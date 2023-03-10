
var vworldTile;
var googlemap;
var drawInteration;
var drawInteration_search;
var choice_idx;

//항적조회 범위값 저장 (연호보아라)
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
    
	map = new ol.Map({
		layers: [
			googlemap
		],
		target: 'dvMap',
		view: view
	});		
    
    wmsInit(); //베이스 wms레이어    
    map.removeLayer(googlemap); //배경맵 삭제    
    vectorInit(); //베이스 vector레이어
    mapEvent();

	//$("#mapSearch3").click();
}

//맵 이벤트
function mapEvent(){
	//기본
	$("#mapDefalt").on('click',function(e){
		deactiveInteractions();
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
		} else {
			$("#mapSearch3 img").attr("src","images/sk/maptool/btn7.jpg");
			$("#div_left_mapSearch").css("display","none");
			$("#div_left_mapSetting").css("display","block");
			$(".div_left").css("display","block");
		}
		setSize();	
	});
	
	//항적표시 검색
	$("#shipsearch").on('click',function(e){
		get_ship();
	});
	
	//항적표시 검색
	$("#shipsearch2").on('click',function(e){
		getShipSearch();
	});
	
	
	
	//선박정보검색
	$("#shipsearch2").on('click',function(e){
		getShipSearch();
	});
	
	//항적표시 해당지역 설정하기
	$("#boxsearch").on('click',function(e){		
	 	deactiveInteractions();
	 	setActiveDrawTool('box',null);
	});	
	
	//목록 갱신
	$("#ship_clean").on('click',function(e){
		getShipSearch();
	});
	
	//선박관리
	$("#ship_setting").on('click',function(e){		
	 	$("#mapSetting").click();
	});
	
	//항적표시
	$("#feather_see").on('click',function(e){
	 	$("#chkViewLayerShip").click();
	});
	
	//태그표시
	$("#tag_see").on('click',function(e){	
		let val = $('input[name=ShipLabel]:checked').val();
		if(val=="none") {
	 		$("input:radio[name='ShipLabel']:radio[value='name']").click();
		} else {
	 		$("input:radio[name='ShipLabel']:radio[value='none']").click();	
		}
	});
	
	//보기설정 - 상세
	$("#chkViewLayerDetail").on('click',function(e){		
	 	ViewLayerChk(this.checked);
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
		get_ship_to_map(choice_idx);
	});
	
	//보기설정 - 선박라벨
	$('input[name=ShipLabel]').on('click',function(e){	
		let val = $('input[name=ShipLabel]:checked').val();
		if(val=="none") { 
			$("#tag_see").css("font-weight","normal");
		} else {
			$("#tag_see").css("font-weight","bold");
		}
		get_ship_to_map(choice_idx);		
	});	
	
	//보기설정 - 선박 항적색깔
	$('input[name=ShipIcon]').on('click',function(e){	
		get_ship_to_map(choice_idx);		
	});	
	
}

//줌인, 줌아웃 드래그
function see_zoomControl(type) {    
    drawInteration = new ol.interaction.DragZoom({
        condition: (e) => {
            return ol.events.condition.click
        },
        out: type
    });
    map.addInteraction(drawInteration);
}

//interaction 비활성화
function deactiveInteractions() {
    map.removeInteraction(drawInteration);
    map.removeInteraction(drawInteration_search);    
    var layers = map.getLayers().getArray();
	for(let i in layers) {
        let l = layers[i];
        const thisLayerId = layers[i].get('id');

        if("mapSearch1" === thisLayerId) {
            l.getSource().clear();
        }
        if("shipLayer" === thisLayerId) {
            l.getSource().clear();
        }
        if("mapSearch2" === thisLayerId) {
            l.getSource().clear();
        }
    }
    map.updateSize();
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
        	//console.log(featClone.getGeometry());        	
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
        	//get_ship();	
    	}
    	drawInteration.on('drawend', drawendCallback);
    	map.addInteraction(drawInteration);
    }    
}


//항적조회1
function get_ship(){
	let date1 = $("#date1").val();
	let date2 = $("#date2").val();
	let txt = $("#txt_search").val();
	let kind = $('input[name="kind"]:checked').val();
	searchBox.date1 = date1;
	searchBox.date2 = date2;
	searchBox.txt = txt;
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
					shipList = [];			
					for(var i=0;i<list.length;i++){
						var item = list[i];
						var chk = true;
						for(var j=0;j<shipList.length;j++){
							if(item.mmsi == shipList[j].mmsi){
								if(Number(item.longitude)<140 && Number(item.longitude)>110 && Number(item.latitude) < 47 && Number(item.latitude) > 18){
									shipList[j].feat_line.push([Number(item.longitude),Number(item.latitude)]);
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
									feat_line : [[Number(item.longitude),Number(item.latitude)]]
								};
								shipList.push(obj);
							}
							
						}
					}
					//console.log(shipList);
					
					get_ship2(); //리스트 만들기
					//get_ship_to_map(); //항적조회2											
				}		   
			},
	    });
	//}	
}

