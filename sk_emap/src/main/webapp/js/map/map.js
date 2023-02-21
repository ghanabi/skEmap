
var cbndWms;
var vworldTile;
var googlemap;
var wfsSource = new ol.source.Vector();
var wfs_layer;

//35.5468629,129.3005359 울산
//126.978446,37.523184  서울
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
    
	map = new ol.Map({
		layers: [
			vworldTile
		],
		target: 'dvMap',
		view: view
	});
	map.addLayer(wfs_layer);
	
	//wms 바다(기본맵처럼사용)
	var DEPAREA = new ol.layer.Tile({
		id : 'DEPAREA',
    	title: 'DEPAREA',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: 'http://141.164.62.150:8089/geoserver/wms',
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
            url: 'http://141.164.62.150:8089/geoserver/wms',
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
            url: 'http://141.164.62.150:8089/geoserver/wms',
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
            url: 'http://141.164.62.150:8089/geoserver/wms',
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
}

//등대,등표,부표 보여주기
function wmslayer(){     
	//등대
   cbndWms = new ol.layer.Tile({
		id : 'lighthouse',
    	title: 'lighthouse',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: 'http://141.164.62.150:8089/geoserver/wms',
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
            url: 'http://141.164.62.150:8089/geoserver/wms',
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
            url: 'http://141.164.62.150:8089/geoserver/wms',
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