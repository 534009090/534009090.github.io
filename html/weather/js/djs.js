
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


  
