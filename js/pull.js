$(function() {

	//				点击目的地的方法

	$('.city-wp li').each(function(Index, Element) {
		$(Element).click(function(e) {
			e.stopPropagation();
			$('.bulk').css('visibility', 'hidden');
			$(this).find('span').css('visibility', 'visible');

			$('.city-wp li').css({
				"color": "#333",
				"background-color": "#ebebeb"
			});
			$(this).css({
				"color": "#0cd084",
				"background-color": "#fdfdfd"
			});
			$('.city-list').css('display', 'none');
			$('.destination ul').eq(Index + 2).css('display', 'block');
		})
	})
	$('.city-list li').click(function(e) {
			e.stopPropagation();
			$('.city-list li').removeClass('sel-spots');
			$(this).addClass('sel-spots');
			$('.st-alert').slideUp();
			$('.tripe-style-wp').eq(0).find('img').attr('src', '../images/select-ico1.png');
			downBool = false;
		})
		//		点击筛选排序方法
	var downBool = false;
	var index;
	$('.tripe-style-wp').click(function() {
		index = $(this).index();
		if(downBool == false) {
			//			$('.tripe-style-wp').find('img').attr('src', '../images/select-ico2.png');
			//			$('.tripe-style-wp').css('color', 'rgb(51,51,51)');
			$(this).find('img').attr('src', '../images/selected-ico1.png');
			$(this).css('color', '#0cd084');
			$('.st-alert').eq(index).slideDown();
			var cityH = $('.city-list').height();
			$('.city-wp').css('height', cityH);
			$('.kong').css('height', cityH);
			$('body').css({
				'overflow': 'hidden',
				'height': '100%'
			});
			downBool = true;
		} else {

			$('.st-alert').slideUp();
			$(this).find('img').attr('src', '../images/select-ico2.png');
			$(this).css('color', 'rgb(51,51,51)');
			$('body').removeAttr('style');
			downBool = false;
		}

	});
	$('.trip-style li').click(function(e) {
		e.stopPropagation();
		$('.trip-style li').removeClass('sel-style');
		$(this).addClass('sel-style');
		$('.st-alert').slideUp();
		$('.tripe-style-wp').eq(index).find('img').attr('src', '../images/select-ico1.png');
		//				$('.st-alert').slideUp(500, function() {
		//				$('.tripe-style-wp').css('color', 'rgb(51,51,51)');
		//					$('.tripe-style-wp').find('img').attr('src', '../images/select-ico2.png');
		//			});

		$('body').removeAttr('style');
		downBool = false;
	});
	$('.st-alert').click(function() {
		$(this).slideUp();
		$('.tripe-style-wp').eq(index).css('color', 'rgb(51,51,51)');
		$('.tripe-style-wp').eq(index).find('img').attr('src', '../images/select-ico2.png');
		downBool = false;
	})

	//			窗口大于640时,弹框展示样式调整
	var screenW = $(window).width();
	var alertW = $('.st-alert').outerWidth(true);
	var alertL = (screenW - alertW) / 2;
	console.log(screenW + "||" + alertW + "||" + alertL);
	if(screenW > 640) {
		//						$('.st-alert').css("margin-left",alertL);
		//						$('.media-content').css("margin-left",alertL);
		//						$('.st-content').css("margin-left",alertL);
	}

})