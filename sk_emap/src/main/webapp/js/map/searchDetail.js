/**
 * 지도 좌측 검색 결과 상세조회
 * @type {{}}
 */
 $mapSearch.dtl = (function() {
    'use strict';

    let activeInfo = false;

    //상세정보 탭
    const viewDetailInfo = {
        resetDtl: function() {
            $('#dvDetailInfo').html('');
        },
        loadTmpl: function(key, callback) {
            $('#dvDetailInfo').load(
                ctx + '/html/mapDtl/' + key + '.html',
                callback
            );
        },
        basic: function(pnu) {
            this.resetDtl();

            const callback = function() {
                const today = new Date();
                const thisYear = today.getFullYear();

                //토지임야정보
                const getLandForestCallback = function(result) {
                    const dataList = result.fields.ladfrlVOList;
                    let data;
                    if (Array.isArray(dataList)) {
                        data = dataList[0];
                    } else {
                        data = dataList;
                    }

                    const tml = _.template(
                        '<tr>' +
                        '   <th>지목</th>' +
                        '   <td>(<%= lndcgrCode %>)<%= lndcgrCodeNm %></td>' +
                        '   <th>토지면적㎡</th>' +
                        '   <td><%= $cmmn.numberWithCommas(lndpclAr) %></td>' +
                        '</tr>'
                    );

                    $('#dvLandFrstBasicInfo').html(tml(data));
                }
                $linkData.getLandForest({
                    pnu: pnu,
                    numOfRows: 10,
                    pageNo: 1,
                }, getLandForestCallback);


                //건물면적
                const sigungu = pnu.substring(0, 5);
                const bjdong = pnu.substring(5, 10);
                const platGb = pnu.substring(10, 11);
                const bun = pnu.substring(11, 15);
                const ji = pnu.substring(15);

                let chngPlatGb = (platGb * 1) - 1;
                if (chngPlatGb < 0) chngPlatGb = 0;

                const buldParam = {
                    sigunguCd: sigungu,
                    bjdongCd: bjdong,
                    platGbCd: chngPlatGb,
                    bun: bun,
                    ji: ji,
                    numOfRows: 999,
                };

                //총괄표제부
                const getBrRecapTitleInfoPrm = function () {
                    const rcDef = $.Deferred();

                    const getBrRecapTitleInfoCallback = function (result) {
                        rcDef.resolve(result);
                    }
                    $linkData.getBrRecapTitleInfo(buldParam, getBrRecapTitleInfoCallback);

                    return rcDef;
                }

                //표제부
                const getBrTitleInfoPrm = function () {
                    const titleDef = $.Deferred();

                    const getBrTitleInfoCallback = function (result) {
                        titleDef.resolve(result);
                    }
                    $linkData.getBrTitleInfo(buldParam, getBrTitleInfoCallback);

                    return titleDef;
                }

                $.when(getBrRecapTitleInfoPrm(), getBrTitleInfoPrm())
                    .done(function (rcpResult, titResult) {

                        let targetDate;
                        //총괄표제부
                        const rcplist = rcpResult.response.body.items;
                        if ($cmmn.isNullorEmpty(rcplist)) {
                            //결과 없음
                            //총괄표제부 없으면 표제부 데이터 조회
                            const titleList = titResult.response.body.items;
                            if ($cmmn.isNullorEmpty(titleList)) {
                                //결과 없음
                            } else {

                                const items = titleList['item'];

                                if (Array.isArray(items)) {
                                    targetDate = items[0];
                                } else {
                                    targetDate = items;
                                }
                            }

                        } else {
                            const items = rcplist['item'];

                            if (Array.isArray(items)) {
                                targetDate = items[0];
                            } else {
                                targetDate = items;
                            }
                        }

                        let html = '';
                        if(!$cmmn.isNullorEmpty(targetDate)) {
                            html =
                                '<tr>' +
                                '   <th>대지면적(㎡)</th>' +
                                '   <td>' + $cmmn.numberWithCommas(targetDate.platArea) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '   <th>연면적(㎡)</th>' +
                                '   <td>' + $cmmn.numberWithCommas(targetDate.totArea) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '   <th>건축면적(㎡)</th>' +
                                '   <td>' + $cmmn.numberWithCommas(targetDate.archArea) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '   <th>사용승인일자</th>' +
                                '   <td>' + targetDate.useAprDay + '</td>' +
                                '</tr>';

                            //화면에 데이터 표시

                        } else {
                            html = '<tr><td colspan="2" class="noResult">결과가 없습니다</td></tr>';
                        }

                        $('#dvBldBasicInfo').html(html);
                    });


                //개별공시지가
                const getIndvdLandPriceAttrCallback = function (result) {
                    const dataList = result.response['fields'];
                    if (dataList == null) {
                        //결과없음
                        $('#dvLndPriceResult').html(
                            '<tr><td colspan="2" class="noResult">검색된 개별공시지가 정보가 없습니다</td></tr>'
                        );
                    } else {
                        const tmp = _.template(
                            '<tr>' +
                            '    <th>공시일자</th>' +
                            '    <td><%= pblntfDe %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>공시지가 (원/㎡)</th>' +
                            '    <td><%= $cmmn.numberWithCommas(pblntfPclnd) %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>데이터 기준일자</th>' +
                            '    <td><%= lastUpdtDt %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>특수지 구분</th>' +
                            '    <td><%= regstrSeCodeNm %></td>' +
                            '</tr>'
                        )

                        const fArr = dataList['field'];
                        let html = '';

                        if (Array.isArray(fArr)) {
                            //여러건
                            for (let i in fArr) {
                                const f = fArr[i];
                                html += tmp(f);
                            }
                        } else {
                            //단건
                            html += tmp(fArr);
                        }

                        $('#dvLndPriceResult').html(html);
                    }
                }
                $linkData.getIndvdLandPriceAttr({
                    pnu: pnu,
                    stdrYear: thisYear,
                    format: 'xml',
                    numOfRows: 999,
                }, getIndvdLandPriceAttrCallback);


                //개별주택가격
                const getIndvdHousingPriceCallback = function(result) {
                    const dataList = result.response['fields'];
                    if (dataList == null) {
                        //결과없음
                        $('#dvBuldPriceResult').html(
                            '<tr><td colspan="2" class="noResult">요청한 주소에 대한 주택가격정보가 없습니다</td></tr>'
                        );
                    } else {
                        const tmp = _.template(
                            '<tr>' +
                            '    <th>데이터 기준일자</th>' +
                            '    <td><%= lastUpdtDt %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>주택가격(원)</th>' +
                            '    <td><%= $cmmn.numberWithCommas(housePc) %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>면적(㎡)</th>' +
                            '    <td>' +
                            '        토지대장면적&nbsp;:&nbsp;<%= $cmmn.numberWithCommas(ladRegstrAr) %>㎡<br/>' +
                            '        산정대지면적&nbsp;:&nbsp;<%= $cmmn.numberWithCommas(calcPlotAr) %>㎡<br/>' +
                            '        건물전체연면적&nbsp;:&nbsp;<%= $cmmn.numberWithCommas(buldAllTotAr) %>㎡<br/>' +
                            '        건물산정연면적&nbsp;:&nbsp;<%= $cmmn.numberWithCommas(buldCalcTotAr) %>㎡<br/>' +
                            '    </td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>표준지여부</th>' +
                            '    <td><%= stdLandAt %></td>' +
                            '</tr>'
                        );

                        let html = '';
                        const fArr = dataList['field'];
                        if (Array.isArray(fArr)) {
                            for(let i in fArr) {
                                const f = fArr[i];
                                html += tmp(f);
                            }
                        } else {
                            html = tmp(fArr);
                        }

                        $('#dvBuldPriceResult').html(html);
                    }
                }
                $linkData.getIndvdHousingPrice({
                    pnu: pnu,
                    stdrYear: thisYear,
                    numOfRows: 999,
                    format: 'xml',
                }, getIndvdHousingPriceCallback);
            }

            this.loadTmpl('basic', callback);
        },
        land: function(pnu) {
            this.resetDtl();

            const callback = function() {
                const today = new Date();
                const thisYear = today.getFullYear();
                const thisMonth = today.getMonth() + 1;
                const thisDate = today.getDate();

                //토지임야정보
                const getLandForestCallback = function(result) {
                    const dataList = result.fields.ladfrlVOList;
                    let data;
                    if (Array.isArray(dataList)) {
                        data = dataList[0];
                    } else {
                        data = dataList;
                    }

                    const tml = _.template(
                        '<tr>' +
                        '   <th>지목</th>' +
                        '   <td>(<%= lndcgrCode %>)<%= lndcgrCodeNm %></td>' +
                        '   <th>토지면적㎡</th>' +
                        '   <td><%= $cmmn.numberWithCommas(lndpclAr) %></td>' +
                        '</tr>'
                    );

                    $('#dvLndFrResult').html(tml(data));
                }
                $linkData.getLandForest({
                    pnu: pnu,
                    numOfRows: 10,
                    pageNo: 1,
                }, getLandForestCallback);


                //토지이동이력
                const getLandMoveAttrCallback = function (result) {
                    const dataList = result.response['fields'];
                    if (dataList == null) {
                        //결과없음
                        $('#dvLndMvResult').parents('.map_table').css('width', '370px');
                        $('#dvLndMvResult').html('<tr><td colspan="3" class="noResult">결과가 없습니다.</td></tr>');
                    } else {

                        const makeHtml = function (f) {
                            return '<tr>' +
                                '   <td>' + f.ladHistSn + '</td>' +
                                '   <td>' + f.ladMvmnDe + '</td>' +
                                '   <td>' + f.ladMvmnPrvonshCodeNm + '</td>' +
                                '</tr>';
                        }

                        const fArr = dataList['field'];
                        let html = '';
                        if (Array.isArray(fArr)) {
                            //여러건
                            for (let i in fArr) {
                                const f = fArr[i];
                                html += makeHtml(f);
                            }
                        } else {
                            //단건
                            html += makeHtml(fArr);
                        }

                        $('#dvLndMvResult').html(html);
                        //$('.tblLand').tableScroll({height:180});
                    }
                }
                $linkData.getLandMoveAttr({
                    pnu: pnu,
                    /*startDt: (thisYear - 20) + '' +
                        $cmmn.lpad(thisMonth, 2, '0') + '' +
                        $cmmn.lpad(thisDate, 2, '0'),*/
                    endDt: thisYear + '' +
                        $cmmn.lpad(thisMonth, 2, '0') + '' +
                        $cmmn.lpad(thisDate, 2, '0'),
                    format: 'xml',
                    numOfRows: 999,
                }, getLandMoveAttrCallback);

                //토지소유속성조회
                const getLandPossessionAttrCallback = function (result) {
                    const dataList = result.response['fields'];

                    if (dataList == null) {
                        //결과없음
                        $('#dvLndPssResult').html('<tr><td colspan="4" class="noResult">결과가 없습니다.</td></tr>');
                    } else {

                        const makeHtml = function (f) {
                            return '<tr>' +
                                '   <td>' + f.posesnSeCodeNm + '</td>' +
                                '   <td>' + f.ownshipChgDe + '</td>' +
                                '   <td>' + f.ownshipChgCauseCodeNm + '</td>' +
                                '   <td>' + f.lastUpdtDt + '</td>' +
                                '</tr>';
                        }

                        let fArr = dataList['field'];
                        let html = '';
                        if (Array.isArray(fArr)) {
                            //여러건
                            fArr = _.sortBy(fArr, 'ownshipChgDe');
                            fArr = fArr.reverse();

                            for (let i in fArr) {
                                const f = fArr[i];
                                html += makeHtml(f);
                            }
                        } else {
                            //단건
                            html += makeHtml(fArr);
                        }

                        $('#dvLndPssResult').html(html);
                        //$('.tblLand').tableScroll({height:180});
                    }
                }
                $linkData.getLandPossessionAttr({
                    pnu: pnu,
                    format: 'xml',
                    numOfRows: 999,
                }, getLandPossessionAttrCallback);


                //토지이용계획정보
                const getLandUseSvcCallback = function(result) {
                    const attr = result['wfs:FeatureCollection']['gml:featureMember'];
                    //TODO null처리
                    const prposText = attr['NSDI:F176']['NSDI:PRPOS_AREA_DSTRC_NM_LIST'];
                    const prposCodeTxt = attr['NSDI:F176']['NSDI:PRPOS_AREA_DSTRC_CODE_LIST'];

                    const arrPrposCode = prposCodeTxt.split(',');
                    const prposList = prposText.split(',');

                    let prposUq = [];
                    let prpos = [];
                    for(let i in arrPrposCode) {
                        const code = arrPrposCode[i];
                        let codeStr = code.substring(0, 2);

                        const dt = {
                            codePre: codeStr,
                            code: code,
                            name: prposList[i],
                        };

                        if(codeStr === 'UQ') {
                            prposUq.push(dt);
                        } else {
                            prpos.push(dt);
                        }
                    }

                    prposUq = _.sortBy(prposUq, 'code');
                    prpos = _.sortBy(prpos, 'code');

                    //따로 잘라서 표시
                    let html = '';

                    //국토교통부 법령 우선 정렬하여 추가
                    for(let i in prposUq) {
                        const o = prposUq[i];
                        html += '<span class="lbPrpos" data-code="' + o['code'] + '">' + o['name'] + '</span>';
                    }

                    for(let i in prpos) {
                        const o = prpos[i];
                        html += '<span class="lbPrpos ' +
                            (i == 0 ? 'lbPrposTl' : '') +
                            '" data-code="' + o['code'] + '">' + o['name'] + '</span>';
                    }

                    $('#lbLndPrposResult').html(html);
                    $('.lbPrpos:eq(0)').trigger('click');
                }
                $linkData.getLandUseSvc({
                    pnu: pnu, format: 'xml'
                }, getLandUseSvcCallback);
            }
            this.loadTmpl('land', callback);
        },
        buld: function(pnu) {
            this.resetDtl();

            const callback = function() {
                //건축물대장 목록
                const sigungu = pnu.substring(0, 5);
                const bjdong = pnu.substring(5, 10);
                const platGb = pnu.substring(10, 11);
                const bun = pnu.substring(11, 15);
                const ji = pnu.substring(15);

                let chngPlatGb = (platGb * 1) - 1;
                if (chngPlatGb < 0) chngPlatGb = 0;

                const buldParam = {
                    sigunguCd: sigungu,
                    bjdongCd: bjdong,
                    platGbCd: chngPlatGb,
                    bun: bun,
                    ji: ji,
                    numOfRows: 999,
                };

                //총괄표제부
                const getBrRecapTitleInfoPrm = function () {
                    const rcDef = $.Deferred();

                    const getBrRecapTitleInfoCallback = function (result) {
                        rcDef.resolve(result);
                    }
                    $linkData.getBrRecapTitleInfo(buldParam, getBrRecapTitleInfoCallback);

                    return rcDef;
                }

                //표제부
                const getBrTitleInfoPrm = function () {
                    const titleDef = $.Deferred();

                    const getBrTitleInfoCallback = function (result) {
                        titleDef.resolve(result);
                    }
                    $linkData.getBrTitleInfo(buldParam, getBrTitleInfoCallback);

                    return titleDef;
                }

                $.when(getBrRecapTitleInfoPrm(), getBrTitleInfoPrm())
                    .done(function (rcpResult, titResult) {
                        const $sel = $('#selBuldRegister');
                        $sel.html('');

                        const rcplist = rcpResult.response.body.items;
                        if ($cmmn.isNullorEmpty(rcplist)) {
                            //결과 없음
                        } else {
                            const items = rcplist['item'];
                            let item;
                            if (Array.isArray(items)) {
                                item = items[0];
                            } else {
                                item = items;
                            }
                            const $opt = $('<option value="' + item['regstrKindCd'] + '">' +
                                item['regstrKindCdNm'] + '</option>');
                            $opt.data({
                                item: item,
                                buldParam: buldParam
                            });

                            $sel.append($opt);
                        }

                        const titleList = titResult.response.body.items;
                        if ($cmmn.isNullorEmpty(titleList)) {
                            //결과 없음
                        } else {
                            const appendOption = function(item) {
                                const $opt = $('<option value="' +
                                    item['regstrKindCd'] + '">' +
                                    item['regstrKindCdNm'] + '(' + item['mainAtchGbCdNm'] + ') : ' +
                                    item['dongNm'] + '</option>');
                                $opt.data({
                                    item: item,
                                    buldParam: buldParam
                                });

                                $sel.append($opt);
                            }
                            const items = titleList['item'];

                            if (Array.isArray(items)) {
                                for(let i in items) {
                                    appendOption(items[i]);
                                }
                            } else {
                                appendOption(items);
                            }
                        }

                        $sel.trigger('change');
                    });
            }
            this.loadTmpl('buld', callback);
        },
        price: function(pnu) {
            this.resetDtl();

            const callback = function() {
                $('.tbPriceInfo').data({pnu: pnu});
                $('.tbPriceInfo:eq(0)').trigger('click');
            }
            this.loadTmpl('price', callback);
        },
        oflp: function(pnu) {
            this.resetDtl();

            const tmpCallback = function() {
                const callback = function(result) {
                    let html = '';
                    if(result.CODE === 'SUCCESS') {
                        const data = result['data']['rows'][0];
                        const template = _.template(
                            /*'<tr>' +
                            '   <th>소재지</th>' +
                            '   <td><%= addr %></td>' +
                            '</tr>' +*/
                            '<tr>' +
                            '   <th>면적(㎡)</th>' +
                            '   <td><%= area %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>지목</th>' +
                            '   <td><%= jimok %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>공시지가(원/㎡)</th>' +
                            '   <td><%= $cmmn.numberWithCommas(price) %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>지리적 위치</th>' +
                            '   <td><%= jiri1 %><br/><%= jiri2 %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>이용상황</th>' +
                            '   <td><%= iyong %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>용도지역</th>' +
                            '   <td><%= youngdo %>&nbsp;<%= youngdo2 %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>주위환경</th>' +
                            '   <td><%= juwi %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>도로교통</th>' +
                            '   <td><%= dorog %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>형상</th>' +
                            '   <td><%= hyungsang %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>지세</th>' +
                            '   <td><%= jise %></td>' +
                            '</tr>');

                        html = template(data);
                        $('#ipCoord').data({
                            x: data['pointX'],
                            y: data['pointY']
                        });
                    } else {
                        //결과 없음
                        html = '<tr><td colspan="2" class="noResult">결과가 없습니다</td></tr>';
                    }
                    $('#dvStndLndPrice').html(html);
                }
                $req.ajax({
                    url: ctx + '/map/view/getStndLndPrice.do',
                    data: {pnu: pnu},
                    success: callback,
                });
            }

            this.loadTmpl('stndLndPrice', tmpCallback);
        },
        tapasmt: function(pnu) {
            this.resetDtl();

            const callback = function() {
                const getTapasmtListCallback = function(result) {
                    const $target = $('#selTapasmtResult');
                    $target.html('');

                    const resultCode = result['CODE'];
                    if(resultCode === 'SUCCESS') {
                        const dataList = result['data']['rows'];

                        for(let i in dataList) {
                            const o = dataList[i];
                            const $opt = $('<option value="' + i + '">' + o['masterid'] + '</option>');
                            $opt.data(o);

                            $target.append($opt);
                        }

                        $target.trigger('change');

                    } else {
                        //결과 없음
                        $target.html('<option value="">-</option>')
                        $('#dvTapasmtResult').html('<td colspan="2" class="noResult">검색된 탁상감정 전례가 없습니다</td>');
                    }
                }
                $req.ajax({
                    url: ctx + '/map/view/getTapasmtList.do',
                    type: 'post',
                    data: {pnu: pnu},
                    success: getTapasmtListCallback,
                });
            }

            this.loadTmpl('tapasmt', callback);
        },
        itself: function(pnu) {
            this.resetDtl();

            const callback = function() {
                //정식감정 목록 조회
                const dataCallback = function(result) {
                    const code = result['CODE'];

                    const $ul = $('#dvItselfListResult');
                    $ul.html('');

                    if(code === 'SUCCESS') {
                        const list = result['data']['rows'];
                        const t = _.template(
                            '<li>' +
                            '   <div class="itselfDt">' +
                            '       <i class="fas fa-check"></i>' +
                            '       <span><%= docId %></span>' +
                            '       <button class="tbltop showPdf" data-masterid="<%= masterid %>" style="margin-top:3px;">감정서 조회</button>' +
                            '   </div>' +
                            '   <div class="itselfDtDetail" style="display:none; overflow:auto; height:200px; margin:0 5px; border:1px solid #ddd;">' +
                            '       <table class="tbStyle5" style="width:100%;">' +
                            '           <colgroup>' +
                            '               <col style="width:30%;"/>' +
                            '               <col style="width:auto%;"/>' +
                            '           </colgroup>' +
                            '           <tbody>' +
                            '               <tr>' +
                            '                   <th>감정서 번호</th>' +
                            '                   <td><%= docId %></td>' +
                            '               </tr>' +
                            '               <tr>' +
                            '                   <th>평가금액(원)</th>' +
                            '                   <td><%= $cmmn.numberWithCommas(price) %></td>' +
                            '               </tr>' +
                            '               <tr>' +
                            '                   <th>업무구분</th>' +
                            '                   <td><%= workNm %></td>' +
                            '               </tr>' +
                            '               <tr>' +
                            '                   <th>평가목적</th>' +
                            '                   <td><%= purposeNm %></td>' +
                            '               </tr>' +
                            '               <tr>' +
                            '                   <th>물건종류(대)</th>' +
                            '                   <td><%= thingGroupNm %></td>' +
                            '               </tr>' +
                            '               <tr>' +
                            '                   <th>물건종류(중)</th>' +
                            '                   <td><%= thingNm %></td>' +
                            '               </tr>' +
                            '               <tr>' +
                            '                   <th>거래처</th>' +
                            '                   <td><%= custName %></td>' +
                            '               </tr>' +
                            '               <tr>' +
                            '                   <th>의뢰인</th>' +
                            '                   <td><%= custCharge %></td>' +
                            '               </tr>' +
                            '               <tr>' +
                            '                   <th>담당평가사</th>' +
                            '                   <td><%= evlUserNm %></td>' +
                            '               </tr>' +
                            '               <tr>' +
                            '                   <th>발송일자</th>' +
                            '                   <td><%= sendDate %></td>' +
                            '               </tr>' +
                            '           </tbody>' +
                            '       </table>' +
                            '   </div>' +
                            '</li>'
                        );


                        for(let i in list) {
                            const o = list[i];

                            const $li = $(t(o));
                            $li.data(o);
                            $ul.append($li);
                        }

                        $ul.find('li:eq(0) .itselfDt').trigger('click');
                    } else {
                        $ul.html('<li class="noResult">정식 감정 결과가 없습니다.</li>');
                    }
                }

                $req.ajax({
                    url: ctx + '/map/view/getItself.do',
                    type: 'post',
                    data: {pnu: pnu},
                    success: dataCallback
                });
            }
            this.loadTmpl('itself', callback);
        },
        rtms: function(pnu) {
            this.resetDtl();

            const callback = function() {
                const dataCallback = function(result) {
                    const resultCode = result['CODE'];

                    let html = '';
                    if(resultCode === 'SUCCESS') {
                        const dataList = result['data']['rows'];
                        const data = dataList[0];

                        const template = _.template(
                            /*'<tr>' +
                            '   <th>소재지</th>' +
                            '   <td><%= addr %></td>' +
                            '</tr>' +*/
                            '<tr>' +
                            '   <th>구분</th>' +
                            '   <td><%= gubun %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>단지</th>' +
                            '   <td><%= aptNm %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>소재지</th>' +
                            '   <td><%= addr %> <%= bunji %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>전용면적</th>' +
                            '   <td><%= area %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>대지면적</th>' +
                            '   <td><%= area2 %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>거래형태</th>' +
                            '   <td><%= cate1 %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>계약일자</th>' +
                            '   <td><%= contractMon %><%= contractDay %></td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>거래금액(층)</th>' +
                            '   <td><%= price %> (<%= floor %>층)</td>' +
                            '</tr>' +
                            '<tr>' +
                            '   <th>해제사유발생일</th>' +
                            '   <td><%= cancelResn %></td>' +
                            '</tr>'
                        );

                        let price = data['actPrice'];
                        if($cmmn.isNullorEmpty(price) || (price * 1) <= 0) {
                            price = '보증금(만원) ' + $cmmn.numberWithCommas(data['deposit']) +
                                    '/ 월(만원) ' + $cmmn.numberWithCommas(data['monPrice']);
                        } else {
                            price = $cmmn.numberWithCommas(price);
                        }
                        data['price'] = price;
                        html = template(data);

                        $('#ipCoord').data({
                            x: data['pointX'],
                            y: data['pointY']
                        });
                    } else {
                        //결과없음
                        html = '<tr><td colspan="2" class="noResult">결과가 없습니다</td></tr>';
                    }

                    $('#dvRtms').html(html);
                }

                $req.ajax({
                    url: ctx + '/map/view/getRtmsPrice.do',
                    data: {pnu: pnu},
                    success: dataCallback
                });
            }
            this.loadTmpl('rtms', callback);
        },
        archPms: function(pnu) {
            this.resetDtl();

            const callback = function() {
                //파라미터 생성
                const sigungu = pnu.substring(0, 5);
                const bjdong = pnu.substring(5, 10);
                const platGb = pnu.substring(10, 11);
                const bun = pnu.substring(11, 15);
                const ji = pnu.substring(15);

                let chngPlatGb = (platGb * 1) - 1;
                if (chngPlatGb < 0) chngPlatGb = 0;

                const buldParam = {
                    sigunguCd: sigungu,
                    bjdongCd: bjdong,
                    platGbCd: chngPlatGb,
                    bun: bun,
                    ji: ji,
                    numOfRows: 999,
                };

                //인허가 정보 조회
                const getApBasisOulnInfoCallback = function(result) {
                    const list = result.response.body.items;

                    const $sel = $('#selArchPms');
                    $sel.html('');

                    let html = '';
                    if ($cmmn.isNullorEmpty(list)) {
                        //결과 없음
                        $('#dvArchPmsResult').html('<tr><td colspan="2" class="noResult">요청한 주소에 대한 주택가격정보가 없습니다</td></tr>');
                    } else {
                        const item = list['item'];
                        const appendOption = function(o) {
                            const $opt = $('<option value="' + o['mgmPmsrgstPk'] + '">' + o['mgmPmsrgstPk'] + '</option>');
                            $opt.data(o);

                            $sel.append($opt);
                        }

                        if (Array.isArray(item)) {
                            for(let i in item) {
                                appendOption(item[i]);
                            }
                        } else {
                            appendOption(item);
                        }

                        $sel.trigger('change');
                    }
                }

                $linkData.getApBasisOulnInfo(buldParam, getApBasisOulnInfoCallback);
            }

            this.loadTmpl('archPms', callback);
        },
        simpleTs: function(pnu) {
            //간이탁상
            const callback = function() {
                $cmmn.showLoading('', 'dvDetailInfo');

                //기존 정보 조회
                const dataCallback = function(dataResult) {
                    const rows = dataResult['rows'];
                    const $frm = $('#frmSimpleTs');
                    //주소
                    const dt = $('.tabMapSearchDetail.on').data();
                    $frm.find('#pointX').val(dt.item.point.x);
                    $frm.find('#pointY').val(dt.item.point.y);

                    $frm.find('#st_addr').text(dt.text);
                    $frm.find('#pnu').val(dt.pnu);

                    if(rows.length > 0) {
                        //기존 데이터 있다면,
                        const row = rows[0];
                        $('#areaLnd').val(row['areaLnd']);
                        $('#calcPriceLnd').val(row['calcPriceLnd']);
                        $('#calcPriceLnd').trigger('keyup');

                        $('#areaBld').val(row['areaBld']);
                        $('#calcPriceBld').val(row['calcPriceBld']);
                        $('#calcPriceBld').trigger('keyup');

                        $cmmn.hideLoading('dvDetailInfo');
                    } else {
                        //건물면적
                        const sigungu = pnu.substring(0, 5);
                        const bjdong = pnu.substring(5, 10);
                        const platGb = pnu.substring(10, 11);
                        const bun = pnu.substring(11, 15);
                        const ji = pnu.substring(15);

                        let chngPlatGb = (platGb * 1) - 1;
                        if (chngPlatGb < 0) chngPlatGb = 0;

                        const buldParam = {
                            sigunguCd: sigungu,
                            bjdongCd: bjdong,
                            platGbCd: chngPlatGb,
                            bun: bun,
                            ji: ji,
                            numOfRows: 999,
                        };

                        //총괄표제부
                        const getBrRecapTitleInfoPrm = function () {
                            const rcDef = $.Deferred();

                            const getBrRecapTitleInfoCallback = function (result) {
                                rcDef.resolve(result);
                            }
                            $linkData.getBrRecapTitleInfo(buldParam, getBrRecapTitleInfoCallback);

                            return rcDef;
                        }

                        //표제부
                        const getBrTitleInfoPrm = function () {
                            const titleDef = $.Deferred();

                            const getBrTitleInfoCallback = function (result) {
                                titleDef.resolve(result);
                            }
                            $linkData.getBrTitleInfo(buldParam, getBrTitleInfoCallback);

                            return titleDef;
                        }


                        const getLandForestPrm = function() {
                            const def = $.Deferred();

                            const getLandForestCallback = function(result) {
                                def.resolve(result);
                            }
                            $linkData.getLandForest({
                                pnu: pnu,
                                numOfRows: 10,
                                pageNo: 1,
                            }, getLandForestCallback);

                            return def;
                        }

                        $.when(getBrRecapTitleInfoPrm(), getBrTitleInfoPrm(), getLandForestPrm())
                            .done(function (rcpResult, titResult, lndResult) {

                                let targetDate;
                                //총괄표제부
                                const rcplist = rcpResult.response.body.items;
                                if ($cmmn.isNullorEmpty(rcplist)) {
                                    //결과 없음
                                    //총괄표제부 없으면 표제부 데이터 조회
                                    const titleList = titResult.response.body.items;
                                    if ($cmmn.isNullorEmpty(titleList)) {
                                        //결과 없음
                                    } else {

                                        const items = titleList['item'];

                                        if (Array.isArray(items)) {
                                            targetDate = items[0];
                                        } else {
                                            targetDate = items;
                                        }
                                    }

                                } else {
                                    const items = rcplist['item'];

                                    if (Array.isArray(items)) {
                                        targetDate = items[0];
                                    } else {
                                        targetDate = items;
                                    }
                                }

                                //화면에 데이터 표시
                                if(!$cmmn.isNullorEmpty(targetDate)) {
                                    const ara = targetDate['totArea'];
                                    $('#areaBld').val(ara);
                                }


                                //토지정보
                                const dataList = lndResult.fields.ladfrlVOList;
                                let data;
                                if (Array.isArray(dataList)) {
                                    data = dataList[0];
                                } else {
                                    data = dataList;
                                }

                                $('#areaLnd').val(data.lndpclAr);
                                $cmmn.hideLoading('dvDetailInfo');
                            });
                    }
                }
                $req.ajax({
                    url: ctx + '/map/view/api/simpleTs/getData.do',
                    type: 'POST',
                    data: {
                        pnu: pnu,
                    },
                    success: dataCallback
                });
            }

            this.loadTmpl('simpleTs', callback);
        }
    };



    //건축물 층별 정보 가공
    const makeBrFloorJson = function (itemList) {
        let result = {};
        for (let i in itemList) {
            const o = itemList[i];
            const dongNm = o['dongNm'];

            let key = o['dongNm'];
            if ($cmmn.isNullorEmpty(dongNm)) {
                key = o['bldNm'];
            }

            if (result[key] == null || typeof result[key] === 'undefined') {
                result[key] = {};
            }

            const flrGbCd = o['flrGbCd'];
            if (result[key][flrGbCd] == null || typeof result[key][flrGbCd] === 'undefined') {
                result[key][flrGbCd] = {
                    name: o['flrGbCdNm'],
                    list: []
                };
            }

            result[key][flrGbCd]['list'].push(o);
        }

        _.each(result, function (obj, key) {
            _.each(obj, function (o, k) {
                const list = o['list'];
                result[key][k]['list'] = _.sortBy(list, 'flrNo');
            });
        });

        return result;
    }


    //건축물대장 일반정보 생성
    const makeBuldInfo = {
        basic: function(data) {
            const tmp = _.template(
                '<tr>' +
                '   <th>위치(도로명)</th>' +
                '   <td><%= newPlatPlc %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>위치(지번)</th>' +
                '   <td><%= platPlc %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>대지면적(㎡)</th>' +
                '   <td><%= $cmmn.numberWithCommas(platArea) %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>연면적(㎡)</th>' +
                '   <td><%= $cmmn.numberWithCommas(totArea) %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>건축면적(㎡)</th>' +
                '   <td><%= $cmmn.numberWithCommas(archArea) %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>용적률산정연면적(㎡)</th>' +
                '   <td><%= $cmmn.numberWithCommas(vlRatEstmTotArea) %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>용적률</th>' +
                '   <td><%= vlRat %>%</td>' +
                '</tr>' +
                '<tr>' +
                '   <th>건폐율</th>' +
                '   <td><%= bcRat %>%</td>' +
                '</tr>' +
                '<tr>' +
                '   <th>주용도</th>' +
                '   <td><%= mainPurpsCdNm %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>주건축물수</th>' +
                '   <td><%= mainBldCnt %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>부속건축물수</th>' +
                '   <td><%= atchBldCnt %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>부속건축물면적(㎡)</th>' +
                '   <td><%= $cmmn.numberWithCommas(atchBldArea) %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>세대수</th>' +
                '   <td><%= hhldCnt %>세대 <%= fmlyCnt %>가구</td>' +
                '</tr>' +
                '<tr>' +
                '   <th>사용승인일자</th>' +
                '   <td><%= useAprDay %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>허가일자</th>' +
                '   <td><%= pmsDay %></td>' +
                '</tr>' +
                '<tr>' +
                '   <th>착공일자</th>' +
                '   <td><%= stcnsDay %></td>' +
                '</tr>'
            );

            if(!$cmmn.isNullorEmpty(data)) {
                const item = data['item'];

                item['mainBldCnt'] = $cmmn.nvl(item['mainBldCnt'], '');
                $('#dvBuldRegister').html(tmp(item));
            } else {
                $('#dvBuldRegister').html('<tr><td colspan="2" class="noResult">결과가 없습니다.</td></tr>');
            }

            $('#dvBasic').show();
            $('#dvFlr').hide();
            $('#dvExp').hide();
        },
        floor: function(data) {
            const $dv = $('#dvFlrInfoResult');

            let html = '';
            if(!$cmmn.isNullorEmpty(data)) {
                const buldParam = data['buldParam'];
                const info = data['item'];

                const dongNm = info['dongNm'];

                //목록 html 만들기
                const makeHtml = function(o) {
                    return '<tr>' +
                        '   <td>' + $cmmn.nvl(o['dongNm'], '') + '</td>' +
                        '   <td>' + $cmmn.nvl(o['flrGbCdNm'], '') + '</td>' +
                        '   <td>' + $cmmn.nvl(o['flrNoNm'], '') + '</td>' +
 /*                       '   <td>' + $cmmn.nvl(o['strctCdNm'], '') + '</td>' +*/
                        '   <td>' + $cmmn.nvl(o['mainPurpsCdNm'], '') + '</td>' +
                        '   <td>' + $cmmn.numberWithCommas($cmmn.nvl(o['area'], '')) + '</td>' +
                        '</tr>';
                }

                //목록
                const makeList = function(flrList) {
                    const keys = Object.keys(flrList);
                    let thisHtml = '';

                    for(let i in keys) {
                        const key = keys[i];
                        const dataList = flrList[key];

                        const list = dataList['list'];
                        for(let j in list) {
                            const o = list[j];

                            thisHtml += makeHtml(o);
                        }
                    }

                    return thisHtml;
                };

                const getBrFlrOulnInfoCallback = function(result) {
                    const list = result.response.body.items;

                    if ($cmmn.isNullorEmpty(list)) {
                        //결과없음
                        $('#tblFlr').css({width: '370px'});
                        $dv.html('<tr><td colspan="6" class="noResult">검색된 층별 정보가 없습니다</td></tr>');
                    } else {
                        const items = list['item'];
                        const buldFlrInfo = makeBrFloorJson(items);

                        const thisFlrList = buldFlrInfo[dongNm];

                        if(thisFlrList == null) {
                            const keyList = Object.keys(buldFlrInfo);
                            for(let i in keyList) {
                                const k = keyList[i];
                                const flrList = buldFlrInfo[k];

                                html += makeList(flrList);
                            }
                        } else {
                            html += makeList(thisFlrList);
                        }
                        //$('#tblFlr').tableScroll({width:500, height:450});
                        $dv.html(html);
                    }
                }
                $linkData.getBrFlrOulnInfo(buldParam, getBrFlrOulnInfoCallback);
                $('#tblFlr').css({width: '100%'});

            } else {
                $('#tblFlr').css({width: '370px'});
                $dv.html('<tr><td colspan="6" class="noResult">검색된 층별 정보가 없습니다</td></tr>');
            }

            $dv.html(html);

            $('#dvBasic').hide();
            $('#dvFlr').show();
            $('#dvExp').hide();
        },
        exp: function(data) {
            const $dv = $('#dvExpResult');

            //목록 html 만들기
            const makeList = function(item) {
                const tmp = _.template(
                    '<tr>' +
                    '   <td><%= hoNm %></td>' +
                    '   <td><%= flrNoNm %></td>' +
                    '   <td><%= mainPurpsCdNm %></td>' +
                    '   <td><%= $cmmn.numberWithCommas($cmmn.nvl(area, 0)) %></td>' +
                    '   <td><%= $cmmn.numberWithCommas($cmmn.nvl(cmmnArea, 0)) %></td>' +
                    '</tr>'
                );

                return tmp(item);
            }
            //전유부 데이터 생성
            const callback = function(result) {
                const list = result.response.body.items;
                if ($cmmn.isNullorEmpty(list)) {
                    //결과없음
                    $('#tblExp').css({width: '370px'});
                    $dv.html('<tr><td colspan="6" class="noResult">검색된 층별 정보가 없습니다</td></tr>');
                } else {
                    //층별로 정보 추출
                    const items = list['item'];

                    //목록 정제
                    let expTemp = {};
                    for(let i in items) {
                        const o = items[i];

                        const hoNm = o['hoNm'];
                        if($cmmn.isNullorEmpty(expTemp[hoNm])) {
                            expTemp[hoNm] = o;
                            expTemp[hoNm]['cmmnArea'] = 0;
                        }

                        const expType = o['exposPubuseGbCd'];
                        if(expType === 2) {
                            expTemp[hoNm]['cmmnArea'] = o['area'];
                        }
                    }

                    //목록 생성
                    const keyList = Object.keys(expTemp);

                    let html = '';
                    for(let i in keyList) {
                        const k = keyList[i];

                        const obj = expTemp[k];
                        html += makeList(obj);
                    }

                    $('#tblExp').css({width: '100%'});
                    $dv.html(html);

                    //$('#tblExp').tableScroll({width:500, height:520});
                }
            }

            $linkData.getBrExposPubuseAreaInfo(data['buldParam'], callback);

            $('#dvBasic').hide();
            $('#dvFlr').hide();
            $('#dvExp').show();
        }
    }


    //공시지가
    const makePriceInfo = {
        //개별공시지가
        lndPrice: function(data) {
            const pnu = data['pnu'];
            const getIndvdLandPriceAttrCallback = function(result) {
                const dataList = result.response['fields'];
                const $dv = $('#dvLndPriceResult');

                if (dataList == null) {
                    $dv.html('<tr><td colspan="4" style="text-align: center;">결과가 없습니다</td></tr>');
                } else {
                    const makeHtml = function (f) {
                        return '<tr>' +
                            '   <td>' + f.pblntfDe + '</td>' +
                            '   <td>' + $cmmn.numberWithCommas(f.pblntfPclnd) + '</td>' +
                            '   <td>' + f.lastUpdtDt + '</td>' +
                            '   <td>' + f.regstrSeCodeNm + '</td>' +
                            '</tr>';
                    }

                    let fArr = dataList['field'];
                    let html = '';
                    if (Array.isArray(fArr)) {
                        //날짜 역순 정렬
                        fArr = fArr.reverse();

                        //여러건
                        for (let i in fArr) {
                            const f = fArr[i];
                            html += makeHtml(f);
                        }
                    } else {
                        //단건
                        html += makeHtml(fArr);
                    }
                    $dv.html(html);
                    $('.tblPrice').tableScroll({width:370, height:400});
                }
            }
            $linkData.getIndvdLandPriceAttr({
                pnu: pnu,
                format: 'xml',
                numOfRows: 999,
            }, getIndvdLandPriceAttrCallback);


            $('#tblHsPrice').hide();
            $('#tblHsPrice').parents('.tablescroll').hide();

            $('#tblLndPrice').show();
            $('#tblLndPrice').parents('.tablescroll').show();
        },
        //개별주택가격
        hsPrice: function(data) {
            const pnu = data['pnu'];
            const getIndvdHousingPriceCallback = function(result) {
                const dataList = result.response['fields'];
                const $dv = $('#dvHsPriceResult');
                if (dataList == null) {
                    //결과없음
                    $dv.html(
                        '<tr><td colspan="4" style="text-align: center;">검색된 주택가격정보가 없습니다</td></tr>'
                    );
                } else {
                    const tmp = _.template(
                        '<tr>' +
                        '   <td><%= lastUpdtDt %></td>' +
                        '   <td><%= $cmmn.numberWithCommas(housePc) %></td>' +
                        '   <td>' +
                        '       토지대장면적&nbsp;:&nbsp;<%= $cmmn.numberWithCommas(ladRegstrAr) %>㎡<br/>' +
                        '       산정대지면적&nbsp;:&nbsp;<%= $cmmn.numberWithCommas(calcPlotAr) %>㎡<br/>' +
                        '       건물전체연면적&nbsp;:&nbsp;<%= $cmmn.numberWithCommas(buldAllTotAr) %>㎡<br/>' +
                        '       건물산정연면적&nbsp;:&nbsp;<%= $cmmn.numberWithCommas(buldCalcTotAr) %>㎡<br/>' +
                        '   </td>' +
                        '   <td><%= stdLandAt %></td>' +
                        '</tr>'
                    );
                    const fArr = dataList.field;

                    let html = '';
                    if (Array.isArray(fArr)) {
                        //여러건
                        for (let i in fArr) {
                            const f = fArr[i];
                            html += tmp(f);
                        }
                    } else {
                        //단건
                        html += tmp(fArr);
                    }
                    $dv.html(html);
                    $('.tblPrice').tableScroll({height:400});
                }
            }

            $linkData.getIndvdHousingPrice({
                pnu: pnu,
                numOfRows: 999,
                format: 'xml',
            }, getIndvdHousingPriceCallback);

            $('#tblLndPrice').hide();
            $('#tblLndPrice').parents('.tablescroll').hide();

            $('#tblHsPrice').show();
            $('#tblHsPrice').parents('.tablescroll').show();
        }
    };


    //탁상감정 상세정보 생성
    const makeTapasmtDtl = function(data) {
        const tmp = _.template(
            '<tr>' +
            '   <th>탁상번호</th>' +
            '   <td><%= masterid %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>정식 감정서 번호</th>' +
            '   <td><%= fmyApprtNo %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>상담자 성명</th>' +
            '   <td><%= cnslUserNm %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>평가사 성명</th>' +
            '   <td><%= evlUserNm %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>요청일시</th>' +
            '   <td><%= rceptDt %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>거래처</th>' +
            '   <td><%= reqpclNm %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>토지 부분 합계 (원)</th>' +
            '   <td><%= $cmmn.numberWithCommas(ladPartSm) %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>건물 부분 합계 (원)</th>' +
            '   <td><%= $cmmn.numberWithCommas(buldPartSm) %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>토지 건물 합계 (원)</th>' +
            '   <td><%= $cmmn.numberWithCommas(ladBuldSm) %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>건물명</th>' +
            '   <td><%= buldnm %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>동호</th>' +
            '   <td><%= dongho %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>평형</th>' +
            '   <td><%= blnc %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>물건종류</th>' +
            '   <td><%= thingKndGroupNm %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>적정 시세 (원)</th>' +
            '   <td><%= proprtCurprc %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>최소 금액 (원)</th>' +
            '   <td><%= mummAmount %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>최대 금액 (원)</th>' +
            '   <td><%= mxmmAmount %></td>' +
            '</tr>'
        );

        $('#dvTapasmtResult').html(tmp(data));
        $('#tblTapasmt').tableScroll({height: 300});

        //단가 정보 조회
        $req.ajax({
            url: ctx + '/map/view/getTapasmt/price.do',
            data: {masterid: data['masterid']},
            success: function(result) {
                $('#dvTapasmtPrice').hide();

                //토지, 건물 단가 및 면적정보 표시
                if(result['CODE'] === "SUCCESS") {
                    const list = result.data.rows;

                    let html = '';
                    for(let i in list) {
                        const o = list[i];

                        html +=
                            '<tr>' +
                            '   <td>' + (o['type'] === 'LAND' ? '토지' : '건물') + '</td>' +
                            '   <td>' + $cmmn.nvl(o['dtl'], '') + '</td>' +
                            '   <td>' + $cmmn.numberWithCommas(o['ar']) + '</td>' +
                            '   <td>' + $cmmn.numberWithCommas(o['untpc']) + '</td>' +
                            '   <td>' + $cmmn.numberWithCommas(o['sm']) + '</td>' +
                            '   <td>' + $cmmn.numberWithCommas(o['reprcurePc']) + '</td>' +
                            '</tr>';
                    }


                    $('#dvTapasmtPriceResult').html(html);
                    //$('#tblTapasmtPrice').tableScroll({height: 50, width: 500});

                    $('#dvTapasmtPrice').show();
                }
            }
        });

    }



    // 정보 도구 사용하여 지도 상세정보 조회
    const singleClick = function(e) {
        if(this.activeInfo) {
            //zoom 체크
            const map = e.map;
            //줌레벨 조정
            const checkZoomLvl = 18;

            map.getView().animate({
                center: e.coordinate,
                zoom: checkZoomLvl,
                duration: 300
            });

            const coords = e.coordinate;
            viewDetailWithPoint(coords);
        }
    }


    /**
     * point정보로 상세정보 화면 조회
     * @param coords
     */
    const viewDetailWithPoint = function(coords) {
        //주소조회
        const getAddr = function() {
            const def = $.Deferred();

            const callback = function(result) {
                def.resolve(result);
            }
            $addr.searchAddrFromPoint(coords, callback);

            return def;
        }

        //pnu조회
        const getPnu = function() {
            const def = $.Deferred();

            //parameter생성
            const feat = new ol.Feature({
                geometry: new ol.geom.Point(coords),
            });

            const callback = function(result) {
                def.resolve(result);
            }
            $linkData.getPnuInfo(feat, callback);

            return def;
        }

        //검색결과
        $.when(getAddr(), getPnu()).done(function(addrResult, pnuResult) {
            const dataJsan = {
                item: {
                    address: {
                        zipcode: '',
                        parcel: '',
                        road: '',
                    },
                    id: '',
                    point: {
                        x: coords[0],
                        y: coords[1],
                    }
                },
                text: '',
                pnu: ''
            };

            const makeJson = function(item) {
                const zipCode = item['zipcode'];
                const text = item['text'];
                const type = item['type'];

                if(!$cmmn.isNullorEmpty(zipCode)) {
                    dataJsan['item']['address']['zipcode'] = zipCode;
                }

                if(type.toLowerCase() === 'parcel') {
                    dataJsan['item']['address']['parcel'] = text;
                } else if (type.toLowerCase() === 'road') {
                    dataJsan['item']['address']['road'] = text;
                }
            }

            const addrStt = addrResult.result.response.status;
            if(addrStt === 'OK') {
                const itemList = addrResult.result.response.result.item;
                //검색결과 건수 확인
                if(Array.isArray(itemList)) {
                    for(let i in itemList) {
                        const item = itemList[i];
                        makeJson(item);
                    }
                } else {
                    makeJson(itemList);
                }

                //표시주소 설정
                (!$cmmn.isNullorEmpty(dataJsan['item']['address']['road']) ?
                    dataJsan['text'] = dataJsan['item']['address']['road']:
                    dataJsan['text'] = dataJsan['item']['address']['parcel']);
            }

            //pnu txt 세팅
            const pnuStt = pnuResult.response.status;
            if(pnuStt === 'OK') {
                const pnuF = pnuResult.response.result.featureCollection.features[0];
                const pnuTxt = pnuF.properties.pnu;

                dataJsan['item']['id'] = pnuTxt;
                dataJsan['pnu'] = pnuTxt;
                dataJsan['pnuFeature'] = pnuF;
            }
            $mapSearch.viewMapSearchDetail(dataJsan);
        });
    }

    //건축 인허가정보 상세
    const makeArchPmsDetail = function(data) {
        const $dv = $('#dvArchPmsResult');
        $dv.html('');

        const tmp = _.template(
            '<tr>' +
            '   <th>건축구분</th>' +
            '   <td><%= archGbCdNm %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>허가/신고일</th>' +
            '   <td><%= archPmsDay %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>건축면적(㎡)</th>' +
            '   <td><%= $cmmn.numberWithCommas(archArea) %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>대지면적(㎡)</th>' +
            '   <td><%= $cmmn.numberWithCommas(platArea) %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>연면적(㎡)</th>' +
            '   <td><%= $cmmn.numberWithCommas(totArea) %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>용적률산정연면적(㎡)</th>' +
            '   <td><%= $cmmn.numberWithCommas(vlRatEstmTotArea) %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>용적률</th>' +
            '   <td><%= vlRat %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>주용도시설</th>' +
            '   <td><%= mainPurpsCdNm %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>착공예정일</th>' +
            '   <td><%= stcnsSchedDay %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>실제착공일</th>' +
            '   <td><%= realStcnsDay %></td>' +
            '</tr>' +
            '<tr>' +
            '   <th>사용승인일</th>' +
            '   <td><%= useAprDay %></td>' +
            '</tr>'
        );

        $dv.html(tmp(data));
    }


    //event 정의
    const initEvt = function() {

        //상세정보 각 탭별 페이지 조회
        $('.tabMapSearchDetail').on('click', function(e) {
            const data = $(e.currentTarget).data();
            const dtlType = data['dtlType'];

            //데이터 표시
            viewDetailInfo[dtlType](data['pnu']);
        });

        //토지이용규제법령조회
        $(document).on('click', '.lbPrpos', function(e) {
            let $target = $(e.currentTarget);
            $('.lbPrpos').removeClass('on');
            $target.addClass('on');

            let txt = $target.text();

            if(txt.indexOf('(') >= 0) {
                txt = txt.substring(0, txt.indexOf('('));
            }
            //한글 인코딩해서 보냄
            txt = encodeURIComponent(txt);

            const getLulawnmmCallback = function(result) {
                const count = result.response.totalCount;

                const $dv = $('#dvLulawnmm');
                if(count > 0) {
                    const tmp = _.template(
                        '<tr>' +
                        '    <th colspan="2">토지이용규제법령</th>' +
                        '</tr>' +
                        '<tr>' +
                        '   <th>용도지역지구명</th>' +
                        '   <td><%= spcfcuCdNm %></td>' +
                        '</tr>' +
                        '<tr>' +
                        '   <th>용도지역지구구분</th>' +
                        '   <td><%= spcfcuSe %></td>' +
                        '</tr>' +
                        '<tr>' +
                        '   <th>소관기관명</th>' +
                        '   <td><%= orgNm %></td>' +
                        '</tr>' +
                        '<tr>' +
                        '   <th>법률명</th>' +
                        '   <td><%= lawNm %></td>' +
                        '</tr>' +
                        '<tr>' +
                        '   <th>조문제목</th>' +
                        '   <td><%= prvsnSj %></td>' +
                        '</tr>' +
                        '<tr>' +
                        '   <th>조문내용</th>' +
                        '   <td><%= joSubCns %></td>' +
                        '</tr>' +
                        '<tr>' +
                        '   <th>조_시행일자</th>' +
                        '   <td><%= joOpertnDe %></td>' +
                        '</tr>' +
                        '<tr>' +
                        '   <th>항_시행일자</th>' +
                        '   <td><%= joSubOpertnDe %></td>' +
                        '</tr>'
                    );

                    const data = result.response.fields.field;
                    let lawHtml = '';
                    if(Array.isArray(data)) {
                        for(let i in data) {
                            const o = data[i];
                            //없는 경우가 있음!!
                            o['prvsnSj'] = $cmmn.nvl(o['prvsnSj']);

                            lawHtml += tmp(o);
                        }
                    } else {
                        lawHtml = tmp(data);
                    }

                    $dv.html(lawHtml);
                } else {
                    $dv.html('<tr><td colspan="2" class="noResult">검색된 법령 정보가 없습니다</td></tr>');
                }
            }
            $linkData.getLulawnmm({
                spcfcuCdNm: txt,
                pageNo: 1,
                numOfRows: 20,
            }, getLulawnmmCallback);
        });

        //건축물대장 변경시 상세 표시
        $(document).on('change', '#selBuldRegister', function(e) {
            //집합건물인 경우 전유부 표시
            const data = $('#selBuldRegister option:selected').data();
            if(!$cmmn.isNullorEmpty(data)) {
                const regstrGbCd = data['item']['regstrGbCd'];

                if(!$cmmn.isNullorEmpty(regstrGbCd) && regstrGbCd === 2) {
                    $('.tbBuldInfo:eq(2)').show();
                }
            }

            $('.tbBuldInfo:eq(0)').trigger('click');
        });

        //건축물대장 상세정보
        $(document).on('click', '.tbBuldInfo', function(e) {
            const data = $('#selBuldRegister option:selected').data();
            const type = $(e.currentTarget).data('type');

            makeBuldInfo[type](data);
        });

        //가격정보 조회
        $(document).on('click', '.tbPriceInfo', function(e) {
            const data = $(e.currentTarget).data();
            const type = data['type'];

            makePriceInfo[type](data);
        });

        //탁상감정정보 조회
        $(document).on('change', '#selTapasmtResult', function(e) {
            const data = $(e.currentTarget).find('option:selected').data();
            makeTapasmtDtl(data);
        });

        //탭 on/off처리
        $(document).on('click', '.ch_radio li', function(e) {
            $('.ch_radio li').removeClass('on');
            $(this).addClass('on');
        });

        //건축인허가정보 상세정보
        $(document).on('change', '#selArchPms', function(e) {
            const data = $(e.currentTarget).find('option:selected').data();
            makeArchPmsDetail(data);
        });

        //PDF조회 버튼 클릭
        $(document).on('click', '.showPdf', function(e) {
            const masterid = $(e.currentTarget).data('masterid');
            $file.viewPdf(masterid);

            return false;
        });

        //탁상감정 정보 저장
        $(document).on('click', '#btnSaveSimpleTs', function(e) {
            const param = $cmmn.checkFormValid('frmSimpleTs');
            if(param == null) {
                return false;
            }

            $layer.krLyr.saveSimpleTs(param);
        });
    }

    //initialize
    const init = function() {
        initEvt();
    }

    return {
        init: init,
        activeInfo: activeInfo,
        singleClick: singleClick,
        viewDetailWithPoint: viewDetailWithPoint,
    }
} ());