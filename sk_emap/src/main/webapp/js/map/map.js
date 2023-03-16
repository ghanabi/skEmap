var googlemap;
var drawInteration;
var drawInteration_search;
var modStyleSelectInteraction;
var choice_idx="";

var ColorPickerValue = "#ff0000";
var shipStyle={
	font : "12",
	color : "#ff0000"
};

//항적조회 범위값 저장 
var searchBox = {
	lon1 : "",
	lat1 : "",
	lon2 : "",
	lat2 : "",
	date1 : "",
	date2 : "",
	kind : "",
	text : ""
};
var shipList = [];		//선박리스트	
var shipMoveList = [];		//선박항적리스트			
var chocieShipMmsi="";  //상세선박정보 id
var featTest;

//35.5468629,129.3005359 울산
function mapInit(){
	var view = new ol.View({
		center: ol.proj.fromLonLat([129.3005359,35.5468629]),
		zoom: 9,
	});
	
	googlemap = new ol.layer.Tile({
		source: new ol.source.OSM(),
	});	
    
    //마우스 좌표
    var mouseControlCoordinate = new ol.control.MousePosition({        
        coordinateFormat: function(coordinate) {
            return ol.coordinate.format(coordinate, '위도: {y}, 경도: {x}', 3);
        },
        projection: 'EPSG:4326',//좌표계 설정
        className: 'scale1', //css 클래스 이름
        target: document.getElementById('mouseLocationStat'),//좌표를 뿌릴 element
    });

    
	map = new ol.Map({
		layers: [
			googlemap
		],
		target: 'dvMap',
		view: view,
		controls: new ol.control.defaults().extend([mouseControlCoordinate]),
	});		
    map.on('moveend', onMoveEnd);
    
    wmsInit(); //베이스 wms레이어    
    map.removeLayer(googlemap); //배경맵 삭제    
    vectorInit(); //베이스 vector레이어
    mapEvent(); //맵 버튼이벤트 설정
    shipSelectEvent(); //맵 선박 feat 셀렉 이벤트

	// 2초 간격으로 메시지를 보여줌
	setInterval(() => scheduleShipInfo(), 5000);	
}

//2초간격 스케쥴 메소드
function scheduleShipInfo(){
	getShipSearch(); //선박리스트 조회
	getShipSearch_Detail_Data(); //선박상세조회
}

