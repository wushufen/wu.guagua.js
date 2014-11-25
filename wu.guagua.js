/**
wu.guagua({
	el: document.getElementById('guaguaCt'),
	callback: function(pc){
		document.title = pc;
		if (pc > 38) {
			document.body.style.background = 'green'
		}
	}
});
*/
+function(wu){

	wu.guagua = function(options){
		var el = options.el,
			callback = options.callback;

		var width = el.clientWidth;
		var height = el.clientHeight;
		// console.log('width:'+width, 'height:'+height);

		// 创建画布
		var canvas = document.createElement('canvas');
		// canvas.style.width = width+'px';//不要使用这种宽度和高度，这样会使坐标不对应
		// canvas.style.height = height+'px';
		canvas.width = width;
		canvas.height = height;

		// 画面定位
		el.style.position = 'relative';
		canvas.style.position = 'absolute';
		canvas.style.left = '0';
		canvas.style.top = '0';
		// canvas.style.border = 'solid 1px #f00';
		el.appendChild(canvas);

		// 涂层
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#888';
		ctx.fillRect(0,0,width,height);
		ctx.globalCompositeOperation = 'destination-out';//关键
		// ctx.fillRect(100,10,10,10);

		// 刮刮
		var gua = function(e){
			e.preventDefault();
			// console.log(e);

            if(e.changedTouches){
                e=e.changedTouches[e.changedTouches.length-1];
            }
            var x = (e.clientX + document.body.scrollLeft || e.pageX) - el.offsetLeft || 0,
                y = (e.clientY + document.body.scrollTop || e.pageY) - el.offsetTop || 0;
			// console.log(x,y);

            with(ctx) {
                arc(x, y, 15, 0, Math.PI * 2);
                fill();
            }

            // 回调
            callback(getTransparentPercent());
		}

		// 透明百分比
		var getTransparentPercent = function() {
		    var imgData = ctx.getImageData(0, 0, width, height),
		        pixles = imgData.data,
		        transPixs = [];
		    for (var i = 0, j = pixles.length; i < j; i += 4) {
		        var a = pixles[i + 3];
		        if (a < 128) {
		            transPixs.push(i);
		        }
		    }
		    return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
		}

		// 注册事件
		canvas.addEventListener('touchmove', gua);
		canvas.addEventListener('mousemove', gua);

	window.canvas = canvas;

	}

	window.wu = wu;
}(window.wu||{})