
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


  $('#lookup').click(function(){ 
       $.ajax({  
        url:"https://wthrcdn.etouch.cn/weather_mini?city=上海",  
        dataType:'jsonp',  
        data:'',  
        jsonp:'callback',  
        success:function(result) {  
               $('.header').css('display','block');
             $('#Result').text(result.data.wendu+'℃'); 
               $('#show').text(result.data.ganmao);  
              $('#show1').text(result.data.forecast[0].fengxiang); 
              $('#show2').text(result.data.forecast[0].fengli);
              $('#show3').text(result.data.forecast[0].high);
              $('#show4').text(result.data.forecast[0].type);
              $('#show5').text(result.data.forecast[0].low);
              $('#show0').text(result.data.forecast[0].date);
            
        },  
        timeout:3000  
    }); 
        });