//맵 버튼이벤트 설정
function mapEvent(){
	//기본
	$("#mapDefalt").on('click',function(e){
		deactiveInteractions();
		modStyleSelectInteraction.setActive(true);
	});
	 
	//확대
	$("#mapZoomIn").on('click',function(e){
		deactiveInteractions();
		see_zoomControl(false);	 	
	});
	 
	//축소
	$("#mapZoomOut").on('click',function(e){
		deactiveInteractions();
		see_zoomControl(true);	 	
	});
	 
	//move
	$("#mapMove").on('click',function(e){
	 	deactiveInteractions();
	});
	 
	//항로범위
	$("#mapSearch1").on('click',function(e){	
	 	deactiveInteractions(); 	
	 	setActiveDrawToolSearch('circle');
	});
	
	//프린트
	$("#mapPrint").on('click',function(e){	
	 	fn_printPopup();
	});
	 
	//항로추적
	$("#mapSearch3").on('click',function(e){
		let dis = $("#div_left_mapSearch").css("display");
		if(dis == "block") {
			$("#mapSearch3 img").attr("src","images/sk/maptool/btn7.jpg");
			$("#div_left_mapSearch").css("display","none");
			$(".div_left").css("display","none");
		} else {
			$("#mapSearch3 img").attr("src","images/sk/maptool/btn7_on.jpg");
			$("#div_left_mapSetting").css("display","none");
			$("#div_left_mapSearch").css("display","block");
			$(".div_left").css("display","block");
		}
		setSize();		
	});

	//레이어 설정
	$("#mapSetting").on('click',function(e){
		let dis = $("#div_left_mapSetting").css("display");
		if(dis == "block") {
			$("#div_left_mapSetting").css("display","none");
			$(".div_left").css("display","none");
			$("#mapSetting img").attr("src",$("#mapSetting img").attr("src").replace("_on.jpg",".jpg"));
		} else {
			$("#mapSearch3 img").attr("src","images/sk/maptool/btn7.jpg");
			$("#div_left_mapSearch").css("display","none");
			$("#div_left_mapSetting").css("display","block");
			$(".div_left").css("display","block");
			$("#mapSetting img").attr("src",$("#mapSetting img").attr("src").replace(".jpg","_on.jpg"));
			for(let i=0; i<$(".map_tool li img").length; i++) {
				$(".map_tool li img").eq(i).attr("src",$(".map_tool li img").eq(i).attr("src").replace("_on.jpg",".jpg"));
			}
		}
		setSize();	
	});
	
	//항적표시 해당지역 설정하기
	$("#boxsearch").on('click',function(e){		
	 	deactiveInteractions();
	 	setActiveDrawTool('box',null);
	});	
	
	//항적표시 검색
	$("#shipsearch").on('click',function(e){
		get_ship(); //항적표시 조회 (왼쪽DIV)
	});	
	
	////////////
	//선박정보검색 -- 우측DIV
	$("#shipsearch2").on('click',function(e){
		chocieShipMmsi = "";
		//findShipSearch(); //선박정보 검색 리스트중에 찾기 (우측DIV)
		getShipSearch();
	});
	
	//목록 갱신 -- 우측DIV
	$("#ship_clean").on('click',function(e){
		getShipSearch(); //선박정보 검색 리스트 (우측DIV)
	});
	
	//항적표시 -- 우측DIV
	$("#chkShipRoute").on('click',function(e){
		var chk = $(this).prop("checked");
	 	if(chk){
	 		getShipSearch_Detail_Data_All(); //우측DIV 항적표시
	 	}else{
	 		moveShipFeature(chocieShipMmsi);
	 	}
	});
	
	//태그표시  ---- 보기설정 선박라벨과 연동
	$("#chkShipName").on('click',function(e){
		var chk = $(this).prop("checked");	
		if(chk) {
	 		$("input:radio[name='ShipLabel']:radio[value='name']").click();
		} else {
	 		$("input:radio[name='ShipLabel']:radio[value='none']").click();	
		}
	});
	
	//보기설정 - 선박라벨  ---- 우측DIV 태그표시랑 연동
	$('input[name=ShipLabel]').on('click',function(e){	
		let val = $('input[name=ShipLabel]:checked').val();
		if(val=="none") { 
			$("#chkShipName").prop("checked",false);
		} else {
			$("#chkShipName").prop("checked",true);
		}	
		makeShipFeature(); //오른쪽 DIV 선박리스트 보여주기		
		get_ship_to_map();
	});	
	
	
	//보기설정 - 표지OFF
	$("#chkViewLayerMark").on('click',function(e){		
	 	ViewLayerChkMark(this.checked);
	});
	
	//보기설정 - 선박OFF
	$("#chkViewLayerShip").on('click',function(e){	
		let chk = $("#chkViewLayerShip").prop("checked");
		if(!chk) {
			$("#feather_see").css("font-weight","bold");
		} else {
			$("#feather_see").css("font-weight","normal");
		}		
		makeShipFeature(); //오른쪽 DIV 선박리스트 보여주기
		get_ship_to_map();
	});	
	
	//보기설정 - 선박 항적색깔 -----> 사용안함
	$('input[name=ShipIcon]').on('click',function(e){	
		get_ship_to_map();		
	});	
	
	//보기설정 - 스타일적용
	$('#changeShipStyle').on('click',function(e){			
		shipStyle={
			font : $("#featShipFont").val(),
			color : ColorPickerValue
		};	
		makeShipFeature(); //오른쪽 DIV 선박리스트 보여주기	
		get_ship_to_map();		
	});		
}

