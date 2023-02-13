/**
 * roadView
 * @type {{}}
 */
const $roadView = (function() {
    'use strict';

    let isActive = false;

    const roadViewOvlyId = 'roadViewHelpOvly';
    let roadViewHelpOvlyEle = null;
    let roadViewHelpOvly = null;

    const roadViewZoom = 16;

    const roadViewMarkerId = 'roadViewMarker';
    let roadView;
    let roadviewClient;


    //지도 클릭시 위치
    const singleClick = function(e) {
        if(isActive) {
            const map = e.map;
            const thisZoom = map.getView().getZoom();

            const thisCoord = e.coordinate;

            if(thisZoom < roadViewZoom) {
                const mapView = map.getView();
                $cmmn.showMsg('로드뷰를 사용하기 위해서 지도를 더 확대합니다');

                mapView.setZoom(roadViewZoom);
                mapView.setCenter(thisCoord);
                return false;
            }

            initRoadview(thisCoord);
        }
    }

    //지도 위 포인트 이동시
    const pointerMove = function(e) {
        if(isActive) {
            const points = e.coordinate;
            if(roadViewHelpOvly != null) {
                roadViewHelpOvly.setPosition(points);
            }
        }
    }

    //로드뷰 마커 회전 변경
    const rotateRvMarker = function(angle) {
        let imgUrl = ctx + "/images/roadview/mk_round";

        if(angle > 0 && angle <= 30){
            imgUrl += "01.png";
        }else if(angle > 30 && angle <= 60){
            imgUrl += "02.png";
        }else if(angle > 60 && angle <= 90){
            imgUrl += "03.png";
        }else if(angle > 90 && angle <= 120){
            imgUrl += "04.png";
        }else if(angle > 120 && angle <= 150){
            imgUrl += "05.png";
        }else if(angle > 150 && angle <= 180){
            imgUrl += "06.png";
        }else if(angle > 180 && angle <= 210){
            imgUrl += "07.png";
        }else if(angle > 210 && angle <= 240){
            imgUrl += "08.png";
        }else if(angle > 240 && angle <= 270){
            imgUrl += "09.png";
        }else if(angle > 270 && angle <= 300){
            imgUrl += "10.png";
        }else if(angle > 300 && angle <= 330){
            imgUrl += "11.png";
        }else if(angle > 330 && angle <= 360){
            imgUrl += "01.png";
        }else{
            imgUrl += "01.png";
        }
        
        return imgUrl;
    }


    //지도 위 로드뷰 마커 이동
    const moveRoadviewMarker = function(lonlat, angle) {
        const lyrId = $layer.vectorIds.roadView;

        let marker = $map.getFeatureById(lyrId, roadViewMarkerId);
        if(marker == null) {
            marker = $map.addPointMarker(lyrId, {
                name: roadViewMarkerId,
            });
            marker.setId(roadViewMarkerId);
        }

        const imgUrl = rotateRvMarker(angle);
        marker.setStyle($mapStyle.featureStyle.roadView(imgUrl));

        const coords = ol.proj.transform(lonlat, 'EPSG:4326', $map.getProjectionCode());
        marker.setGeometry(new ol.geom.Point(coords));
    }


    //로드뷰 화면 및 마커 구성
    const initRoadview = function(coords) {
        //roadView dialog 정의
        $('#dvRoadView').dialog({
            title: '로드뷰',
            width: 600,
            height: 400,
            minWidth: 480,
            minHeight: 320,
            position: {my: "center top", at: "center top+30", of: window},
            close: function(e, ui) {
                //팝업 닫을때 로드뷰 관련 객체 초기화
                const map = $map.getMap();
                clearRoadViewLyr(map);
            }
        });

        //로드뷰 생성
        const thisProj = $map.getProjectionCode();
        const lonlat = ol.proj.transform(coords, thisProj, 'EPSG:4326');

        const kakaoLonlat = new kakao.maps.LatLng(lonlat[1], lonlat[0]);

        const roadViewContainer = $('#dvRoadView').get(0);
        roadView = new kakao.maps.Roadview(roadViewContainer);
        roadviewClient = new kakao.maps.RoadviewClient();

        roadviewClient.getNearestPanoId(kakaoLonlat, 50, function(panId) {
            if(panId == null) {
                $cmmn.showMsg('로드뷰를 조회할 수 없는 위치입니다');
            } else {
                roadView.setPanoId(panId, kakaoLonlat);

                const angle = 180;
                roadView.setViewpoint({pan: angle, tilt:7, zoom:0});

                moveRoadviewMarker(lonlat, angle);
            }
        });


        //로드뷰 위치, 각도 변경시 마커 이동
        const rvChangeCallback = function() {
            const lonlat = roadView.getPosition();
            const lon = lonlat.getLng();
            const lat = lonlat.getLat();

            const viewPoint = roadView.getViewpoint();

            moveRoadviewMarker([lon, lat], viewPoint.pan);
        }

        kakao.maps.event.addListener(roadView, 'position_changed', rvChangeCallback);
        kakao.maps.event.addListener(roadView, 'viewpoint_changed', function() {
            const viewPoint = roadView.getViewpoint();
            if(viewPoint.pan != 0) {
                rvChangeCallback();
            }
        });
    }


    //로드뷰 오버레이 삭제
    const clearRoadViewOvly = function(map) {
        if(roadViewHelpOvly != null) {
            map.removeOverlay(roadViewHelpOvly);
            roadViewHelpOvlyEle = null;
        }
    }

    //로드뷰 마커, 오버레이 삭제
    const clearRoadViewLyr = function(map) {
        const lyrId = $layer.vectorIds.roadView;
        const lyr = $layer.getLayerById(lyrId);
        if(lyr != null) {
            lyr.getSource().clear();
        }
    }

    //안내문 ovly설정
    const setRoadViewGuideOvly = function(map) {
        //ovly생성
        roadViewHelpOvlyEle =
            $('<div class="measureOvly">지도를 클릭하여<br/>로드뷰를 조회합니다</div>').get(0);

        roadViewHelpOvly = new ol.Overlay({
            id: roadViewOvlyId,
            element: roadViewHelpOvlyEle,
            offset: [30, -30],
            positioning: 'bottom=center'
        });
        map.addOverlay(roadViewHelpOvly);
    };


    //활성화 여부 설정
    const setActive = function(map, isOn) {
        isActive = isOn;

        clearRoadViewOvly(map);

        if(isActive) {
            setRoadViewGuideOvly(map);
        } else {
            $('.mapTool[data-tool-type="roadView"]').removeClass('on');
        }
    }

    return {
        singleClick: singleClick,
        pointerMove: pointerMove,

        setActive: setActive,
    }
} ());