<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/taglib/taglib.jsp"%>
<jsp:useBean id="today" class="java.util.Date" />
<fmt:formatDate value="${today}" pattern="yyyyMMddHHmmss" var="nowDate"/>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width" />
<title>SK EnerygyMap</title>
<!-- css -->
<link rel="stylesheet" type="text/css" href="<c:url value="/js/libs/colorpicker/css/colorpicker.css"/>"/>
<link rel="stylesheet" type="text/css" href="<c:url value="/js/libs/colorpicker/css/layout.css"/>"/>
<link rel="stylesheet" href="<c:url value="/js/libs/openlayers/ol-v5.30/ol.css"/>">
<link rel="stylesheet" href="<c:url value="/js/libs/openlayers/ol-ext/ol-ext.min.css"/>"/>
<link rel="stylesheet" href="<c:url value="/css/common.css"/>"/>


<!-- 지도 스크립트 -->
<!-- JS -->
<!-- jquery -->
<script type="text/javascript" src="<c:url value="/js/libs/jquery/jquery-3.4.1.min.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/libs/jquery/jquery.migrate-3.0.0.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/libs/jquery/jquery-ui-1.11.4.min.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/libs/jquery/jquery.tablescroll.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/libs/jquery/jquery.blockUI.js"/>"></script>
<!-- jquery fileUpload -->
<script type="text/javascript" src="<c:url value="/js/libs/jquery/jquery.form.min.js"/>"></script>

<!-- underscore -->
<script type="text/javascript" src="<c:url value="/js/libs/underscoreJs/underscore-umd-min.js"/>"></script>

<!-- fileSaver -->
<script type="text/javascript" src="<c:url value="/js/libs/jquery/FileSaver.js"/>"></script>

<!-- openlayers -->
<script type="text/javascript" src="<c:url value="/js/libs/openlayers/ol-v5.30/ol.js"/>"></script>
<!-- openlayers -->
<script type="text/javascript" src="<c:url value="/js/libs/openlayers/ol-ext/ol-ext.min.js"/>"></script>

<!-- proj -->
<script type="text/javascript" src="<c:url value="/js/libs/proj4/proj4.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/libs/proj4/epsg.js"/>"></script>

<!-- 이미지저장용 -->
<script type="text/javascript" src="<c:url value="/js/libs/html2canvas/html2canvas.min.js"/>"></script>

<!-- 작업파일 -->
<script type="text/javascript" src="<c:url value="/js/map/customDragInteraction.js?version=${nowDate}"/>"></script>

<script>    
	var ctx = "${ctx}";
</script>
<script type="text/javascript" src="<c:url value="/js/map/mapOptions.js?version=${nowDate}"/>"></script>
<script type="text/javascript" src="<c:url value="/js/map/style.js?version=${nowDate}"/>"></script>
<script type="text/javascript" src="<c:url value="/js/map/map.js?version=${nowDate}"/>"></script>
<script type="text/javascript" src="<c:url value="/js/map/layer.js?version=${nowDate}"/>"></script>
<script type="text/javascript" src="<c:url value="/js/map/wfsLayer.js?version=${nowDate}"/>"></script>
<script type="text/javascript" src="<c:url value="/js/map/interaction.js?version=${nowDate}"/>"></script>
<script type="text/javascript" src="<c:url value="/js/map/measure.js?version=${nowDate}"/>"></script>
<script type="text/javascript" src="<c:url value="/js/map/mapEvent.js?version=${nowDate}"/>"></script>

<!-- RGB색상표 -->
<script type="text/javascript" src="<c:url value="/js/libs/colorpicker/js/colorpicker.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/libs/colorpicker/js/eye.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/libs/colorpicker/js/utils.js"/>"></script>

<script type="text/javascript" src="<c:url value="/js/script.js"/>"></script>