//항적조회 이벤트 활성화
function setActiveDrawTool(type, isOn) {
	let lyr=null;
	var layers = map.getLayers().getArray();
	for(let i in layers) {
        const l = layers[i];
        const thisLayerId = layers[i].get('id');

        if("mapSearch1" === thisLayerId) {
            lyr = l;
            break;
        }
    }
    
    if(lyr != null){
    	const source = lyr.getSource();
    	
    	const tool = {
	        type: 'Circle',
	        geometryFunction: ol.interaction.Draw.createBox(),
	    };
	    
	    let drawOption = $.extend({}, tool);
    	drawOption['source'] = source;
    	drawInteration = new ol.interaction.Draw(drawOption);
    	const drawendCallback = function (e) {
    		lyr.getSource().clear();
    		wfs_layer.getSource().clear();    		
    		searchBox = {
				lon1 : "",
				lat1 : "",
				lon2 : "",
				lat2 : "",
				date1 : "",
				date2 : "",
				kind : "",
				text : ""
			};
        	e.feature.set('type', "box");  
        	//console.log(e.feature);   
        	let feat = e.feature;
        	let featClone = feat.clone();
        	       	
        	let c_geometry = featClone.getGeometry().transform( 'EPSG:3857',  'EPSG:4326').getCoordinates();  
        	
        	var lon1 = 110;
        	var lat1 = 18;
        	var lon2 = 140;
        	var lat2 = 47;
        	  
        	var coord = c_geometry[0];
        	for(var i=0;i<coord.length;i++){
        		var item = coord[i];
        		//console.log(item);
        		if(Number(item[0]) < lon2){
        			lon2 = item[0];
        		}
        		if(Number(item[0]) > lon1){
        			lon1 = item[0];
        		}
        		if(Number(item[1]) < lat2){
        			lat2 = item[1];
        		}
        		if(Number(item[1]) > lat1){
        			lat1 = item[1];
        		}        		
        	}
        	
        	//항적조회 값 넣기.
			searchBox.lon1 = lon1;
			searchBox.lon2 = lon2;
			searchBox.lat1 = lat1;
			searchBox.lat2 = lat2;
			
			//시작, 끝점 좌표 도분초 변환
			let s_lat_d = Math.floor(lat2);
			let s_lat_m = Math.floor((lat2-s_lat_d)*60);
			let s_lat_s = Math.round((((lat2-s_lat_d)*60)-s_lat_m)*60*100)/100;
			let s_lon_d = Math.floor(lon2);
			let s_lon_m = Math.floor((lon2-s_lon_d)*60);
			let s_lon_s = Math.round((((lon2-s_lon_d)*60)-s_lon_m)*60*100)/100;
			let e_lat_d = Math.floor(lat1);
			let e_lat_m = Math.floor((lat1-e_lat_d)*60);
			let e_lat_s = Math.round((((lat1-e_lat_d)*60)-e_lat_m)*60*100)/100;
			let e_lon_d = Math.floor(lon1);
			let e_lon_m = Math.floor((lon1-e_lon_d)*60);
			let e_lon_s = Math.round((((lon1-e_lon_d)*60)-e_lon_m)*60*100)/100;
			
			$("#s_lat_d").text(s_lat_d);  //시작점 위도 도
			$("#s_lat_m").text(s_lat_m);  //시작점 위도 분
			$("#s_lat_s").text(s_lat_s);  //시작점 위도 초
			$("#s_lon_d").text(s_lon_d);  //시작점 경도 도
			$("#s_lon_m").text(s_lon_m);  //시작점 경도 분
			$("#s_lon_s").text(s_lon_s);  //시작점 경도 초
			$("#e_lat_d").text(e_lat_d);  //끝점 위도 도
			$("#e_lat_m").text(e_lat_m);  //끝점 위도 분
			$("#e_lat_s").text(e_lat_s);  //끝점 위도 초
			$("#e_lon_d").text(e_lon_d);  //끝점 경도 도
			$("#e_lon_m").text(e_lon_m);  //끝점 경도 분
			$("#e_lon_s").text(e_lon_s);  //끝점 경도 초      
		deactiveInteractions();  		
    	}
    	drawInteration.on('drawend', drawendCallback);
    	map.addInteraction(drawInteration);
    }    
}


