/**

by wushufen
2014.11.25
wusfun@foxmail.com

bug: 
	2014.12.10 部分安android机刮不了，回调却是正常的

wu.guagua({
	el: document.getElementById('guaguaCt'),
	cover: 'img.png',
	callback: function(pc){
		document.title = pc;
		if (pc > 40) {
			document.body.style.background = 'green'
		}
	}
});
*/
+function(wu){

	wu.guagua = function(options){
		var el = options.el,
			cover = options.cover,
			callback = options.callback;

		var width = el.clientWidth;
		var height = el.clientHeight;
		// console.log('width:'+width, 'height:'+height);

		// 创建画布
		var canvas = document.createElement('canvas');

		// 画布尺寸
		// canvas.style.width = width+'px';//不要使用这种宽度和高度，这样会使坐标不对应
		// canvas.style.height = height+'px';
		canvas.width = width;
		canvas.height = height;

		// 画布定位
		el.style.position = 'relative';
		canvas.style.position = 'absolute';
		canvas.style.left = '0';
		canvas.style.top = '0';
		// canvas.style.border = 'solid 1px #f00';
		el.appendChild(canvas);

		// 涂层
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#A3A3A3';
		ctx.beginPath();
		ctx.fillRect(0,0,width,height);
		ctx.closePath();

		// 图片涂层
		if (cover) {
			var coverImg = new Image;
			coverImg.src = cover;
			coverImg.onload = function(){
				ctx.beginPath();
				ctx.drawImage(coverImg,0,0);
				ctx.closePath();
			};
		};

		// 刮刮
		var gua = function(e){
			e.preventDefault();
			ctx.globalCompositeOperation = 'destination-out';//关键
			// ctx.fillRect(100,10,10,10);
			// console.log(e);

			if(e.changedTouches){
				// e=e.changedTouches[e.changedTouches.length-1];
				e = e.changedTouches[0];
			}
			var x = (e.clientX + document.body.scrollLeft || e.pageX) - el.offsetLeft || 0,
				y = (e.clientY + document.body.scrollTop || e.pageY) - el.offsetTop || 0;
			// console.log(x,y);

			ctx.beginPath();
			ctx.arc(x, y, 15, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();

			// 回调
			callback&&callback(getTransparentPercent());

			// 2014.12.11 bug fixed 部分微信浏览器刮了看不到效果，
			// 通过不断改canvas的css来促使浏览器更新渲染
			canvas.style.marginRight = (canvas.style.marginRight == '0px'? '1px': '0px');

		};

		// 透明百分比
		var getTransparentPercent = function() {
			var imgData = ctx.getImageData(0, 0, width, height),
				rgbaArr = imgData.data,
				transPixNum = 0;
			for (var i = 0; i < rgbaArr.length; i += 4) {
				var a = rgbaArr[i + 3];
				if (a < 128) {
					transPixNum++;
				}
			}
			return (transPixNum / (rgbaArr.length / 4) * 100).toFixed(2);
		};

		// 注册事件
		canvas.addEventListener('touchmove', gua);
		canvas.addEventListener('mousemove', gua);

		return {
			ctx: ctx
		};

	};

	window.wu = wu;
}(window.wu||{});