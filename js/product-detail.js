$(document).ready(function() {
	$('.ca-btn-group button').click(function() {
		$(this).parent().children().removeClass('checked-type');
		$(this).addClass('checked-type');

	})

	$('.dt-info-nav ul li').each(function(Index, Element) {
		$(Element).click(function() {
			var scrollDis = $('.element').eq(Index).offset().top - $('.dt-info-nav').outerHeight(true);
			$("html,body").animate({
				scrollTop: scrollDis
			}, 300);
			return false;
		})
	});
	//	var navTop = $('#dt-info-nav').offset().top;
	var navTop = null;
	$(window).scroll(function() {
		//导航条固定位置---start
		if(navTop == null) {
			navTop = $("#dt-info-nav").offset().top;
			console.log(navTop);
		}
		var distance = navTop - $(window).scrollTop();
		console.log(distance);
		var NAV_HEIGHT = $("#dt-info-nav").outerHeight(true);
		$(".blank").height(NAV_HEIGHT);
		if(distance <= 0) {
			//			$('.dt-info-nav').css('position', 'fixed');
			$('.dt-info-nav').addClass('navbar-fixed-top')
			$('.blank').css('display', 'block');
		} else {
			//			$('.dt-info-nav').removeAttr('style');
			$('.dt-info-nav').removeClass('navbar-fixed-top');
			$('.blank').css('display', 'none');
		}
		//    导航栏固定位置----end //

		//导航栏滑动到某一位置，给相应的楼层也就是item添加class
		var top = $(window).scrollTop() + 1; //页面卷去的高度
		$('.element').each(function(Index, Element) {
				var elementTop = $(Element).offset().top;
				var elementTopNext = $('body').height();
				var len = $('.element').length;
				if(Index < len-1) {
					elementTopNext = $('.element').eq(Index + 1).offset().top;
				}
				if(top > elementTop - $('.dt-info-nav').outerHeight(true) &&
					top < elementTopNext - $('.dt-info-nav').outerHeight(true)) {
					$('.element').removeClass('current');
					$(Element).addClass('current');
				}
			})
			//获取当前有class名的li
		var elementIndex = $('.element.current').index('.element');
		elementIndex = elementIndex == -1 ? 0 : elementIndex;
		$('.dt-info-nav ul li').removeClass('dt-line');
		$('.dt-info-nav ul li').eq(elementIndex).addClass('dt-line');

		//		导航栏左移（导航条类别大于5个）
		var w = $(".dt-info-nav ul li").width() + parseInt($(".dt-info-nav ul li").eq(0).css("margin-right"));
		var elementLengh = $('.element').length;
		if(elementLengh >= 5 && $('.dt-info-nav').css('position') == 'fixed') {
			var t = $('.dt-info-list5').offset().top;
			if($(window).scrollTop() + $('.dt-info-nav').outerHeight(true) + 1 >= t) {
				var li_index = $(".dt-line").index() > 3 ? ($(".dt-line").index() - 3) : 0;
				var sleft = w * li_index;
				$('.dt-info-nav ul').stop().animate({
					scrollLeft: sleft
				}, 300);
			} else if($(".dt-info-nav ul").scrollLeft() != 0) {
				$(".dt-info-nav ul").stop().animate({
					scrollLeft: 0
				}, 300);
				$(".dt-info-nav ul").scrollLeft(0);
			}
		}
	});
	//弹框
	$(function() {
			var headerH = $('.pd-header').height();

			function preventDefaultFn(event) {
				event.preventDefault();
			}
			//		咨询
			$('.footer1').click(function() {
				$('.my-modal-content').fadeIn(200, function() {
					$('.button-wp').animate({
						bottom: '0'
					}, "fast")
				});
				$('body').css('overflow', 'hidden');
				$('body').on('touchmove', preventDefaultFn);
			});
			$('.cancel-bth').click(function() {
				$('body').off('touchmove', preventDefaultFn);
				$('body').removeAttr('style');
				$('.my-modal-content').fadeOut(200, function() {
					$('.button-wp').animate({
						bottom: '-100%'
					}, "fast")
				});

			});
			//点击购买
			$('.dt-choice img').click(function() {
				$('.ca-top-modal').fadeIn(100);
				$('.ca-top').animate({
					bottom: '0'
				}, "slow");
				$('body').css('overflow', 'hidden');
				$('body').on('touchmove', preventDefaultFn);
			})
			$('.footer3').click(function() {
				$('.ca-top-modal').fadeIn(100);
				$('.ca-top').animate({
					bottom: '0'
				}, "slow");
				$('body').css('overflow', 'hidden');
				$('body').on('touchmove', preventDefaultFn);
			});
			$('.ca-close').click(function(e) {
				e.stopPropagation();
				$('.ca-top-modal').fadeOut(100);
				$('body').off('touchmove', preventDefaultFn);
				$('.ca-top').animate({
					bottom: '-100%'
				}, "slow");
				$('body').removeAttr('style');
			})
			$('.ca-top-modal').click(function() {
					$(this).fadeOut(100);
					$('body').off('touchmove', preventDefaultFn);
					$('.ca-top').animate({
						bottom: '-100%'
					}, "slow");
					$('body').removeAttr('style');
				})
				//		点击分享
			$('.uparrow-img').click(function() {
				$('.masking').css('top', headerH);
				$('.masking').fadeIn(100, function() {
					$('.share-mb').animate({
						bottom: headerH
					}, "fast")
				});
				$('body').css('overflow', 'hidden');
				$('body').on('touchmove', preventDefaultFn);
				$('.masking').click(function(){
					$(this).fadeOut(100,function(){
						$('body').off('touchmove' , preventDefaultFn);
					})
				})
			})

		})
		//	收藏
	$('.collect-img').click(function() {
		if($(this).attr("src") == "../images/shoucang.png" && $('.footer2 img').attr("src") == "../images/shoucang.png") {
			$(this).attr("src", "../images/collected1.png");
			$('.footer2 img').attr("src", "../images/collected2.png");
		} else if($(this).attr("src") == "../images/collected1.png" && $('.footer2 img').attr("src") == "../images/collected2.png") {
			$(this).attr("src", "../images/shoucang.png");
			$('.footer2 img').attr("src", "../images/shoucang.png");
		}
	})
	$('.footer2 img').click(function() {
		if($(this).attr("src") == "../images/shoucang.png" && $('.collect-img').attr("src") == "../images/shoucang.png") {
			$(this).attr("src", "../images/collected2.png");
			$('.collect-img').attr("src", "../images/collected1.png");
		} else if($(this).attr("src") == "../images/collected2.png" && $('.collect-img').attr("src") == "../images/collected1.png") {
			$(this).attr("src", "../images/shoucang.png");
			$('.collect-img').attr("src", "../images/shoucang.png");
		}
	})

})