//항적조회1
function get_ship(){
	let date1 = $("#date1").val();
	let txt = $("#txt_search").val();
	let kind = $('input[name="kind"]:checked').val();
	if(date1 == '') {
		alert("날짜 설정 하세요.");
		return;
	}
	searchBox.date1 = date1.replace(/-/g, '');
	searchBox.text = txt;
	searchBox.kind = kind;
	//if(confirm("해당 범위의 선박을 검색하시겠습니까?")){
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "getShipList.do",			
			data : searchBox,
			success: function(data) {		    
				if(data != null){
					//console.log(data);
					var list = data;		
					shipMoveList = [];			
					for(var i=0;i<list.length;i++){
						var item = list[i];
						var chk = true;
						for(var j=0;j<shipMoveList.length;j++){
							if(item.mmsi == shipMoveList[j].mmsi){
								if(Number(item.longitude)<140 && Number(item.longitude)>110 && Number(item.latitude) < 47 && Number(item.latitude) > 18){
									shipMoveList[j].feat_line.push([Number(item.longitude),Number(item.latitude)]);
									shipMoveList[j].timestampkList.push(item.timestampk);
									chk = false;
									break;				
								}		 
							}
						}
						
						if(chk){
							if(Number(item.longitude)<140 && Number(item.longitude)>110 && Number(item.latitude) < 47 && Number(item.latitude) > 18){
								var obj = {
									mmsi : item.mmsi,
									shipname : item.shipname,
									timestampkList : [item.timestampk],
									feat_line : [[Number(item.longitude),Number(item.latitude)]]
								};
								shipMoveList.push(obj);
							}
							
						}
					}					
					get_ship2(); //리스트 만들기															
				}		   
			},
	    });
	//}	
}

//선박 리스트 만들기
function get_ship2() {
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "getShipList2.do",			
		data : searchBox,
		success: function(data) {		    
			if(data != null){
				let str = "<table style='width: 265px;margin: 0;border: 0;overflow-x: hidden; white-space:nowrap;'>";
				str += "<colgroup><col width='40px'><col width='40px'><col width='79px'><col width='79px'></colgroup>";
				str += "<tr><th>MMSI</th><th>선박명칭</th><th>최초수신시간</th><th>최종수신시간</th></tr>";
				for(var i=0; i<data.length; i++) {
					str += "<tr onclick='set_ship_to_map(\""+data[i].mmsi+"\",\""+(i+1)+"\");'>";
					str += "<td>"+data[i].mmsi+"</td>";
					str += "<td>"+data[i].shipname+"</td>";
					str += "<td>"+data[i].min_timestampk+"</td>";
					str += "<td>"+data[i].max_timestampk+"</td>";
					str += "</tr>"; 
				}
				str += "</table>";
				$("#ship_result").html(str);
			}		   
		},
	});
}

//항적조회 - 지도위 항적그리기
function set_ship_to_map(mmsi, num){
	choice_idx = mmsi;
	get_ship_to_map();
	for(let i=0; i<$("#ship_result table tr").length; i++) {
		$("#ship_result table tr").eq(i).css("background","");
	}
	$("#ship_result table tr").eq(num).css("background","#d5d5d5");
}

