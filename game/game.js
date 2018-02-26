window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	}
})();

var imgs = [ {
		url: './huaji.jpg',
		img: null
	}
]

var musics = [
	{
		url: './op.mp3',
		audio: null
	}
]



var can = document.querySelector('#canvas'),
	ctx = can.getContext('2d'),
	_h = document.documentElement.clientHeight,
	_w = document.documentElement.clientWidth,
	w = _w * 2,
	h = _h * 2

can.style.height = _h + 'px'
can.style.width = _w + 'px'
can.height = _h * 2
can.width = _w * 2


// 状态
var $ = {
	loadTime: 1, //第一屏
	waitTime: 1, // 等待
	huaji: 0, // 等在载入完成
	start: 0, // 进行中
	over: 0, // 结束
	ratio: 1, // 难度等级
	speed: 500,
	moveX: _w / 2,
	moveY: h - 150,
	status: 1,
	flag: 1,
	score: 0 // 得分
}

// FPS
var fps = {
	size: 0,
	fps: 0,
	time: Date.now()
}

// 光点
var	spot = (function() {
	var can2 = document.createElement('canvas')
	var ctx2 = can2.getContext('2d')
	can2.width = 100
	can2.height = 100
	var x = 50,
		r = 20
	color = ctx2.createRadialGradient(x, x, 0, x, x, x)
	color.addColorStop(0.025, '#CCC')
	color.addColorStop(0.1, 'hsl(' + 200 + ', 61%, 33%)')
	color.addColorStop(0.25, 'hsl(' + 200 + ', 64%, 6%)')
	color.addColorStop(1, 'transparent')
	ctx2.fillStyle = color
	ctx2.beginPath()
	ctx2.arc(x, x, r, 0, Math.PI * 2)
	ctx2.fill()
	return can2
}())

var spotArr = []

var obstacleArr = []

