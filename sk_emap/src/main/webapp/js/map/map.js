
var cbndWms;
var vworldTile;
var googlemap;
var wfsSource = new ol.source.Vector();
var wfs_layer;
var drawInteration;
var drawInteration_search;
var geoserverWmsUrl = "http://141.164.62.150:8089/geoserver/wms";

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
	
	//wms 바다(기본맵처럼사용)
	var DEPAREA = new ol.layer.Tile({
		id : 'DEPAREA',
    	title: 'DEPAREA',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:DEPAREA',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(DEPAREA);
    
    //wms 대지(기본맵처럼사용)
    var LNDAREA_A = new ol.layer.Tile({
		id : 'LNDAREA_A',
    	title: 'LNDAREA_A',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:LNDAREA_A',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(LNDAREA_A);
    
    //wms 강(기본맵처럼사용)
    var rivers = new ol.layer.Tile({
		id : 'rivers',
    	title: 'rivers',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:rivers',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(rivers);
    
    //wms 강(기본맵처럼사용)
    var souding = new ol.layer.Tile({
		id : 'souding',
    	title: 'souding',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:SOUNDG',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(souding);
    
    map.removeLayer(vworldTile); //배경맵 삭제
    wmslayer(); //등대,등표,부표 호출
    
    //항로범위
    const mapSearch2 = new ol.layer.Vector({
        id: "mapSearch2",
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,0, 0, 0.8)',
                width: 3,
                lineDash: [.1, 5]
            })
      	})
    });
    map.addLayer(mapSearch2);
    
    //항로검색용
    const mapSearch1 = new ol.layer.Vector({
        id: "mapSearch1",
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({                
                color: '#FF000033'
            }),
            stroke: new ol.style.Stroke({                
                color: '#ff0000ff',
                width: 2
            })
      	})
    });
    map.addLayer(mapSearch1);
    
    mapEvent();
    
    
    //선박 벡터레이어
    wfs_layer = new ol.layer.Vector({
    	id: "shipLayer",
		source: wfsSource,
		style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 228, 0, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#FF007F',
                width: 2
            }),
        }),
        zIndex : 9999
	});
    map.addLayer(wfs_layer);
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
    
    
    //$measure.off();
    //dragInteraction.setActive(false);
    //modStyleSelectInteraction.setActive(false);
    //modStyleSelectedFeature = null;
}

//항로검색 활성화
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


//선박 리스트 가져오기.
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
									feat_line : [[Number(item.longitude),Number(item.latitude)]]
								};
								shipList.push(obj);
							}
							
						}
					}
					//console.log(shipList);
					
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
							  
								//console.log("111111111111");
								try{
									wfs_layer.getSource().addFeature(feat_line);
								}catch(e){
									console.log(e);
									console.log("shipList[i] error : "+shipList[i].mmsi);
								}
								//console.log("22222222");
							//}									
						}
					}
				}		   
			},
	    });
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
        	//console.log("fpoint");
        	//console.log(fpoint);
        	let lpoint = feat.getGeometry().getLastCoordinate();   	
        	//console.log("lpoint");
        	//console.log(lpoint);       	
	        
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



//등대,등표,부표 보여주기
function wmslayer(){     
	//등대
   cbndWms = new ol.layer.Tile({
		id : 'lighthouse',
    	title: 'lighthouse',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lighthouse',
                //'SLD_BODY': text_SLD,
                //'format' : 'image/png', 
                //'transparent' : 'true',
                'CRS' : 'EPSG:3857',
            },            
        })
    });   
    map.addLayer(cbndWms);    
    //등표
    var lightmark = new ol.layer.Tile({
		id : 'lightmark',
    	title: 'lightmark',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lightmark',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });   
    map.addLayer(lightmark);    
    //부표
     var buoy = new ol.layer.Tile({
		id : 'buoy',
    	title: 'buoy',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:buoy',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });   
    map.addLayer(buoy);       
    
    //wrecks
     var wrecks = new ol.layer.Tile({
		id : 'wrecks',
    	title: 'wrecks',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:wrecks',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });   
    map.addLayer(wrecks);       
}  






















function clear_wmslayer(){
	map.removeLayer(cbndWms);
}

function clear_wfslayer(){
	wfsSource.clear();
}