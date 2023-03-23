function onMoveEnd(evt) {
	  var map1 = evt.map;  
	  var lev =map1.getView().getZoom();
	  var resol = map1.getView().getResolutionForZoom(lev);	  
	  
	  var INCHES_PER_UNIT = 39.37;
	  var DOTS_PER_INCH = 72;
	  
	  var scale = INCHES_PER_UNIT * DOTS_PER_INCH * resol;
	  scale = Math.round(scale);
	  $("#mapZoomLevelStat").html("축척=>1:"+scale+"[LEVEL:"+lev+"]");	  
}

//선박 선택 이벤트
function shipSelectEvent(){
	//TODO selected feature style 변경
        modStyleSelectInteraction = new ol.interaction.Select({
            condition: ol.events.condition.click,
            layers: function (lyr) {
                let id = lyr.get('id');
                if (id === "shipLayer") {
                    return true;
                }
                return false;
            }
        });
        modStyleSelectInteraction.setActive(false);

        modStyleSelectInteraction.on('select', function (e) {
            const selectedList = e.selected;
            e.target.getFeatures().clear();

            if (selectedList.length > 0) {
                const f = e.selected[0];               
                var fid = f.id;
                var mmsi = fid.substring(5);
                var c = $('#slide2').attr('class');
                if(c != "slide2_on") {
			    	$("#slide2").click();
				}       
				getShipSearch_Detail(mmsi); //선박 상세정보     
            }
        });
        map.addInteraction(modStyleSelectInteraction);
}

//interaction 비활성화
function deactiveInteractions() {
    map.removeInteraction(drawInteration);
    map.removeInteraction(drawInteration_search); 
    modStyleSelectInteraction.setActive(false);   
    var layers = map.getLayers().getArray();
	for(let i in layers) {
        let l = layers[i];
        const thisLayerId = layers[i].get('id');

        if("mapSearch1" === thisLayerId) {
            l.getSource().clear();
        }
        if("shipLayer" === thisLayerId) {  //선박레이어
            //l.getSource().clear();
        }
        if("shipDetailLayer" === thisLayerId) {  //선박상세레이어
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
    		//console.log(e);
    		lyr.getSource().clear();
        	e.feature.set('type', "circle");       
        	let feat = e.feature;
        	    	
        	let fpoint = feat.getGeometry().getCenter();             	
        	//let lpoint = feat.getGeometry().getLastCoordinate();         
        	let lpoint = e.target.sketchCoords_[1];
	        var feat_line = new ol.Feature({
				geometry:new ol.geom.LineString([
		            fpoint,lpoint              
		        ])
			});	
			
			let featClone = feat_line.clone();
        	featTest = featClone;    		          
			
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
    
    
    let fpoint = featClone.getGeometry().getCoordinates()[0];	
	let lpoint = featClone.getGeometry().getCoordinates()[1];	
	
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


// 지도 이미지 출력
function fn_printPopup(){
	map.once('postcompose', function(event) {
		
		var cnvs = event.context.canvas;
		cnvs.crossOrigin = "anonymous";
		var mapImage = cnvs.toDataURL('image/png');
		
		var popupWindow = window.open("","","width=800px,height=620px");
		
		popupWindow.document.write("<head>")
		popupWindow.document.write('<script type="text/javascript" src="js/map/mapEvent.js"></script>')
		popupWindow.document.write("</head>")
		
		popupWindow.document.write("<body>")
		popupWindow.document.write("<div id=mapPopup>")
		
			popupWindow.document.write("<div id='printHead'>")
				popupWindow.document.write("<div id='title' style='padding:10px;background:#f3f3f3;'>")
				popupWindow.document.write("SK 지도 프린트 미리보기")
				popupWindow.document.write("<button id='printBtn' style='padding:4px 10px 6px 10px;border-radius:5px;border:none;background:#24356E;font-size:12px;color:#fff;float:right;' onclick='fn_print()'>")
				popupWindow.document.write("인 쇄")
			    popupWindow.document.write("</button>")
				popupWindow.document.write("</div>")

			popupWindow.document.write("</div>")
			
			popupWindow.document.write("<div id='printBody'>")
				popupWindow.document.write("<div id='mapView'>")
			    popupWindow.document.write("<img src='"+mapImage+"' width='100%'/>");
			    popupWindow.document.write("</div>")
				
			    //popupWindow.document.write("<div id='memoBox'>")
			    //popupWindow.document.write("<textarea id='memo' placeholder='메모를 입력하세요.' style='width:100%;height:100px;'></textarea>");
			    //popupWindow.document.write("</div>")
		    popupWindow.document.write("</div>")
	    
	    popupWindow.document.write("</div>")
	    popupWindow.document.write("</body>")
	    
	    popupWindow.document.close();
	    popupWindow.focus();
		
	});
	map.renderSync();
}

function fn_print(){
	document.getElementById('printBtn').style.display = "none";
	window.print();
	window.close();
};
