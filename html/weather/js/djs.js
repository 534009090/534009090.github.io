
  var  str;
  var cityPicker = new HzwCityPicker({
        data: data,
        target: 'cityChoice',
        valType: 'k-v',
        hideCityInput: {
            name: 'city',
            id: 'city',
            val:'2'
        },
        callback: function(){
        	  str = $('#cityChoice').val();
         	  str = str.replace(/市/g,'');    
        }
    });
    cityPicker.init();

  $(function(){ 
  $('#lookup').click(function(){ 
              	if ($('#cityChoice').val()=='请选择') {alert('请选择要查询的城市！');  return}
            $.ajax({  
                url: 'https://wthrcdn.etouch.cn/weather_mini?city='+str,  
                type: 'GET',  
                dataType: 'jsonp',  
                timeout: 1000,  
                cache: false,  
                beforeSend: LoadFunction, //加载执行方法    
                error: erryFunction,  //错误执行方法    
                success: succFunction //成功执行方法    
            })  
            function LoadFunction() {  
                console.log('ok');  
            }  
            function erryFunction() {  
                alert("服务器繁忙，请稍后查询！");  
            }  
            function succFunction(t) { 
            	$('.header').css('display','block');
              $('#Result').text(t.data.wendu+'℃'); 
              $('#show').text(t.data.ganmao);  
              $('#show1').text(t.data.forecast[0].fengxiang); 
              $('#show2').text(t.data.forecast[0].fengli);
              $('#show3').text(t.data.forecast[0].high);
              $('#show4').text(t.data.forecast[0].type);
              $('#show5').text(t.data.forecast[0].low);
              $('#show0').text(t.data.forecast[0].date);
              for (var i = 1; i < 5; i++) {
              	 $('#show'+i+'1').text(t.data.forecast[i].date);
                 $('#show'+i+'2').text(t.data.forecast[i].fengxiang); 
                 $('#show'+i+'3').text(t.data.forecast[i].fengli);
                 $('#show'+i+'4').text(t.data.forecast[i].high);
                 $('#show'+i+'5').text(t.data.forecast[i].low);
                 $('#show'+i+'6').text(t.data.forecast[i].type);
              }
            }
});
});
