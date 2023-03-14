(function ($){
	$(window).on('load', function () {
		setSize();
		
		$('#colorSelector2').ColorPicker({
			color: '#0000ff',
			onShow: function (colpkr) {
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				$('#colorSelector2 div').css('backgroundColor', '#' + hex);
			}
		});
		$('#colorSelector1').ColorPicker({
			color: '#ff0000',
			onShow: function (colpkr) {
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				$('#colorSelector1 div').css('backgroundColor', '#' + hex);
				ColorPickerValue = "#"+hex;
			}
		});
	});
	$(window).resize(function () {
		setSize();
	});
	
	$(document).ready(function () {
		/*$("#slide1").click(function() {
			var c = $('#slide1').attr('class');
			if(c == "slide1_on") {
		    	//$(this).addClass('slide1');
		    	//$(this).removeClass('slide1_on');

				$(".div_left").css("display","none");
				$("#div_left_mapSetting").css("display","none");
				$("#div_left_mapSearch").css("display","none");				
			} else {				
	    		//$(this).addClass('slide1_on');
	    		//$(this).removeClass('slide1');

				$(".div_left").css("display","block");
			}
			setSize();
	    	return false;
		});*/
		
		$("#slide2").click(function() {
			var c = $('#slide2').attr('class');
			if(c == "slide2_on") {
		    	$(this).addClass('slide2');
		    	$(this).removeClass('slide2_on');
				$("#div_right").css("display","none");
			} else {				
	    		$(this).addClass('slide2_on');
	    		$(this).removeClass('slide2');
				$("#div_right").css("display","block");
				getShipSearch();
			}
			setSize();
	    	return false;
		});
		let today = new Date(); 
		let year = today.getFullYear(); // 년도
		let month = ("0" + (1 + today.getMonth())).slice(-2);  // 월
		let day = ("0" + today.getDate()).slice(-2);  // 날짜
		
		document.getElementById("date1").setAttribute("max", year + '-' + month + '-' + day);
		
		//슬라이더 설정
		Ps.initialize(document.getElementById('shiplist_result'));
		Ps.initialize(document.getElementById('ship_result'));
		
		$(".map_tool li img").on("click",function(){
			if($(this).attr("src").indexOf("btn7") == -1) {
				$(".div_left").css("display","none");
				$("#div_left_mapSearch").css("display","none");
				$("#div_left_mapSetting").css("display","none");
			}
			
			for(let i=0; i<$(".map_tool li img").length; i++) {
				$(".map_tool li img").eq(i).attr("src",$(".map_tool li img").eq(i).attr("src").replace("_on.jpg",".jpg"));
			}
			
			$("#mapSetting img").attr("src",$("#mapSetting img").attr("src").replace("_on.jpg",".jpg"));
			
			var srcn = $(this).attr("src").slice(-5);
			if (srcn == 'n.jpg') $(this).attr("src",$(this).attr("src").replace("_on.jpg",".jpg"));
			else $(this).attr("src",$(this).attr("src").replace(".jpg","_on.jpg"));
			setSize();
		});
		 
	});
})(jQuery);


function setSize() {
		var window_w = $( window ).width();
		var window_h = $( window ).height();
		var left_w = $(".con_left").width();
		var right_w = $(".con_right").width();
		var l_div = $(".div_left").width();
		var r_div = $("#div_right").width();
		
		if($(".div_left").css("display") == "none") {
			l_div = 0;
		}else l_div += 1;
		
		if($("#div_right").css("display") == "none") {
			r_div = 0;
		}else r_div += 1;
		
		$(".con_left").height(window_h+"px");
		$(".nav").height(window_h-70+"px");
		
		$("#container").width(window_w+"px");
		$("#container").height(window_h+"px");
		$(".con_center").width(window_w-left_w-right_w-l_div-r_div-4+"px");
		$(".con_center").height(window_h+"px");
		
		$(".con_right").height(window_h+"px");
		$(".right_tab").height(window_h+"px");
		
		$(".scale").css({'left': 85+l_div+"px"});
		
		//$(".slide1").css({'top': (window_h/2)+60+"px"});
		
		if(map != null){
			map.updateSize();
		}		
}
