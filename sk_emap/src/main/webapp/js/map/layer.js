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
    
    //wms 바다(lev6_DEPARE_A)
	var lev6_DEPARE_A = new ol.layer.Tile({
		id : 'lev6_DEPARE_A',
    	title: 'lev6_DEPARE_A',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_DEPARE_A',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_DEPARE_A);
    
    
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
    
    //wms lev6_LNDARE_A(기본맵처럼사용)
    var lev6_LNDARE_A = new ol.layer.Tile({
		id : 'lev6_LNDARE_A',
    	title: 'lev6_LNDARE_A',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_LNDARE_A',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_LNDARE_A);     
    
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
    //map.addLayer(rivers);
    
    //wms 	lev6_DEPCNT_L(기본맵처럼사용)
    var lev6_DEPCNT_L = new ol.layer.Tile({
		id : 'lev6_DEPCNT_L',
    	title: 'lev6_DEPCNT_L',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_DEPCNT_L',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_DEPCNT_L);       
    
    //wms 수심텍스트(기본맵처럼사용)
    var lev6_SOUNDG_P = new ol.layer.Tile({
		id : 'lev6_SOUNDG_P',
    	title: 'lev6_SOUNDG_P',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_SOUNDG_P',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_SOUNDG_P);   
    
    //wms lev6_OBSTRN_A(기본맵처럼사용)
    var lev6_OBSTRN_A = new ol.layer.Tile({
		id : 'lev6_OBSTRN_A',
    	title: 'lev6_OBSTRN_A',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_OBSTRN_A',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_OBSTRN_A);      
    
   //wms lev6_OILBAR_L(기본맵처럼사용)
    var lev6_OILBAR_L = new ol.layer.Tile({
		id : 'lev6_OILBAR_L',
    	title: 'lev6_OILBAR_L',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_OILBAR_L',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_OILBAR_L);   
    
    //wms lev6_ACHBRT_A(기본맵처럼사용)
    var lev6_ACHBRT_A = new ol.layer.Tile({
		id : 'lev6_ACHBRT_A',
    	title: 'lev6_ACHBRT_A',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_ACHBRT_A',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_ACHBRT_A);  
    
    //wms lev6_BRIDGE_A(기본맵처럼사용)
    var lev6_BRIDGE_A = new ol.layer.Tile({
		id : 'lev6_BRIDGE_A',
    	title: 'lev6_BRIDGE_A',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_BRIDGE_A',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_BRIDGE_A);       
    
    //wms lev6_BUISGL_A(기본맵처럼사용)
    var lev6_BUISGL_A = new ol.layer.Tile({
		id : 'lev6_BUISGL_A',
    	title: 'lev6_BUISGL_A',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_BUISGL_A',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_BUISGL_A);   
    
    //wms lev6_SEAARE_A(기본맵처럼사용)
    var lev6_SEAARE_A = new ol.layer.Tile({
		id : 'lev6_SEAARE_A',
    	title: 'lev6_SEAARE_A',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_SEAARE_A',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_SEAARE_A);  
    
    //wms lev6_SLCONS_L(기본맵처럼사용)
    var lev6_SLCONS_L = new ol.layer.Tile({
		id : 'lev6_SLCONS_L',
    	title: 'lev6_SLCONS_L',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_SLCONS_L',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });
    map.addLayer(lev6_SLCONS_L);   
    
    
    
         
    lightIconlayer(); //등대,등표,부표 호출
}


//등대,등표,부표 보여주기
function lightIconlayer(){

	//부표222  :lev6_BUOY_P
   var lev6_BUOY_P = new ol.layer.Tile({
		id : 'lev6_BUOY_P',
    	title: 'lev6_BUOY_P',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_BUOY_P',                
                'CRS' : 'EPSG:3857',
            },            
        })
    });   
    map.addLayer(lev6_BUOY_P); 
         
	//부표
   var lev6_FOGSIG_P = new ol.layer.Tile({
		id : 'lev6_FOGSIG_P',
    	title: 'lev6_FOGSIG_P',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_FOGSIG_P',
                //'SLD_BODY': text_SLD,
                //'format' : 'image/png', 
                //'transparent' : 'true',
                'CRS' : 'EPSG:3857',
            },            
        })
    });   
    map.addLayer(lev6_FOGSIG_P);    
    
    //등표
    var lev6_LIGHTS_P = new ol.layer.Tile({
		id : 'lev6_LIGHTS_P',
    	title: 'lev6_LIGHTS_P',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_LIGHTS_P',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });   
    map.addLayer(lev6_LIGHTS_P);    
    
     //등대
     var lev6_LNDMARK_P = new ol.layer.Tile({
		id : 'lev6_LNDMARK_P',
    	title: 'lev6_LNDMARK_P',
    	opacity: 1,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_LNDMARK_P',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });   
    map.addLayer(lev6_LNDMARK_P);        
    
    //lev6_WRECKS_P
     var lev6_WRECKS_P = new ol.layer.Tile({
		id : 'lev6_WRECKS_P',
    	title: 'lev6_WRECKS_P',
    	opacity: 0,
        source: new ol.source.TileWMS({
            url: geoserverWmsUrl,
            serverType: 'geoserver',
            crossOrigin: 'anonymous',            
            params: { 
            	'VERSION': '1.1.0' , 
                'LAYERS': 'skemap:lev6_WRECKS_P',               
                'CRS' : 'EPSG:3857',
            },            
        })
    });   
    map.addLayer(lev6_WRECKS_P);       
}  

//표지 레이어 on/off  (등대,등표,부표)
function ViewLayerChkMark(checked){	
	var layers = map.getLayers().getArray();
	
	var layerList = ["lev6_FOGSIG_P","lev6_LIGHTS_P","lev6_LNDMARK_P","lev6_BUOY_P"];
	let chkLevel = $('input[name=ShipView]:checked').val();
	
	if(!checked){
		if(chkLevel == "1"){  //기본    	
	    	for(let i in layers) {
		        const lyr = layers[i];
		        const thisLayerId = layers[i].get('id');	
				if(thisLayerId == "lev6_LNDMARK_P"){
					lyr.setOpacity(1);
				}		
			}
	    }else{  //표준,상세    	
	    	for(let i in layers) {
		        const lyr = layers[i];
		        const thisLayerId = layers[i].get('id');	
				
				for(var j=0;j<layerList.length;j++){
					if(layerList[j] === thisLayerId) {
						if(chkLevel == "3" && layerList[j]=="lev6_LIGHTS_P"){
						
						}else{
							lyr.setOpacity(1);
						}
						
					}
				}	
			}
	    }    
	}else{ //checked
		for(let i in layers) {
	        const lyr = layers[i];
	        const thisLayerId = layers[i].get('id');	
			
			for(var j=0;j<layerList.length;j++){
				if(layerList[j] === thisLayerId) {
					lyr.setOpacity(0);
				}
			}	
		}
	}
	
}


//OBSTRN 레이어 on/off
function ViewLayerChk(chkLevel){
	var layers = map.getLayers().getArray();
	
	var layerList = ["lev6_SOUNDG_P","lev6_OBSTRN_A","lev6_OILBAR_L","lev6_ACHBRT_A","lev6_BRIDGE_A","lev6_BUISGL_A","lev6_SEAARE_A"
	,"lev6_SLCONS_L","lev6_FOGSIG_P","lev6_LIGHTS_P","lev6_LNDMARK_P","lev6_WRECKS_P","lev6_BUOY_P","lev6_DEPCNT_L"];
	
	
	//레이어 off 후 필요한 레이어만 킴
	for(let i in layers) {
        const lyr = layers[i];
        const thisLayerId = layers[i].get('id');

		for(var j=0;j<layerList.length;j++){
			if(layerList[j] === thisLayerId) {
				lyr.setOpacity(0);
			}
		}
    }
    
    if(chkLevel == "1"){  //기본
    	var lList = ["lev6_LNDMARK_P"];
    	for(let i in layers) {
	        const lyr = layers[i];
	        const thisLayerId = layers[i].get('id');
	
			for(var j=0;j<lList.length;j++){
				if(lList[j] === thisLayerId) {
					var chk = $("#chkViewLayerMark").prop("checked");
					if(!chk){
						lyr.setOpacity(1);
					}				
				}
			}
		}
    }
    
    if(chkLevel == "2"){  //표준
    	var lList = ["lev6_ACHBRT_A","lev6_SLCONS_L","lev6_FOGSIG_P","lev6_LIGHTS_P","lev6_LNDMARK_P","lev6_BUOY_P","lev6_DEPCNT_L"];
    	for(let i in layers) {
	        const lyr = layers[i];
	        const thisLayerId = layers[i].get('id');
	
			for(var j=0;j<lList.length;j++){
				if(lList[j] === thisLayerId) {				
					if(lList[j] == "lev6_LNDMARK_P" || lList[j] == "lev6_FOGSIG_P" || lList[j] == "lev6_LIGHTS_P"|| lList[j] == "lev6_BUOY_P"){
						var chk = $("#chkViewLayerMark").prop("checked");
						if(!chk){
							lyr.setOpacity(1);
						}	
					}else{
						lyr.setOpacity(1);
					}			
				}
			}
		}
    }
    
    if(chkLevel == "3"){  //상세
    	var lList = ["lev6_SOUNDG_P","lev6_OBSTRN_A","lev6_OILBAR_L","lev6_ACHBRT_A","lev6_BRIDGE_A","lev6_BUISGL_A","lev6_SEAARE_A"
	,"lev6_SLCONS_L","lev6_FOGSIG_P","lev6_LNDMARK_P","lev6_WRECKS_P","lev6_BUOY_P"];
    	for(let i in layers) {
	        const lyr = layers[i];
	        const thisLayerId = layers[i].get('id');
	
			for(var j=0;j<lList.length;j++){
				if(lList[j] === thisLayerId) {				
					if(lList[j] == "lev6_LNDMARK_P" || lList[j] == "lev6_FOGSIG_P" || lList[j] == "lev6_LIGHTS_P"|| lList[j] == "lev6_BUOY_P"){
						var chk = $("#chkViewLayerMark").prop("checked");
						if(!chk){
							lyr.setOpacity(1);
						}	
					}else{
						lyr.setOpacity(1);
					}			
				}
			}
		}
    }    
}