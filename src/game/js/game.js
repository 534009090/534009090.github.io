/***
* @v1.0.0
***/
var $ = {
	can: null,
	ctx: null,
	_h: document.documentElement.clientHeight,
	_w: document.documentElement.clientWidth,
	img: [], // 
	music: [], //
	spotArr: [], //
	obstacle: [], //
	obstacleArr: [], //
	grade: 0, // 难度等级
	ratio: 30, // 系数
	speed: 500, // 生成速度
	score: 0, // 得分
	index: 0, // 当前位置
	await: 0, // show play text
	game: 0, // game status
	execution: 0, // 进度
	dataLength: 0, // 数据总长度
	fps: {
		size: 0,
		fps: 0,
		time: Date.now(),
		timer: null
	}
}

var api = {
	log: function() {
		var text = document.createElement('p')
		text.style.position = 'absolute'
		text.style.left = '0'
		text.style.top = '50px'
		text.style.fontSize = '16px'
		text.style.color = '#fff'
		text.style.zIndex = '999'
		document.body.appendChild(text)
		function info() {
			var te = 'index: ' + $.index + '<br>' + 
				'moveX: ' + $.moveX + '<br>' +
				'moveY: ' + $.moveY + '<br>' +
				'game: ' + $.game + '<br>' +
				'speed: ' + $.speed + '<br>' +
				'execution: ' + $.execution + '<br>' +
				'dataLength: ' + $.dataLength + '<br>' +
				'进度: ' + ($.execution == 0 ? '0%' : (Math.round($.execution / $.dataLength * 100) + '%'))
			text.innerHTML = te
			requestAnimFrame(info)
		}
		info()
	},
	// 光点
	spot: (function() {
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
	}()),
	getImg: function (src) {
		var img = new Image()
		img.src = src
		img.onload = function() {
			$.execution++
		}
		return img
		// var img = document.createElement('img')
		// img.src = src
		// return img
	},
	// 文字
	drawText: function(text, x, y, font, color, bcolor, blur, align) {
		$.ctx.font = font || '20px Microsoft YaHei'
		$.ctx.fillStyle = color || '#fff'
		$.ctx.shadowBlur = blur || 0
		$.ctx.shadowColor = bcolor || ''
		$.ctx.textAlign = align || 'left'
		$.ctx.fillText(text, x, y)
		$.ctx.shadowBlur = 0
	},
	fps: function() {
		$.fps.size++
		api.drawText($.fps.fps + ' FPS', $.w - 90, 30, '20px Arial', '#fff')
	},
	setFps: function() {
		clearTimeout($.fps.timer)
		function getFps() {
			var t = Date.now()
			$.fps.fps = Math.round($.fps.size * 1000 / (t - $.fps.time))
			$.fps.time = t
			$.fps.size = 0
			$.fps.timer = setTimeout(getFps, 1000) 
		}
		getFps()
	},
	getSpotXY: function getXY(y) {
		return {
			x: Math.round(Math.random() * $.w),
			y: y || Math.round(Math.random() * $.h),
			w: Math.random() * 80
		}
	},
	addSpot: function(k) {
		if (k) {
			$.spotArr.push(api.getSpotXY(1))
		} else {
			for (var i = 0; i < 100; i++) {
				$.spotArr.push(api.getSpotXY())
  			}
		}
	},
	moveBg: function() {
  		for (var i = 0; i < $.spotArr.length; i++) {
  			$.ctx.drawImage(api.spot, $.spotArr[i].x, $.spotArr[i].y, $.spotArr[i].w, $.spotArr[i].w)
  			$.spotArr[i].y++
  			if ($.spotArr[i].y > $.h + 50) {
  				$.spotArr.splice(i, 1)
  				api.addSpot(1)
  			}
  		}
	},
	// 增加障碍
	addObstacle: function() {
		$.obstacleArr.push({
			x: Math.round(Math.random() * $.w) - 50,
			y: -10,
			img: $.obstacle[Math.round(Math.random()*6)]
		})
		$.game && setTimeout(api.addObstacle, $.speed)
	},
	// 障碍物
	obstacle: function() {
		for (var i = 0; i < $.obstacleArr.length; i++) {
			$.ctx.drawImage($.obstacleArr[i].img, $.obstacleArr[i].x, $.obstacleArr[i].y, 50, 50)
			$.obstacleArr[i].y+=4
			api.interval($.obstacleArr[i].x, $.obstacleArr[i].y, $.moveX, $.moveY, 50)
			if ($.obstacleArr[i].y > $.h) {
				$.obstacleArr.splice(i, 1)
				$.score++
				if ($.score - (10 * $.grade) > 10) {
					$.grade++
					if ($.speed > 60) $.speed-= $.ratio
				}
			}
		}
	},
	// 碰撞检测
	interval: function(ox, oy, x, y, r) {
		if ((oy >= y && oy < y + r) || (oy + r >= y && oy + r <= y + r)) {
			if ((ox >= x && ox < x + r) || (ox + r >= x && ox + r <= x + r)) {
				$.obstacleArr = []
				setTimeout(function() {
					$.game = 0
					$.music[2].pause()
					$.music[3].currentTime = 0
					$.music[3].play()
					api.drawText('GAME OVER!', $._w, $._h - 250, 'bold 60px Arial', '#12f', 0, 0, 'center')
					api.drawText('得分：' + $.score, $._w, $._h, '40px Arial', '#fff', 0, 0, 'center')
					api.drawText('重新开始', $._w, $._h + 300, 'bold 40px Arial', 'rgb(155,200,50)', 0, 0, 'center')
				}, 100)
			}
		}
	},
	init: function() {
		$.w = $._w * 2
		$.h = $._h * 2
		$.moveX = $._w / 2,
		$.moveY = $.h - 150,
		$.can = document.querySelector('#canvas')
		$.ctx = $.can.getContext('2d')
		$.can.style.height = $._h + 'px'
		$.can.style.width = $._w + 'px'
		$.can.height = $.h
		$.can.width = $.w
		var music = [
			'./music/A New Age.ogg', // 背景介绍
			'./music/One Wish.mp3', // 开始
			'./music/3.ogg', // ing
			'./music/Jolly Frolic.ogg' // ing
		]
		var img = [
			'./images/load.jpg',
			'./images/huaji.jpg',
			'./images/b6.jpg',
			'./images/b4.jpg',
			'./images/loading.gif'
		]
		var obstacle = [
			'./images/g0.png',
			'./images/g1.jpg',
			'./images/g2.jpg',
			'./images/g3.jpg',
			'./images/g4.jpg',
			'./images/g5.jpg',
			'./images/g6.jpg',
		]
		$.dataLength = music.length + img.length + obstacle.length
		for (var i = 0; i < music.length; i++) {
			var au = document.createElement('audio')
			au.src = music[i]
			au.loop = true
			au.reload = 'auto'
			au.oncanplay = function() {
				$.execution++
			}
			$.music.push(au)
		}
		// 图片预加载
		for (var y = 0; y < img.length; y++) {
			$.img.push(api.getImg(img[y]))
		}
		// 障碍
		for (var j = 0; j < obstacle.length; j++) {
			$.obstacle.push(api.getImg(obstacle[j]))
		}
		api.addEvent()
		api.starLoading()
	},
	// event
	addEvent: function() {
		var touch = {
			time: 0,
			y: 0,
			flag: 0
		}
		$.can.addEventListener('touchstart', function(e) {
			e.preventDefault()
			touch.time = Date.now()
			touch.flag = 1
			touch.y = e.targetTouches[0].pageY
		}, false)
		$.can.addEventListener('touchmove', function(e) {
			e.preventDefault()
			touch.flag = 0
			var x = e.targetTouches[0].pageX -25
			if (x >= $._w) x = $._w
			if (x <= 0) x = 0
			$.moveX = x * 2
		}, false)
		$.can.addEventListener('touchend', function(e) {
			e.preventDefault()
			if (touch.flag && Date.now() - touch.time < 300) {
				switch ($.index) {
					case 1:
						$.index = 2
						api.wait()
						$.music[0].pause()
						$.music[1].play()
					break
					case 2:
						if ($.await && touch.y > ($._h * 0.7)) {
							$.index = 3
							$.music[1].pause()
							$.music[3].pause()
							$.music[2].play()
							api.ready()
							$.await = 0
						}
					break
					case 3:
						if (!$.game && touch.y > ($._h * 0.7)) {
							$.music[3].pause()
							$.music[2].currentTime = 0
							$.music[2].play()
							api.startMove()
						}
					break
				}
			}
		}, false)
	},
	// 初始化
	starLoading: function() {
		var M = Math,
		PI = M.PI,
		TWOPI = PI * 2,
		HALFPI = PI / 2,
		count = 40,
		sizeBase = 0.1,
		sizeDiv = 6,
		tick = 0,
		ingY = $._h / 2 + 200;
		$.ctx.translate($._w, $._h);
		function loop() {
			$.ctx.fillStyle = '#000'
			$.ctx.fillRect(-$._w, -$._h, $.w, $.h)
			$.ctx.drawImage($.img[3], -$._w, -$._h, $.w, $.h)
			var angle = tick / 8,
				radius = -50 + M.sin( tick / 15 ) * 100,
				size,
				ing = $.execution ? Math.round($.execution / $.dataLength * 100) : 0
			for( var i = 0; i < count; i++ ) {
				angle += PI / 64;
				radius += i / 30;
				size = sizeBase + i / sizeDiv;
	
				$.ctx.beginPath();
				$.ctx.arc( M.cos( angle ) * radius, M.sin( angle ) * radius, size, 0, TWOPI, false );
				$.ctx.fillStyle = 'hsl(200, 70%, 50%)';
				$.ctx.fill();
	
				$.ctx.beginPath();
				$.ctx.arc( M.cos( angle ) * -radius, M.sin( angle ) * -radius, size, 0, TWOPI, false );
				$.ctx.fillStyle = 'hsl(320, 70%, 50%)';
				$.ctx.fill();
	
				$.ctx.beginPath();
				$.ctx.arc( M.cos( angle + HALFPI ) * radius, M.sin( angle + HALFPI ) * radius, size, 0, TWOPI, false );
				$.ctx.fillStyle = 'hsl(60, 70%, 50%)';
				$.ctx.fill();
	
				$.ctx.beginPath();
				$.ctx.arc( M.cos( angle + HALFPI ) * -radius, M.sin( angle + HALFPI ) * -radius, size, 0, TWOPI );
				$.ctx.fillStyle = 'hsl(0, 0%, 100%)';
				$.ctx.fill();
			}
			tick++;
			api.drawText(ing + '%', 0, ingY - 50, '30px Arial', '#fff', 0, 0, 'center')
			$.ctx.fillStyle = '#bbb'; 
			$.ctx.fillRect(-$._w, ingY, $._w * 2, 3)
			$.ctx.fillStyle = '#0f5'; 
			$.ctx.fillRect(-$._w, ingY, ing / 100 * $.w, 4)
			$.ctx.drawImage($.img[1], ing * $.w - $._w - 38, ingY - 20, 40, 40)
			if (ing / 100 >= 1) {
				$.index = 1
				$.ctx.translate(-$._w, -$._h)
				api.bgText()
			}
			$.index === 0 && requestAnimFrame(loop)
		}
		loop()
	},
	// text load
	bgText: function() {
		$.music[0].play()
		var y = $.h
		var textList = [
			'许多年后地球文明发展到巅峰',
			'却突然因为某种原因走向湮灭',
			'人类准备大规模移民太空',
			'但发生了“星变”',
			'整个星系都变得不稳定，计划破灭',
			'人类精英决定放手一搏',
			'利用“星变”进行时空穿越,纠正悲剧历史',
			'承载着地球文明最后希望的方舟最后被黑洞所吞噬',
			'不知所终',
			'消失的方舟没能回到过去，却来到了未来',
			'登陆在重组的星球。经过漫长的岁月',
			'大陆上已经重新出现了生命起源',
			'星球上的原生民，将乘坐方舟降临的人类精英视为“神明”',
			'（即以女娲为代表的初代神灵）',
			'“神明”们利用先进的科技统治星球',
			'同时醉心于利用星球的环境进行科学研究',
			'创造了“魔道”和“机关术”两大成果',
			'在这个过程中制造出了“魔种”为自己服务',
			'而魔种进化出了智慧和自我意识',
			'开始反抗“神明”（以孙悟空、牛魔为领袖的魔种起义）',
			'魔种叛乱和人类精英内部的分裂',
			'导致“神明”决定退居幕后',
			'开始扶持原生民的君主作为代理人'
			]
		function text() {
			$.ctx.fillStyle = '#000'
			$.ctx.fillRect(0, 0, $.w, $.h)
			$.ctx.drawImage($.img[2], 0, 0, $.w, $.h)
			for (var i = 0; i < textList.length; i++) {
				api.drawText(textList[i], $._w, (i * 40) + y, '24px Arial', '#fff', 0, 0, 'center')
			}
			api.drawText('跳过', $.w - 100, $.h - 80, 'bold 24px Arial', '#0ee')
			y-=.4
			$.index == 1 && requestAnimFrame(text)
		}
		setTimeout(text, 500)
	},
	// 等待中
	wait: function() {
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

			this.orbitRadius = random(maxOrbit($.w, $.h));
			this.radius = random(60, this.orbitRadius) / 8; 
	  		//星星大小
	  		this.orbitX = $.w / 2;
	  		this.orbitY = $.h / 2;
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

	  		$.ctx.globalAlpha = this.alpha;
	  		$.ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.	radius, this.radius);
	  		this.timePassed += this.speed;
	  	}

	  	for (var i = 0; i < maxStars; i++) {
	  		new Star();
	  	}
	  	var opacity = 0,
			flag = 1,
			x = ($.w - $._w) / 2,
			y = 0,
			over = 0
	  	function starMove() {
	  		$.ctx.globalCompositeOperation = 'source-over'
	  		$.ctx.globalAlpha = 0.5; //尾巴
	  		$.ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)'
	  		$.ctx.fillRect(0, 0, $.w, $.h)
	  		$.ctx.globalCompositeOperation = 'lighter'
	  		for (var i = 1, l = stars.length; i < l; i++) {
	  			stars[i].draw()
	  		};
	  		$.ctx.globalAlpha = 1
			$.ctx.globalCompositeOperation = 'source-over';
	  		if (over) {
	  			api.drawText('PLAY', $._w, $.h * 0.8, 'bold 50px serif', 'rgba(155,200,50,'+opacity/100+')', 'rgb(155,200,50)', '30', 'center')
				if (flag) {
					opacity+=2
				} else {
					opacity-=2
				}
				if (opacity <= 0) flag = 1
				if (opacity > 100) flag = 0
				$.await = 1 // ok
	  		}
	  		$.ctx.drawImage($.img[1], x, y, $._w, $._w)
			$.index === 2 && requestAnimFrame(starMove)
	  	}
	  	move(-100, 400, 800, 'Bounce.easeOut', function(v) {
	  		y = v
	  	}, function() {
	  		over = 1
	  	})
	  	starMove()
	},
	// ready
	ready: function() {
		setTimeout(function() {
			$.ctx.fillStyle = '#000'
			$.ctx.fillRect(0, 0, $.w, $.h)
			api.drawText('Ready', $._w,$. _h, 'bold 35px Arial', '#fff', '#fff', 10, 'center')
			setTimeout(function() {
				$.ctx.fillStyle = '#000'
				$.ctx.fillRect(0, 0, $.w, $.h)
				api.drawText('Go', $._w, $._h, 'bold 35px Arial', '#fff', '#fff', 10, 'center')
				setTimeout(function() {
					api.startMove()
					}, 1000)
			}, 1000)
		}, 500)
	},
	// ing
	startMove: function() {
		$.game = 1
		$.speed = 500
		$.score = 0
		$.grade = 0
		$.index = 3
		$.ctx.clearRect(0, 0, $.w, $.h)
		// fps
		api.setFps()
		// 光点
		api.addSpot()
		// 障碍
		api.addObstacle()
		// 动画
		function move() {
			// 层级确认
			$.ctx.fillStyle = '#000'
			$.ctx.fillRect(0, 0, $.w, $.h)
			// 背景
			api.moveBg()
			// 障碍
			api.obstacle()
			// 人物
			$.ctx.drawImage($.img[1], $.moveX, $.moveY, 50, 50)
			
			api.drawText('分数：' + $.score, 10, 35, 'bold 25px Arial', '#fff')

			api.drawText('等级：' + $.grade, $._w, 35, 'bold 20px Arial', '#fff', 0, 0, 'center')

			api.fps()
			$.game && requestAnimFrame(move)
		}
		move()
	},
}

window.onload = function() {
	api.init()
	// api.log()
}