//항적조회2
function get_ship_to_map(i){
	wfs_layer.getSource().clear();
	var chkShip = $("#chkViewLayerShip").prop("checked"); //보기설정 선박 OFF 일경우 지도위에 항적표시 X
	if(!chkShip){
		//선박 레이어 라인 표시
		//for(var i=0;i<shipList.length;i++){
		if(shipList.length>0){
			choice_idx = i;
			if(shipList[i].feat_line.length>1){
				//if(shipList[i].mmsi == "440200240"){
					//console.log(shipList[i]);
					var feat_line = new ol.Feature({
						geometry:new ol.geom.LineString(shipList[i].feat_line)
					});								
	
					let val = $('input[name=ShipLabel]:checked').val();
					let color = $('input[name=ShipIcon]:checked').val();
					let styles = [];
					//라벨 표시 여부.
					if(val != "none"){
						var text = "";
						if(val=="name"){ 
							text = shipList[i].shipname; //이름인경우
						}else{
							text = shipList[i].mmsi; //ID인경우
						}
						
						styles = [
						    // linestring
						    new ol.style.Style({
						      stroke: new ol.style.Stroke({
						        color: '#'+color,
						        width: 2,
						      }),
						      text: new ol.style.Text({
					                textAlign: 'center',
					                font:  'bold 10px Arial',
					                fill: new ol.style.Fill({color: 'rgba(255,0, 0, 0.8)'}),
					                stroke: new ol.style.Stroke({color:'#ffffff', width:0}),
					                text: text,
					                offsetX: 0,
					                offsetY: -10,
					                overflow:true,
					            })
						    }),
						];
					}else{
						
						styles = [
						    // linestring
						    new ol.style.Style({
						      stroke: new ol.style.Stroke({
						        color: '#'+color,
						        width: 2,
						      }),			
						    }),
						];
					}
					
	
					let c_geometry = feat_line.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');
					
					c_geometry.forEachSegment(function (start, end) {
					    const dx = end[0] - start[0];
					    const dy = end[1] - start[1];
				    	const rotation = Math.atan2(dy, dx);
				    	// arrows
				    	styles.push(
				      		new ol.style.Style({
					        	geometry: new ol.geom.Point(end),
					        	image: new ol.style.Icon({
						          	src: 'images/sk/'+color+'.png',
						          	anchor: [0.75, 0.5],
						          	rotateWithView: true,
						          	rotation: -rotation,
				        		}),
				      		})
				    	);
				  	});
				  	
				  	feat_line.setStyle(styles);			
					try{
						wfs_layer.getSource().addFeature(feat_line);
					}catch(e){
						console.log(e);
						console.log("shipList[i] error : "+shipList[i].mmsi);
					}				
				//}									
			}
		}
	}		
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
					let str = "<table style='width:100%'>";
					str += "<colgroup><col width='20%'><col width='20%'><col width='30%'><col width='30%'></colgroup>";
					str += "<tr><th>MMSI</th><th>선박명칭</th><th>최초수신시간</th><th>최종수신시간</th></tr>";
					for(var i=0; i<data.length; i++) {
						str += "<tr onclick='get_ship_to_map("+i+")'>";
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
//항로범위 활성화
function setActiveDrawToolSearch(type) {
	let lyr=null;
	var layers = map.getLayers().getArray();
	for(let i in layers) {
        const l = layers[i];
        const thisLayerId = layers[i].get('id');

        if("mapSearch2" === thisLayerId) {
            lyr = l;
            break;
        }
    }
    
    if(lyr != null){
    	const source = lyr.getSource();
    	
    	const tool = {
	        type: 'Circle',	        
	    };
	    
	    let drawOption = $.extend({}, tool);
    	drawOption['source'] = source;
    	drawInteration_search = new ol.interaction.Draw(drawOption);
    	const drawendCallback = function (e) {
    		lyr.getSource().clear();
        	e.feature.set('type', "circle");       
        	let feat = e.feature;
        	let featClone = feat.clone();
        	featTest = featClone;        	
        	let fpoint = feat.getGeometry().getCenter();        	
        	let lpoint = feat.getGeometry().getLastCoordinate();        	     	
	        
	        var feat_line = new ol.Feature({
				geometry:new ol.geom.LineString([
		            fpoint,lpoint              
		        ])
			});			          
			
			var dis = calDistance(featClone);	//거리구하기			
			feat_line.setStyle(
				new ol.style.Style({		            
		            stroke: new ol.style.Stroke({
		                color: 'rgba(255,0, 0, 1)',
		                width: 2		             
		            }),
		            text: new ol.style.Text({
		                textAlign: 'center',
		                font:  'bold 10px Arial',
		                fill: new ol.style.Fill({color: 'rgba(255,0, 0, 0.8)'}),
		                stroke: new ol.style.Stroke({color:'#ffffff', width:0}),
		                text: String(dis),
		                offsetX: 0,
		                offsetY: -10,
		                overflow:true,
		            })
		      	})
			);
			lyr.getSource().addFeature(feat_line);
    	}
    	drawInteration_search.on('drawend', drawendCallback);
    	map.addInteraction(drawInteration_search);
    }    
}
//거리구하기
function calDistance(featClone){
    let c_geometry = featClone.getGeometry().transform( 'EPSG:3857',  'EPSG:4326');
    
    let fpoint = c_geometry.getCenter();	
	let lpoint = c_geometry.getLastCoordinate();	
	
	const lat1 = fpoint[1];
	const lon1 = fpoint[0];
	const lat2 = lpoint[1];
	const lon2 = lpoint[0];

	const R = 6371e3; // metres
	const φ1 = lat1 * Math.PI/180; // φ, λ in radians
	const φ2 = lat2 * Math.PI/180;
	const Δφ = (lat2-lat1) * Math.PI/180;
	const Δλ = (lon2-lon1) * Math.PI/180;
	
	const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	          Math.cos(φ1) * Math.cos(φ2) *
	          Math.sin(Δλ/2) * Math.sin(Δλ/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	
	const d = R * c; // in metres
	
	var str = "";
	let dis = Math.round(d);
	
	//해리는 1해리 =1852m
	let harry = Math.round(dis/1852*100)/100;
	str = harry+"해리";
	
	if(Number(dis) > 1000){
		var diskm = dis/1000;
		str += " ("+diskm+")km";
	}else{
		str += " ("+dis+")m";
	}
	
	var y = Math.sin(lon1-lon2) * Math.cos(lat1);
	var x = Math.cos(lat2)*Math.sin(lat1) -
	        Math.sin(lat2)*Math.cos(lat1)*Math.cos(lon1-lon2);
	var brng = Math.atan2(y, x) * 180 / Math.PI;
	brng = Math.round(brng);
	//console.log("Bearing in degreee:  " + brng);
	str += ", "+brng+"도";
	
	return str;
}

//OBSTRN 레이어 on/off
function ViewLayerChk(checked){
	let lyr=null;
	var layers = map.getLayers().getArray();
	for(let i in layers) {
        const l = layers[i];
        const thisLayerId = layers[i].get('id');

        if("OBSTRN" === thisLayerId) {
            lyr = l;
            break;
        }
    }
    
    if(lyr != null){
    	if(checked){
			lyr.setOpacity(1);
		}else{
			lyr.setOpacity(0);
		}
    }	
    
    //수심테스트 
	for(let i in layers) {
        const l = layers[i];
        const thisLayerId = layers[i].get('id');

        if("souding" === thisLayerId) {
            lyr = l;
            break;
        }
    }
    
    if(lyr != null){
    	if(checked){
			lyr.setOpacity(1);
		}else{
			lyr.setOpacity(0);
		}
    }	
}

//표지 레이어 on/off
function ViewLayerChkMark(checked){
	let lyr=null;
	var layers = map.getLayers().getArray();
	for(let i in layers) {
        const l = layers[i];
        const thisLayerId = layers[i].get('id');

        if("lightmark" === thisLayerId) {
            lyr = l;
            break;
        }
    }
    
    if(lyr != null){
    	if(checked){
			lyr.setOpacity(0);
		}else{
			lyr.setOpacity(1);
		}
    }	
    
    //부표 
	for(let i in layers) {
        const l = layers[i];
        const thisLayerId = layers[i].get('id');

        if("buoy" === thisLayerId) {
            lyr = l;
            break;
        }
    }
    
    if(lyr != null){
    	if(checked){
			lyr.setOpacity(0);
		}else{
			lyr.setOpacity(1);
		}
    }	
}

//선박정보 검색 리스트
function getShipSearch() {
	getShipClean();
	let txt = $("#search_word").val();
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "getShipSearch.do",
		asyn: false,
		data : {
			shipname : txt
		},
		success: function(data) {		    
			if(data != null){
				let style="";
				if(data.length < 13) {
					style = "style='height: "+(26*data.length)+"px;'";
				}
				
				let str = "<table "+style+">";
				str += "<colgroup><col width='50%'><col width='50%'></colgroup>";
				for(var i=0; i<data.length; i++) {
					str += "<tr style='cursor:pointer;' onclick='getShipSearch_Detail("+data[i].mmsi+");'>";
					str += "<td>"+data[i].mmsi+"</td>";
					str += "<td>"+data[i].shipname+"</td>";
					str += "</tr>";
				}
				str += "</table>";
				$("#shiplist_result").html(str);
				$("#ship_num").text(data.length);
			}		   
		}
	});
}

//선박정보 상세 정보
function getShipSearch_Detail(mmsi) {
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "getShipSearch_Detail.do",
		asyn: false,			
		data : {
			mmsi : mmsi
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