<script>    
let map;      
window.onload = function(){
	mapInit();
}
</script>
</head>
<body>
<div id="wrapper">
		<div id="container">
			<div class="con_left">
				<div class="logo"></div>
				<div class="nav">
					<div class="map_tool">
						<ul>
							<li class="tool1" id="mapDefalt"><img alt="" src="images/sk/maptool/btn1.jpg"></li>
							<li class="tool2" id="mapZoomIn"><img alt="" src="images/sk/maptool/btn2.jpg"></li>
							<li class="tool3" id="mapZoomOut"><img alt="" src="images/sk/maptool/btn3.jpg"></li>
							<li class="tool4" id="mapMove"><img alt="" src="images/sk/maptool/btn4.jpg"></li>
							<li class="tool5" id="mapSearch1"><img alt="" src="images/sk/maptool/btn5.jpg"></li>
							<!-- <li class="tool6" id="mapSearch2"><img alt="" src="images/sk/maptool/btn6.jpg"></li>  -->
							<li class="tool7" id="mapSearch3"><img alt="" src="images/sk/maptool/btn7.jpg"></li>
						</ul>
					</div>
					<div class="option">
						<ul>
							<li class="opt_tool1"><img alt="" src="images/sk/maptool/opt1.jpg"></li>
							<li class="opt_tool2" id="mapSetting"><img alt="" src="images/sk/maptool/opt2.jpg"></li>
							<li class="opt_tool3"><img alt="" src="images/sk/maptool/opt3.jpg"></li>
							<li class="opt_tool4"><img alt="" src="images/sk/maptool/opt4.jpg"></li>
							<li class="opt_tool5"><img alt="" src="images/sk/maptool/opt5.jpg"></li>
						</ul>
					</div>
				</div>
				<div class="slide1" id="slide1"><!-- <img alt="" src="images/sk/slide.jpg"> --></div>
			</div>
			<div class="div_left">
				<div id="div_left_mapSetting" style="display: none;">
					<div id="option1">
						<table>
							<colgroup><col width="100%"></colgroup>
							<tr>
								<th class="t_center">보기 설정</th>
							</tr>
							<tr>
								<td class="t_left">기본 <input type="checkbox" ></td>
							</tr>
							<tr>
								<td class="t_left">표준 <input type="checkbox" ></td>
							</tr>
							<tr>
								<td class="t_left">상세<input type="checkbox" id="chkViewLayerDetail"></td>
							</tr>
						</table>
					</div>
					<div id="option2">
						<table>
							<colgroup><col width="100%"></colgroup>
							<tr>
								<th class="t_center">선박/표지 표기</th>
							</tr>
							<tr>
								<td class="t_left">선박   OFF <input type="checkbox" id="chkViewLayerShip"></td>
							</tr>
							<tr>
								<td class="t_left">전체 <input type="checkbox" >&nbsp;이동 <input type="checkbox" >&nbsp;정박 <input type="checkbox" ></td>
							</tr>
							<tr>
								<td class="t_left">이름 <input type="radio" name="ShipLabel" value="name" checked>&nbsp;ID <input type="radio" name="ShipLabel" value="id">&nbsp;표기안함 <input type="radio" name="ShipLabel" value="none"></td>
							</tr>
							<tr>
								<td class="t_left">표지   OFF <input type="checkbox" id="chkViewLayerMark"></td>
							</tr>
						</table>
					</div>
					<div id="option3">
						<table>
							<colgroup><col width="60%"><col width="40%"></colgroup>
							<tr>
								<th class="t_left" colspan="2">선박</th>
							</tr>
							<tr>
								<td class="t_center">
									<div class="option3_1">
										<span>기호</span>
									</div>
									<div id="colorSelector1" style="width: 34px;height: 34px;"><div style="background-color: #0000ff;width: 30px;height: 30px;"></div></div>
								</td>
								<td class="t_center"><img alt="" src="images/sk/btn_chg.jpg"></td>
							</tr>
							<tr>
								<td class="t_center">
								<div class="option3_1">
										<span>항적</span>
									</div>
									<div id="colorSelector2" style="width: 34px;height: 34px;"><div style="background-color: #0000ff;width: 30px;height: 30px;"></div></div>
								</td>
								<td class="t_center"><img alt="" src="images/sk/btn_chg.jpg"></td>
							</tr>
							<tr>
								<td>
									<div class="option3_2">
										<input type="text"><span>분</span>
									</div>
								</td>
								<td class="t_center" style="font-weight: bold;">선박 표시시간</td>
							</tr>
							<tr>
								<td>
									<div class="option3_2">
										<input type="text"><span>분</span>
									</div>
								</td>
								<td class="t_center" style="font-weight: bold;">항적 저장시간</td>
							</tr>
						</table>
					</div>
					<div id="option4">
						<table>
							<colgroup><col width="60%"><col width="40%"></colgroup>
							<tr>
								<th class="t_left" colspan="2">표지</th>
							</tr>
							<tr>
								<td>
									<div class="option3_2">
										<input type="text"><span>분</span>
									</div>
								</td>
								<td class="t_center" style="font-weight: bold;">표지 저장시간</td>
							</tr>
						</table>
					</div>
				</div>
				<div id="div_left_mapSearch" style="display: none; width: 100%;">
					<div id="option5">
						<span class="option_h">항적표시</span>
						<div>
						<img id="boxsearch" style="width: 70%; margin: 5px;" alt="" src="images/sk/Areasetting.jpg">
						</div>
						<span class="option_h2">검색기간(DAY)</span>
						<div style="text-align: center; margin: 10px;">
							<input type="date" id="date1" > ~ 
							<input type="date" id="date2" >
						</div>
						<div style="text-align: center; margin: 10px;">
							선택 : 
							<input type="radio" name="kind" value="MMSI" checked/>MMSI
  							<input type="radio" name="kind" value="SHIPNAME" />선박명칭
						</div>
						<div style="text-align: center; margin: 10px;">MMSI / 선박명칭 : <input type="text" id="txt_search"></div>
						<img id="shipsearch"style="float: right; width: 100px; margin: 15px 5px 0 0;" alt="" src="images/sk/shipsearch.jpg">
						<span class="option_h">결과</span>
						<div id="ship_result" style="width: 100%;height: 650px;overflow: auto;"></div>
					</div>
				</div>
			</div>
			<div class="con_center">
				<div class="map" id="dvMap" style="width:100%; height:100%;"></div>
			</div>
			<div id="div_right">
				<div id="r_title" style="margin-top:20px;">선박정보</div>
				<div id="right_result" class="right_result">
					<table>
						<colgroup><col width="45%"><col width="55%"></colgroup>
						<tr>
							<th>MMSI</th>
							<td><span id="txt_mmsi"></span></td>
						</tr>
						<tr>
							<th>선박명</th>
							<td><span id="txt_shipname"></span></td>
						</tr>
						<tr>
							<th>선박부호</th>
							<td><span id="txt_callsign"></span></td>
						</tr>
						<tr>
							<th>IMO</th>
							<td><span id="txt_imo"></span></td>
						</tr>
						<tr>
							<th>선박위치</th>
							<td><span id="txt_lonlat"></span></td>
						</tr>
						<tr>
							<th>대지속력</th>
							<td><span id="txt_sog"></span></td>
						</tr>
						<tr>
							<th>대지방향</th>
							<td><span id="txt_cog"></span></td>
						</tr>
						<tr>
							<th>선수방위</th>
							<td><span id="txt_theading"></span></td>
						</tr>
						<tr>
							<th>회두력</th>
							<td><span id="txt_rateturn"></span></td>
						</tr>
						<tr>
							<th>항행상태</th>
							<td><span id="txt_cstate"></span></td>
						</tr>
						<tr>
							<th>선박형태</th>
							<td><span id="txt_shiptype"></span></td>
						</tr>
						<!-- <tr>
							<th>홀수</th>
							<td id="txt_cstate"></td>
						</tr> -->
						<tr>
							<th>선박크기</th>
							<td><span id="txt_shipsize"></span></td>
						</tr>
						<tr>
							<th>도착정보</th>
							<td><span id="txt_desti"></span></td>
						</tr>
						<tr>
							<th>수신시간</th>
							<td><span id="txt_timestamp"></span></td>
						</tr>
					</table>
				</div>
				<div id="right_shiplist" class="right_result">
					<table style="height: 26px;">
						<colgroup><col width="50%"><col width="50%"></colgroup>
						<tr>
							<th>MMSI</th>
							<th>선  명</th>
						</tr>
					</table>
					<div id="shiplist_result" style="height:344px;border: 1px solid #444444;">
						<table>
						<colgroup><col width="50%"><col width="50%"></colgroup>
						<tr>
							<td></td>
							<td></td>
						</tr>
					</table>
					</div>
				</div>
				<div id="ship_option" style="height: 70px; margin: 10px;">
					<div>
						<img id="ship_clean" class="pointer" alt="" src="images/sk/clean_btn.jpg">
						<img id="ship_setting" class="pointer" alt="" src="images/sk/setting_btn.jpg">
					</div>
					<div style="width: 100%;">
					<table style="width: 100%;">
					<colgroup><col width="33%"><col width="33%"><col width="33%"></colgroup>
					<tr>
					<th><span id="feather_see">항적표시</span></th>
					<th><span id="tag_see">태그표시</span></th>
					<th>선박수 : <span id="ship_num"></span></th>
					</tr>
					</table>
					</div>
				</div>
				<div id="div_ship_search" style="height: 40px; margin: 10px;">
					<span style="font-size: 20px; vertical-align: middle; cursor: default;">검색</span> 
					<input id="search_word" type="text" style="height: 30px;">
					<img id="shipsearch2" class="pointer" alt="" src="images/sk/ship_search.jpg">
				</div>
				
			</div>
			<div class="con_right">
				<div class="slide2" id="slide2">
					<!-- <img alt="" src="images/sk/shipinfo_btn.jpg"> -->
				</div>
			</div>
			<!-- <div class="scale">E 129 21.25    N 35' 44.14'   SCALE=>1:10.000[LEVEL:27]</</div> -->
		</div>
	</div>

</body>
</html>