           //当前正在编辑行
          // 五种类型参数 R_0,R_1,OFFSET,PORT,MVRD_NEXT
        // Start.addEventListener("click",Init);
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
var init_line_len = 5; //&gt\b A 2000 >和空格
var command_line_len = 7;
var memory = [];
var PC = 0;      // 10进制
var cursor = 0;
// 初始状态 分为3个状态 其余两个为 
//1 : A   2 : E  
//3 : G   4 : U
var status = 0; 
/////// 硬件
var PORT = {"80":"0000","81":"0000"};
var  R_Arr = {
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
var SP = [];
var C = "0";   // 针对每一位的操作,当有进位时为1,没有进位的时候为0;
var Z = "1";   // 一次计算当计算结果为0时,为1,否则为0;
var FLAG = 1;  // 默认是开中断的
var Level = 0;
var Level_Change = 0;
function Init()
{
  var Start = document.getElementById('Start');
  var Button1 = document.getElementById('btn1');
  var Button2 = document.getElementById('btn2');
  var Button3 = document.getElementById('btn3');
  Button1.addEventListener("click",Jump1);
  Button2.addEventListener("click",Jump2);
  Button3.addEventListener("click",Jump3);
  document.onkeydown = keyDown;
}

function keyDown(e) 
{     
      var keycode; // 按键码
      var realkey; // 字符
      var edit_p = document.getElementById('now');            // 正在编辑的一行
    
      if (navigator.appName == "Microsoft Internet Explorer")//IE
      {
           keycode = event.keyCode;
           realkey = String.fromCharCode(event.keyCode);
      }else {                                                // Firefox,Opera
           keycode = e.which;
           realkey = String.fromCharCode(e.which);
      }

      if( status == 0 || status == 1 || status == 2)
      {
          // 1字母 2数字 3空格 4逗号  以及回车,退格 其余忽略 
                                                  // ASCII
            if(  (keycode > 47 && keycode <58 )  // 0:48 9:57
               ||(keycode > 64 && keycode < 91)  // A:65 Z:90
              )           
            {
              edit_p.innerHTML += realkey;
            }
            else if( keycode == 32)// 空格:32
            {
               edit_p.innerHTML += " " ;
               return false;
            }
            else if( keycode == 188)// 逗号:188
            {
              edit_p.innerHTML += ',';
            }
            else if( keycode == 8) // 退格
            { 
              if( status == 0 && edit_p.innerHTML.length > init_line_len ) // 在初始状态下需要剩余 >和空格
              {  
                 edit_p.innerHTML = edit_p.innerHTML.slice(0,-1); 
              }
              else if( (status == 1 || status ==2)  && edit_p.innerHTML.length > 7) //多了两个空格
              {  
                 edit_p.innerHTML = edit_p.innerHTML.slice(0,-1); 
              }

              return false;   // 返回false 去除浏览器自带回退
            }
            else if( keycode == 13) //回车 >E 2000 将>去掉
            {                       //只需 ->解析并输出 
               if( status == 0 )
               {
                 Parse_Init_Order( edit_p.innerHTML.slice(init_line_len) );  // 将本行内容传入解析函数
               }
               else if( status == 1)
               {
                  Parse_A_Line( edit_p.innerHTML.slice(command_line_len) );
               }
               else if( status == 2)
               {
                  Parse_E_Line( edit_p.innerHTML.slice(command_line_len) );
               }

               return false;
            }
      }
      else if( status == 3 ) // G
      {
         PORT["80"] = keycode.toString(16);
         // 81 次高位设为1
         var t = Complete_Binary( Hex_To_Binary( PORT["81"] ) );// 0000 0000 0000 0000
         PORT["81"] = Binary_To_Hex( t.slice(0,1) + '1' + t.slice(2) );
      }
      else  if( status ==4) // U
      { 
         // U命令进行时 无法输入字符
      }
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