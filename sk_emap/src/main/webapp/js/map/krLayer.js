/**
 * 가람맵 레이어
 * (표준공시지가, 실거래가, 자체전례, 탁상감정전례 레이어)
 * @type {{}}
 */
$layer.krLyr = (function() {
    'use strict';
    
    const krLyrDotMinZoom = 16;
    const krLyrMinZoom = 18;
    const clickEventActive = false;

    const lyrSetting = {
        stndLnd: {
            class: 'clrOrange',
            arrowClass: 'clrfOrange',
            widClass: 'wid120',
            getPrice: function(o) {
                let priceVal = o['price'] * 1;

                let priceStr = '';
                //만원 단위로 자름
                if(priceVal > 10000) {
                    priceVal = (priceVal / 10000).toFixed(0);
                    priceStr = priceVal + '만';
                } else {
                    priceStr = $cmmn.numberWithCommas(priceVal);
                }
                return priceStr;
            },
            getInfo: function(o) {
                //용도지역(약자)/지목/이용상황
                let yd = o['youngdo'];
                let jm = o['jimok'];

                let infoStr =
                    $cmmn.getAbbrCode('ABBR_YONGDO_SE', yd) + '/' +
                    $cmmn.getAbbrCode('ABBR_JIMOK_SE', jm) + '/' +
                    o['iyong'];

                return infoStr;
            },

        },
        tapasmt: {
            class: 'clrGreen',
            arrowClass: 'clrfGreen',
            widClass: 'wid120',
            getPrice: function(o) {
                let priceStr = '';

                //단가 조회하여 체크
                let price = o['untpc'];

                if(price > 0) {
                    priceStr = '(토) ' + $cmmn.numberWithCommas(price);
                } else {
                    price = o['bldSm'];

                    if(price > 100000000) {
                        price /= 100000000;
                        priceStr = $cmmn.numberWithCommas(price.toFixed(1)) + '억';
                    } else if (price > 10000) {
                        price /= 10000;
                        priceStr = $cmmn.numberWithCommas(price.toFixed(0)) + '만';
                    } else {
                        priceStr = $cmmn.numberWithCommas(price);
                    }

                    priceStr = '(건) ' + priceStr;
                }
                return priceStr;
            },
            getInfo: function(o) {
                return "";
            },

        },
        itself: {
            class: 'clrBlue',
            arrowClass: 'clrfBlue',
            widClass: 'wid120',
            getPrice: function(o) {
                let priceStr = '';

                const tacount = o['tacount'];
                priceStr = "(토) " + $cmmn.numberWithCommas(tacount);

                return priceStr;
            },
            getInfo: function(o) {
                return '';
            },

        },
        rtms: {
            class: 'clrPurple',
            arrowClass: 'clrfPurple',
            widClass: 'wid120',
            getPrice: function(o) {
                let price = o['actPrice'];

                //가격이 0원이면 띄우지 않게
                if($cmmn.isNullorEmpty(price) || (price * 1) <= 0) {
                    const monPrice = o['monPrice'];

                    price = $cmmn.numberWithCommas(o['deposit']) + '만' +
                        (monPrice == 0 ? '' : '/월 ' + $cmmn.numberWithCommas(monPrice) + '만');
                } else {
                    price = $cmmn.numberWithCommas(price) + '만';
                }
                return price;
            },
            getInfo: function(o) {
                return '';
            },

        },
        simpleTs: {
            class: 'clrPink',
            arrowClass: 'clrfPink',
            widClass: 'wid70',
            getPrice: function(o) {
                let price = 0;

                let lnd = o['calcPriceLnd'] * o['areaLnd'];
                let bld = o['calcPriceBld'] * o['areaBld'];

                price = lnd + bld;

                if(price > 10000) {
                    price = (price / 10000).toFixed(0);
                }
                price = $cmmn.numberWithCommas(price) + '만';

                return price;
            },
            getInfo: function(o) {
                return '';
            }
        },
        qSale: {
            class: 'clrBrown',
            arrowClass: 'clrfBrown',
            widClass: 'wid70',
            getPrice: function(o) {
                let priceStr = '';
                let price = o['saledangaLm'];

                priceStr = $cmmn.numberWithCommas(price);

                return priceStr;
            },
            getInfo: function(o) {
                return '';
            }
        },
        qJun: {
            class: 'clrTurq',
            arrowClass: 'clrfTurq',
            widClass: 'wid70',
            getPrice: function(o) {
                let priceStr = '';
                let price = o['landdanga'];

                priceStr = $cmmn.numberWithCommas(price);

                return priceStr;
            },
            getInfo: function(o) {
                return '';
            }
        }
    };


    const lyrOvlyTmpl = _.template(
        '<div class="map_marker pointer-cursor krLyrMarker <%= widClass %>" id="<%= id %>">' +
        '   <div class="m_adress <%= krClass %>">' +
        '       <b><%= price %></b>원' +
        '<% if(!$cmmn.isNullorEmpty(info)) { %>' +
        '       <br/><%= info %>' +
        '<% } %>' +
        '   </div>' +
        '   <div class="arrowD">' +
        '       <i class="fas fa-caret-down <%= arrClass %>"></i>' +
        '   </div>' +
        '</div>'
    );

    //moveend Event
    const moveend = function(e) {
        //1. zoomCheck
        const thisZoom = e.map.getView().getZoom();
        //2.On 확인
        const krLyrList = $('.ipKrLayer').not('.off');
        if(krLyrList.length <= 0) {
            $map.toggleMapLoading(false);
        }

        if(thisZoom >= krLyrMinZoom) {
            //2.On 확인
            $.each(krLyrList, function(i, l) {
                const lyrNm = $(l).data('val');
                toggleKrLyr(true, lyrNm);
            });
        } else if (thisZoom >= krLyrDotMinZoom) {
            $.each(krLyrList, function(i, l) {
                const lyrNm = $(l).data('val');

                removeKrLyr(lyrNm);
                toggleKrDot(true, lyrNm);
            });
        } else {
            //축척 벗어나면 삭제
            const lyrs = Object.keys(lyrSetting);
            for(let i in lyrs) {
                removeKrLyr(lyrs[i]);
                removeKrDotLyr(lyrs[i]);
            }

            //간이탁상은 켬
            $.each(krLyrList, function(i, l) {
                const lyrNm = $(l).data('val');
                if(lyrNm === 'simpleTs') {
                    toggleKrDot(true, lyrNm);
                }
            });
        }
    }


    /**
     *  간이탁상 정보 저장
     * @param param
     *          {
     *              seq: ID
     *              pnu: '' PNU값,
     *              pointX: X좌표 (EPSG:3857),
     *              pointY: Y좌표 (EPSG:3857),
     *              areaLnd: 지적 면적,
     *              calcPriceLnd: 토지 1㎡당 단가,
     *              areaBld: 건물 면적,
     *              calcPriceBld: 건물 1㎡당 단가,
     *          }
     */
    const saveSimpleTs = function(param) {
        const callback = function(result) {
            if(result['CODE'] !== 'SUCCESS') {
                $cmmn.showMsg(result['MSG']);
            } else {
                $cmmn.showMsg('간이탁상 정보가 \r\n저장되었습니다.');
            }

            //$('#popAddSimpleTs').dialog('close');

            //레이어 켜기
            $('.ipKrLayer.clrPink').removeClass('off');
            toggleKrLyr(true, 'simpleTs');

            //li정보 업데이트(상세조회화면일시)
            const $li = $('#tabKrDetail li.on');
            if($li.length > 0) {
                const liData = $li.data();

                let price = param['calcPrice'] * param['area'];
                price = price.toFixed(0);
                if(liData['krLyrNm']  === 'simpleTs' && liData.pnu == param.pnu) {
                    if(price > 10000) {
                        price = (price / 10000).toFixed(0);
                    }
                    price = $cmmn.numberWithCommas(price) + '만';
                    $li.find('span:eq(1)').text(price);
                }
            }
        }

        $req.ajax({
            url: ctx + '/map/view/api/simpleTs/save.do',
            type: 'POST',
            data: param,
            success: callback,
        });
    }


    //지도 클릭이벤트
    const singleclick = function(e) {
        //click
    }


    //가람맵 레이어 overlay 삭제
    const removeKrLyr = function(krLyrNm) {
        const map = $map.getMap();
        const ovlyList = map.getOverlays().getArray();

        let targetOvlyList = [];
        for(let i in ovlyList) {
            const ovly = ovlyList[i];
            const ovlyLyrNm = ovly.get('krLyrNm');

            if(ovlyLyrNm === krLyrNm) {
                targetOvlyList.push(ovly);
            }
        }

        for(let i in targetOvlyList) {
            const ovly = targetOvlyList[i];
            map.removeOverlay(ovly);
        }
    }


    //데이터 조회 및 레이어 데이터 생성
    const getLyrData = function(krLyrNm, callback) {
        if(typeof callback !== 'function') {
            callback = function() {
                console.log('krLayer.getLyrData Callback');
            }
        }

        const map = $map.getMap();
        const ext = map.getView().calculateExtent();
        const param = {
            xmin: ext[0] + '',
            ymin: ext[1] + '',
            xmax: ext[2] + '',
            ymax: ext[3] + ''
        };

        $req.ajax({
            url: ctx + '/map/view/krVector/' + krLyrNm + '.do',
            type: 'post',
            data: JSON.stringify(param),
            contentType: 'application/json',
            success: callback,
        });
    }

    //가람맵 레이어 ON
    const onKrLyrData = function(krLyrNm) {
        $map.toggleMapLoading(true);
        const map = $map.getMap();

        const vcCallback = function(data) {
            //기존 데이터 삭제
            removeKrLyr(krLyrNm);

            const status = data['CODE'];
            if(status === 'SUCCESS') {
                const thisLyrSetting = lyrSetting[krLyrNm];

                const list = data['rows'];
                for(let i in list) {
                    const o = list[i];
                    const price = thisLyrSetting.getPrice(o);
                    const info = thisLyrSetting.getInfo(o);
                    const idx = o['id'];
                    const id = krLyrNm + '_' + idx;

                    const x = o['pointX'] * 1;
                    const y = o['pointY'] * 1;

                    const coords = [x, y];

                    const $ele = $(lyrOvlyTmpl({
                        price: price,
                        info: info,
                        id: id,
                        krClass: thisLyrSetting['class'],
                        arrClass: thisLyrSetting['arrowClass'],
                        widClass: thisLyrSetting['widClass'],
                    }));

                    $ele.data(o);
                    $ele.data('coords', coords);

                    $ele.on('click', krLyrMarkerClick);

                    const pop = new ol.Overlay({
                        id: id,
                        element: $ele.get(0),
                        position: coords,
                    });
                    pop.set('data', o);
                    pop.set('krLyrNm', krLyrNm);
                    pop.set('price', price);

                    map.addOverlay(pop);

                    //offset 조정
                    const width = $ele.width();
                    const height = $ele.height();
                    pop.setOffset([-(width / 2), -(height - 13)]);
                }
            } else {
                //err
            }

            $map.toggleMapLoading(false);
        };

        //getLyrData(krLyrNm, vcCallback);

        //on
        const thisZoom = map.getView().getZoom();

        //축척 체크
        removeKrLyr(krLyrNm);
        removeKrDotLyr(krLyrNm);

        if(thisZoom < krLyrDotMinZoom) {
            if(confirm('해당 데이터는 확대된 지도에서만 조회됩니다. 지도를 확대하시겠습니까?')) {
                map.getView().animate({
                    zoom: krLyrMinZoom,
                    duration: 300
                }, function() {
                    getLyrData(krLyrNm, vcCallback);
                });
            } else {
                return false;
            }
        } else {
            getLyrData(krLyrNm, vcCallback);
        }
    }

    //가람맵 레이어 조회
    const toggleKrLyr = function(isOn, krLyrNm) {
        if(isOn) {
            //on
            const result = onKrLyrData(krLyrNm);
            if(!$cmmn.isNullorEmpty(result)) {
                return result;
            }
        } else {
            //off
            removeKrLyr(krLyrNm);
            return false;
        }
        return true;
    }


    //dot레이어데이터 조회
    const onKrDotData = function(krLyrNm) {
        $map.toggleMapLoading(true);

        const map = $map.getMap();

        const callback = function(result) {
            const status = result['CODE'];
            if(status === 'SUCCESS') {

                const list = result['rows'];
                for(let i in list) {
                    const o = list[i];

                    const pointX = o['pointX'];
                    const pointY = o['pointY'];

                    const geom = new ol.geom.Point([pointX * 1, pointY * 1]);
                    const lyrId = $layer.vectorIds.krLyrDot;

                    //const pointStyle = $mapStyle.krLyrDotStyle[krLyrNm];

                    //point 추가
                    const f = $map.addPointMarker(lyrId, {
                        geometry: geom,
                        data: o,
                        krLyrNm: krLyrNm
                    });
                    //f.setStyle(pointStyle);
                }
            }

            $map.toggleMapLoading(false);
        }

        //on
        const thisZoom = map.getView().getZoom();

        //축척 체크
        removeKrLyr(krLyrNm);
        removeKrDotLyr(krLyrNm);

        if(krLyrNm !== 'simpleTs') {
            if(thisZoom < krLyrDotMinZoom) {
                if(confirm('해당 데이터는 확대된 지도에서만 조회됩니다. 지도를 확대하시겠습니까?')) {
                    map.getView().animate({
                        zoom: krLyrDotMinZoom,
                        duration: 300
                    }, function() {
                        getLyrData(krLyrNm, callback);
                    });
                } else {
                    return false;
                }
            } else {
                getLyrData(krLyrNm, callback);
            }
        } else {
            getLyrData(krLyrNm, callback);
        }
    }


    //가람맵 도트 레이어 조회
    const toggleKrDot = function(isOn, krLyrNm) {
        if(isOn) {
            //on
            const result = onKrDotData(krLyrNm);
            if(!$cmmn.isNullorEmpty(result)) {
                return result;
            }
        } else {
            removeKrDotLyr(krLyrNm);
            return false;
        }

        return true;
    }

    //포인트 레이어 삭제
    const removeKrDotLyr = function(krLyrNm) {
        const lyrId = $layer.vectorIds.krLyrDot;
        const lyr = $layer.getLayerById(lyrId);
        if(lyr != null) {
            const feats = lyr.getSource().getFeatures();

            let fList = [];
            for(let i in feats) {
                const f = feats[i];
                const fLyrNm = f.get('krLyrNm');

                if(fLyrNm !== krLyrNm) {
                    fList.push(f);
                }
            }

            lyr.getSource().clear();
            lyr.getSource().addFeatures(fList);
        }
    }


    //레이어 마커 클릭시
    const krLyrMarkerClick = function(e) {
        const $target = $(e.currentTarget);
        const coords = $target.data('coords');

        //coord로 범위검색(반경 20m)
        const geom = new ol.geom.Circle(coords, 30);
        //TEST
        // $map.addFeature('', {
        //     geometry: geom
        // });

        const map = $map.getMap();
        const ovlyList = map.getOverlays().getArray();

        let targetOvlyList = [];
        for(let i in ovlyList) {
            const ovly = ovlyList[i];
            const ovlyCoord = ovly.getPosition();

            if(ovlyCoord != null) {
                if(geom.intersectsCoordinate(ovlyCoord)) {
                    targetOvlyList.push(ovly);
                }
            }
        }

        //클릭한 위치
        const clickPosition = [e.pageX, e.pageY];

        //팝업 열기
        viewKrLayerDetailInfoPop(targetOvlyList);
    }

    //선택한 오버레이 상세정보 조회
    const viewKrLayerDetailInfoPop = function(ovlyList) {
        const classNm = {
            stndLnd: 'orange',
            tapasmt: 'green',
            itself: 'blue',
            rtms: 'purple',
            simpleTs: 'pink',
            qSale: 'brown',
            qJun: 'turq',
        };
        const lyrNm = {
            stndLnd: '표준공시지가',
            tapasmt: '탁상전례',
            itself: '정식전례',
            rtms: '실거래가',
            simpleTs: '간이탁상',
            qSale: '거래사례',
            qJun: '평가사례',
        }

        const $ul = $('#tabKrDetail');
        $ul.html('');

        for(let i in ovlyList) {
            const ovly = ovlyList[i];

            const data = ovly.get('data');
            const krLayerNm = ovly.get('krLyrNm');
            const price = ovly.get('price');

            const $li = $(
                '<li class="' + classNm[krLayerNm] + ' pointer-cursor">' +
                '   <span class="krLyrType">' + lyrNm[krLayerNm] + '</span>' +
                '   <span>' + price +'원</span>' +
                '</li>'
            );
            $li.data(data);
            $li.data('krLyrNm', krLayerNm);
            $li.data('price', price);

            $ul.append($li);
        }

        $ul.find('li:eq(0)').trigger('click');
        $('#dvShowKrLyrDetail').dialog('open');
    }

    //initialize
    const init = function() {
        // $('#popAddSimpleTs').dialog({
        //     title: '간이탁상',
        //     resizable: false,
        //     width: 300,
        //     autoOpen: false,
        //     position: {
        //         my: 'center',
        //         at: 'center+230 center',
        //         of: document
        //     },
        //     close: function(e, ui) {
        //         $('#lbArea').html('');
        //         $('#ipCalcPrice').val('');
        //         $('#lbTotalPrice').html('');
        //
        //         $layer.getLayerById($layer.vectorIds.simpleTs).getSource().clear();
        //     },
        // });

        //간이탁상 계산
        $(document).on('keyup', '#ipCalcPrice', function(e) {
            const val = $(this).val();
            if(!$cmmn.isNumber(val)) {
                $(this).val('');
                $(this).focus();

                return false;
            }

            const area = $('#lbArea').text();
            const price = area * val;

            $('#lbTotalPrice').html($cmmn.numberWithCommas(price.toFixed(0)));
        });


        //삭제
        $(document).on('click', '#btnDelSimpleTs', function(e) {
            const pnu = $('#stDetPnu').val();
            $req.ajax({
                url: ctx + '/map/view/api/simpleTs/del.do',
                type: 'POST',
                data: {
                    pnu: pnu
                },
                success: function(result) {
                    if(result['CODE'] === 'SUCCESS') {
                        $cmmn.showMsg('삭제되었습니다');

                        const $ul = $('#tabKrDetail');
                        const $li = $ul.find('li.on');
                        if($li.length > 0) {
                            $li.remove();

                            if($ul.find('li').length > 0) {
                                $ul.find('li:eq(0)').trigger('click');
                            } else {
                                $('#dvShowKrLyrDetail').dialog('close');
                            }
                        }

                        toggleKrLyr(true, 'simpleTs');
                    }
                }
            });
        });


        //상세조회 dialog
        $('#dvShowKrLyrDetail').dialog({
            title: '가람 레이어 상세조회',
            minWidth: 500,
            width: 600,
            minHeight: 200,
            height: 360,
            position: {
                of: '#garam_map',
                at: 'right center',
                my: 'right-60 center'
            },
            autoOpen: false,
            close: function(e, ui) {
                $('#tabKrDetail').html('');
                $('#dvkrLyrDetailInfo').html('');
            }
        });


        //간이탁상 전체 목록 열기
        $('#popSimpleTsList').dialog({
            title: '간이탁상 전체 목록',
            minWidth: 300,
            maxHeight: 500,
            minHeight: 100,
            width: 500,
            position: {
                of: '.map_layer3',
                at: 'left bottom',
                my: 'left top+45'
            },
            autoOpen: false,
            resizable: false,
            open: function(e, ui) {
                //데이터 세팅
                $req.ajax({
                    url: ctx + '/map/view/api/simpleTs/getData.do',
                    type: 'POST',
                    data: {},
                    success: function(result) {
                        let list = result['rows'];
                        const $dv = $('#dvSimpleTsList');
                        if(list.length > 0) {
                            $dv.html('');

                            for(let i in list) {
                                const o = list[i];

                                let price = 0;
                                let lnd = o['calcPriceLnd'] * o['areaLnd'];
                                let bld = o['calcPriceBld'] * o['areaBld'];

                                price = lnd + bld;

                                const html =
                                    '<tr class="totSimpleTsRow pointer-cursor">' +
                                    '   <td>' +
                                    o.as1 + ' ' + o.as2 + ($cmmn.isNullorEmpty(o.as3) ? '' : ' ' + o.as3) + ' ' + o.as4 + ' ' +
                                    (o.mnnm * 1) + ($cmmn.isNullorEmpty(o.slno) ? '' : '-' + (o.slno * 1)) +
                                    '   </td>' +
                                    '   <td>' + $cmmn.numberWithCommas(price.toFixed(0)) + '</td>' +
                                    '   <td>' + o['regDate'] + '</td>' +
                                    '</tr>';

                                const $tr = $(html);
                                $tr.data(o);

                                $dv.append($tr);
                            }
                        } else {
                            $dv.html('<tr><td colspan="3" class="noResult">등록된 탁상감정 데이터가 없습니다.</td></tr>');
                        }
                    },
                });
            }
        });


        //상세정보 조회
        $('#tabKrDetail').on('click', 'li', function(e) {
            $('#tabKrDetail li').removeClass('on');
            $(e.currentTarget).addClass('on');

            const data = $(this).data();
            const krLyrNm = data['krLyrNm'];

            $.get(ctx + '/html/mapDtl/krLayer/' + krLyrNm + '.html', function(result) {
                const tmpl = _.template(result);
                //주소

                let tmplData = data;
                if(krLyrNm === 'simpleTs') {
                    const tmplDataCallback = function(stData) {
                        tmplData = {
                            list: stData.rows,
                        };
                    }
                    $req.ajax({
                        url: ctx + '/map/view/api/simpleTs/getData.do',
                        type: 'POST',
                        async: false,
                        data: {
                            pnu: tmplData['pnu'],
                            listType: 'list'
                        },
                        success: tmplDataCallback,
                    });
                } else if (krLyrNm === "tapasmt") {
                    const tapasmtCallback = function(result) {
                        tmplData = result;
                    }

                    $req.ajax({
                        url: ctx + "/map/view/api/tapasmt/dtl.do",
                        type: "POST",
                        async: false,
                        data: {
                            masterid: tmplData['masterid'],
                            ladSeq: tmplData['ladSeq']
                        },
                        success: tapasmtCallback,
                    });
                } else if (krLyrNm === 'qSale' || krLyrNm === 'qJun') {
                    const callback = function(result) {
                        tmplData = result;
                    }

                    $req.ajax({
                        url: ctx + "/map/view/api/qList/dtl.do",
                        type: "POST",
                        async: false,
                        data: {
                            seq: tmplData['seq'],
                            type: tmplData['type']
                        },
                        success: callback,
                    });
                }

                const html = tmpl(tmplData);
                $('#dvkrLyrDetailInfo').html(html);
            });
        });


        //가람맵 좌측 레이어 조작
        $('.ipKrLayer').on('click', function(e) {
            const $target = $(e.currentTarget);
            const krLyrNm = $target.data('val');

            const isOn = $target.hasClass('off');
            if(isOn) {
                $target.removeClass('off');
            } else {
                $target.addClass('off');

                //TODO임시
                removeKrLyr(krLyrNm);
                removeKrDotLyr(krLyrNm);
            }

            const map = $map.getMap();


            if(krLyrNm === 'simpleTs' && isOn) {
                $('#popSimpleTsList').dialog('open');
            }

            //moveend event 발생
            map.dispatchEvent({type: 'moveend', map: map});
        });


        //간이탁상 목록 조회
        $(document).on('click', '.totSimpleTsRow', function(e) {
            $('.totSimpleTsRow').removeClass('on');
            
            const $t = $(e.currentTarget);
            $t.addClass('on');
            
            const dt= $t.data();
            const x = dt['pointX'];
            const y = dt['pointY'];

            $map.getMap().getView().animate({
                center: [x*1, y*1],
                zoom: krLyrMinZoom,
                duration: 300,
            });
        });
    }

    return {
        clickEventActive: clickEventActive,

        init: init,
        moveend: moveend,
        singleclick: singleclick,
        saveSimpleTs: saveSimpleTs,
    }
} ());