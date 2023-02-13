const $mapEvt = (function () {
    'use strict';

    const mapTool = {
        offInters: function (map) {
            //interaction 기능 OFF
            $('.mapTool[data-tool-type="distance"]').removeClass('on');
            $('.mapTool[data-tool-type="area"]').removeClass('on');
            $('.mapTool[data-tool-type="info"]').removeClass('on');
            // $('.mapTool[data-tool-type="simpleTs"]').removeClass('on');
            $('.mapTool[data-tool-type="roadView"]').removeClass('on');

            this.distance(map, true);
            this.area(map, true);
            this.info(map, true);
            // this.simpleTs(map, true);

            $roadView.setActive(map, false);
        },
        zoomIn: function (map, isOn) {
            //확대
            let thisZoom = map.getView().getZoom();
            thisZoom++;
            map.getView().animate({zoom: thisZoom, duration: 300});
        },
        zoomOut: function (map, isOn) {
            //축소
            let thisZoom = map.getView().getZoom();
            thisZoom--;
            map.getView().animate({zoom: thisZoom, duration: 300});
        },
        toc: function (map, isOn) {
            //레이어
            if (isOn) {
                $('#dvToc').hide();
            } else {
                $('#dvToc').show();
            }
        },
        roadView: function (map, isOn) {
            //로드뷰
            $roadView.setActive(map, !isOn);
        },
        landLyr: function (map, isOn) {
            const $lyr = $('.lyrTocCheck[value="lp_pa_cbnd_bubun"]');
            //지적도
            $lyr.prop('checked', !isOn);
            $lyr.trigger('change');
        },
        distance: function (map, isOn) {
            //거리
            if (isOn) {
                $measure.off();
            } else {
                $measure.init('distance');
            }
        },
        area: function (map, isOn) {
            //면적
            if (isOn) {
                $measure.off();
            } else {
                $measure.init('area');
            }
        },
        refresh: function (map, isOn) {
            //지도 초기화

            //전체 vector 삭제
            const vList = $layer.getVectorLayers();
            _.each(vList, function (vl, i) {
                vl.getSource().clear();
            });

            //overlay 삭제
            const ovlys = map.getOverlays().getArray();
            //overlay는 삭제할때마다 리스트 size가 바뀜
            const len = ovlys.length;
            for (let i = 0; i < len; i++) {
                if (ovlys.length > 0) {
                    const ovly = ovlys[0];
                    map.removeOverlay(ovly);
                }
            }

            //wms visible false처리
            $('#btnUncheckLyrs').trigger('click');

            //상단 레이어 끄기
            $('.ipKrLayer').addClass('off');

        },
        saveMap: function (map) {
            //지도화면저장
            html2canvas(document.getElementById('dvMap')).then(function(canvas) {
                const dataUrl = canvas.toDataURL("image/png");
                //이미지 저장
                const el = document.getElementById("downloadMapImage");
                let date = new Date();
                let dateStr = date.getUTCFullYear() + '' +
                    (date.getUTCMonth() * 1 + 1) +
                    date.getUTCDate() +
                    date.getTime();

                el.href = dataUrl;
                el.download = '가람맵_' + dateStr + '.png';
                el.click();
            });
        },
        info: function (map, isOn) {
            //정보조회
            if(typeof $mapSearch !== 'undefined') {
                $mapSearch.dtl.activeInfo = !isOn;
            }
        },

        //TODO 삭제 예정
        simpleTs: function (map, isOn) {
            //간이탁상 입력
            $layer.krLyr.clickEventActive = !isOn;
        },
    };


    //지도조작도구
    const mapToolCallback = function (e) {
        const $target = $(e.currentTarget);
        const mapToolType = $target.data('toolType');
        const map = $map.getMap();

        const isOn = $target.hasClass('on');

        //inter끄기
        if (mapToolType !== 'landLyr') {
            mapTool['offInters'](map);
        }

        if (mapToolType !== 'refresh' && mapToolType !== 'saveMap') {
            if (isOn) {
                $target.removeClass('on');
            } else {
                $target.addClass('on');
            }
        }

        //도구 실행
        mapTool[mapToolType](map, isOn);

        //return false;
    }


//지도 이벤트 정의
const initMapEvt = function () {
    const map = $map.getMap();

    //지도이동 종료시
    map.on('moveend', function (e) {
        //위치도 작성 기능
        if (typeof $pfMap != 'undefined' && $pfMap != null) {
            $pfMap.moveend(e);
            return false;
        }

        $layer.krLyr.moveend(e);

        //축척바 변경
        const thisZoom = e.target.getView().getZoom();
        const lv = thisZoom - 6;
        const topPos = 83 - (lv * 6);

        $('#dvScaleLv').css({top: topPos});

        //기본 가람맵 기능
        //주소 표시
        const centerPoint = e.target.getView().getCenter();
        const getAddrCallbak = function (data) {

            let txt = '-';
            if (data.result.response.status === 'OK') {
                const resultItem_ = data.result.response.result.item;
                let resultItem = data.result.response.result.item;
                if(Array.isArray(resultItem_)){
                    resultItem = resultItem_[0];
                }
                let zipCode = resultItem.zipcode;
                let zipCodeStr = '';
                if (!$cmmn.isNullorEmpty(zipCode)) {
                    zipCodeStr = '(' + zipCode + ')';
                }

                txt = resultItem.text + ' ' + zipCodeStr;

                if (txt.indexOf('undefined') >= 0) {
                    txt = '-';
                }

                $('#centeroidAddr').html(txt);

                //selectbox 변경
                let st = resultItem['structure'];
                if (!$cmmn.isNullorEmpty(st)) {
                    let lcNum = st['level4LC'];

                    if (!$cmmn.isNullorEmpty(lcNum)) {
                        let p1 = lcNum.substring(0, 2);

                        if (thisZoom <= 8) {
                            $('#selMove_sido option[value=""]').prop('selected', true);
                            $('#selMove_sido').trigger('change', ['locMove']);
                        } else {
                            $('#selMove_sido option[value="' + p1 + '"]').prop('selected', true);
                            $('#selMove_sido').trigger('change', ['locMove', lcNum]);
                        }
                    }
                }
            }
        }
        $addr.searchAddrFromPoint(centerPoint, getAddrCallbak);
    });


    //지도 클릭시
    map.on('singleclick', function (e) {
        $roadView.singleClick(e);
        $layer.krLyr.singleclick(e);

        if (typeof $mapSearch != 'undefined' && $mapSearch != null) {
            $mapSearch.dtl.singleClick(e);
        }

        if (typeof $pfMap != 'undefined' && $pfMap != null) {
            $pfMap.singleClick(e);
        }
    });

    //지도 위 마우스 이동
    map.on('pointermove', function (e) {
        $measure.pointerMove(e);
        $roadView.pointerMove(e);
    });

}


const locSelect = {
    sido: {
        data: 'LT_C_ADSIDO_INFO',
        column: 'ctprvn_cd',
        total: function () {
            const ext = [13890091.241159268, 4045046.6672116867, 14508313.925929774, 4561149.482193197];
            $map.moveToExtFromExtStr(ext.toString());
        }
    },
    sgg: {
        data: 'LT_C_ADSIGG_INFO',
        column: 'sig_cd',
        total: function () {
            //시도 영역으로 이동
            const code = $('#selMove_sido option:selected').val();
            moveToLocationSelected('sido', code);
        }
    },
    emd: {
        data: 'LT_C_ADEMD_INFO',
        column: 'emd_cd',
        total: function () {
            //시군구 영역으로 이동
            const code = $('#selMove_sgg option:selected').val();
            moveToLocationSelected('sgg', code);
        }
    }
}

//지도 상단 selectbox 선택으로 이동
const moveToLocationSelected = function (type, code, fromMain) {
    const thisSelOption = locSelect[type];
    if ($cmmn.isNullorEmpty(code)) {
        thisSelOption['total']();
    } else {
        //위치조회
        const callback = function (result) {
            const fListJson = result.response.result.featureCollection;
            const fList = new ol.format.GeoJSON().readFeatures(fListJson);

            const f = fList[0];
            const fExt = f.getGeometry().getExtent().toString();

            let option = {};
            if (!$cmmn.isNullorEmpty(fromMain) && fromMain) {
                option = {
                    callback: function (a, b) {
                        let zoom = $map.getMap().getView().getZoom();
                        $map.getMap().getView().setZoom(zoom + 1);
                    }
                };
            }
            $map.moveToExtFromExtStr(fExt, option);
        }

        $linkData.getData({
            data: thisSelOption['data'],
            attrFilter: thisSelOption['column'] + ':=:' + code,
            size: 999,
        }, callback);
    }
}


//상단 select 위치 조회하기
const reqLocationSel = function (param, callback) {
    $req.ajax({
        url: ctx + '/map/view/loc/getLocSel.do',
        type: 'post',
        data: param,
        success: callback
    });
}

//initialize
const init = function () {
    initMapEvt();

    //지도 도구
    $('.mapTool').on('click', mapToolCallback);

    //지도 베이스 변경
    $('.mapBase').on('click', function (e) {
        $('.mapBase').removeClass('on');

        let mapType = $(this).data('mapType');
        $layer.changeBase(mapType);

        $(this).addClass('on');
    });

    //시도 목록 불러와서 세팅
    const getSidoCallback = function (result) {
        let html = '<option value="" data-type="sido">전체</option>';
        for (let i in result) {
            let o = result[i];

            //두자리만 사용
            let code = o['reg'].substring(0, 2);
            const nm = o['name'];
            html += '<option value="' + code + '" data-type="sido">' + nm + '</option>';
        }

        $('#selMove_sido').html(html);
        $('#selMove_sido').trigger('change');
    }
    reqLocationSel({}, getSidoCallback);


    //시도 이동시
    $('#selMove_sido').on('change', function (e, moveType, locTarget) {
        //location 조회
        const $opt = $(e.currentTarget).find('option:selected');
        const code = $opt.val();
        const type = $opt.data('type');

        const fromMain = $(e.currentTarget).data('fromMain');

        const isMoving = ($cmmn.isNullorEmpty(moveType) || moveType !== "locMove");

        if (isMoving) {
            moveToLocationSelected(type, code, fromMain);
        }

        if ($cmmn.isNullorEmpty(code)) {
            $('#selMove_sgg').html('<option value="">-</option>');
            return false;
        }

        //하위 데이터 세팅
        const callback = function (result) {
            let html = '<option value="">전체</option>';
            for (let i in result) {
                let o = result[i];
                const nm = o['name'];
                let code = o['reg'];

                html += '<option value="' + code + '" data-type="sgg">' + nm + '</option>';
            }

            $('#selMove_sgg').html(html);

            if (!isMoving) {
                const thisZoom = $map.getMap().getView().getZoom();

                if(thisZoom >= 11 && !$cmmn.isNullorEmpty(locTarget)) {
                    let tl = locTarget.substring(0, 5);

                    $('#selMove_sgg option[value="' + tl + '"]').prop('selected', true);
                    $('#selMove_sgg').trigger('change', [moveType, locTarget]);
                }
            }
        }
        reqLocationSel({sido: code}, callback);
    });

    //시군구 이동시
    $('#selMove_sgg').on('change', function (e, moveType, locTarget) {
        //location 조회
        const $opt = $(e.currentTarget).find('option:selected');
        const code = $opt.val();
        const type = $opt.data('type');

        const isMoving = ($cmmn.isNullorEmpty(moveType) || moveType !== "locMove");

        if (isMoving) {
            moveToLocationSelected(type, code);
        }

        if ($cmmn.isNullorEmpty(code)) {
            $('#selMove_emd').html('<option value="">-</option>');
            return false;
        }

        //하위 데이터 세팅
        const callback = function (result) {
            let html = '<option value="">전체</option>';
            for (let i in result) {
                let o = result[i];
                const nm = o['name'];
                let code = o['reg'] + o['eub'].substring(0, 3);

                html += '<option value="' + code + '" data-type="emd">' + nm + '</option>';
            }

            $('#selMove_emd').html(html);

            if (!isMoving) {
                const thisZoom = $map.getMap().getView().getZoom();

                if(thisZoom >= 14 && !$cmmn.isNullorEmpty(locTarget)) {
                    let tl = locTarget.substring(0, 8);

                    $('#selMove_emd option[value="' + tl + '"]').prop('selected', true);
                    $('#selMove_emd').trigger('change', [moveType, locTarget]);
                }
            }
        }
        reqLocationSel({sgg: code}, callback);
    });

    //읍면동 이동시
    $('#selMove_emd').on('change', function (e, moveType, locTarget) {
        //location 조회
        const $opt = $(e.currentTarget).find('option:selected');
        const code = $opt.val();
        const type = $opt.data('type');

        const isMoving = ($cmmn.isNullorEmpty(moveType) || moveType !== "locMove");

        if (isMoving) {
            moveToLocationSelected(type, code);
        }
    });

}

return {
    init: init,

}
}
()
)
;