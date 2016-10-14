window.onload = function () {
			var container = document.getElementById('container');
			var list = document.getElementById('list');
			var buttons = document.getElementById('buttons').getElementsByTagName('span');
			var prev = document.getElementById('prev');
			var next = document.getElementById('next');
			var index = 1;
			var len = 6;
			var animated = false;
			var interval = 3000;
			var timer;


			function animate (offset) {
				if (offset == 0) {
					return;
				}
				animated = true;
				var time = 300;
				var inteval = 10;
				var speed = offset/(time/inteval);
				var left = parseInt(list.style.left) + offset;

				var go = function (){
					if ( (speed > 0 && parseInt(list.style.left) < left) || (speed < 0 && parseInt(list.style.left) > left)) {
						list.style.left = parseInt(list.style.left) + speed + 'px';
						setTimeout(go, inteval);
					}
					else {
						list.style.left = left + 'px';
						if(left>-200){
							list.style.left = -730 * len + 'px';
						}
						if(left<(-730 * len)) {
							list.style.left = '-730px';
						}
						animated = false;
					}
				}
				go();
			}

			function showButton() {
				for (var i = 0; i < buttons.length ; i++) {
					if( buttons[i].className == 'on'){
						buttons[i].className = '';
						break;
					}
				}
				buttons[index - 1].className = 'on';
			}

			function play() {
				timer = setTimeout(function () {
					next.onclick();
					play();
				}, interval);
			}
			function stop() {
				clearTimeout(timer);
			}

			next.onclick = function () {
				if (animated) {
					return;
				}
				if (index == 6) {
					index = 1;
				}
				else {
					index += 1;
				}
				animate(-730);
				showButton();
			}
			prev.onclick = function () {
				if (animated) {
					return;
				}
				if (index == 1) {
					index = 6;
				}
				else {
					index -= 1;
				}
				animate(730);
				showButton();
			}

			for (var i = 0; i < buttons.length; i++) {
				buttons[i].onclick = function () {
					if (animated) {
						return;
					}
					if(this.className == 'on') {
						return;
					}
					var myIndex = parseInt(this.getAttribute('index'));
					var offset = -730 * (myIndex - index);

					animate(offset);
					index = myIndex;
					showButton();
				}
			}
			container.onmouseover = stop;
			container.onmouseout = play;
			play();

 var phs = ['https://r.photo.store.qq.com/psb?/V115M72j2t1nX9/iSADmtRXYTwHdSy.kWT5wTEPCqJSVOMRVZgi99bD6Ho!/r/dAkBAAAAAAAA','https://r.photo.store.qq.com/psb?/V115M72j2t1nX9/QC2hK3UC6FURm9jOumfozYZYPmL30QThBZHXQOpN2ts!/r/dHcBAAAAAAAA','https://r.photo.store.qq.com/psb?/V115M72j2t1nX9/FDMWAtlJwCSDQRlpx0k7eL43mLweEsxNao8GYV1M2lY!/r/dG8BAAAAAAAA','https://r.photo.store.qq.com/psb?/V115M72j2t1nX9/evqn4c3vtGGywO5*xCjPXT3pCNNIevDlzoAgE.BPAD8!/r/dAoBAAAAAAAA','https://r.photo.store.qq.com/psb?/V115M72j2t1nX9/8kwh54HNKVj.H78MPNDrq9.oRDpQtl2g9vjqEhqI3yY!/r/dAoBAAAAAAAA','https://r.photo.store.qq.com/psb?/V115M72j2t1nX9/MsSxyLM*uqC6xxi1Y95P0AbPyOdGpXFLHBMUjwp6bAc!/r/dAkBAAAAAAAA','https://r.photo.store.qq.com/psb?/V115M72j2t1nX9/iSADmtRXYTwHdSy.kWT5wTEPCqJSVOMRVZgi99bD6Ho!/r/dAkBAAAAAAAA','https://r.photo.store.qq.com/psb?/V115M72j2t1nX9/QC2hK3UC6FURm9jOumfozYZYPmL30QThBZHXQOpN2ts!/r/dHcBAAAAAAAA','https://r.photo.store.qq.com/psb?/V115M72j2t1nX9/8kwh54HNKVj.H78MPNDrq9.oRDpQtl2g9vjqEhqI3yY!/r/dAoBAAAAAAAA'];

     var bg = document.getElementById('imgs');
     var lis = document.getElementById("lis").getElementsByTagName("li");
               lis[0].style.border='1px solid #B21F2F';
               lis[0].style.borderTop='3px solid #B21F2F';
            for(i=0; i<lis.length; i++){ 
               lis[i].index= i;               
               lis[i].onmouseenter = function(){
                var cc = this.index;
                        for (var j = 0; j < lis.length; j++) {
                          lis[j].style.border='';
                        }
                        this.style.border='1px solid #B21F2F';
                        this.style.borderTop='3px solid #B21F2F';
                    bg.style.background='url(' + phs[cc] + ')no-repeat';
                }
             }
    var bg2 = document.getElementById('imgs2');
    var lis2 = document.getElementById("lis2").getElementsByTagName("li");
               lis2[0].style.border='1px solid #B21F2F';
               lis2[0].style.borderTop='3px solid #B21F2F';
            for(i=0; i<lis.length; i++){ 
               lis2[i].index= i;               
               lis2[i].onmouseenter = function(){
                var cc = this.index;
                        for (var j = 0; j < lis2.length; j++) {
                          lis2[j].style.border='';
                        }
                        this.style.border='1px solid #B21F2F';
                        this.style.borderTop='3px solid #B21F2F';
                    bg2.style.background='url(' + phs[cc] + ')no-repeat';
                }
             }



  var _li = document.getElementById('move').getElementsByTagName('i');
        var _a = document.getElementById('move').getElementsByTagName('a');
              for (var i = 0; i < _li.length; i++) {
                 _li[i].index=i;
                  _li[i].onmouseenter=function(){
                       var x = this.index;
                       for (var j = 0; j < _a.length; j++) {
                           startMove(_a[x],{right:32});
                        }                    
                    }
                    _li[i].onmouseout=function(){
                       var x = this.index; 
                            startMove(_a[x],{right:-32});
                       }
                }





  var _obtn = document.getElementById("btn");
     var _time = null;
     //var clientHeight = document.documentElement.clientHeight;//界面高度获取
     //滚动触发  显示隐藏按钮
            _obtn.onclick = function(){
                //清除二次定时器
                clearInterval(_time);
                //定时器
                _time = setInterval(function(){
                //顶部高度
                var sTop = document.documentElement.scrollTop || document.body.scrollTop;
               document.documentElement.scrollTop=document.body.scrollTop = Math.floor(sTop/2);
                 if (sTop==0) {
            clearInterval(_time);
                }
            },50);    
          }



         


}



        


   
       	
		

	
		 
       

        
        

   



