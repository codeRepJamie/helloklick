(function(){
	var docelem = document.documentElement;

	baidu.offset = function(elem) {
        var top = left = 0;

        while (elem != null) {
            left += elem.offsetLeft;
            top += elem.offsetTop;
            elem = elem.offsetParent;
        };
        return { top: top, left: left };
    }
    function now(){
    	return (new Date()).getTime();
    }
    function tween(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b
    }

    function S(obj, endTop, opt) {
        var j = k = 0, fn = opt && opt.finish;

        var s = now(), d = opt && opt.step || 500,
			b = parseFloat(obj.scrollTop),
			c = parseFloat(endTop) - b;
        (function () {

            var t = now() - s;
            if (t > d) {
                t = d;
                obj.scrollTop = tween(t, b, c, d);
                ++k === ++j && fn && fn.apply(obj);
                return true;
            }
            obj.scrollTop = tween(t, b, c, d);
            setTimeout(arguments.callee, 10);
        })();
    }


	baidu.ToScroll = function(index){
		index > 2 && (index = 2);
		index < 0 && (index = 0);
		var elem = baidu.dom.q('rows')[index];
		baidu.oFlag = true;
		baidu.oIndex = index;
		var px = elem ? baidu.offset(elem).top : document.body.offsetHeight;
		S(baidu.ie || baidu.firefox ? docelem : document.body, px < 70 ? 0 : px, {
		 	'finish' : function(){
			 	baidu.oFlag = false;
				//console.log(baidu.oFlag)
			 }
		});
		
	};

	baidu.MenuMidden = function(obj){
		var doc = baidu.ie || baidu.firefox ? document.documentElement : document.body;
		var ch = document.documentElement.clientHeight,
			oh = obj.offsetHeight, top = (ch - oh) / 2;

		var sTop = baidu.ie === 6 ? doc.scrollTop : 0;
		//baidu.oIndex === -1 && sTop + top < 40 && (top = 40);
		obj.style.top = sTop + (top < 0 ? 0 : top) + 'px';
	};

	baidu.scrollFunc = function (e){
		e = e || window.event;
		T.event.preventDefault(e);
		if (baidu.oFlag)
			return;
		//console.log('a');
		var val = e.wheelDelta || e.detail;
		var flag = /-/.test(val);
		T.browser.firefox && (flag = !flag);
		if ( flag ) {		// 向下;
			baidu.ToScroll(baidu.oIndex + 1);
			//console.log(baidu.oIndex + 1);
		} else {
			baidu.ToScroll(baidu.oIndex - 1);
		}
	};

	baidu.AutoScroll = (function(){
		var inter;
		return function(timer){
			undefined === timer && (timer = 5);
			
			clearTimeout(inter);
			inter = setTimeout(function(){

				baidu.ToScroll(baidu.oIndex + 1);

			}, timer * 1000);

			return {
				'clear' : function(){
					clearTimeout(inter);
				}
			};
		}
	})();
})();
aAnimateJson=[
	{
		text:[800,0],
		img:[1000,1000]
	},
	{
		img:[800,0],
		title:[1000,200]
	}
]
baidu.dom.ready(function(){
	var doc = baidu.ie || baidu.firefox ? document.documentElement : document.body;
	baidu.oIndex = 0;

	// right float menu
	var menu  = baidu.dom.q('menu')[0],
		arr   = menu.getElementsByTagName('li'),
		rows  = baidu.dom.q('rows');

	var curElem = arr[0];
	function MenuHoverFn(elem, flag, index){
		//console.log(index);
		baidu.dom.removeClass(curElem, 'selected');
		baidu.dom.addClass(elem, 'selected');
		curElem._hFlag_ = false;
		curElem		    = elem;
		elem._hFlag_    = true;
		flag && baidu.ToScroll(index);
		fnAnimate(index);
	}

	// 以下条件清除滚动 : 用户在点击右侧导航，或滚动鼠标时;
	//var scrollEve = baidu.AutoScroll(5);

	baidu.each(arr, function(index,v){
		baidu(v).on('click', function(){
			MenuHoverFn(this, true, index);
		});
		baidu(v).on('mouseover', function(){
			baidu.dom.addClass(this, 'selected');
		});
		baidu(v).on('mouseout', function(){
			if ( this._hFlag_ ) return;
			baidu.dom.removeClass(this, 'selected');
		});
	});

	baidu.ie === 6 && baidu.dom.setStyle(menu, 'position', 'absolute');

	var sc_flag;
	function ScrollFn() {
		//console.log('a');
		clearTimeout(sc_flag);
		sc_flag = setTimeout(function(){

			baidu.MenuMidden(menu);
			var sTop = doc.scrollTop;
			if ( sTop !== 0 ) {
				baidu.each(rows, function(i,v){
					var top = baidu.offset(v).top,
						height = parseInt(baidu.dom.getStyle(v, 'height'));
					if (top <= sTop && top + height > sTop) {
						//baidu.oIndex = i - 1;//old
						baidu.oIndex = i;
						return false;
					}
				});
			}
			//baidu.oIndex !== 1 && scrollEve.clear();
			//console.log(baidu.oIndex == 0 && alert('ok'))
			var elem = arr[ baidu.oIndex ];
			if ( !elem ) {
				curElem._hFlag_ = false;
				baidu.dom.removeClass(curElem, 'selected');
				return;
			}
			MenuHoverFn(elem, false, baidu.oIndex);
		}, 100);
	}
	baidu.event.on(window, 'scroll', ScrollFn);

	setTimeout(ScrollFn, 500);


	if (document.addEventListener) {
	    document.addEventListener('DOMMouseScroll',baidu.scrollFunc,false); 
	}
	window.onmousewheel = document.onmousewheel = baidu.scrollFunc;

	(window.onresize = function(){
		// 跟随客户端高度;
		var height = document.documentElement.clientHeight;
		if ( height < 600 ) height = 600;
		for(var i = 0;i < rows.length;i++) {
			i === 2 && (height = baidu('.footer').outerHeight(true)-60);
			rows[i].style.height = height + 'px';
		}
		baidu.MenuMidden(menu);
	})();
	menu.style.display = "block";
	baidu.MenuMidden(menu);
	
	function fnAnimate(e){
		var aJson=aAnimateJson[e];
		var oBox=baidu('.rows').eq(e);
		//oBox.remove();
		for(var i in aJson){
			//console.log(aJson[i]['animateObject']);
			if(aJson[i]['isBind']){
				baidu('#'+i.toString()).on(aJson[i].bind,function(e){
					baidu('#'+aJson[i].target).stop(true,false).animate(aJson[i].animateObject,aJson[i].speed);
				});
			}else if(aJson[i]['animateObject']){
				
				oBox.find('.'+i.toString()+'_cont').delay(aJson[i].delay).animate(aJson[i].animateObject,aJson[i].speed);
			}else{
				//console.log(oBox.find('.'+i.toString()+'_cont'));
				oBox.find('.'+i.toString()+'_cont').delay(aJson[i][1]).animate({
					opacity:'+=1'
				},aJson[i][0]);
			}
		}
	}
	//fnAnimate(3);
});