//항적조회 - 지도위 항적그리기
function get_ship_to_map(){	
	wfs_layer.getSource().clear();
	var chkShip = $("#chkViewLayerShip").prop("checked"); //보기설정 선박 OFF 일경우 지도위에 항적표시 X
	if(!chkShip){
		//선박 레이어 라인 표시
		for(var i=0;i<shipMoveList.length;i++){	
			var item = shipMoveList[i];
			if(item.mmsi == choice_idx){				
				if(item.feat_line.length>1){
					var feat_line = new ol.Feature({
						geometry:new ol.geom.LineString(item.feat_line)
					});				
					
					//항적 스타일주기
					styles = [
					    // linestring
					    new ol.style.Style({
					      stroke: new ol.style.Stroke({
					        color: '#ff0000',
					        width: 2,
					      })					      
					    }),
					];
					
					let c_geometry = feat_line.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');							  	
				  	feat_line.setStyle(styles);
				  	try{
						wfs_layer.getSource().addFeature(feat_line);
						
						var lyrCenter = ol.extent.getCenter(feat_line.getGeometry().getExtent());			
						//zoom, center 설정
					    map.getView().setCenter(lyrCenter);
					    map.getView().setZoom(17);						
					}catch(e){
						console.log(e);
						console.log("error : "+item.mmsi);
					}
				  	//중간 이동경로 point 만들기.
				  	for(var j=0;j<item.feat_line.length;j++){
				  		var itemP = item.feat_line[j];
				  		
				  		
				  		var pointFeature = new ol.Feature({
							geometry: new ol.geom.Point(itemP)
						});				
						let c_geometry2 = pointFeature.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');
						let val = $('input[name=ShipLabel]:checked').val();
						var shipNameText = "";
						var pointLabel = "";
						if(val=="name"){ 
							shipNameText = item.mmsi+" "+item.shipname; //이름인경우
							pointLabel = item.timestampkList[j];
						}else if(val=="id"){
							shipNameText = item.mmsi; //ID인경우
							pointLabel = item.timestampkList[j];
						}else{
							shipNameText = "";
							pointLabel = "";
						}
						pointFeature.id = "ship_"+item.mmsi;
						
						if(j == item.feat_line.length-1){
							pointFeature.setStyle(
								new ol.style.Style({		            
						            image: new ol.style.Icon({
							          	src: 'images/sk/shipIcon.png',
							          	anchor: [0.8, 0.8],				          	
					        		}),
						            text: new ol.style.Text({
						                textAlign: 'center',
						                font:  'bold '+shipStyle.font+'px Arial',
						                fill: new ol.style.Fill({color: shipStyle.color}),
						                stroke: new ol.style.Stroke({color:'#ffffff', width:0}),
						                text: shipNameText,
						                offsetX: 0,
						                offsetY: -25,
						                overflow:true,
						            })
						      	})
							);
						}else{
							pointFeature.setStyle(
								new ol.style.Style({
									image: new ol.style.Circle({
							            radius: 4,
							            fill: new ol.style.Fill({
							                color: shipStyle.color
							            }),
							            stroke: new ol.style.Stroke({
								        	color: '#ffffff',
								        	width: 1,
								      	})
							        }),		            
						            text: new ol.style.Text({
						                textAlign: 'center',
						                font:  'bold '+shipStyle.font+'px Arial',
						                fill: new ol.style.Fill({color: shipStyle.color}),
						                stroke: new ol.style.Stroke({color:'#ffffff', width:0}),
						                text: pointLabel,
						                offsetX: 70,
						                offsetY: 0,
						                overflow:true,
						            })
						      	})
							);
						}
						
						try{
							wfs_layer.getSource().addFeature(pointFeature);
						}catch(e){
							console.log(e);
							console.log("point error : "+item.mmsi);
						}
				  	}	//var j=0;j<item.feat_line.length;j++			  	
				} //item.feat_line.length>1
			} //item.mmsi == mmsi		
		} //var i=0;i<shipMoveList.length;i++
	}//!chkShip
}


