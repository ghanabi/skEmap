var wfsSource = new ol.source.Vector();
var wfs_layer;
function vectorInit(){
    
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
                color: '#FF000000'
            }),
            stroke: new ol.style.Stroke({                
                color: '#ff0000ff',
                width: 2
            })
      	})
    });
    map.addLayer(mapSearch1);    
    
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