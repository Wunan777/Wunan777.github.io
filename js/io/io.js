  var table = [
                 "ADD 00 R_2", 
                 "SUB 01 R_2",
                 "AND 02 R_2",
                 "CMP 03 R_2",
                 "XOR 04 R_2",
                 "TEST 05 R_2",
                 "OR 06 R_2",
                 "MVRR 07 R_2",
                 "DEC 08 R_1",
                 "INC 09 R_1",
                 "SHL 0A R_1",
                 "SHR 0B R_1",
                 "JR 41 OFFSET",
                 "JRC 44 OFFSET",
                 "JRNC 45 OFFSET",
                 "JRZ 46 OFFSET",
                 "JRNZ 47 OFFSET",
                 "JMPA 80 OFFSET",
                 "IN 82 PORT",
                 "PUSH 85 R_1",
                 "OUT 86 PORT",
                 "POP 87 R_1",
                 "MVRD 88 R_1",
                 "CALA CE OFFSET",
                 "EI 6E NONE",
                 "DI 6F NONE",
                 "RET 8F NONE",
                 "IRET EF NONE"
                 ];
  var PORT = {"80": "0000", "81": "0000", "90": "0000", "91": "0000"};
     var init_line_len = 5; //&gt\b A 2000 >和空格
     var command_line_len = 7; // A 2000 :
     
     var TEC1 = {};
     var TEC2 = {};


   
     // var FLAG = 1;  // 默认是开中断的
     // var Level = 0;
     // var Level_Change = 0;
    window.onload = function()
    {  
      
       //当前正在编辑行
       // 五种类型参数 R_0,R_1,OFFSET,PORT,MVRD_NEXT
        //  Init();
    };///window end

    function Init()
    { 
      // var Start = document.getElementById('Start');
      // var Button1 = document.getElementById('btn1');
      // var Button2 = document.getElementById('btn2');
      // var Button3 = document.getElementById('btn3');

      // // Start.addEventListener("click",Init);
      // Button1.addEventListener("click",Jump1);
      // Button2.addEventListener("click",Jump2);
      // Button3.addEventListener("click",Jump3);
      Tec_Init(TEC1,"TEC1",1);
        // Tec_Init(TEC2,"TEC2",2);
      var T1 = document.getElementById("TEC1");
      var T2 = document.getElementById("TEC2");
      EventUtil.addHandler(T1,"mouseover",function(){
          TEC1.screen1 = 1;
          TEC1.screen2 = 0;
          TEC1.num = 1
          // TEC2.screen = 0;
      });
      EventUtil.addHandler(T2,"mouseover",function(){
          // TEC2.screen = 1;
          TEC1.num = 2;
          TEC1.screen2 = 1;
          TEC1.screen1 = 0;
      });
      document.onkeydown = keyDown;
      
    }
    
    function Tec_Init(obj,name,num)
    {
         // 初始状态 分为3个状态 其余两个为 
         //1 : A   2 : E  
         //3 : G   4 : U
         obj.name = name;
         obj.num = num;
         obj.memory = [];
         obj.PC = 0;      // 10进制
         obj.cursor = 0;
         obj.status = 0; 
         /////// 硬件
         obj.R_Arr = 
         {
                     "R0":"",
                     "R1":"",
                     "R2":"",
                     "R3":"",
                     "R6":"",
                     "R7":"",
                     "R8":"",
                     "R9":"",
                     "R10":"",
                     "R11":"",
                     "R12":"",
                     "R13":"",
                     "R14":"",
                     "R15":""
         };
         obj.SP = [];
         obj.C = "0";   // 针对每一位的操作,当有进位时为1,没有进位的时候为0;
         obj.Z = "1";   // 一次计算当计算结果为0时,为1,否则为0;
        obj.screen1 = 0;
        obj.screen2 = 0;
    }

    function keyDown(e) 
    {
          var keycode; // 按键码
          var realkey; // 字符
          var edit_p = Get_CurrentScreenLine();            // 正在编辑的一行
        // var current_tec = Get_CurrentTec();
        var current_tec = TEC1;
          var status = current_tec.status;
          if (navigator.appName == "Microsoft Internet Explorer")//IE
          {
               keycode = event.keyCode;
               realkey = String.fromCharCode(event.keyCode);
          }
          else  // Firefox,Opera
          {
               keycode = e.which;
               realkey = String.fromCharCode(e.which);
          }

          if( status === 0 || status === 1 || status === 2)
          {
              // 1字母 2数字 3空格 4逗号  以及回车,退格 其余忽略 
                                                     // ASCII
                if(  (keycode > 47 && keycode <58 )  // 0:48 9:57
                   ||(keycode > 64 && keycode < 91)  // A:65 Z:90
                  )           
                {
                   AddCharToLastLine.call( current_tec, realkey );
                }
                else if( keycode == 32)// 空格:32
                {
                   AddCharToLastLine.call( current_tec, " " );
                   return false;
                }
                else if( keycode == 188)// 逗号:188
                {
                   AddCharToLastLine.call( current_tec, "," );
                }
                else if( keycode == 8) // 退格
                { 
                  if( status === 0 && edit_p.innerHTML.length > init_line_len ) // 在初始状态下需要剩余 >和空格
                  {  
                     RecCharAtLastLine.call( current_tec ,"");
                  }
                  else if( (status === 1 || status === 2)  && edit_p.innerHTML.length > command_line_len) //多了两个空格
                  {  
                     RecCharAtLastLine.call( current_tec ,"");
                  }
                  // else
                  // {
                  //   console.log("不可再删除了");
                  //   alert(edit_p.innerHTML.length);
                  // }
                  return false;   // 返回false 去除浏览器自带回退
                }
                else if( keycode == 13) //回车 >E 2000 将>去掉
                {                       //只需 ->解析并输出 
                   if( status === 0 )
                   {  
                      Parse_Init_Order.call( current_tec , edit_p.innerHTML.slice(init_line_len) );  // 将本行内容传入解析函数
                   }
                   else if( status === 1)
                   {
                      Parse_A_Line.call( current_tec , edit_p.innerHTML.slice(command_line_len) );
                   }
                   else if( status === 2)
                   {
                      Parse_E_Line.call( current_tec , edit_p.innerHTML.slice(command_line_len) );
                   }
                }
          }
          else if( status === 3 ) // G
          {
              var t;
              if (current_tec.screen1 == 1) {
                  PORT["80"] = keycode.toString(16);
                  // 81 次高位设为1
                  t = Complete_Binary(Hex_To_Binary(PORT["81"]));// 0000 0000 0000 0000
                  PORT["81"] = Binary_To_Hex(t.slice(0, 1) + '1' + t.slice(2));
              } else if (current_tec.screen2 == 1) {
                  PORT["90"] = keycode.toString(16);
                  // 81 次高位设为1
                  t = Complete_Binary(Hex_To_Binary(PORT["91"]));// 0000 0000 0000 0000
                  PORT["91"] = Binary_To_Hex(t.slice(0, 1) + '1' + t.slice(2));
              }

          }
          else  if( status === 4) // U
          { 
             // U命令进行时 无法输入字符
          }
          else
          {
            alert(111);
          }

    }

    function Get_CurrentTec()
    {
        var tec;
        if( TEC1.screen == 1)
        {
          tec = TEC1;
        }
        else if (TEC2.screen == 1) 
        {
          tec = TEC2;
        }
        return tec;
    }

    function Get_CurrentScreenLine()
    {
        var now_screen;
        var line;
        if (TEC1.screen1 == 1)
        {
           now_screen = document.getElementById("console1");
        }
        else if (TEC1.screen2 == 1)
        {
           now_screen = document.getElementById("console2");
        }
        var p = now_screen.getElementsByTagName('p');
        line = p[ p.length-1 ];
        return line;
    }

    function PrintScreenInfo(str)
    {
        
    }
    


    function Jump1()
    { 
      Level_Change = 1;
      if( status == 3 && FLAG == 1 && Level_Change > Level)
      { // 中断跳转
        alert( "跳转前"+cursor.toString(16) );
        Stack_Push( "$" + Level + "#" + cursor);
        cursor = parseInt("2404",16);
        alert( cursor.toString(16) );
        Level = Level_Change;
      }
    }
    function Jump2()
    {
      Level_Change = 2;
      if( status ==3 && FLAG == 1 && Level_Change > Level)
      {
        alert( "跳转前"+cursor.toString(16) );
        Stack_Push("$" + Level + "#" + cursor);
        cursor = parseInt("2408",16);
        alert( cursor.toString(16) );
        Level = Level_Change;
      }
    }
    function Jump3()
    {
      Level_Change = 3;
      if( status == 3 && FLAG == 1 && Level_Change > Level)
      {
         alert( "跳转前"+cursor.toString(16) );
         Stack_Push("$" + Level + "#" + cursor);
         cursor = parseInt("240C",16);
         alert( cursor.toString(16) );
         Level = Level_Change;
      }
    }