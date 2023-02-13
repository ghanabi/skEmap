/**
 * 지도 기능
 *
 * @type {{}}
 */
const $map = (function() {
    'use strict';
    let map;

    //지도 기본 옵션
    const defaultMapOption = {
        projection: 'EPSG:3857',
        center: [14243425.793355, 4342305.8698004],
        zoom: 7,
        minZoom: 6,
        maxZoom: 19
    };


    const mapFuncs = {
        //get Map
        getMap: function() {
            return map;
        },
        //현재 지도 좌표계 가져오기
        getProjectionCode: function() {
            return $map.getMap().getView().getProjection().getCode();
        },
        //layerId, featureId 로 해당 feature 가져오기
        getFeatureById: function(layerId, featureId) {
            const lyr = $layer.getLayerById(layerId);

            if(lyr == null) {
                //err
                console.error('[ $map.getFeatureById ] ' + layerId + ' 레이어가 없습니다.');
                return false;
            }

            const feat = lyr.getSource().getFeatureById(featureId);
            return feat;
        },
        //layerId, 속성명, 속성키로 해당 feature 가져오기
        getFeaturesByType: function(layerId, key, value) {
            const lyr = $layer.getLayerById(layerId);

            if(lyr == null) {
                //err
                console.error('[ $map.getFeatureById ] ' + layerId + ' 레이어가 없습니다.');
                return false;
            }

            const feats = lyr.getSource().getFeatures();
            let featList = [];
            for(let i in feats) {
                let f = feats[i];

                if(f.get(key) == value) {
                    featList.push(f);
                }
            }

            return featList;
        },
        //feature추가
        addFeature: function(layerId, options) {
            if($cmmn.isNullorEmpty(layerId)) {
                //default
                layerId = $layer.vectorIds.default;
            }

            const defaultOption = {
                geometry: new ol.geom.Point([0, 0]),
                bMoveCenter: false,
                moveZoom: 19
            };

            const setOption = $.extend({}, defaultOption, options);
            const f = new ol.Feature(setOption);
            const lyr = $layer.getLayerById(layerId);
            lyr.getSource().addFeature(f);

            if(setOption.bMoveCenter) {
                $map.getMap().getView().animate({
                    center: ol.extent.getCenter(f.getGeometry().getExtent()),
                    zoom: setOption.moveZoom,
                    duration: 300
                })
            }

            return f;
        },
        //포인트 마커 추가
        addPointMarker: function(layerId, options) {
            const f = this.addFeature(layerId, options);
            return f;
        },
        //extent문자열 ('xmin,ymin,xmax,ymax')로 지도 이동
        moveToExtFromExtStr: function(extStr, option) {
            const defaultOption = {
                duration: 300
            };
            const _option = $.extend({}, defaultOption, option);


            const arrExt = extStr.split(',');
            //숫자로 변경
            for(let i in arrExt) {
                arrExt[i] = arrExt[i] * 1;
            }

            //위치이동
            const map = $map.getMap();
            map.getView().fit(arrExt, _option);
        },
    };

    //지도 전체 로딩화면
    const toggleMapLoading = function(isOn) {
        let ck = false;
        if(isOn === true) {
            ck = isOn;
        }

        if(ck) {
            $cmmn.showLoading('', 'garam_map');
        } else {
            $cmmn.hideLoading('garam_map');
        }
    }

    //initialize
    const init = function(divId) {
        console.log('map init + ' + divId);

        //지도 함수들 등록
        _.each(mapFuncs, function(f, k) {
            $map[k] = f;
        });

        //init Map
        map = new ol.Map({
            target: divId,
            interactions : ol.interaction.defaults({
                dragPan: true,		/*펜컨트롤*/
                mouseWheelZoom: true, /*마우스 이동 컨트롤*/
                doubleClickZoom :false,    /*더블클릭*/
                altShiftDragRotate:false, /*회전 관련*/
                pinchRotate:false  /*회전 영역 관련*/
            }),
            controls: [
                /*new ol.control.Attribution({
                    collapsible: true
                }),*/
                /*new ol.control.Zoom()*/
            ],
            view : new ol.View({
                projection: defaultMapOption.projection,
                center: defaultMapOption.center,
                zoom: defaultMapOption.zoom,
                minZoom: defaultMapOption.minZoom,
                maxZoom: defaultMapOption.maxZoom
            }),
        });

        $layer.init();
        $interaction.init();
        $mapEvt.init();

        //왼쪽 화면 가려놓기
        //$('.map_left_btn').trigger('click');
    }

    return {
        init: init,
        toggleMapLoading: toggleMapLoading,
    }
} ());