$(function(){
		//	返回顶部
	$(window).scroll(function() {
		if($(window).scrollTop() >= 2 * $(window).height()) {
			$('.top-back').css('display', 'block')
		} else {
			$('.top-back').css('display', 'none');
		}
	})
	$(".top-back img").on("click", function() {
		$("html,body").animate({
			scrollTop: 0
		}, 300, "linear");
	});
})
