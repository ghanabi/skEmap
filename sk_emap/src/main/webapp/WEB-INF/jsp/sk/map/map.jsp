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
<script type="text/javascript" src="<c:url value="/js/map/krLayer.js?version=${nowDate}"/>"></script>
<script type="text/javascript" src="<c:url value="/js/map/interaction.js?version=${nowDate}"/>"></script>
<script type="text/javascript" src="<c:url value="/js/map/measure.js?version=${nowDate}"/>"></script>
<script type="text/javascript" src="<c:url value="/js/map/mapEvent.js?version=${nowDate}"/>"></script>

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
							<li class="opt_tool2"><img alt="" src="images/sk/maptool/opt2.jpg"></li>
							<li class="opt_tool3"><img alt="" src="images/sk/maptool/opt3.jpg"></li>
							<li class="opt_tool4"><img alt="" src="images/sk/maptool/opt4.jpg"></li>
							<li class="opt_tool5"><img alt="" src="images/sk/maptool/opt5.jpg"></li>
						</ul>
					</div>
				</div>
				<div class="slide1"><img alt="" src="images/sk/slide.jpg"></div>
			</div>
			<div class="con_center">
				<div class="map" id="dvMap" style="width:100%; height:100%;"></div>
			</div>
			<div class="con_right">
				<div class="right_tab">
					<img alt="" src="images/sk/shipinfo_btn.jpg">
				</div>
			</div>
			<div class="scale"><input type="text">E 129 21.25    N 35' 44.14'   SCALE=>1:10.000[LEVEL:27]</</div>
		</div>
	</div>

</body>
</html>