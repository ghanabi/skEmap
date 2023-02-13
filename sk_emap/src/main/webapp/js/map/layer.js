const $layer = (function() {
    'use strict';

    const vectorIds = {
        default: 'defulatVector',       //기본
        measure: 'measureVector',       //거리, 면적측정
        roadView: 'roadViewVector',     //로드뷰
        search: 'searchResultVector',   //검색결과
        searchSelect: 'searchSelectVector', //검색결과 상세
        pfLcdoMap: 'pfLcdoMapVector',       //위치도
        simpleTs: 'simpleTsVector',         //간이탁상
        krLyrDot: 'krLyrDotVector',         //가람레이어 도트 레이어
        //pfLcdoAreaMap: 'pfLcdoMapAreaVector',   //광역위치도
    };

    let layerInfo = {};

    const baseLayer = {
        Base: {
            id: 'vwolrdBase',
            layer: new ol.layer.Tile({
                id: 'vwolrdBase',
                title: 'vwolrdBase',
                type: 'base',
                tileSize: [512, 512],
                source: new ol.source.XYZ({
                    //url: ctx + '/cmmn/link/get.do?url=/vworld/baseMap/Base/{z}/{y}/{x}.do',
                    url: ctx + '/vworld/vworld/baseMap/Base/{z}/{y}/{x}.do',
                }),
                visible: true,
            }),
        },
        Satellite: {
            id: 'vworldSatelite',
            layer: new ol.layer.Tile({
                id: 'vworldSatelite',
                title: 'vworldSatelite',
                type: 'base',
                tileSize: [512, 512],
                source: new ol.source.XYZ({
                    //url: ctx + '/cmmn/link/get.do?url=/vworld/baseMap/Satellite/{z}/{y}/{x}.do',
                    url: ctx + '/vworld/vworld/baseMap/Satellite/{z}/{y}/{x}.do',
                }),
                visible: false,
            })
        },
    };

    //레이어 관련 함수
    const mapFuncs = {
        //배경지도 변경
        changeBase: function(_mapType) {
            _.each(baseLayer, function(o, k) {
                o.layer.setVisible(false);
            });
            baseLayer[_mapType].layer.setVisible(true);
        },
        //전체 레이어 목록 조회
        getLayers: function() {
            const map = $map.getMap();
            return map.getLayers().getArray();
        },
        //wms 레이어 조회
        getWmsLayers: function() {
            const layers = this.getLayers();
            //TODO

        },
        //벡터 레이어 목록 조회
        getVectorLayers: function() {
            const layers = this.getLayers();
            const returnList = [];
            for(let i in layers) {
                let l = layers[i];
                if(l instanceof ol.layer.Vector) {
                    returnList.push(l);
                }
            }

            return returnList;
        },
        //레이어 ID로 레이어 조회
        getLayerById: function(layerId) {
            const layers = this.getLayers();
            for(let i in layers) {
                const l = layers[i];
                const thisLayerId = layers[i].get('id');

                if(layerId === thisLayerId) {
                    return l;
                }
            }

            return null;
        }
    };

    //레이어정보 json 생성
    const makeLayerInfoJson = function(data) {
        let jsonData = {};
        for(let i in data) {
            const o = data[i];
            const grpId = o['lyrGroupSeq'];

            if($cmmn.isNullorEmpty(jsonData[grpId])) {
                jsonData[grpId] = {
                    name: o['lyrGroupNm'],
                    children: {},
                };
            }

            //wms레이어명을 key로 함
            const wmsLyrNm = o['wmsLyrNm'];
            jsonData[grpId]['children'][wmsLyrNm] = o;
        }
        return jsonData;
    }


    //레이어 관리도구 생성
    const makeToc = function() {
        const lyrInfo = layerInfo;
        const tocTmpl = _.template(
            '<dt>- <%= name %><button><i class="fas fa-caret-up"></i></button></dt>' +
            '<dd>' +
            '   <ul>' +
            '       <% _.each(children, function(l, k) { %>' +
            '       <li>' +
            '           <div>' +
            '              <input type="checkbox" class="lyrTocCheck" value="<%= k %>" id="lyrTocCheck_<%= k %>"/>' +
            '              <label for="lyrTocCheck_<%= k %>" class="check"><%= l.lyrKorNm %></label>' +
            '           </div>' +
            '           <div class="tocBtns">' +
            '                  <a href="#" class="btnShowLabel btnShowLegend" ' +
            '                   data-lyr-id="<%= k %>" data-lyr-style="<%= l.styleLyrNm %>" data-lyr-nm="<%= l.lyrKorNm %>"><i class="fab fa-elementor"></i>' +
            '                      <span style="display:none;">범례</span>' +
            '                  </a>' +
            '           </div>' +
            '       </li>' +
            '       <% }); %>' +
            '   </ul>' +
            '</dd>'
        );


        let html = '';
        for(let k in lyrInfo) {
            html += tocTmpl(lyrInfo[k]);
        }

        $('#dvLyrToc').html(html);

        //span hover
        $('.btnShowLabel').hover(function() {
            $(this).children('span').show();
        }, function() {
            $(this).children('span').hide();
        });
    }


    //wms레이어 init
    const initWmsLayers = function() {
        const callback = function(data) {
            if(data.length <= 0) {
                //err
                return false;
            }

            const map = $map.getMap();
            //wms레이어 생성
            for(let i in data) {
                const l = data[i];

                let wmsLyr;
                //지적도인 경우,
                if("lp_pa_cbnd_bubun" === l['wmsLyrNm']) {
                    wmsLyr = new ol.layer.Tile({
                        id: l['wmsLyrNm'],
                        source: new ol.source.TileWMS({
                            url: 'vworld/wms.do?',
                            params: {
                                LAYERS: l['wmsLyrNm'],
                                STYLES: l['styleLyrNm'],
                                WIDTH: 512,
                                HEIGHT: 512,
                                SLD_BODY:  jijukSld,
                                TRANSPARENT: true
                            },
                            tileLoadFunction: function(image, src) {
                                let img = image.getImage();
                                //src = ctx + '/cmmn/link/get.do?url=' + encodeURIComponent(src);
                                src = ctx + '/vworld/' + src;
                                img.src = src;
                            }
                        }),
                        visible: true,
                    });
                } else {
                    wmsLyr = new ol.layer.Tile({
                        id: l['wmsLyrNm'],
                        source: new ol.source.TileWMS({
                            url: '/vworld/wms.do?',
                            params: {
                                LAYERS: l['wmsLyrNm'],
                                STYLES: l['styleLyrNm'],
                                WIDTH: 512,
                                HEIGHT: 512,
                                TRANSPARENT: true
                            },
                            tileLoadFunction: function(image, src) {
                                let img = image.getImage();
                                //src = ctx + '/cmmn/link/get.do?url=' + encodeURIComponent(src);
                                src = ctx + '/vworld/' + src;
                                img.src = src;
                            }
                        }),
                        visible: false,
                    });

                }
                map.addLayer(wmsLyr);
            }

            layerInfo = makeLayerInfoJson(data);

            //toc 생성
            makeToc();

            //vector
            //wms레이어 등록 이후에 벡터를 등록하기 위해 여기서 호출
            initVectorLayers();
        }      
    }


    //vector레이어 init
    const initVectorLayers = function() {

        const map = $map.getMap();
        _.forEach(vectorIds, function(k, i) {

            const lyr = new ol.layer.Vector({
                id: k,
                source: new ol.source.Vector(),
                style: $mapStyle.layerStyle[i],
            });

            //고객 요청으로 검색결과 마커 표시하지 않음
            if(i === 'search') {
                lyr.setVisible(false);
            }

            map.addLayer(lyr);
        });
    }


    //initialize
    const init = function() {
        //함수 정의
        _.each(mapFuncs, function(f, k) {
            $layer[k] = f;
        });

        let layerList = [
            baseLayer.Base.layer,
            baseLayer.Satellite.layer
        ];

        const map = $map.getMap();
        _.each(layerList, function(l, i) {
            map.addLayer(l);
        });

        initWmsLayers();


        //레이어 전체 해제
        $('#btnUncheckLyrs').on('click', function(e) {
            const onLyrList = $('.lyrTocCheck:checked');

            $.each(onLyrList, function(i, l) {
                $(l).prop('checked', false);
                $(l).trigger('change');
            });
        });


        //toc Event
        $(document).on('change', '.lyrTocCheck', function(e) {
            const $target = $(e.currentTarget);
            const wmsLyrId = $target.val();
            const isOn = $target.is(':checked');

            const lyr = $layer.getLayerById(wmsLyrId);
            if(lyr == null) {
                //err
                $cmmn.showMsg('레이어 정보가 잘못되었습니다.');
                return false;
            }

            lyr.setVisible(isOn);

            //지적도인경우 도구 버튼 binding
            if(wmsLyrId === 'lp_pa_cbnd_bubun') {
                if(isOn) {
                    //확대
                    const curZoomLevel = map.getView().getZoom();
                    const cbndZoom = 18;

                    if(curZoomLevel < cbndZoom) {
                        $cmmn.showMsg('현재 축척에서는 지적도가 조회되지 않습니다.\r\n지도를 확대합니다');
                        map.getView().animate({
                            zoom: cbndZoom,
                            duration: 300,
                        })
                    }

                    $('.mapTool[data-tool-type="landLyr"]').addClass('on');
                } else {
                    $('.mapTool[data-tool-type="landLyr"]').removeClass('on');
                }
            }
        });

        //도구 닫기
        $('#closeToc').on('click', function(e) {
            $('#dvShowLegend').dialog('close');
            $('#dvToc').hide();
            //도구 on 지우기
            $('.mapTool[data-tool-type="toc"]').removeClass('on');
            if($('#btnViewLyr').length > 0) {
                $('#btnViewLyr').removeClass('on');
            }
        });

        //범례 조회
        $('#dvShowLegend').dialog({
            autoOpen: false,
            width: 295,
            modal: false,
            maxHeight: 150,
            close: function(e, ui) {
                $('#dvShowLegend img').attr('src', '');
            }
        });
        $(document).on('click', '.btnShowLegend', function(e) {
            //legend 조회
            let data = $(e.currentTarget).data();
            let sendUrl = '/vworld/getLegend.do?layer=' + data.lyrId + '&style=' + data.lyrStyle;
            //let url = ctx + '/cmmn/link/get.do?url=' + encodeURIComponent(sendUrl);
            let url = ctx + '/vworld' + sendUrl;

            $('#dvShowLegend img').attr('src', '');
            $('#dvShowLegend img').attr('src', url);
            $('#dvShowLegend').dialog({
                title: '범례 (' + data.lyrNm + ')',
                position: {
                    of: '#dvLyrToc',
                    at: 'left bottom',
                    my: 'right-10 bottom'
                }
            });

            $('#dvShowLegend').dialog('open');
        });


        $layer.krLyr.init();
    }

    return {
        vectorIds: vectorIds,
        krLyr: null,
        init: init,
    }
} ());