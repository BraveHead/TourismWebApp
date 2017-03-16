/*!
 * extend jQuery by ZhangYunling v1.0.1
 * 
 * extend some method we used often
 *  
 * Date: 2014-11-30
 */
 
var extendjQ = (function( $ ) {
	
	var loadingImg = "http://www.zhangyunling.com/images/loading.gif";
	
	$.extend({
		//判断目标对象obj是否为jQuery对象
		isjQuery:function(obj){
			return obj instanceof jQuery;
		},
		
		//很多时候，当我们点击回车时，会触发其他的一些事件。
		enterTrigger:function(options){
			/*
			  * obj 目标元素
			  * src obj元素按下enter时，触发src中的type类型的事件
			  * type src元素将被触发的事件类型
			  * needCtrl 是否需要按下ctrl，默认为false，
			  * needAlt 是否需要按下alt键，默认为false，
			  * needShift 是否需要按下shift键，默认为false
			  * 上述三个，当委托ture时，表示ctrl+enter等联合的时，才能触发
			*/
			if(!$.isjQuery(options.obj)){
				options.obj = $(options.obj);
			}
			if(!$.isjQuery(options.src)){
				options.src = $(options.src);
			}
			
			if(!options.obj.size() || !options.src.size()){
				return false;
			}

			options.type = options.type || "click";
			
			options.needCtrl = options.needCtrl || false;
			options.needAlt = options.needAlt || false;
			options.needShift = options.needShift || false;
			options.obj.on("keydown",function(e){
				e = e || window.event;
				var code = e.which || e.keyCode,
					flag = code == 13,
					altKey = false,
					ctrlKey = false,
					shiftKey = false;
					
				if(flag){
					//这个时候，判断是否需要altKey键
					altKey = e.altKey;
					flag = options.needAlt?altKey:!altKey;
				}
				
				if(flag){
					//这个时候，判断是否需要ctrlKey键
					ctrlKey = e.ctrlKey;
					flag = options.needCtrl?ctrlKey:!ctrlKey;
				}
				
				if(flag){
					//这个时候，判断是否需要shiftKey键
					shiftKey = e.shiftKey;
					flag = options.needShift?shiftKey:!shiftKey;
				}

				if(flag){
					options.src.trigger(options.type);
				}
			});
			
			return this;
		},
		
		scrollIntoView:function(obj){
			var src = obj;
			if(!$.isjQuery(obj)){
				src = $(src);
			}
			if(!src.size()){
				return false;
			}
			
			var parent = src.parent(),
				height = parent.height(),
				srcTop = src.position().top,
				srcHeight = src.outerHeight(),
				scrollTop = parent.scrollTop();
			
			parent.scrollTop(scrollTop + srcTop - height + srcHeight);
			
			return this;
		},
		
		ellipsis:function(obj,options){
			new Ellipsis(obj,options);
		}
		
	});
	
	$.fn.extend({
		
		enterTrigger:function(options){
			var obj = options;
			obj.obj = $(this);
			return $.enterTrigger(obj);
		},
		
		scrollIntoView:function(){
			$.scrollIntoView($(this));
		},
		
		ellipsis:function(options){
			$.ellipsis($(this),options);
			return this;
		}
		
	});
	
	function selectBox(options){
		/**
			options内容的属性包括如下方法
			obj，必须，绑定该方法的input框对象，可以使jQuery对象和id
				最好不是class，因为会多个出现问题
				obj对象上，要有一个data-name属性，用于创建隐藏的input的名称
			hiddenInput，隐藏的input对象
			
			src，目标的元素框，如果有，则定位该框，如果没有，则生成该框
			    最好是确定的jQuery对象，或者是以id为目标的元素
			type，支持两个属性，ajax属性，或者为空，默认为空
				当值为ajax时，可以先加载一个空的loadding画面
			url，字符串（固定），如果是ajax的话，需要提供url，并且返回的数据必须为指定格式，格式定为：[{name:"",value:""},{name:"",value:""}];
			dataFn，在ajax提交时，可能是有额外数据的，所以通过dataFn的回调处理数据，如果没有该方法
				
			data，保存初始化时数据，用于非ajax的下拉框数据的初始化，下拉框的数据，是一个数组
				[{name:"name1",value:"value1"},{name:"name2",value:"value2"}]
			parentClass,容器框的class名称，
			childClass,内部元素的class名称
			//上述的两个class的名称，是在需要创建容器时，使用
			//如果没有这两个元素，则按照默认的样式显示
			width,设置容器的宽度，如果是单纯的数字，则按照该倍数显示
				默认值为1，表示，按照input输入框的宽度显示
				px，其他只支持以像素为单位的宽度设置
		*/
		
		if(!(this instanceof selectBox)){
			return new selectBox(options);
		}
		
		this.options = options;

		var obj = options.obj,
			src = options.src || "";
			
		obj = $.isjQuery(obj)?obj:$(obj);
		
		if(!obj.size()){
			alert("使用selectBox方法时，对象中必须包含有效的obj属性！");
			return null;
		}
		obj = obj.eq(0);
		options.obj = obj;
		
		if(obj.prop("data-selectBox") == "true"){
			//表示该方法已经添加过这个属性了，则退出
			return null;
		}
		
		obj.attr("autocomplete","off");
		obj.prop("data-selectBox","true");
		
		//支持把url写在obj的data-url上
		options.url = options.url || obj.attr("data-url") || "";
		
		if(options.type == "ajax" && !options.url){
			alert("当您使用ajax获取数据时，必须包含url地址，请确认！");
			return null;
		}
		
		this.initOptions();
		if(!src){
			src = this.createBox();
		}else if(src && !(src = $.isjQuery(src)?src:$(src)).size()){
			//如果src本就存在，则不创建新的src对象，如果不存在，则新建，并且放在obj的后面
			alert("您输入的src无法找到对应的目标元素，请确认！");
			return null;
		}
		src = src.eq(0);
		options.src = src;
		
		if(!src.find("li:not('.loadding')").size()){
			src.html(this.getBoxHtml(options.data));
		}
		
		hiddenInput = options.hiddenInput || "";
		if(!hiddenInput){
			hiddenInput = this.initHiddenInput();
		}else if(hiddenInput && !(hiddenInput = $.isjQuery(hiddenInput)?hiddenInput:$(hiddenInput)).size()){
			//如果src本就存在，则不创建新的src对象，如果不存在，则新建，并且放在obj的后面
			alert("您输入的hiddenInput无法找到对应的目标元素，请确认！");
			return null;
		}
		options.hiddenInput = hiddenInput.eq(0);
		
		options.width = options.width || 1;
		options.cacheData = {};
		//cacheData用于缓存已经存在的数据，在ajax状态下有效
		
		this.initHiddenInputValue();
		this.initBoxPos();
		this.initEvent();
	}
	
	selectBox.prototype.initOptions = function(){
		var options = this.options;
		
		options.loading = "<li class = 'loadding' style = 'list-style:none;'><img src = 'http://www.zhangyunling.com/images/loading.gif' style = 'text-align:center;padding:5px 10px;'/></li>";
		
		options.noData = "<li class = 'loadding p5' style = 'list-style:none;'>暂无数据</li>";
		
		options.parentCssText = {"display":"none","position":"absolute","z-index":2,"list-style":"none","max-height":"200px","overflow-x":"hidden","overflow-y":"auto","margin-left":"0px","padding-left":"0px","text-align":"left","border":"1px solid #aaa"};
		
		options.childCssText = {"list-style":"none","padding":"4px","border-bottom":"1px solid #ccc","cursor":"pointer"};
		
		this.initOptions = null;
		//清理该方法，每次实例化时，只运行一次
	}
	
	selectBox.prototype.initHiddenInput = function(){
		var options = this.options,
			obj = options.obj,
			inputName = obj.attr("data-name") || (obj.attr("name") || "selectBox")+"Value",
			inputValue = obj.attr("data-value") || "",
			hiddenInput = $('<input type = "hidden" name = "'+inputName+'" value = "'+inputValue+'"/>');
			
			
		obj.after(hiddenInput);
		
		this.initHiddenInput = null;
		//清理该方法，每次实例化时，只运行一次
		
		return hiddenInput;
	};
	
	selectBox.prototype.initHiddenInputValue = function(){
		var options = this.options,
			obj = options.obj,
			src = options.src,
			hiddenInput = options.hiddenInput,
			text = src.find("li[data-value="+(hiddenInput.val() || "")+"]");
		
		if(text.length){
			obj.val(text.text());
		}
		
		this.initHiddenInputValue = null;
		//清理该方法，每次实例化时，只运行一次
	};
	
	selectBox.prototype.createBox = function(){
		var options = this.options,
			obj = options.obj,
			parentClass = options.parentClass || "",
			parentCssText = options.parentCssText,
			src = $('<ul></ul>');
		
		obj.after(src);
		
		if(parentClass){
			src.addClass(parentClass);
		}else{
			src.css(parentCssText);
		}
		
		this.createBox = null;
		//该方法，只能被调用一次。
		return src;
	};
	
	selectBox.prototype.getBoxHtml = function(data){
		var options = this.options,
			data = data || [],
			i=0,len = data.length,
			html = "",
			one = null,
			childClass = options.childClass || "",
			childCssText = options.childCssText;
		
		if(!len){
			html = options.noData;
		}else{
			for(;i<len;i++){
				one = data[i];
				html += "<li data-value = '"+one.value+"'>"+one.name+"</li>";
			}
		}
		
		html = $(html);
		
		if(childClass){
			html.addClass(childClass).filter(":last").css({"border":"none"});
		}else{
			html.css(childCssText).filter(":last").css({"border":"none"});
		}
		
		return html;
	}
	
	selectBox.prototype.ajaxGetHtml = function(objValue){
		var that = this,
			options = this.options,
			obj = options.obj,
			src = options.src,
			hiddenInput = options.hiddenInput,
			url = options.url || "",
			cacheData = options.cacheData,
			dataFn = options.dataFn || "",
			data = typeof dataFn == "function"?dataFn():dataFn;

		//如果获取ajax时，则把之前的hidden的值清空。
		hiddenInput.val("");
		
		if(objValue && (cacheData[objValue] instanceof Array)){
			src.html(that.getBoxHtml(cacheData[objValue]));
			
		}else{
			
			src.html(options.loading);
			
			if(objValue.indexOf("=") != -1){
				data = data == ""?objValue:objValue+"&"+data;
			}
			$.ajax({
				url:url,
				data:data,
				type:"get",
				dataType:"json",
				success:function(data){
					data = typeof data == "string"?$.parseJSON(data):data;
					var value = "";
					if(data instanceof Array){
						value = data;
					}else if(data instanceof Object){
						if(data.succ){
							value = data.value;
						}else{
							if(data.msg){
								alert(data.msg);
								return false;
							}
						}
					}
					if(value instanceof Array){
						src.html(that.getBoxHtml(value));
						cacheData[objValue] = value;
					}
				},
				error:function(){
					alert("由于网络错误，未能获取数据！");
				}
			});
		}
	};
	
	selectBox.prototype.initBoxPos = function(){
		var options = this.options,
			width = ""+options.width,
			obj = options.obj,
			src = options.src,
			position = obj.position();
		
		width = width.replace(/^\d+(\.\d*)?(px)?$/,function($1,$2,$3){
			if(!$3){
				return width*obj.outerWidth();
			}else{
				return width;
			}
		});
		
		src.css({
			"width":width,
			"left":position.left,
			"top":(position.top-1+obj.outerHeight())
		});
	};
	
	selectBox.prototype.initEvent = function(){
		var options = this.options,
			obj = options.obj,
			src = options.src,
			hiddenInput = options.hiddenInput,
			type = options.type || "",
			timer = null,
			timeSec = 300,
			that = this,
			inputType = "oninput" in obj[0]?"input":"keydown";
		
		this.initEvent = null;
		//清理该方法，每次实例化时，只运行一次
		
		function srcShow(){
			var childs = src.children("li");
			changeBg.removeBg(childs);
			src.show();
			childs.filter(".active").scrollIntoView();
		}
		
		function srcHide(){
			changeBg.removeBg(src.children("li"));
			src.hide();
		}
		
		function changeOptions(){
			var defaultValue = "&nbsp;",
				oldValue = obj.prop("data-oldValue") || defaultValue,
				newValue = $.trim(obj.val()),
				keyWords = "",
				justFirst = false,
				childs = src.children("li");
				
			if(oldValue == newValue){
				return "";
			}
			
			if(!newValue){
				childs.show();
				obj.prop("data-oldValue",defaultValue);
				obj.trigger("objempty");
				//留接口，obj可以添加objempty的监听事件
				//objempty的事件，在selectBoxMulti构造函数内部使用
				//千万不要给删掉了。
				hiddenInput.val("");
				return "";
			}
			
			obj.prop("data-oldValue",newValue);
			
			if(type == "ajax"){
				that.ajaxGetHtml($.trim(obj.val()));
				return false;
			}
			
			if(newValue.length == 1){
				justFirst = true;
			}
			
			keyWords = newValue.split(/\s+/g);
			childShow();
			
			function childShow(){
				childs.each(function(){
					var li = $(this),
						text = li.text(),
						i,len=keyWords.length,
						flag = 0;
						
					for(i=0;i<len;i++){
						if(text.indexOf(keyWords[i]) == -1){
							flag = 1;
							break;
						}
					}
					
					if(flag){
						li.hide();
					}else{
						li.show();
					}
				});
				var visChild = childs.filter(":visible");
				
				visChild.each(function(){
					var li = $(this),
						text = li.text(),
						i,len=keyWords.length,
						flag = 0;
						
					for(i=0;i<len;i++){
						if(justFirst && text.indexOf(keyWords[i]) != 0){
							flag = 1;
							break;
						}
					}
					
					if(flag){
						li.hide();
					}else{
						li.show();
					}
				});
				
				if(!childs.filter(":visible").size()){
					visChild.show();
				}
			}
		}
		
		var changeBg = {
			liBg:function(curLi,nextLi){
				this.removeBg(curLi);
				this.addBg(nextLi);
				nextLi.scrollIntoView();
			},
			removeBg:function(curLi){
				curLi.filter(function(){
					return $(this).attr("data-value") != hiddenInput.val();
				}).removeClass("active").css("background-color","#fff");
			},
			addBg:function(nextLi){
				nextLi.addClass("active").css("background-color","#ddd");
			}
		};
		
		function choiceValue(li){
			var curLi = src.children("li").filter(".active");
			changeBg.liBg(curLi,li);
			obj.val(li.text());
			hiddenInput.val(li.attr("data-value") || "");
			srcHide();
		}
		
		obj.on("focus",function(){
			srcShow();
		});
		
		obj.on(inputType,function(){
			clearTimeout(timer);
			timer = setTimeout(changeOptions,timeSec);
		});
		
		obj.on("click",srcShow);
		
		obj.on("dblclick",function(){
			obj.select();
		});
		
		src.on("click","li:not('.loadding')",function(){
			choiceValue($(this));
		});
		
		src.on("mouseenter","li:not('.loadding')",function(){
			changeBg.addBg($(this));
		}).on("mouseleave","li:not('.loadding')",function(){
			changeBg.removeBg($(this));
		});
		
		obj.on("keydown",function(e){
			var c = e.keyCode || e.which,
				curLi = null,
				nextLi = null,
				showChild = null,
				childs = null;
				
			if(c == 40 || c == 38 || c== 13){
				childs = src.children("li");
				childs.removeClass(".active");
				showChild = childs.filter(":visible");
				curLi = showChild.filter(".active");
				curLi = curLi.length > 1?curLi.filter(function(){
					return $(this).attr("data-value") != hiddenInput.val();
				}):curLi;
			}	
			if(c == 40){
				//表示按下向下的按钮
				srcShow();

				nextLi = curLi.nextAll("li:visible:first");
				nextLi = nextLi.size()?nextLi:showChild.eq(0);
				changeBg.liBg(curLi,nextLi);
				return false;
			}else if(c == 38){
				//表示按下向上的按钮
				srcShow();
				nextLi = curLi.prevAll("li:visible:first");
				nextLi = nextLi.size()?nextLi:showChild.filter(":last");
				changeBg.liBg(curLi,nextLi);
				return false;
			}else if(c == 13){
				curLi.trigger("click");
				return false;
			}
		});
		
		$(document).on("click",function(e){
			var target = $(e.target);
			if(!target.closest(obj).size() && !target.closest(src).size()){
				srcHide();
			}
		});
		
	};
	
	function SelectBoxMulti(options,multiType){
		/*
			options为需要联动的下拉框的元素，
			arr:数组元素，内部为object对象，
				每个对象的支持属性，格式和selectBox的属性相同。
			还可以添加一些默认属性，格式与selectBox的格式相同
			如果arr数组中的对象，没有设置该处设置的属性，那么给其设置。
			width:如果在options中设置该属性，那么所有arr中，没有width的对象，都会继承该属性
		*/
		
		if(!(this instanceof SelectBoxMulti)){
			return new SelectBoxMulti(options,multiType);
		}
		
		if(typeof options != "object"){
			return null;
			//options必须为一个对象
		}
		
		var arr = null;
		
		//是多级联动，还是单级联动
		//true时，表示后面所有的都会ajax的请求
		this.multiType = multiType == true?true:false;
		
		if(options instanceof Array){
			arr = options;
			this.options = {};
		}else{
			arr = options.arr || [];
			this.options = options;
		}
		
		this.initUrl(arr);
		//使用jQuery的部分
		this.getjQueryArr(options,arr);
		
		
		if(arr.length > 1){
			//只给第一个有初始化数据
			var data = options.data || [];
			arr[0].data = data;
			delete options.data;
		}
		
		var multis = this.initMultis(arr);
		
		if(multis.length > 1){
			this.initEvent(multis);
		}
	}
	
	SelectBoxMulti.prototype.initUrl = function(arr){
		if(arr instanceof Array){
			var i=0,len = arr.length,obj = null,
				url = "";
			for(i=0;i<len;i++){
				obj = arr[i];
				url = $.isjQuery(obj.obj)?(obj.obj.attr("data-url") || ""):"";
				if(url){
					obj.url = url;
				}
			}
		}
		this.initUrl = null;
	};
	
	SelectBoxMulti.prototype.getjQueryArr = function(options,arr){
		var obj = options.obj || "",
			src = options.src || "",
			hiddenInput = options.hiddenInput || "",
			data = options.data || [],
			objLen = 0,
			srcLen = 0,
			inputLen = 0,
			i=0,
			one = null,
			url = "";
		
		delete options.obj;
		delete options.src;
		delete options.hiddenInput;
		delete options.arr;
		//删除这些数据，以防影响selectBox实例化时，obj继承默认的width属性的情况
		
		this.getjQueryArr = null;
		//每个实例中，只能使用一次getjQueryArr方法
		//delete this.getjQueryArr;
		
		if(!obj){
			return null;
		}
		
		obj = $.isjQuery(obj)?obj:$(obj);
		
		src = $.isjQuery(src)?src:$(src);
		hiddenInput = $.isjQuery(hiddenInput)?hiddenInput:$(hiddenInput);
		
		objLen = obj.size();
		srcLen = src.size();
		inputLen = hiddenInput.size();
		
		if(objLen >= srcLen && objLen >= inputLen){
			for(i=0;i<objLen;i++){
				one = obj.eq(i);
				url = one.attr("data-url") || "";
				oneObj = {
					obj:one
				};
				if(i<srcLen){
					oneObj.src = src.eq(i);
				}
				if(i<inputLen){
					oneObj.hiddenInput = hiddenInput.eq(i);
				}
				
				arr.push(oneObj);
			}
		}
	};
	
	SelectBoxMulti.prototype.initMultis = function(arr){
		/*if(!(arr instanceof Array)){
			return [];
			//arr必须为数组
		}*/
		
		this.initMultis = null;
		//每个实例中，只能使用一次initMultis方法
		//delete this.initMultis;
		
		var options = this.options,
			i,len=arr.length,res = [],
			item = null,
			selectOption = null;
		
		for(i=0;i<len;i++){
			item = $.extend({},options,arr[i]);
			//继承一些默认的属性
			if(item.obj.prop("data-selectBox") != "true"){
				//表示该方法，还没有添加过，则添加，否则不进行添加
				
				item = new selectBox(item);
				//selectBox实例化
				selectOption = item.options;
				item.obj = selectOption.obj;
				item.hiddenInput = selectOption.hiddenInput;
				item.src = selectOption.src;
				//给每一个item添加一些默认的属性
				res.push(item);
			}
		}
		
		return res;
	};
	
	SelectBoxMulti.prototype.initEvent = function(arr){
		/*if(!(arr instanceof Array)){
			return null;
			//arr必须为数组
		}*/
		this.initEvent = null;
		//每个实例中，只能使用一次initEvent方法
		//delete this.initEvent;
		
		var i = 0,
			len = arr.length-1;
			//因为最后一个联动框，不需要添加这个方法的。
		
		for(i=0;i<len;i++){
			this.lineEventInit(arr,i);
		}
		
	}
	
	SelectBoxMulti.prototype.lineEventInit = function(arr,index){
		
		if(!(arr instanceof Array)){
			return null;
			//arr必须为数组
		}
		
		var item = arr[index],
			src = item.src,
			multiType = this.multiType;
			
		if(!src.size()){
			return false;
		}
		
		item.obj.on("objempty",function(){
			//当前面的input清空时，后面所有联动的数据清除
			var i = index+1,
				len = arr.length,
				item = null;
				
			for(i;i<len;i++){
				//清空后续的联动框的数据
				item = arr[i];
				item.obj.val("");
				item.src.html(item.options.noData);
				item.hiddenInput.val("");
			}
		});
		
		src.on("click","li:not('.loadding')",function(){
			
			var i = 0,
				len = arr.length,
				item = null,
				reqObj = null;
				reqData = [],
				next = 0;
				
			if((index - len >= 0) || (index - 0 < 0 )){
				//如果位置出错，则不做处理
				return "";
			}
			
			for(i=0;i<=index;i++){
				item = arr[i];
				reqObj = item.hiddenInput;
				if(reqObj.size()){
					reqData.push(reqObj.attr("name")+"="+reqObj.val());
				}
			}
			//获取之前的所有的数据之和
			reqData = reqData.join("&");
			next = multiType?len:i;
			for(i;i<len;i++){
				item = arr[i];
				item.obj.val("");
				item.src.html(item.options.loading);
				item.hiddenInput.val("");
				if(multiType || next == i){
					item.ajaxGetHtml(reqData);
				}
			}
		});
	}
	
	function Ellipsis(obj,options){
		//这个方法，是基于jQuery在写的，所以obj要求是jQuery对象
		/*
			options内部支持三个属性。
			word://显示文字的个数，如果有值，按该值处理，默认为0
			line://显示的行数，如果word为0时，按该值处理，默认为1
			more:'<a href = "#" data-show = "展开↓" data-hide = "收起↑">展开↓</a>'
			//more按钮的样式，
			//为空，则不添加该按钮
			//如果不输入该值，则按照默认添加
			//如果href有值，则为一个超链接，无值则为一个当前展开关闭的JS操作
			//data-show的值，在省略号时显示，data-hide为，全部显示时显示。
		*/
		if(!$.isjQuery(obj) && !(obj = $(obj)).size()){
			//如果obj不是jQuery对象，
			//那么把obj变成jQuery对象
			//并检测该对象在是否有效
			//如果无效，同样结束执行
			alert("输入的目标对象不正确！");
			return null;
		}
		
		if(obj.size() > 1){
			obj.each(function(){
				return new Ellipsis($(this),options);
			});
			return null;
		}
		
		if(!(this instanceof Ellipsis)){
			return new Ellipsis(obj,options);
		}
		
		if(obj.prop("data-ellipsize") == "yes"){
			//防止重复添加。
			return null;
		}
		obj.prop("data-ellipsize","yes");
		
		var defaultTxt = "",
			childEle = obj.children().size();
			
		if((defaultTxt = obj.html()) == ""){
		//|| childEle || (!childEle && obj.contents().size() != 1)
			//判断一些不支持的条件，
			//比如如果包含其他Element元素
			//text文本为空
			//包含不止一个text文本节点
			//这几种情况，比较复杂，所以不做处理
			alert("您绑定该方法的元素，内部包含的节点不正确，请正确使用！");
			return null;
		}
		
		options = options || {};
		options.obj = obj;
		this.initOptions(options);
		//初始化一些默认的信息
		
		//初始化一些需要使用的容器
		this.initHTML();
		
		//进行一点点的分词，以确保英文和数组的完整显示。
		this.getWords(defaultTxt);
		
		//createElli，进行计算，并显示省略号
		this.createElli();
		
	}

	Ellipsis.prototype.initOptions = function(option){
		this.options = $.extend({
			word:0,
			//显示文字的个数，如果有值，按该值处理
			line:1,
			//显示的行数，如果word为0时，按该值处理
			more:'<a href = "#" data-show = "展开↓" data-hide = "收起↑">展开↓</a>'
			//more按钮的样式，
			//为空，则不添加该按钮
			//如果不输入该值，则按照默认添加
			//如果href有值，则为一个超链接，无值则为一个当前展开关闭的JS操作
			//data-show的值，在省略号时显示，data-hide为，全部显示时显示。
		},option);
	};

	Ellipsis.prototype.initHTML = function(){
		var options = this.options;
		
		//初始化more按钮
		if(options.more){
			options.more = $(options.more);
		}
		
		//初始化省略号样式
		options.ellipsis = $('<span>...</span>');
		
		//隐藏的文字，被一个span包含，所以初始化一个span，存放
		options.hideWord = $('<span style = "display:none;"></span>');
		
	};

	Ellipsis.prototype.getWords = function(html){
		//txt为默认的值
		var regEle = /\<([a-zA-Z]+)[^\1]*?\<\/\1\>/g,
			reg = /(É|[\d\.a-zA-Z\_\-]+|[^\d\.a-zA-Z\_\-]{1})/g,
			regLt = /\</g,
			html = $.trim(html),
			eles = [],
			words = [];

		html = html.replace(regEle,function($1,$2){
			eles.push($1);
			return "É";
		});
		
		html.replace(regLt,"&lt;").replace(reg,function($1){
			if($1 == "É"){
				$1 = eles.shift();
			}
			words.push($1);
		});
		this.options.wordArr = words;
	};

	Ellipsis.prototype.createElli = function(){
		
		var options = this.options,
			word = options.word,
			line = options.line,
			words = options.wordArr;

		if(word < 0 && line<=0){
			return false;
		}
		
		if(word){
			this.basicWord();
		}else{
			this.basicLine();
		}
		
		if(options.more){
			this.initEvent();
		}
	};

	Ellipsis.prototype.basicWord = function(){
		
		var options = this.options,
			obj = options.obj,
			more = options.more,
			ellipsis = options.ellipsis,
			hideWord = options.hideWord,
			word = options.word,
			words = options.wordArr;
		
		if(word < words.length){	
			obj.html(words.splice(0,word).join(""));
			obj.append(ellipsis,hideWord.html(words.join("")),more);
		}
	};

	Ellipsis.prototype.basicLine = function(){
		
		var options = this.options,
			obj = options.obj,
			more = options.more,
			ellipsis = options.ellipsis,
			hideWord = options.hideWord,
			line = options.line,
			words = options.wordArr,
			defHeight = obj.height(),
			height = 0,
			basicHeight = 0,
			curNum = 2;
			
		height = Math.ceil(obj.html(words.slice(0,curNum).join("")).height());
		
		if(defHeight <= height*line){
			obj.html(words.join(""));
			return false;
		}
		
		basicHeight = height*2;
		
		while( obj.height() < basicHeight){
			curNum += 3;
			changeTxt(curNum);
		}
		curNum = curNum*line;
		basicHeight = height*(line+1);
		changeTxt(curNum);
		
		if(obj.height() < basicHeight){
			while( obj.height() < basicHeight){
				curNum += 2;
				changeTxt(curNum);
			}
			obj.html(words.splice(0,curNum-2).join(""));
		}else{
			while( obj.height() >= basicHeight){
				curNum -= 2;
				changeTxt(curNum);
			}
			obj.html(words.splice(0,curNum).join(""));
		}
		
		function changeTxt(num){
			obj.html(words.slice(0,num).join(""));
			obj.append(ellipsis,more);
		}
		
		obj.append(ellipsis,hideWord.html(words.join("")),more);
	};

	Ellipsis.prototype.initEvent = function(){
		var options = this.options,
			more = options.more,
			ellipsis = options.ellipsis,
			hideWord = options.hideWord,
			href = $.trim(more.attr("href")),
			showName = more.attr("data-show") || "",
			hideName = more.attr("data-hide") || "";
		
		if(href && href != "#"){
			//如果href是有效的，则按照定义的处理
			//如果为空，或者为"#"，则按照展示，隐藏处理
			return false;
		}
		
		more.on("click",function(){
			var isShow = hideWord.is(":visible");
			if(isShow){
				hideWord.hide();
				showName && more.text(showName);
				ellipsis.show();
			}else{
				hideWord.show();
				hideName && more.text(hideName);
				ellipsis.hide();
			}
			return false;
		});
	}

	return {
		selectBox:selectBox,
		SelectBoxMulti:SelectBoxMulti,
		Ellipsis:Ellipsis
	}
	
})(jQuery);