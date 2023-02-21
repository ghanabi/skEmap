(function ($){
	$(window).on('load', function () {
		setSize();
	});
	$(window).resize(function () {
		setSize();
	});
	
	function setSize() {
		var window_w = $( window ).width();
		var window_h = $( window ).height();
		var left_w = $(".con_left").width();
		var right_w = $(".con_right").width();
		
		$(".con_left").height(window_h+"px");
		$(".nav").height(window_h-60+"px");
		
		$("#container").width(window_w+"px");
		$("#container").height(window_h+"px");
		$(".con_center").width(window_w-left_w-right_w+"px");
		$(".con_center").height(window_h+"px");
		
		$(".con_right").height(window_h+"px");
		$(".right_tab").height(window_h+"px");
		
		$(".slide1").css({'top': (window_h/2)+60+"px"});
	}
})(jQuery);