var api = {
	// 初始化
	starLoading: function() {
		var M = Math,
		PI = M.PI,
		TWOPI = PI * 2,
		HALFPI = PI / 2,
		count = 40,
		sizeBase = 0.1,
		sizeDiv = 6,
		tick = 0;
		ctx.translate(_w, _h);
	
		function loop() {
			ctx.fillStyle = '#000';
			ctx.fillRect(-_w, -_h, _w * 2, _h * 2);
			ctx.fillStyle = '#fff';  
			var angle = tick / 8,
			radius = -50 + M.sin( tick / 15 ) * 100,
			size;
	
			for( var i = 0; i < count; i++ ) {
				angle += PI / 64;
				radius += i / 30;
				size = sizeBase + i / sizeDiv;
	
				ctx.beginPath();
				ctx.arc( M.cos( angle ) * radius, M.sin( angle ) * radius, size, 0, TWOPI, false );
				ctx.fillStyle = 'hsl(200, 70%, 50%)';
				ctx.fill();
	
				ctx.beginPath();
				ctx.arc( M.cos( angle ) * -radius, M.sin( angle ) * -radius, size, 0, TWOPI, false );
				ctx.fillStyle = 'hsl(320, 70%, 50%)';
				ctx.fill();
	
				ctx.beginPath();
				ctx.arc( M.cos( angle + HALFPI ) * radius, M.sin( angle + HALFPI ) * radius, size, 0, TWOPI, false );
				ctx.fillStyle = 'hsl(60, 70%, 50%)';
				ctx.fill();
	
				ctx.beginPath();
				ctx.arc( M.cos( angle + HALFPI ) * -radius, M.sin( angle + HALFPI ) * -radius, size, 0, TWOPI );
				ctx.fillStyle = 'hsl(0, 0%, 100%)';
				ctx.fill();
			}
			tick++;
			$.loadTime && requestAnimationFrame(loop)
		}
		loop()
	},
	// 等待中
	wait: function() {
		ctx.translate(-_w, -_h)
		var hue = 217,
			stars = [],
			count = 0,
  			maxStars = 1300;//星星数量

  		var canvas2 = document.createElement('canvas'),
  		ctx2 = canvas2.getContext('2d');
  		canvas2.width = 100;
  		canvas2.height = 100;
  		var half = canvas2.width / 2,
  		gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
  		gradient2.addColorStop(0.025, '#CCC');
  		gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
  		gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
  		gradient2.addColorStop(1, 'transparent');

  		ctx2.fillStyle = gradient2;
  		ctx2.beginPath();
  		ctx2.arc(half, half, half, 0, Math.PI * 2);
  		ctx2.fill();

		// End cache

		function random(min, max) {
			if (arguments.length < 2) {
				max = min;
				min = 0;
			}
			if (min > max) {
				var hold = max;
				max = min;
				min = hold;
			}
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function maxOrbit(x, y) {
			var max = Math.max(x, y),
			diameter = Math.round(Math.sqrt(max * max + max * max));
			return diameter / 2;
		 	 //星星移动范围，值越大范围越小，
		}

		var Star = function() {

			this.orbitRadius = random(maxOrbit(w, h));
			this.radius = random(60, this.orbitRadius) / 8; 
	  		//星星大小
	  		this.orbitX = w / 2;
	  		this.orbitY = h / 2;
	  		this.timePassed = random(0, maxStars);
	  		this.speed = random(this.orbitRadius) / 50000; 
	  		//星星移动速度
	  		this.alpha = random(2, 10) / 10;
	  		count++;
	  		stars[count] = this;
	  	}

	  	Star.prototype.draw = function() {
	  		var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
	  		y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
	  		twinkle = random(10);

	  		if (twinkle === 1 && this.alpha > 0) {
	  			this.alpha -= 0.05;
	  		} else if (twinkle === 2 && this.alpha < 1) {
	  			this.alpha += 0.05;
	  		}

	  		ctx.globalAlpha = this.alpha;
	  		ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.	radius, this.radius);
	  		this.timePassed += this.speed;
	  	}

	  	for (var i = 0; i < maxStars; i++) {
	  		new Star();
	  	}

	  	var huajiOver = 0
	  	var textSize = 0
		var flag = 1
	  	function animate() {
	  		
	  		ctx.globalCompositeOperation = 'source-over';
	  		ctx.globalAlpha = 0.5; //尾巴
	  		ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
	  		ctx.fillRect(0, 0, w, h)

	  		ctx.globalCompositeOperation = 'lighter';
	  		for (var i = 1, l = stars.length; i < l; i++) {

	  			stars[i].draw();
	  		};
	  		ctx.globalAlpha= 1
			ctx.globalCompositeOperation = 'source-over';
	  		if ($.huaji) {
	  			ctx.drawImage(imgs[1].img, _w -170, _w - 100, _w, _w)
				api.drawText('PLAY', w / 2 - 50, h * 0.8, 'bold 50px Arial', 'rgba(155,200,50,'+textSize/100+')', '30', 'rgb(155,200,50)')
				if (flag) {
					textSize+=2
				} else {
					textSize-=2
				}
				if (textSize <= 0) flag = 1
				if (textSize > 100) flag = 0
	  		}
			$.waitTime && requestAnimationFrame(animate);
	  	}
	  	animate();
	  	animation(0, _w, 1400, 'Quart.easeOut', function (v, b) {
	  		ctx.globalCompositeOperation = 'source-over';
			ctx.drawImage(imgs[1].img, v -170, v - 100, v , v)
			if (b) {
				$.huaji = 1
			}
		})

	},
	// 获取img
	getImg: function (src) {
		var img = new Image()
		img.src = src
		return img
		// var img = document.createElement('img')
		// img.src = src
		// return img
	},
	/***
		* autoplay 是否可播放
		* readyState 状态
		* playbackRate 播放速度
		* currentTime 当前播放时间
		* duration 长度
		* ended 结束状态
		* // api
		* play 播放
		* oncanplay 缓冲完成播放
		* oncanplaythrough 缓冲时播放
	***/
	music: function(src, call) {
		var audio = document.createElement('audio')
		audio.src = src
		audio.oncanplaythrough = function() {
			audio.play()
			function playTime() {
				ctx.fillStyle = '#000'
				ctx.fillRect(400, 60, 100, 50)
				drawText(audio.currentTime.toFixed(0) +'/'+ audio.duration.toFixed(0),200,50,'15px', '#fff')
				console.log('thisTime ' + audio.currentTime)
				if (audio.ended) {
					audio = null
					call && call()
				} else {
					setTimeout(playTime, 1000)
				}
			}
			playTime()
		}
		return audio
	},
	// 文字
	drawText: function(text, x, y, font, color, blur, bcolor) {
		ctx.font = font || '20px Microsoft YaHei'
		ctx.fillStyle = color || '#fff'
		ctx.shadowBlur = blur || '0'
		ctx.shadowColor = bcolor || ''
		ctx.fillText(text, x, y)
		ctx.shadowBlur = 0
	},
	//
	fps: function() {
		fps.size++
		api.drawText(fps.fps + ' FPS', w-90, 30, '20px Arial', '#fff')
	},
	setFps: function() {
		function getFps() {
			var t = Date.now()
			fps.fps = Math.round(fps.size * 1000 / (t - fps.time))
			fps.time = t
			fps.size = 0
			setTimeout(getFps, 1000) 
		}
		getFps()
	},
	// 
	startMove: function() {
		ctx.clearRect(0, 0, w, h)
		// fps
		api.setFps()
		// 光点
		api.addSpot()
		// 障碍
		api.addObstacle()
		// 动画
		function move() {
			// 层级确认
			ctx.fillStyle = '#000'
			ctx.fillRect(0, 0, w, h)
			// 背景
			api.moveBg()
			// 障碍
			api.obstacle()
			// 人物
			ctx.drawImage(imgs[1].img, $.moveX, $.moveY, 50, 50)
			
			api.drawText('分数：' + $.score, 10, 35, 'bold 25px Arial', '#fff')

			api.drawText('等级：' + $.ratio, _w - 50, 35, 'bold 20px Arial', '#fff')

			api.fps()
			$.status && requestAnimationFrame(move)
		}
		move()
	},
	addSpot: function(k) {
		function getXY(y) {
			return {
				x: Math.round(Math.random() * w),
				y: y || Math.round(Math.random() * h),
				w: Math.random() * 80
			}
		}
		if (k) {
			spotArr.push(getXY(1))
		} else {
			for (var i = 0; i < 100; i++) {
				spotArr.push(getXY())
  			}
		}
	},
	// 背景
	moveBg: function() {
  		for (var i = 0; i < spotArr.length; i++) {
  			ctx.drawImage(spot, spotArr[i].x, spotArr[i].y, spotArr[i].w, spotArr[i].w)
  			spotArr[i].y++
  			if (spotArr[i].y > h + 50) {
  				spotArr.splice(i, 1)
  				api.addSpot(1)
  			}
  		}
	},
	addObstacle: function() {
		obstacleArr.push({
			x: Math.round(Math.random() * w) - 50,
			y: -10
		})
		$.status && setTimeout(api.addObstacle, $.speed)
	},
	// 障碍物
	obstacle: function() {
		for (var i = 0; i < obstacleArr.length; i++) {
			ctx.drawImage(imgs[1].img, obstacleArr[i].x, obstacleArr[i].y, 50, 50)
			obstacleArr[i].y+=4
			api.interval(obstacleArr[i].x, obstacleArr[i].y,$.moveX, $.moveY, 50)
			if (obstacleArr[i].y > h) {
				obstacleArr.splice(i, 1)
				$.score++
				if ($.score - (10 * $.ratio) > 10) {
					$.speed-= 40
					$.ratio++
					if ($.speed < 60) $.speed = 60
				}
			}
		}
	},
	// 碰撞检测
	interval: function(ox, oy, x, y, r) {
		if ((oy >= y && oy < y + r) || (oy + r >= y && oy + r <= y + r)) {
			if ((ox >= x && ox < x + r) || (ox + r >= x && ox + r <= x + r)) {
				$.status = 0
				$.over = 1
				obstacleArr = []
				setTimeout(function() {
					api.drawText('GAME OVER!', _w - 200, _h - 150, 'bold 70px Arial', 'green')
					api.drawText('得分：' + $.score, _w - 100, _h + 100, 'bold 50px Arial', 'red')
					api.drawText('重新开始', _w - 100, _h + 350, 'bold 50px Arial', 'red')
				}, 100)
			}
		}
	}
}

