/**
 * 지도 좌측 검색영역
 * @type {{}}
 */
const $mapSearch = (function() {
    'use strict';

    //페이지당 검색건수
    //* 결과 마커가 20번까지밖에 없습니다. 되도록 변경하지 마세요
    const RESULT_SIZE = 20;

    const totalCountLbId = 'lbSearchTotal';
    const searchResultDvId = 'dvSearchPlaceResult';
    const paginationId = 'dvPagination';

    //검색결과 pnu목록
    let pnuListSize = 0;
    let pnuList = [];


    //레이어 클리어
    const clearSearchLyr = function() {
        //결과 표시 레이어
        const lyr = $layer.getLayerById($layer.vectorIds.search);
        lyr.getSource().clear();
        clearSearchDtlLyr();
    }

    //select레이어 클리어
    const clearSearchDtlLyr = function() {
        //상세정보 조회 결과 표시 레이어
        const dtlLyr = $layer.getLayerById($layer.vectorIds.searchSelect);
        dtlLyr.getSource().clear();
    }


    //검색결과화면 초기화
    const resetSearch = function() {
        $('#' + totalCountLbId).html('0');
        $('#' + searchResultDvId).html('<tr><td colspan="3" style="text-align: center; color:#666;">검색어를 입력하여 검색해 주세요</td></tr>');
        $('#' + paginationId).html('');

        //레이어 초기화
        clearSearchLyr();
        pnuListSize = 0;
        pnuList = [];
    }


    //지도 검색결과 목록 템플릿
    const mapSearchResultTmpl = _.template(
        '<tr>' +
        '   <td class="resultIndex"><%= index %></td>' +
        '   <td class="srchResTitle dvPlaceDetail">' +
        '       <%= title %><br/>' +
        '       <span class="ic_name">도로명</span><span class="txt">&nbsp;<%= roadAddr %></span><br/>' +
        '       <span class="ic_name">지 번</span><span class="txt">&nbsp;<%= parcelAddr %></span>' +
        '   </td>' +
        '   <td class="dvKaaramData">' +
        '       <img class="loadingImg" src="' + ctx + '/images/progress.gif"/>' +
        '   </td>' +
        '</tr>'
    );


    const setPnuList = function(pnu) {
        pnuList.push(pnu);

        if(pnuList.length === pnuListSize) {
            checkKaaramData();
        }
    }

    //해당 위치에 데이터 있는지 여부 확인
    const checkKaaramData = function() {

        const callback = function(result) {
            $('.dvKaaramData').html('');

            //표준공시지가
            const oflPrice = result['oflPriceCount'];
            if(oflPrice != null && oflPrice.length > 0) {
                for(let i in oflPrice) {
                    const o = oflPrice[i];
                    const pnu = o['pnu'];
                    const cnt = o['cnt'];

                    const $target = $('#' + searchResultDvId)
                        .find('tr[data-pnu="' + pnu + '"]')
                        .find('.dvKaaramData');
                    $target.append((cnt > 0 ? '<button class="bt_orange" title="표준공시지가준">표준</button>' : ''));
                }
            }

            //탁상감정전례
            const tapasmt = result['tapasmtCount'];
            if(tapasmt != null && tapasmt.length > 0) {
                for(let i in tapasmt) {
                    const o = tapasmt[i];
                    const pnu = o['pnu'];
                    const cnt = o['cnt'];

                    const $target = $('#' + searchResultDvId)
                        .find('tr[data-pnu="' + pnu + '"]')
                        .find('.dvKaaramData');
                    $target.append((cnt > 0 ? '<button class="bt_green" title="탁상감정전례">탁상</button>' : ''));
                }
            }

            //자체전례
            const itself = result['itselfCount'];
            if(itself != null && itself.length > 0) {
                for(let i in itself) {
                    const o = itself[i];
                    const pnu = o['pnu'];
                    const cnt = o['cnt'];

                    const $target = $('#' + searchResultDvId)
                        .find('tr[data-pnu="' + pnu + '"]')
                        .find('.dvKaaramData');
                    $target.append((cnt > 0 ? '<button class="bt_blue" title="정식감정전례">정식</button>' : ''));
                }
            }

            //실거래가
            const rtms = result['rtmsCount'];
            if(rtms != null && rtms.length > 0) {
                for(let i in rtms) {
                    const o = rtms[i];
                    const pnu = o['pnu'];
                    const cnt = o['cnt'];

                    const $target = $('#' + searchResultDvId)
                        .find('tr[data-pnu="' + pnu + '"]')
                        .find('.dvKaaramData');

                    $target.append((cnt > 0 ? '<button class="bt_puple" title="실거래가">실가</button>' : ''));
                }
            }

            //$map.toggleMapLoading(false);
        }

        $req.ajax({
            url: ctx + '/map/view/getKaaramDataFromPnu.do',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({pnu: pnuList}),
            success: callback
        });
    }


    //위치검색함수
    const mapSearchPlace = function(param) {
        //$map.toggleMapLoading(true);

        resetSearch();

        $('#' + searchResultDvId).html('');

        const callback = function(result) {
            $('#ipAddrSearchKeyword').val($('#btnSearchPlace').data('query'));

            const type = $('.mapSearchType:checked').val();
            let data = null;
            if(type === 'addr') {
                //지번을 우선으로 검색한다. 만약 지번 결과값이 없으면 도로명을 검색한다
                data = result.parcel;
                if(data.result.response.status !== 'OK') {
                    data = result.road;
                }
            } else if (type === 'place') {
                data = result.place;
            }

            //데이터 결과 체크
            if(data.result.response.status === 'OK') {
                const $tbody = $('#' + searchResultDvId);
                $tbody.html('');

                //마커
                const addMarker = function(item, index) {
                    //marker 추가
                    const pointInfo = item['point'];
                    const coord = [pointInfo['x'] * 1, pointInfo['y'] * 1];

                    const markerId = 'searchResult_' + index;
                    const marker = $map.addPointMarker(
                        $layer.vectorIds.search,
                        {
                            name: markerId,
                            geometry: new ol.geom.Point(coord),
                        }
                    );
                    marker.setId(markerId);
                    marker.set('data', item);

                    marker.setStyle($mapStyle.featureStyle.searchResult((index * 1) + 1));
                }
                
                //결과 행 표시
                const makeResultTr = function(item, index) {
                    //marker 추가
                    const pointInfo = item['point'];
                    const coord = [pointInfo['x'] * 1, pointInfo['y'] * 1];

                    //행 구성
                    const address = item.address;
                    const category = address['category'];

                    if(category != null && category !== '') {
                        const zipCode = address.zipcode;
                        let zipCodeStr = '';

                        if(zipCode !== '') {
                            zipCodeStr = '(' + zipCode + ')';
                        }

                        let parcelAddr = $cmmn.nvl(address.parcel, '');
                        let roadAddr = $cmmn.nvl(address.road, '');

                        const $tr = $(mapSearchResultTmpl({
                            index: (index * 1) + 1,
                            title: zipCodeStr,
                            roadAddr: roadAddr,
                            parcelAddr: parcelAddr
                        }));
                        $tr.data({
                            item: item,
                            text: parcelAddr,
                        });

                        $tbody.append($tr);

                        const pnu = item.id;
                        $tr.attr('data-pnu', pnu);
                        $tr.data({pnu: pnu});
                        setPnuList(pnu);
                        //checkKaaramData(pnu, $tr);
                    } else {
                        //place
                        let parcelAddr = $cmmn.nvl(address.parcel, '');
                        let roadAddr = $cmmn.nvl(address.road, '');

                        const $tr = $(mapSearchResultTmpl({
                            index: (index * 1) + 1,
                            title: item.title,
                            roadAddr: roadAddr,
                            parcelAddr: parcelAddr,
                        }));
                        $tr.data({
                            item: item,
                            text: item.title,
                        });

                        $tbody.append($tr);

                        //pnu정보 조회
                        const pnuCallback = function(pnuInfo) {
                            //tr 구성
                            const pnu = pnuInfo.response.result.featureCollection.features[0].properties.pnu;

                            $tr.data({pnu: pnu});
                            $tr.attr('data-pnu', pnu);
                            //checkKaaramData(pnu);
                            setPnuList(pnu);
                        }

                        //pnu검색 및 목록 구성
                        $linkData.getPnuInfo(new ol.Feature({geometry: new ol.geom.Point(coord)}), pnuCallback);
                    }
                };
                const items = data.result.response.result.items.item;

                //마커
                if(Array.isArray(items)) {
                    for(let i in items) {
                        addMarker(items[i], i);
                    }
                } else {
                    addMarker(items, 0);
                }
                pnuListSize = $layer.getLayerById($layer.vectorIds.search)
                    .getSource().getFeatures().length;


                //결과 목록
                if(Array.isArray(items)) {
                    for(let i in items) {
                        makeResultTr(items[i], i);
                    }
                } else {
                    makeResultTr(items, 0);
                }

                //검색결과영역으로 위치 이동
                const lyr = $layer.getLayerById($layer.vectorIds.search);
                const resultExt = lyr.getSource().getExtent();

                $map.getMap().getView().fit(resultExt, {padding: [0, 0, 0, 420], duration: 300});

                const list = data.result.response;
                $('#' + totalCountLbId).html(list.record.total);

                //paging
                makePagination({
                    totalCount: list.record.total,
                    totalPage: list.page.total,
                    currentPage: list.page.current,
                    pageSize: list.page.size,
                });
            } else {
                $('#' + searchResultDvId).html('<tr><td colspan="3" style="text-align: center; color:#666;">검색 결과가 없습니다</td></tr>');
            }
        }

        $linkData.searchAddr(param, callback);
    }


    /**
     * 페이징 생성
     * @param pageObject
     *  {
     *      totalCount: 총 건수,
     *      totalPage: 총 페이지수,
     *      currentPage: 현재 페이지,
     *      pageSize: 페이지당 데이터 건수
     *  }
     *
     */
    const makePagination = function(pageObject) {
        const paginationDvId = paginationId;
        const pageSize = 10; //한번에 표시할 페이지 개수

        const $pd = $('#' + paginationDvId);
        if ($pd.length <= 0) {
            console.error('[ $search.makePagination ] 페이징 객체 ID가 잘못되었습니다');
            return false;
        }

        //페이징div에 현재 페이지 저장
        $pd.data({currentPage: pageObject.currentPage});
        let currentPage = pageObject.currentPage * 1;

        let html = '';
        html += '<a href="#" ' +
            'data-total-page="' + pageObject.totalPage + '" ' +
            'data-page="prev" class="btnPg"><i class="fas fa-caret-square-left" title="앞 10페이지로"></i></a>';

        //전체 페이지
        let totalPage = pageObject.totalPage * 1;
        //
        let pageIndex = 0;
        if (currentPage > pageSize) {
            pageIndex = Math.floor(currentPage / pageSize);
        }

        let checkMax = (pageIndex * 1 + 1) * pageSize;

        let thisTotalPage = checkMax;
        if (checkMax > totalPage) {
            thisTotalPage = totalPage;
        }

        //startIndex
        let i = (pageIndex * pageSize) + 1;

        for (i; i <= thisTotalPage; i++) {
            let thisPage = i;
            html += '<a href="#"  ' +
                'data-total-page="' + pageObject.totalPage + '" ' +
                'data-page="' + thisPage + '" class="btnPg">';

            if (thisPage === pageObject.currentPage * 1) {
                html += '<b>' + thisPage + '</b>';
            } else {
                html += thisPage;
            }

            html += '</a>';
        }

        html += '<a href="#"  ' +
            'data-total-page="' + pageObject.totalPage + '" ' +
            'data-page="next" class="btnPg"><i class="fas fa-caret-square-right" title="뒤 10페이지로"></i></a>';
        $pd.html(html);
    }

    /**
     * 페이지 이동
     * @param dataObject
     *  {
     *      page: 요청 페이지,
     *      searchType: 검색 타입,
     *      totalPage: 총 페이지수
     *  }
     */
    const movePage = function (dataObject) {
        const page = dataObject['page'];
        const totalPage = dataObject['totalPage'] * 1;

        const paginationDvId = paginationId;
        const currentPage = ($('#' + paginationDvId).data('currentPage')) * 1;

        let toPage = page;

        if (page === 'prev') {
            if (currentPage === 1) {
                $cmmn.showMsg('처음 페이지입니다');
                return false;
            }

            let check = Math.floor(currentPage / 10);
            if (check < 1) {
                toPage = 1;
            } else {
                check--;
                toPage = (check) * 10 + 1;
            }
        } else if (page === 'next') {
            let range = totalPage - currentPage;
            if (range === 0) {
                $cmmn.showMsg('마지막 페이지입니다');
                return false;
            }

            if (range > 10) {
                let check = Math.floor(currentPage / 10);
                check++;
                toPage = (check) * 10 + 1;
            } else {
                //마지막 페이지로 이동
                toPage = totalPage;
            }
        }

        const query = $('#btnSearchPlace').data('query');
        mapSearchPlace({
            query: query,
            size: RESULT_SIZE,
            page: toPage,
        });
    }

    //결과 지번 위치 표시
    const setPnuResultFeature = function(featureJson, addrText) {
        const feat = new ol.format.GeoJSON().readFeature(featureJson);
        const addFeat = $map.addFeature($layer.vectorIds.searchSelect, {
            geometry: feat.getGeometry(),
            bMoveCenter: true,
            moveZoom: 18,
        });
        addFeat.setStyle($mapStyle.featureStyle.searchPlace(addrText));
    }

    //데이터 생성
    const viewMapSearchDetail = function(data) {
        $('#btnToList').show();

        //주소정보 표시
        const addr = data['item']['address'];

        let zipcode = ($cmmn.isNullorEmpty(addr['zipcode']) ? '' : ' (' + addr['zipcode'] + ')');
        let parcelAddr = $cmmn.nvl(addr.parcel, '');
        let roadAddr = $cmmn.nvl(addr.road, '');

        $('#lbDtlAddrRoad').html(roadAddr + zipcode);
        $('#lbDtlAddrParcel').html(parcelAddr + zipcode);

        $('.tabMapSearchDetail').data(data);

        //결과 위치 표시
        clearSearchDtlLyr();

        const pnuFeature = data['pnuFeature'];
        if(pnuFeature != null) {
            setPnuResultFeature(pnuFeature, roadAddr + zipcode);
        } else {
            const point = data['item']['point'];
            const searchF = new ol.Feature({
                geometry: new ol.geom.Point([point.x * 1, point.y * 1]),
            });
            const pnuCallback = function(result) {
                const pnuStt = result.response.status;
                if(pnuStt === 'OK') {
                    const pnuF = result.response.result.featureCollection.features[0];
                    setPnuResultFeature(pnuF, roadAddr + zipcode);
                }
            }
            $linkData.getPnuInfo(searchF, pnuCallback);
        }

        //첫번째 탭 조회
        //탭 이벤트부터는 searchDetail.js 파일에 작성
        $('.tabMapSearchDetail:eq(0)').trigger('click');        

        $('#dvMapSearch').hide();
        $('#dvMapSearchDetail').show();

        //화면 접힌 경우 펼치기
        if($('.map_left_btn').css('left') === '0px') {
            $('.map_left_btn').trigger('click');
        }

        resizeLeftContent();
    }
    

    //event 정의
    const initEvt = function() {
        //엔터키로 검색
        $('#ipSearchQuery').on('keyup', function(e) {
            if(e.code === 'Enter') {
                $('#btnSearchPlace').trigger('click');
            }
        });

        //검색 클릭
        $('#btnSearchPlace').on('click', function(e) {
            const queryStr = $('#ipSearchQuery').val();
            if($cmmn.isNullorEmpty(queryStr)) {
                $cmmn.showMsg('검색어를 입력하세요');
                $('#ipSearchQuery').focus();

                return false;
            }

            //query 문자열 검색버튼에 저장함
            $('#btnSearchPlace').data('query', queryStr);

            let param = {
                query: queryStr,
                size: RESULT_SIZE,
                page: 1
            };

            const isBox = $('#ipSearchBox').is(':checked');
            if(isBox) {
                const bbox = $map.getMap().getView().calculateExtent().toString();
                param['bbox'] = bbox;
            }
            mapSearchPlace(param);
        });

        //범위내검색 클릭
        // $('#btnSearchBbox').on('click', function(e) {
        //     const queryStr = $('#ipSearchQuery').val();
        //     if($cmmn.isNullorEmpty(queryStr)) {
        //         $cmmn.showMsg('검색어를 입력하세요');
        //         $('#ipSearchQuery').focus();
        //
        //         return false;
        //     }
        //
        //     //bbox
        //     const bbox = $map.getMap().getView().calculateExtent().toString();
        //     const param = {
        //         query: queryStr,
        //         size: RESULT_SIZE,
        //         bbox: bbox,
        //         page: 1
        //     };
        //     mapSearchPlace(param);
        // });

        //상세정보 조회
        $(document).on('click', '.dvPlaceDetail', function(e) {
            const data = $(e.currentTarget).parent().data();
            //상세정보화면 생성
            viewMapSearchDetail(data);
            resizeLeftContent();    /* ui 사이즈 변경 */
        });

        
        //페이징
        $(document).on('click', '.btnPg', function (e) {
            const data = $(e.currentTarget).data();
            movePage(data);
        });

        //목록으로 돌아가기
        $('#btnToList').on('click', function(e) {
            $('#dvMapSearchDetail').hide();
            $('#dvDetailInfo').html('');
            clearSearchDtlLyr();

            $('#btnToList').hide();
            $('#dvMapSearch').show();

            resizeLeftContent();
        });
        
    }


    //좌측 검색영역 로딩
    const toggleDtlLoading = function(isOn) {
        let ck = false;

        if(isOn === true) {
            ck = isOn;
        }

        if(ck) {
            $cmmn.showLoading('', 'dvMapLeftSearch');
        } else {
            $cmmn.hideLoading('dvMapLeftSearch');
        }
    }


    //initialize
    const init = function() {
        //조회버튼 show
        $('.mapTool[data-tool-type="info"]').show();

        initEvt();
        $mapSearch.dtl.init();
    }

    return {
        init: init,
        dtl: null,
        viewMapSearchDetail: viewMapSearchDetail,
        toggleDtlLoading: toggleDtlLoading,
    }
} ());