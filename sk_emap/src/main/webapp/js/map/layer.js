var geoserverWmsUrl = "http://141.164.62.150:8089/geoserver/wms";
function wmsInit(){	
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
    
    //wms 수심텍스트(기본맵처럼사용)
    var souding = new ol.layer.Tile({
		id : 'souding',
    	title: 'souding',
    	opacity: 0,
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
    
    //wms OBSTRN(기본맵처럼사용)
    var OBSTRN = new ol.layer.Tile({
		id : 'OBSTRN',
    	title: 'OBSTRN',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:OBSTRN',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(OBSTRN);   
    
    lightIconlayer(); //등대,등표,부표 호출
}


//등대,등표,부표 보여주기
function lightIconlayer(){     
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

//표지 레이어 on/off  (등대,등표,부표)
function ViewLayerChkMark(checked){
	let lyr=null;
	var layers = map.getLayers().getArray();
	
	//등표
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
    
    //등대 
	for(let i in layers) {
        const l = layers[i];
        const thisLayerId = layers[i].get('id');

        if("lighthouse" === thisLayerId) {
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