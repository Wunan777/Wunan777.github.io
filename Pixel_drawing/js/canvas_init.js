// 全局 
var rectlist = {}; // 存离散的点 不用初始化
$(document).ready(function(){
    
    // 要画的信息
    var darwlist = {};
    // 画布信息
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var num = 10;
    var rows = num;
    var cols = num;
    var blockWidth  ;
    var blockHeight ;
    
    //  鼠标
    var mouse = {};
    mouse.x = 0;
    mouse.y = 0; 
    //  键盘
    var key = {};
    key.lastTime = 0;
    key.lastIndex = 0;
    /// 画笔
    var brush = {};
    brush.size = 1;
    brush.colorObj = document.getElementsByClassName('colors')[0];
    
    // 开关
    var LineBtn = document.getElementById('LineBtn');
    LineBtn.type = "show";
    var flashBtn = null;
    var flashColor = "#000" ;
    var flashOrbit = {};
    
    var BlockNumBtn = document.getElementById('BlockNumBtn');
    BlockNumBtn.now = 1;//
    BlockNumBtn.max = 6;//最大增加5次
       
    var CanvasSizeSelector = document.getElementById('CanvasSizeSelector');
    var canvasWidth = parseInt(getComputedStyle(canvas).width);
    var canvasHeight = parseInt(getComputedStyle(canvas).height);
    // 时间
    var time = new Date();
    

    //开始初始化
    init();
    // 初始化函数
    function init(){
      // 画布
      canvas.width = canvasWidth;
      canvas.height= canvasHeight;
      // 格子
      blockWidth = Math.floor( canvasWidth/cols );
      blockHeight = Math.floor( canvasHeight/rows );
      draw_allRects();
      if(LineBtn.type === "show")draw_line();
    }
 
    
    // 控制层control
    $(LineBtn).on("click",function(){
       if( this.type === "show" )
       {
         this.type = "hide";
         $(this).html("Show Line");
         draw_allRects();
       }
       else
       {
         this.type = "show";
         $(this).html("Hide Line");
         draw_line();
       }
    });

    $(BlockNumBtn).on("click",function(){
        if( this.now < this.max )
        {
            this.now++; 
            mulitple();
            react();
        }
        else
        {
            this.now = 1;
            restore();
            react();
        }
        
        function react()
        {   console.log(rectlist);
            blockWidth = Math.floor( canvasWidth/cols );
            blockHeight = Math.floor( canvasHeight/rows );
            draw_allRects();
            if(LineBtn.type === "show")draw_line();
        }

        function mulitple()
        {
           num = num * 2;
           rows = num;
           cols = num;
        }
        function restore()
        {
           num = 10;
           rows = num;
           cols = num;
        }
    });
    
    $(CanvasSizeSelector).on("change",function(event){
        var ev = event;
        var target = ev.target;
        canvasWidth =  target.options[ target.selectedIndex ].value; 
        canvasHeight =  target.options[ target.selectedIndex ].value;
        

        react();
        function react()
        {  
           //
           canvas.style.width = canvasWidth + 'px';
           canvas.style.height = canvasHeight + 'px';
           canvas.width = canvasWidth;
           canvas.height = canvasHeight;
           blockHeight = canvasHeight/rows;
           blockWidth = canvasWidth/cols;
           // 画格
           draw_allRects();
           // 画线 
           if( LineBtn.type === "show") 
            draw_line();
        }
    });

    $(canvas).on("click",function(event){
        var x = Math.floor( event.offsetX/blockHeight );
        var y = Math.floor( event.offsetY/blockWidth );
        if( brush.colorObj.value != rectlist[x+","+y] )// 同色不绘制
        {
          // 改变模型 
          change_rect(x,y); //单击改变rectlist 并改变view
          // 绘制图像
          draw_at(x,y);
        }
    });

      // 拖拽画板
    $("#mycolor").on("mousedown",function(e1){
        var yt=e1.clientY-document.getElementById('mycolor').offsetTop;
        var xt=e1.clientX-document.getElementById('mycolor').offsetLeft;
        var mycolor = document.getElementById('mycolor');
       $(document).on("mousemove",function(e2){
           $("#mycolor").css({"top" : e2.clientY-yt , "left" :  e2.clientX-xt });
       })
    });
    $("#mycolor").on("mouseup",function(){
        $(document).off("mousemove");
    });

      // 拖拽着画

    $(canvas).on("mousedown",function(event){
        $(canvas).on("mousemove",event,record);
    });
    $(canvas).on("mouseup",function(event){
         $(canvas).off("mousemove",record);
         for(var i in darwlist)
         {
           // 鼠标抬起 将要画的点画出
           var sign_pos = i.indexOf(",");
           var x = i.slice(0,sign_pos);
           var y = i.slice(sign_pos+1);
           // model
           rectlist[i] = darwlist[i];
           // view
           draw_at(x,y);
         } 
          // 画完清空
         darwlist = {};
    });
    
       // 选择画板中的颜色
       
      // 颜色框 选择颜色
    $("#colorlist").on("click",function(event){
       var target = event.target;
       $(".colors").each(function(index){
           if( this === target )
           {
              $(this).attr("class" , "colors active");
              // 改变模型
              brush.colorObj = this;
           }
           else
           {
              $(this).attr("class" , "colors");
           }
       });
    });
     //  数字快捷键
    $(document).on("keydown",function(event){
         var now = new Date();
         var keyCode = event.keyCode;
         if( 49 <= keyCode && keyCode <= 57)
         { 
             var number = parseInt( String.fromCharCode(keyCode) ) - 1;
             var target = $(".colors")[number];
             $(".colors").filter(".active").attr("class" , "colors");
             // 改变模型
             brush.colorObj = target;
             // 改变view
             $(target).attr("class" , "colors active");

             if( now - key.lastTime < 300 && key.lastIndex === number) // 连按
             {
               $(target).trigger("click");
             }
             key.lastTime = now;
             key.lastIndex = number;
         }
    });
       // 鼠标移入 开始画闪烁的线
    $(canvas).on("mousemove",function(event){
       mouse.x = event.offsetX;
       mouse.y = event.offsetY;
    });
    $(canvas).on("mouseenter",function(event){
       if( LineBtn.type === "show" )
        { update() };
    });
    $(canvas).on("mouseleave",function(event){
      if( flashBtn )
      {   
          window.cancelAnimationFrame(flashBtn);
          draw_fill_orbit(); // 离开时 填补最后一次画的白线
      }
      flashBtn = null;
    });


    // 控制器改变模型
    function change_rect(x,y)
    { 
       rectlist[x+","+y] = brush.colorObj.value;
    }

    function change_draw(x,y)
    {
        darwlist[x+","+y] = brush.colorObj.value;
    }
    
    function record(event)
    {
              var x = Math.floor( event.offsetX/blockHeight );
              var y = Math.floor( event.offsetY/blockWidth );
              
              if( darwlist[x+","+y] === undefined && rectlist[x+","+y] != brush.colorObj.value )
              {
                // 将要画的放入 drawlist中
                change_draw(x,y);
                // 改变view 标记要画出的部分
                draw_circle(x,y);
              } 
    }

    // 绘制view
 

    function draw_circle(x,y)
    {
       var p_x = x * blockWidth + blockWidth/2; // x坐标
       var p_y = y * blockHeight + blockHeight/2;
       var r = blockHeight/4;
       ctx.beginPath(); 
       ctx.strokeStyle = brush.colorObj.value;
       ctx.arc( p_x , p_y , r , 0, 2*Math.PI );
       ctx.stroke();
    }
    function draw_at(x,y)
    {  
       ctx.fillStyle = brush.colorObj.value;
       ctx.fillRect( x*blockWidth  , y*blockHeight  ,blockWidth  ,blockHeight);
       if( LineBtn.type === "show")
        { draw_line_at(x,y); } // 是否画横线
    }
    function draw_allRects()
    {   
    	var bgWidth = blockWidth;
    	var bgHeight = blockHeight;
        
        draw_allRects_component();
    	function draw_allRects_component()
    	{  
          ctx.beginPath();
    	    for(var m=0; m < cols ;m++) // 列
    	    {
    	          for(var n=0; n < rows; n++) // 行
    	          {   
    	              if( rectlist[m+","+n] != undefined )
                      {  // m 行 n 列 2 , 0
    	                 ctx.fillStyle= rectlist[m+","+n];  
    	                 ctx.fillRect(  m*blockWidth, n*blockHeight, blockWidth, blockHeight);
    	              }
    	              else
    	              {  // 绘制背景图片
                        ctx.fillStyle = "#ffffff"; 
                        ctx.fillRect(  m*blockWidth , n*blockHeight ,  blockWidth/2 , blockHeight/2);
                        ctx.fillRect(  m*blockWidth + blockWidth/2 , n*blockHeight + blockHeight/2 ,  blockWidth/2 , blockHeight/2);
                        ctx.fillStyle = "#c7c7c7";
                        ctx.fillRect(  m*blockWidth , n*blockHeight + blockHeight/2,  blockWidth/2 , blockHeight/2);
                        ctx.fillRect(  m*blockWidth + blockWidth/2 , n*blockHeight , blockHeight/2 , blockHeight/2); 
                      }   	              
    	          }
    	    }
    	} 
    }
      // 画分割线
    function draw_line() // 所有的
    { 
        var rowsLines = rows - 1;
        var colLines = cols - 1;
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        // 画行
        for(var i = 0; i < rowsLines ; i++) 
        {
            ctx.moveTo( 0 + 0.5 , (i+1)*blockHeight + 0.5);
            ctx.lineTo( canvasWidth + 0.5, (i+1)*blockHeight + 0.5);
            ctx.stroke();
        }
        // 画列
        for(var i=0; i < colLines ; i++)
        {
            ctx.moveTo( (i+1)*blockWidth + 0.5, 0 + 0.5 )
            ctx.lineTo( (i+1)*blockWidth + 0.5,canvasHeight + 0.5 );
            ctx.stroke();
        }
    }
    function draw_line_at(x,y) // 指定的
    {  
       var row = y;
       var col = x;
       ctx.beginPath();
       ctx.strokeStyle = "#000";

       ctx.moveTo( 0+0.5 , row*blockHeight + 0.5 );
       ctx.lineTo( canvasWidth + 0.5 , row*blockHeight + 0.5);
       ctx.moveTo( 0+0.5 , (row+1)*blockHeight + 0.5 );
       ctx.lineTo( canvasWidth + 0.5 , (row+1)*blockHeight + 0.5);

       ctx.moveTo( col*blockWidth + 0.5 , 0 + 0.5);
       ctx.lineTo( col*blockWidth + 0.5 , canvasHeight + 0.5);
       ctx.moveTo( (col+1)*blockWidth + 0.5 , 0 + 0.5);
       ctx.lineTo( (col+1)*blockWidth + 0.5 , canvasHeight + 0.5);
       ctx.stroke();
    }
    function draw_flash()
    {  
       var row = Math.floor( mouse.y/blockHeight ); // 1 9 
       var col = Math.floor( mouse.x/blockWidth );
       ctx.beginPath();
       ctx.strokeStyle = flashColor;

       ctx.moveTo( 0+0.5 , row*blockHeight + 0.5 );
       ctx.lineTo( canvasWidth + 0.5 , row*blockHeight + 0.5);
       ctx.moveTo( 0+0.5 , (row+1)*blockHeight + 0.5 );
       ctx.lineTo( canvasWidth + 0.5 , (row+1)*blockHeight + 0.5);

       ctx.moveTo( col*blockWidth + 0.5 , 0 + 0.5);
       ctx.lineTo( col*blockWidth + 0.5 , canvasHeight + 0.5);
       ctx.moveTo( (col+1)*blockWidth + 0.5 , 0 + 0.5);
       ctx.lineTo( (col+1)*blockWidth + 0.5 , canvasHeight + 0.5);
       ctx.stroke();


       return  {"row":row , "col":col};
    }
    function draw_fill_orbit()
    {
        var row = flashOrbit.row ;// 1 9 
        var col = flashOrbit.col ;
        ctx.beginPath();
        ctx.strokeStyle = "#000";

        ctx.moveTo( 0+0.5 , row*blockHeight + 0.5 );
        ctx.lineTo( canvasWidth + 0.5 , row*blockHeight + 0.5);
        ctx.moveTo( 0+0.5 , (row+1)*blockHeight + 0.5 );
        ctx.lineTo( canvasWidth + 0.5 , (row+1)*blockHeight + 0.5);

        ctx.moveTo( col*blockWidth + 0.5 , 0 + 0.5);
        ctx.lineTo( col*blockWidth + 0.5 , canvasHeight + 0.5);
        ctx.moveTo( (col+1)*blockWidth + 0.5 , 0 + 0.5);
        ctx.lineTo( (col+1)*blockWidth + 0.5 , canvasHeight + 0.5);
        ctx.stroke();
    }
      // 刷新
    function render()
    {  
       var now = new Date();
       if( now - time > 300 )
       { 
         change_flashColor();
         time = now;
       }
       draw_fill_orbit();
       flashOrbit =  draw_flash();
    }
    function change_flashColor()
    {
       // 换颜色
        if( flashColor === "#000")
        {
          flashColor = "#fff";
        } 
        else if( flashColor === "#fff")
        {
          flashColor = "#000";
        }
    }
    function update()
    {  
       render();
       flashBtn = window.requestAnimationFrame(update);
    }
});

