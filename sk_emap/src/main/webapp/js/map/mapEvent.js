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
        if("shipLayer" === thisLayerId) {  //선박레이어
            l.getSource().clear();
        }
        if("mapSearch2" === thisLayerId) {
            l.getSource().clear();
        }
        if("shipMoveLayer" === thisLayerId) { //항적레이어
            l.getSource().clear();
        }
    }
    //map.updateSize();
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
		                font:  'bold 12px Arial',
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