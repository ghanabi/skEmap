/**
 * 측정도구
 * @type {{}}
 */
const $measure = (function() {
    'use strict';

    const measureToolOption = {
        distance: {
            id: 'distanceMeasure',
            type: 'LineString',
        },
        area: {
            id: 'areaMeasure',
            type: 'Polygon',
        }
    };

    let measureOvly = {
        help: {
            id: 'measureHelpOvly',
            ovly: null,
            ele: null
        },
        measure: {
            id: 'measureOvly',
            ovly: null,
            ele: null
        }
    };

    let measureTool;
    let coordsLen = 0;
    let measureStartFeat;
    let measureingGeom;
    let measureGeomChange;


    /**
     * Format length output.
     * @param {module:ol/geom/LineString~LineString} line The line.
     * @return {string} The formatted length.
     */
    var formatLength = function(line) {
        var length = ol.sphere.getLength(line);
        var output;
        if (length > 100) {
            output = '<b>' + (Math.round(length / 1000 * 100) / 100) + '</b>' +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    };


    /**
     * Format area output.
     * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    var formatArea = function(polygon) {
        var area = ol.sphere.getArea(polygon);
        var output;
        if (area > 10000) {
            output = '<b>' + (Math.round(area / 1000000 * 100) / 100) + '</b>' +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = '<b>' + (Math.round(area * 100) / 100) + '</b>' +
                ' ' + 'm<sup>2</sup>';
        }
        return output;
    };


    //지도에 포인트 이동시
    const pointerMove = function(evt) {
        //measureTool 활성화 상태일때만 동작
        if(measureTool != null && measureTool.getActive()) {
            if(measureOvly['help']['ele'] == null) {
                initMeasureHelpOvly(evt.map);
            }

            if(evt.dragging) {
                return;
            }

            if(measureStartFeat) {
                measureOvly['help']['ele'].innerHTML = '더블클릭하여 종료합니다';
                measureOvly['help']['ovly'].setPosition(evt.coordinate);
            }
        }
    }

    //도움말 오버레이 생성
    const initMeasureHelpOvly = function(map, type) {
        let helpEle = measureOvly['help']['ele'];
        if(helpEle || helpEle != null) {
            helpEle.parentNode.removeChild(helpEle);
        }

        const $helpEle = $(
            '<div class="measureOvly measureHelp">' +
            '클릭하여 측정을 시작합니다' +
            '</div>'
        )
        measureOvly['help']['ele'] = $helpEle.get(0);

        measureOvly['help']['ovly'] = new ol.Overlay({
            id: measureOvly['help']['id'],
            element: measureOvly['help']['ele'],
            offset: [60, 40],
            positioning: 'bottom-center'
        });

        map.addOverlay(measureOvly['help']['ovly']);
    }


    //측정값 오버레이 생성
    const initMeasureOvly = function(map, type) {
        let measureEle = measureOvly['measure']['ele'];
        if(measureEle || measureEle != null) {
            measureEle.parentNode.removeChild(measureEle);
        }

        const $measureEle = $(
            '<div class="measureOvly measure">' +
            '클릭하여 측정을 시작합니다' +
            '</div>'
        )
        measureOvly['measure']['ele'] = $measureEle.get(0);

        measureOvly['measure']['ovly'] = new ol.Overlay({
            id: measureOvly['measure']['id'],
            element: measureOvly['measure']['ele'],
            offset: [0, -10],
            positioning: 'bottom-center'
        });
        map.addOverlay(measureOvly['measure']['ovly']);
    }


    //tool 초기화
    const initToolInteraction = function(map, type) {
        const thisOption = measureToolOption[type];
        const geoType = thisOption['type'];
        
        let lyr=null;
		var layers = map.getLayers().getArray();
		for(let i in layers) {
	        const l = layers[i];
	        const thisLayerId = layers[i].get('id');
	
	        if("measure" === thisLayerId) {
	            lyr = l;
	            break;
	        }
	    }
    
        measureTool = new ol.interaction.Draw({
            source: lyr.getSource(),
            type: geoType,
            style: new ol.style.Style({
            fill: new ol.style.Fill({
	                color: 'rgba(255, 0, 0, 0.3)'
	            }),
	            stroke: new ol.style.Stroke({
	                color: 'rgba(255,0, 0, 0.8)',
	                width: 2
	            })
	      	})
       	 });

        measureTool.setProperties({
            id: thisOption['id'],
            type: geoType
        });
        measureTool.un('drawstart');
        measureTool.on('drawstart', function(evt) {
            measureStartFeat = evt.feature;
            initMeasureOvly(map, type);

            measureGeomChange = measureStartFeat.getGeometry().on('change', function(e) {
                const geom = e.target;
                let output = '';
                let coord;

                if(geom instanceof ol.geom.Polygon) {
                    output = formatArea(geom);
                    coord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    output = formatLength(geom);
                    coord = geom.getLastCoordinate();
                }

                measureOvly['measure']['ele'].innerHTML = output;
                measureOvly['measure']['ovly'].setPosition(coord);
            });
        });
        measureTool.un('drawend');
        measureTool.on('drawend', function(evt) {
            const f = evt.feature;
            const geom = f.getGeometry();

            let result = '';
            if(geom instanceof ol.geom.LineString) {
                result = formatLength(geom);
            } else if (geom instanceof ol.geom.Polygon) {
                result = formatArea(geom);
            }

            if(result != '') {
                measureOvly['measure']['ele'].innerHTML = result;
                measureOvly['measure']['ele'].className = 'measureOvly measureEnd';
            }

            measureOvly['measure']['ele'] = null;


            map.removeOverlay(measureOvly['help']['ovly']);
            measureOvly['help']['ovly'] = null;
            measureOvly['help']['ele'] = null;

            measureStartFeat = null;
            ol.Observable.unByKey(measureGeomChange);
        });

        map.addInteraction(measureTool);
    }


    /**
     * 툴 비활성화
     */
    const off = function() {
        //기존 삭제
        _.forEach(measureToolOption, function(o, k) {
            const inter = $interaction.getInteractionById(o['id']);
            if(inter != null) {
                map.removeInteraction(inter);
            }

        });

        coordsLen = 0;
        measureStartFeat = null;
        measureingGeom = null;
    }


    //initialize
    const init = function(measureType) {
        off();
        initToolInteraction(map, measureType);
    }

    return {
        init: init,
        off: off,
        pointerMove: pointerMove,
    }
} ());