// 图片预加载
for (var ix = 0; ix < imgs.length; ix++) {
	imgs[ix].img = api.getImg(imgs[ix].url)
	
}



// api.starLoading()

// setTimeout(function() {
// 	$.loadTime = 0
// 	setTimeout(function() {
// 		api.wait()
// 	}, 10)
// }, 2000)



// events
can.addEventListener('touchstart', function(e) {
	e.preventDefault()
	$.flag = 1
	var y = e.targetTouches[0].pageY
	if (y > (_h * 0.7) && !$.start) {
		$.waitTime = 0
		setTimeout(function() {
			ctx.clearRect(0, 0, w, h)
			api.drawText('Ready', _w - 50, _h, 'bold 35px Arial', '#fff')

			setTimeout(function() {
				ctx.clearRect(0, 0, w, h)
				api.drawText('Go', _w - 10, _h, 'bold 35px Arial', '#fff')
				$.start = 1
				
				setTimeout(function() {
					api.startMove()
				}, 1000)
				
			}, 1000)
			
		}, 300)
	}
	if ($.over) {
		$.score = 0
		$.status = 1
		api.startMove()
		$.over = 0
	}
}, false)

can.addEventListener('touchmove', function(e) {
	e.preventDefault()
	var x = e.targetTouches[0].pageX -25
	if (x >= _w) x = _w
	if (x <= 0) x = 0
	$.moveX = x * 2
}, false)

can.addEventListener('touchend', function(e) {
	e.preventDefault()
	$.flag = 0
}, false)



for (var i = 0; i < musics.length; i++) {
	var aa = document.createElement('audio')
	aa.src = musics[i].url
	musics[i].audio = aa
}

musics[0].audio.play()