//선박Feature 보여주기
function makeShipFeature(){
	shipSource.clear();
	var chkShip = $("#chkViewLayerShip").prop("checked"); //보기설정 선박 OFF 일경우 지도위에 항적표시 X
	if(!chkShip){
		//선박 레이어 라인 표시
		for(var i=0;i<shipList.length;i++){
			var item = shipList[i];
			if(Number(item.longitude)<140 && Number(item.longitude)>110 && Number(item.latitude) < 47 && Number(item.latitude) > 18){
				var pointFeature = new ol.Feature({
					geometry: new ol.geom.Point([Number(item.longitude),Number(item.latitude)])
				});				
				let c_geometry = pointFeature.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');
				
				let val = $('input[name=ShipLabel]:checked').val();
				
				var shipNameText = "";
				if(val=="name"){ 
					shipNameText = shipList[i].mmsi+" "+shipList[i].shipname; //이름인경우
				}else if(val=="id"){
					shipNameText = shipList[i].mmsi; //ID인경우
				}else{
					shipNameText = "";
				}
				pointFeature.id = "ship_"+shipList[i].mmsi;
				pointFeature.setStyle(
					new ol.style.Style({		            
			            image: new ol.style.Icon({
				          	src: 'images/sk/shipIcon.png',
				          	anchor: [0.8, 0.8],				          	
		        		}),
			            text: new ol.style.Text({
			                textAlign: 'center',
			                font:  'bold '+shipStyle.font+'px Arial',
			                fill: new ol.style.Fill({color: shipStyle.color}),
			                stroke: new ol.style.Stroke({color:'#ffffff', width:0}),
			                text: shipNameText,
			                offsetX: 0,
			                offsetY: -25,
			                overflow:true,
			            })
			      	})
				);		
				
				try{
					ship_layer.getSource().addFeature(pointFeature);
				}catch(e){
					console.log(e);
					console.log("shipList[i] error : "+shipList[i].mmsi);
				}						
			} //if~lon>140체크		
		}
	}
}

//선박정보 검색 리스트 (우측DIV)
function getShipSearch() {
	//getShipClean();
	shipList = [];
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "getShipSearch.do",
		asyn: false,
		data : {
			shipname : $("#search_word").val()
		},
		success: function(data) {
			//console.log(data);		    
			if(data != null){
				shipList = data;
				makeTableForShipList(); //우측DIV 선박리스트 표만들기
				makeShipFeature(); //선박리스트 feat만들기
			}		   
		}
	});
}

function makeTableForShipList(){
	let style="";
	let str_h = "";
	if(shipList.length < 13) {
		style = "style='width: 100%; height: "+(26*shipList.length)+"px; word-break: break-all;'";
		str_h = "<table style='width: 100%; height: 26px; word-break: break-all;'><colgroup><col width='135'><col width='135'></colgroup><tr><th>MMSI</th><th>선박명칭</th></tr></table>";
	} else{
		style = "style='width: 100%; word-break: break-all;'";
		str_h = "<table style='width: 100%; height: 26px; word-break: break-all;'><colgroup><col width='135'><col width='135'></colgroup><tr><th>MMSI</th><th>선박명칭</th></tr></table>";
	}
	$("#shiplist_header").html(str_h);
	
	let str = "<table "+style+">";
	str += "<colgroup><col width='50%'><col width='50%'></colgroup>";
	for(var i=0; i<shipList.length; i++) {
		if(chocieShipMmsi != "" && shipList[i].mmsi == chocieShipMmsi)
			str += "<tr style='cursor:pointer;background: #d5d5d5;' onclick='getShipSearch_Detail("+shipList[i].mmsi+","+i+");'>";
		else str += "<tr style='cursor:pointer;' onclick='getShipSearch_Detail("+shipList[i].mmsi+","+i+");'>";
		str += "<td id='shipList_"+shipList[i].mmsi+"'><span>"+shipList[i].mmsi+"</span></td>";
		str += "<td><span>"+shipList[i].shipname+"</span></td>";	
		
		str += "</tr>";
	}
	str += "</table>";
	
	$("#shiplist_result").html(str);
	$("#ship_num").text(shipList.length);	 
}

//해당 선박정보 위치로 이동
function moveShipFeature(mmsi){
	var featid = "ship_"+mmsi;
	var feats = ship_layer.getSource().getFeatures();
	for(var i=0;i<feats.length;i++){
		if(featid == feats[i].id){
			//featTest = feats[i];
			lyrCenter = ol.extent.getCenter(feats[i].getGeometry().getExtent());			
			//zoom, center 설정
		    map.getView().setCenter(lyrCenter);
		    map.getView().setZoom(14);
			
			break;
		}
	}	
}

