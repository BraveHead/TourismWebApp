$(function(){
	//返回顶部
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
	//点击搜索框跳转至搜索页面
	$('.pl-search').click(function() {
		
		var windowW = $(window).width();
		var searchR = (windowW - $('.search-page').outerWidth(true)) / 2;
		$('.search-page').animate({
			right: searchR
		}, "fast");
		$('.guiding').hide();
		$('.search-keyword')[0].focus();
		setTimeout(function() {
			try {
				$('.search-keyword')[0].focus();
			} catch(e) {}
		}, 200);
		$('.search-back').click(function() {
			$('.search-page').animate({
				right: "-100%"
			}, "fast");

			$('.guiding').show();
		})
	})
	//点击回收按钮删除搜索记录
			var deleteShowBool = false;
			$('.history h2').find('img').click(function() {
				if(deleteShowBool == false) {
					$('.delete').fadeIn();
					$('.delete').css('display', 'inline-block');
					deleteShowBool = true;
				} else {
					$('.delete').fadeOut();
					deleteShowBool = false;
				}

			})
	//移除某个搜索历史记录
			$('.history-info a').click(function() {
				if(deleteShowBool) {
					$(this).attr('href', 'javascript:;');
					$(this).remove();
				} else {
					window.location.href = "$(this).attr('href')";
				}

			})
	
	
	
});


	