
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
    
    
    //test
    wfs_layer = new ol.layer.Vector({
		source: wfsSource,
		style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 228, 0, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ff0000',
                width: 3
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
	 	setActiveDrawToolSearch('circle');
	 });
	 
	 //항로추적
	 $("#mapSearch3").on('click',function(e){
	 	setActiveDrawTool('box',null);
	 });
}

//interaction 비활성화
function deactiveInteractions() {
    map.removeInteraction(drawInteration);
    map.removeInteraction(drawInteration_search);    
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
        	e.feature.set('type', "box");  
        	console.log(e.feature);   
        	let feat = e.feature;
        	let featClone = feat.clone();
        	console.log(featClone.getGeometry());        	
        	let c_geometry = featClone.getGeometry().transform( 'EPSG:3857',  'EPSG:4326').getCoordinates();
        	console.log(c_geometry);        	
    	}
    	drawInteration.on('drawend', drawendCallback);
    	map.addInteraction(drawInteration);
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
		                stroke: new ol.style.Stroke({color:'#ffffff', width:4}),
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

function setSld(){
	if(cbndWms == null){
		return;
	}
	cbndWms.getSource().updateParams({
		SLD_BODY : encodeURIComponent(sld())
	});
}

function sld() {
	var lyNm = 'lt_c_uq111';
	
    var sld = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">';
    sld += '<NamedLayer>';
    sld += '<Name>sop:'+lyNm+'</Name>';
    sld += '<UserStyle>';
    sld += '<Name>Default Styler</Name>';
    sld += '<Title>테스트</Title>';
    sld += '<Abstract>테스트</Abstract>';
    sld += ' <FeatureTypeStyle>';
    sld += '<Rule>';
    sld += '<Name>도시지역</Name>';
    sld += '<Title>도시지역</Title>';
    //sld += '<Filter xmlns="http://www.opengis.net/ogc">';
    //if(type != "emd"){
    //  sld += '<PropertyIsLike wildCard="_" singleChar="!" escapeChar="?">';
    //  sld += '<PropertyName>'+lyCol+'</PropertyName>';
    //  sld += '<Literal>'+lyVal+'_</Literal>';
    //  sld += '</PropertyIsLike>';
    // }else{
    //   sld += '<PropertyIsEqualTo>';
    //   sld += '<PropertyName>'+lyCol+'</PropertyName>';
    //   sld += '<Literal>'+lyVal+'</Literal>';
    //   sld += '</PropertyIsEqualTo>';
    // }
    //sld += '</Filter>';
    sld += '<PolygonSymbolizer>';
    sld += '<Fill>';
    sld += '<CssParameter name="fill">#000000</CssParameter>';
    sld += '<CssParameter name="fill-opacity">1</CssParameter>';
    sld += '</Fill>';
    sld += '<Stroke>';
    sld += '<CssParameter name="stroke">';
    sld += '<Literal xmlns="http://www.opengis.net/ogc">#FF0000</Literal>';
    sld += '<CssParameter name="stroke-width">3</CssParameter>';
    sld += '</CssParameter>';
    sld += '</Stroke>';
    sld += '</PolygonSymbolizer>';
    // sld += '<TextSymbolizer>';
    // sld += '<Label>';
    // sld += '<PropertyName>sig_kor_nm</PropertyName>';
    // sld += '</Label>';
    // sld += '<Font>';
    // sld += '<CssParameter name="font-family">Arial</CssParameter>';
    // sld += '<CssParameter name="font-size">17</CssParameter>';
    // sld += '<CssParameter name="font-style">italic</CssParameter>';
    // sld += '</Font>';
    // sld += '<Fill>';
    // sld += '<CssParameter name="fill">#FFFF00</CssParameter>';
    // sld += '</Fill>';
    // sld += '</TextSymbolizer>';
    sld += '</Rule>';
    sld += '</FeatureTypeStyle>';
    sld += '</UserStyle>';
    sld += '</NamedLayer>';
    sld += '</StyledLayerDescriptor>';
    
    return sld;
}

function startWfs(){
	
	var str = "http://api.vworld.kr/req/wfs?SERVICE=WFS&REQUEST=GetFeature&TYPENAME=lt_c_uq111&BBOX=13987670,3912271,14359383,4642932&PROPERTYNAME=mnum,sido_cd,sigungu_cd,dyear,dnum,ucode,bon_bun,bu_bun,uname,sido_name,sigg_name,ag_geom&VERSION=1.1.0&MAXFEATURES=40&SRSNAME=EPSG:3857&OUTPUT=GML3&EXCEPTIONS=text/xml&KEY=90D6D336-FE7B-3EAD-860C-19793AC8FE9E&DOMAIN=localhost:8080";
	
	var param = encodeURIComponent(str);
	
	$.ajax({
		type : "GET",
		url : './proxyGetMap.jsp?url='+param,
		dataType : "text",
		outputFormat : "json",
		success : function(gml) {
			console.log(gml);
			fn_searchParser_move_smap(gml);
		},
		error : function(e) {
			alert("검색결과를 가져오는데 실패했습니다.");
		}
	});	
}

//지도 위치 이동 + 하이라이팅
function fn_searchParser_move_smap(xml) {
	var gmlParser = new ol.format.GML3();
	gmlParser.extractAttributes = true;
	var features = gmlParser.readFeatures(xml);
	//console.log(features);
	if (features) {
		for (var i = 0; i < features.length; i++) {
			var feature = features[i];
			//var result_feature = getFeature(feature);
			// map.getLayerByName("search_juso").addFeatures(result_feature);
			// var result_feature = init_feature_style(feature);
			wfsSource.addFeature(feature);
			// var point_w = feature.geometry.getBounds().getCenterLonLat();
		}
	} else {
		alert("해당지역의 공간데이터가 없습니다.");
	}
}

function clear_wfslayer(){
	wfsSource.clear();
}