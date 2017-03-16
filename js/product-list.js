$(function() {
				
				$('.type-info').each(function(Index,Element){
					$('.type-info').click(function(){
					$(Element).css('color' , '#333');
$(this).css('color' , '#0cd084');	
						
					})

				})
				
				
				
				var selBool = true;
				
//				点击门票和排序展开列表的方法
				function show(sort , sortContent){
					$(sort).click(function(){
					$(this).siblings().find('.type-img').attr("src", "../images/select-ico2.png");
					if(selBool){
						$(this).find('.type-img').attr("src" , "../images/selected-ico1.png")
						$(sortContent).parent().parent().css("visibility" , "visible");
//$(sortContent).parent().parent().slideDown();
						$('.pl-content').css('background', 'rgba(0 , 0 , 0 , 0.5)');
						selBool=false;
					}else{
						$(this).find('.type-img').attr("src", "../images/select-ico1.png");
						$(this).css('color','#333');
						$(sortContent).parent().parent().css("visibility" , "hidden");
//$(sortContent).parent().parent().slideUp();
						$('.pl-content').css('background', 'rgba(0 , 0 , 0 , 0)');
						$('.sel-show').css("visibility" , "hidden");
							selBool = true;
					}
				})

				$(sortContent).click(function(){
					$(sortContent).css('color', '#333');
									$(this).css('color', '#0cd084');
									$(sortContent).parent().parent().find("img").css("visibility", "hidden");
									$(this).parent().find("img").css("visibility", "visible")
				})
				}
				show('.type1' , '.ticket li var');
				show('.type3' , '.rank li var');
//				点击目的地的方法
			$('.type2').click(function(){
				$(this).siblings().find('.type-img').attr("src", "../images/select-ico2.png");
				if(selBool){
				$(this).find('.type-img').attr("src" , "../images/selected-ico1.png")
						$('.destination').css("visibility" , "visible");
						$('.pl-content').css('background', 'rgba(0 , 0 , 0 , 0.5)');
						selBool=false;	
				}else{
					$(this).find('.type-img').attr("src", "../images/select-ico1.png");
					$('.bulk').css('visibility','hidden');
					$(this).css('color','#333');
						$('.destination').css("visibility" , "hidden");
						$('.pl-content').css('background', 'rgba(0 , 0 , 0 , 0)');
						$('.sel-show').css("visibility" , "hidden");
							selBool = true;
				}
				
			})
			
			$('.city-wp li').each(function(Index , Element){
				$(Element).click(function(){
					console.log(Index+1);
					$('.bulk').css('visibility','hidden');
					$(this).find('span').css('visibility','visible');

					$('.city-wp li').css({"color":"#333" , "background-color":"#ebebeb"});
					$(this).css({"color":"#0cd084" , "background-color":"#fdfdfd"});
					$('.city-list').css('display' , 'none');
					$('.destination ul').eq(Index+2).css('display','block');
				})
			})
			$('.city-list li var').click(function(){
				$('.city-list li var').css('color', '#333');
									$(this).css('color', '#0cd084');
									$(this).parent().find("img").css("visibility", "hidden");
									$(this).parent().find("img").css("visibility", "visible")
									$('.city-list li').removeClass('sel-spots');
									$(this).parent().addClass('sel-spots');
			})
			
//获取目的地相关ul的高度
				var cityH = $('.city-list').height();
				$('.city-wp').css('height', cityH);
				$('.kong').css('height', cityH);

			})