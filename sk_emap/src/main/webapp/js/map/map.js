
var vworldTile;
var googlemap;
var drawInteration;
var drawInteration_search;


var featTest;

//35.5468629,129.3005359 울산
function mapInit(){
	var view = new ol.View({
		center: ol.proj.fromLonLat([129.3604722,35.35916667]),
		zoom: 7,
	});
	
	vworldTile = new ol.layer.Tile({
        id : 'vworldTile',
        visible: true,
        source: new ol.source.XYZ({
        	crossOrigin: 'anonymous',
            url: 'http://xdworld.vworld.kr:8080/2d/Base/service/{z}/{x}/{y}.png'
        })
    });
	//vworldTile.set("name" , 'vworldTile');
	
	googlemap = new ol.layer.Tile({
		source: new ol.source.OSM(),
	});	
    
	map = new ol.Map({
		layers: [
			vworldTile
		],
		target: 'dvMap',
		view: view
	});		
    
    wmsInit(); //베이스 wms레이어    
    map.removeLayer(vworldTile); //배경맵 삭제    
    vectorInit(); //베이스 vector레이어
    mapEvent();
}

//맵 이벤트
function mapEvent(){
	 //기본
	 $("#mapDefalt").on('click',function(e){
	 	deactiveInteractions();
	 });
	 
	 //확대
	 $("#mapZoomIn").on('click',function(e){
	 	let thisZoom = map.getView().getZoom();
	 	thisZoom++;
        map.getView().animate({zoom: thisZoom, duration: 300});
	 });
	 
	 //축소
	 $("#mapZoomOut").on('click',function(e){
	 	let thisZoom = map.getView().getZoom();
	 	thisZoom--;
        map.getView().animate({zoom: thisZoom, duration: 300});
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
	 	deactiveInteractions();
	 	setActiveDrawTool('box',null);
	 });
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
    
    //dragInteraction.setActive(false);
    //modStyleSelectInteraction.setActive(false);
    //modStyleSelectedFeature = null;
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
        	get_ship(lon1,lat1,lon2,lat2);	
    	}
    	drawInteration.on('drawend', drawendCallback);
    	map.addInteraction(drawInteration);
    }    
}


//항적조회1
function get_ship(lon1,lat1,lon2,lat2){
	if(confirm("해당 범위의 선박을 검색하시겠습니까?")){
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "getShipList.do",
			data : {
				lon1 : lon1,
				lat1 : lat1,
				lon2 : lon2,
				lat2 : lat2
			},
			success: function(data) {		    
				if(data != null){
					//console.log(data);
					var list = data;		
					var shipList = [];			
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
					get_ship_to_map(shipList); //항적조회2
				}		   
			},
	    });
	}	
}

//항적조회2
function get_ship_to_map(shipList){
	//선박 레이어 라인 표시
	for(var i=0;i<shipList.length;i++){
		if(shipList[i].feat_line.length>1){
			//if(shipList[i].mmsi == "440200240"){
				//console.log(shipList[i]);
				var feat_line = new ol.Feature({
					geometry:new ol.geom.LineString(shipList[i].feat_line)
				});								

				const styles = [
				    // linestring
				    new ol.style.Style({
				      stroke: new ol.style.Stroke({
				        color: '#ffcc33',
				        width: 2,
				      }),
				      text: new ol.style.Text({
			                textAlign: 'center',
			                font:  'bold 10px Arial',
			                fill: new ol.style.Fill({color: 'rgba(255,0, 0, 0.8)'}),
			                stroke: new ol.style.Stroke({color:'#ffffff', width:0}),
			                text: shipList[i].shipname,
			                offsetX: 0,
			                offsetY: -10,
			                overflow:true,
			            })
				    }),
				];

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
					          	src: 'images/sk/arrow.png',
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