//선박정보 상세 정보
function getShipSearch_Detail(mmsi,num) {
	chocieShipMmsi = mmsi;
	getShipSearch_Detail_Data();
	
	var chk = $("#chkShipRoute").prop("checked");
	if(chk){  //상세정보시 항적표시 있으면 항적표시로, 아니면 해당위치로 이동
		getShipSearch_Detail_Data_All(); //우측 DIV 항적표시
	}else{
		moveShipFeature(mmsi);	
	}
	
	for(let i=0; i<$("#shiplist_result table tr").length; i++) {
		$("#shiplist_result table tr").eq(i).css("background","");
	}
	$("#shiplist_result table tr").eq(num).css("background","#d5d5d5");
	
}

//선박정보 상세 정보2
function getShipSearch_Detail_Data() {
	getShipClean();
	if(chocieShipMmsi != ""){
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "getShipSearch_Detail.do",
			asyn: false,			
			data : {
				mmsi : chocieShipMmsi
			},
			success: function(data) {		    
				if(data != null){
					$("#txt_mmsi").text(data[0].mmsi);
					$("#txt_shipname").text(data[0].shipname);
					$("#txt_callsign").text(data[0].callsign);
					$("#txt_imo").text(data[0].imonumeric);
					$("#txt_lonlat").text(data[0].latitude + " / " + data[0].longitude);
					$("#txt_sog").text(data[0].sog);
					$("#txt_cog").text(data[0].cog);
					$("#txt_theading").text(data[0].theading);
					$("#txt_rateturn").text(data[0].rateturn);
					$("#txt_cstate").text(data[0].cstate);
					$("#txt_shiptype").text(data[0].shiptype);
					$("#txt_shipsize").text(data[0].shipsize);
					$("#txt_desti").text(data[0].destination);
					$("#txt_timestamp").text(data[0].timestampk);
				}		   
			}
		});
	}	
}

function getShipClean() {
	$("#txt_mmsi").text("");
	$("#txt_shipname").text("");
	$("#txt_callsign").text("");
	$("#txt_imo").text("");
	$("#txt_lonlat").text("");
	$("#txt_sog").text("");
	$("#txt_cog").text("");
	$("#txt_theading").text("");
	$("#txt_rateturn").text("");
	$("#txt_cstate").text("");
	$("#txt_shiptype").text("");
	$("#txt_shipsize").text("");
	$("#txt_desti").text("");
	$("#txt_timestamp").text("");
}



//선박정보 상세 정보 - 항적표시용
function getShipSearch_Detail_Data_All() {
	getShipClean();
	if(chocieShipMmsi != ""){
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "getShipSearch_all.do",
			asyn: false,			
			data : {
				mmsi : chocieShipMmsi
			},
			success: function(data) {		    
				if(data != null){					
					var list = data;		
					var DIVshipMoveList = [];			
					for(var i=0;i<list.length;i++){
						var item = list[i];					
						if(i==0){
							if(Number(item.longitude)<140 && Number(item.longitude)>110 && Number(item.latitude) < 47 && Number(item.latitude) > 18){
								var obj = {
									mmsi : item.mmsi,
									shipname : item.shipname,
									timestampkList : [item.timestampk],
									feat_line : [[Number(item.longitude),Number(item.latitude)]]
								};
								DIVshipMoveList.push(obj);
							}							
						}else{
							if(Number(item.longitude)<140 && Number(item.longitude)>110 && Number(item.latitude) < 47 && Number(item.latitude) > 18){
									DIVshipMoveList[0].feat_line.push([Number(item.longitude),Number(item.latitude)]);
									DIVshipMoveList[0].timestampkList.push(item.timestampk);									
							}		
						}
					}	//var i=0;i<list.length;i++		
					DIVget_ship_to_map(DIVshipMoveList); //항적조회 - 지도위 항적그리기 - 우측DIV
													
				}//	data != null
			}
		});
	}	
}


