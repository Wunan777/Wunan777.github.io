// 全局变量
 // 浏览器事件兼容
var EventUtil = {
   addHandler : function(element,type,handler){
          if(element.addEventListener){
           element.addEventListener(type,handler)
          }
          else if(element.attachEvent){
           element.attachEvent("on"+type,handler);
          }
          else{
           element["on"+type] = handler;
          }
   },
   removeHandler : function(element,type,handler){
     if(element.removeEventListener){
       element.removeEventListener(type,handler,false);
     }
     else if(element.detachEvent){
       element.detachEvent("on"+type,handler);
     }
     else{
       element["on"+type] = null;
     }
   },
   ////////////对事件的处理
   getEvent : function(event){
       return event?event:window.event;
   },
   getTarget : function(event){
       return event.target || event.srcElement;
   },
   getRelatedTarget : function(event){
       if( event.relatedTarget ){
         return event.relatedTarget;
       }
       else if( event.toElement ){
         return event.toElement;
       }
       else if( event.fromElement ){
         return event.fromElement;
       }
       else{
         return null;
       }
   },
   preventDefault : function(event){//阻止默认事件
       if( event.preventDefault )
       {
         event.preventDefault();
       }
       else
       {
         event.returnValue = false;
       }
   },
   stopPropagation : function(event){//阻止冒泡
       if (event.stopPropagation){
         event.stopPropagation();
       }
       else{
         event.cancelBubble = true;
       }
   }, 
   getButton : function(event){ // 点击事件 0左键 1中间 2右键
       if ( document.implementation.hasFeature("MouseEvents","2.0")) {
       	  return event.button;
       }
       else{
       	 switch(event.button){
       	 	case 0:
       	 	case 1:
       	 	case 3:
       	 	case 5:
       	 	case 7:
       	 	  return 0;
       	 	case 2:
       	 	case 6:
       	 	  return 2;
       	 	case 4:
       	 	  return 1;
       	 }
       }
   },
   getWheelDelta : function(event){
      if( event.wheelDelta )
      { // 兼容opera9.5以下版本
      	return ( client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta );
      }
      else{ // firefox
      	 return -event.detail*40;
      }
   }

}

