/**
 * 지도 스타일정보
 * @type {{}}
 */
const $mapStyle = (function() {
    'use strict';

    const layerStyle = {
        default: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0.1)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,0, 0, 0.8)',
                width: 2
            }),
        }),
        measure: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,0, 0, 0.8)',
                width: 2
            }),
        }),
        roadView: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0.1)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,0, 0, 0.8)',
                width: 2
            }),
        }),
        search: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0.1)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,0, 0, 0.8)',
                width: 2
            }),
        }),
        searchSelect: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0.1)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,0, 0, 0.8)',
                width: 2
            }),
        }),
        pfLcdoMap: new ol.style.Style({
            fill: new ol.style.Fill({
                //color: 'rgba(255, 0, 0, 1)'
                color: '#FF000033'
            }),
            stroke: new ol.style.Stroke({
                //color: 'rgba(255,0, 0, 1)',
                color: '#ff0000ff',
                width: 2
            })
        }),
        pfLcdoMapAreaVector: new ol.style.Style({
            fill: new ol.style.Fill({
                //color: 'rgba(255, 0, 0, 1)'
                color: '#FF000033'
            }),
            stroke: new ol.style.Stroke({
                //color: 'rgba(255,0, 0, 1)',
                color: '#ff0000ff',
                width: 2
            })
        }),
        simpleTs: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(37,201,0,0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0,103,24,0.8)',
                width: 2
            }),
        }),
        krLyrDot: function(f) {
            const krLyrNm = f.get("krLyrNm");
            return $mapStyle.krLyrDotStyle[krLyrNm];
        },

    };

    const pfLcdoMapStyle = {
        info: new ol.style.Style({
            fill: new ol.style.Fill({
                //color: 'rgba(255, 0, 0, 1)'
                color: '#FF0000ff'
            }),
            stroke: new ol.style.Stroke({
                //color: 'rgba(255,0, 0, 1)',
                color: '#ff0000ff',
                width: 2
            }),
        }),
        info_single: new ol.style.Style({
            fill: new ol.style.Fill({
                //color: 'rgba(255, 0, 0, 1)'
                color: '#FF000033'
            }),
            stroke: new ol.style.Stroke({
                //color: 'rgba(255,0, 0, 1)',
                color: '#ff0000ff',
                width: 2
            }),
        }),
        info_mult: new ol.style.Style({
            fill: new ol.style.Fill({
                //color: 'rgba(255, 0, 0, 1)'
                color: '#FF000033'
            }),
            stroke: new ol.style.Stroke({
                //color: 'rgba(255,0, 0, 1)',
                color: '#ff0000ff',
                width: 2
            }),
        }),
        sale: new ol.style.Style({
            fill: new ol.style.Fill({
                //color: 'rgba(255, 0, 0, 1)'
                color: '#b400b233'
            }),
            stroke: new ol.style.Stroke({
                //color: 'rgba(255,0, 0, 1)',
                color: '#b400b2ff',
                width: 2
            }),
        }),
        saleA: new ol.style.Style({
            fill: new ol.style.Fill({
                //color: 'rgba(255, 0, 0, 1)'
                color: '#b400b233'
            }),
            stroke: new ol.style.Stroke({
                //color: 'rgba(255,0, 0, 1)',
                color: '#b400b2ff',
                width: 2
            }),
        }),
        gonsi: new ol.style.Style({
            fill: new ol.style.Fill({
                //color: 'rgba(255, 0, 0, 1)'
                color: '#0044e133'
            }),
            stroke: new ol.style.Stroke({
                //color: 'rgba(255,0, 0, 1)',
                color: '#0044e1ff',
                width: 2
            }),
        }),
        jun: new ol.style.Style({
            fill: new ol.style.Fill({
                //color: 'rgba(255, 0, 0, 1)'
                color: '#008C0F33'
            }),
            stroke: new ol.style.Stroke({
                //color: 'rgba(255,0, 0, 1)',
                color: '#008C0FFF',
                width: 2
            }),
        }),
        junA: new ol.style.Style({
            fill: new ol.style.Fill({
                //color: 'rgba(255, 0, 0, 1)'
                color: '#008C0F33'
            }),
            stroke: new ol.style.Stroke({
                //color: 'rgba(255,0, 0, 1)',
                color: '#008C0FFF',
                width: 2
            }),
        }),
        areaRd: new ol.style.Style({
            fill: new ol.style.Fill({
                color: '#ffffff00',
            }),
            stroke: new ol.style.Stroke({
                color: '#ff0000ff',
                width: 3,
                // lineDash: [8, 6]
            })
        }),
        textRd: function(text) {
            text = $cmmn.nullToDefaultValue(text);

            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#ffffff00',
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffffff00',
                    width: 1,
                    // lineDash: [8, 6]
                }),
                text: new ol.style.Text({
                    textAlign: 'center',
                    font:  'bold 29px Arial',
                    fill: new ol.style.Fill({color: 'rgba(255,0, 0, 0.8)'}),
                    stroke: new ol.style.Stroke({color:'#ffffff', width:6}),
                    text: text,
                    offsetX: 0,
                    offsetY: 0,
                    overflow:true,
                })
            });
        }
    };

    const krLyrDotRaduis = 7;
    const krLyrDotStyle = {
        stndLnd: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: '#ec9613',
                }),
                radius: krLyrDotRaduis,
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 1,
                })
            })
        }),
        tapasmt: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: '#3caf5f',
                }),
                radius: krLyrDotRaduis,
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 1,
                })
            })
        }),
        itself: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: '#2a7ac5',
                }),
                radius: krLyrDotRaduis,
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 1,
                })
            })
        }),
        rtms: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: '#834ab8',
                }),
                radius: krLyrDotRaduis,
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 1,
                })
            })
        }),
        simpleTs: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: '#DC4A85',
                }),
                radius: krLyrDotRaduis,
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 1,
                })
            })
        }),
        qSale: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: '#7E4B4B',
                }),
                radius: krLyrDotRaduis,
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 1,
                })
            })
        }),
        qJun: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: '#1F6A6A',
                }),
                radius: krLyrDotRaduis,
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 1,
                })
            })
        }),
    }


    const featureStyle = {
        //기본마커
        default: function() {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: ctx + '/images/marker/defaultMarker.png',
                    scale: 1
                })
            })
        },
        //로드뷰 마커
        roadView: function(src) {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: src,
                    scale: 0.8,
                })
            })
        },
        searchResult: function(index) {

            if($cmmn.isNullorEmpty(index)) {
                index = '1';
            }

            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: ctx + '/images/marker/idxMarker_' + index + '.png',
                    scale: 0.6
                }),
            });
        },
        searchPlace: function(text) {
            text = $cmmn.nullToDefaultValue(text);

            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255,189,106,0.21)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(255,0, 0, 0.8)',
                    width: 2
                }),
                text: new ol.style.Text({
                    textAlign: 'center',
                    font: '14px Arial',
                    fill: new ol.style.Fill({color: '#260532'}),
                    stroke: new ol.style.Stroke({color:'#ffffff', width:5}),
                    text: text,
                    offsetX: 0,
                    offsetY: -35,
                })
            });
        },
        areaRd: function(text) {
            text = $cmmn.nullToDefaultValue(text);

            return new ol.style.Style({
                text: new ol.style.Text({
                    textAlign: 'center',
                    font: 'bold 30px Arial',
                    fill: new ol.style.Fill({color: 'rgba(255,0, 0, 0.8)'}),
                    stroke: new ol.style.Stroke({color:'#ffffff', width:5}),
                    text: text,
                    offsetX: 0,
                    offsetY: 0,
                })
            });
        },
        /**
         * 파라미터는 #제외한 색상hex문자열(맨 뒤 2자리는 투명도)
         * @param strokeColor   '00000000'
         * @param fillColor     '00000000'
         * @returns {*}
         */
        colorStyle: function(strokeColor, fillColor) {
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#' + fillColor
                }),
                stroke: new ol.style.Stroke({
                    color: '#' + strokeColor,
                    width: 2
                })
            });
        },
        krLyrDot: function(krLyr) {

        }
    };

    return {
        layerStyle: layerStyle,
        featureStyle: featureStyle,
        pfLcdoMapStyle: pfLcdoMapStyle,
        krLyrDotStyle: krLyrDotStyle,
    }
} ());