/*starmove框架*/
function startMove(obj,json,fn){
    var incur,subduce,speed,flag;
    clearInterval(obj.timer);

    obj.timer = setInterval(function(){
        flag=true;
        for(var attr in json){
            if(attr==='opacity'){
                incur = Math.round(parseFloat(getComputedStyle(obj,null)[attr])*100);
            }else{
                incur = parseInt(getComputedStyle(obj,null)[attr]);
            }
            subduce = json[attr] - incur;
            speed = subduce>0?Math.ceil(subduce/10):Math.floor(subduce/10);
            if(attr==='opacity'){
                obj.style[attr] = (incur + speed)/100;
            }else{
                obj.style[attr] = incur + speed + "px";
            }
            if(incur!=json[attr]){
                flag  = false ;
            }
        }
        if(flag===true){
            clearInterval(obj.timer);
            if(fn){
                fn();
            }
        }
    },10);
}
/*
方法
 同时运动 宽高 透明度
 onmouseover=onmouseenter 代替阻止冒泡 
 startMove(变量名,{width:201,height:200,opacity:100}); 
链式运动调用 
 Li.onmouseover=function(){ 
 startMove(Li,{width:400},function(){//先宽 
 startMove(Li,{height:200},function(){//后高 
 (Li,{opacity:100});//再透明度 
 });}); } 
 */