//항적조회 - 지도위 항적그리기 - 우측DIV
function DIVget_ship_to_map(DIVshipMoveList){	
	wfs_layer.getSource().clear();
	var chkShip = $("#chkViewLayerShip").prop("checked"); //보기설정 선박 OFF 일경우 지도위에 항적표시 X
	if(!chkShip){
		//선박 레이어 라인 표시
		var item = DIVshipMoveList[0];
		if(item.feat_line.length>1){
			var feat_line = new ol.Feature({
				geometry:new ol.geom.LineString(item.feat_line)
			});				
			
			//항적 스타일주기
			styles = [
			    // linestring
			    new ol.style.Style({
			      stroke: new ol.style.Stroke({
			        color: '#ff0000',
			        width: 2,
			      })					      
			    }),
			];
			
			let c_geometry = feat_line.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');							  	
		  	feat_line.setStyle(styles);
		  	try{
				wfs_layer.getSource().addFeature(feat_line);
				
				var lyrCenter = ol.extent.getCenter(feat_line.getGeometry().getExtent());			
				//zoom, center 설정
			    map.getView().setCenter(lyrCenter);
			    map.getView().setZoom(17);						
			}catch(e){
				console.log(e);
				console.log("error : "+item.mmsi);
			}
		  	//중간 이동경로 point 만들기.
		  	for(var j=0;j<item.feat_line.length;j++){
		  		var itemP = item.feat_line[j];
		  		
		  		
		  		var pointFeature = new ol.Feature({
					geometry: new ol.geom.Point(itemP)
				});				
				let c_geometry2 = pointFeature.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');
				let val = $('input[name=ShipLabel]:checked').val();
				var shipNameText = "";
				var pointLabel = "";
				if(val=="name"){ 
					shipNameText = item.mmsi+" "+item.shipname; //이름인경우
					pointLabel = item.timestampkList[j];
				}else if(val=="id"){
					shipNameText = item.mmsi; //ID인경우
					pointLabel = item.timestampkList[j];
				}else{
					shipNameText = "";
					pointLabel = "";
				}
				pointFeature.id = "ship_"+item.mmsi;
				
				if(j == item.feat_line.length-1){
					pointFeature.setStyle(
						new ol.style.Style({		            
				            image: new ol.style.Icon({
					          	src: 'images/sk/shipIcon.png',
					          	anchor: [0.8, 0.8],				          	
			        		}),
				            text: new ol.style.Text({
				                textAlign: 'center',
				                font:  'bold '+shipStyle.font+'px Arial',
				                fill: new ol.style.Fill({color: shipStyle.color}),
				                stroke: new ol.style.Stroke({color:'#ffffff', width:0}),
				                text: shipNameText,
				                offsetX: 0,
				                offsetY: -25,
				                overflow:true,
				            })
				      	})
					);
				}else{
					pointFeature.setStyle(
						new ol.style.Style({
							image: new ol.style.Circle({
					            radius: 4,
					            fill: new ol.style.Fill({
					                color: shipStyle.color
					            }),
					            stroke: new ol.style.Stroke({
						        	color: '#ffffff',
						        	width: 1,
						      	})
					        }),		            
				            text: new ol.style.Text({
				                textAlign: 'center',
				                font:  'bold '+shipStyle.font+'px Arial',
				                fill: new ol.style.Fill({color: shipStyle.color}),
				                stroke: new ol.style.Stroke({color:'#ffffff', width:0}),
				                text: pointLabel,
				                offsetX: 70,
				                offsetY: 0,
				                overflow:true,
				            })
				      	})
					);
				}
				
				try{
					wfs_layer.getSource().addFeature(pointFeature);
				}catch(e){
					console.log(e);
					console.log("point error : "+item.mmsi);
				}
		  	}	//var j=0;j<item.feat_line.length;j++			  	
		} //item.feat_line.length>1			
	}//!chkShip
}
