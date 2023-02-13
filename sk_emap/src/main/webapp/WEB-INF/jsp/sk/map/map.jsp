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
			<div class="con_left" id="m1">
				<button type="button" onclick="wmslayer();"
					style="width: 130px; height: 30px; font-size: 15px;">wms layer</button>
				<button type="button" onclick="setSld();"
					style="width: 80px; height: 30px; font-size: 15px;">wms	sld</button>
				<button type="button" onclick="clear_wmslayer();"
					style="width: 80px; height: 30px; font-size: 15px;">clear </button>
				<button type="button" onclick="startWfs();"
					style="width: 130px; height: 30px; font-size: 15px;">wfs feature</button>
				<button type="button" onclick="clear_wfslayer();"
					style="width: 80px; height: 30px; font-size: 15px;">clear wfs</button>
				<button type="button" onclick="googletile();"
					style="width: 130px; height: 30px; font-size: 15px;">google tile</button>
				<button type="button" onclick="vworldtile();"
					style="width: 130px; height: 30px; font-size: 15px;">vworld tile</button>
				<br />
			</div>
			<div class="con_right">
				<div class="map" id="dvMap" style="width:100%; height:100%;"></div>
			</div>
		</div>
	</div>

</body>
</html>