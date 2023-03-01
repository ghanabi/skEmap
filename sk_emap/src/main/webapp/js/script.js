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
				$('#colorSelector1 div').css('backgroundColor', '#' + hex);
			}
		});
	});
	$(window).resize(function () {
		setSize();
	});
	
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
		
		$(".slide1").css({'top': (window_h/2)+60+"px"});
	}
	$(document).ready(function () {
		$("#slide1").click(function() {
			var c = $('#slide1').attr('class');
			if(c == "slide1_on") {
		    	$(this).addClass('slide1');
		    	$(this).removeClass('slide1_on');

				$(".div_left").css("display","none");
				$("#div_left_mapSetting").css("display","none");
				$("#div_left_mapSearch").css("display","none");				
			} else {				
	    		$(this).addClass('slide1_on');
	    		$(this).removeClass('slide1');

				$(".div_left").css("display","block");
			}
			setSize();
	    	return false;
		});
		
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
			}
			setSize();
	    	return false;
		});
		 
	});
})(jQuery);
