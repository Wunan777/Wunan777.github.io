 //////////////// 与硬件接口
  function Stack_Push(Add)
  { 
    // alert(Add); //push(R0) 0-9A-F{1,4} CALA 10进制  中断 $0#0-9A-F{1,4}
    SP.push(Add);
    var sp = document.getElementById("SP");

    if(Add[0] == "#")
    { 
      Add = parseInt( Add.slice(1) ).toString(16).toUpperCase();
    }
    else if(Add[0] == "$")
    {
      Add = parseInt( Add.slice(3) ).toString(16).toUpperCase();
    }

    sp.innerHTML = Complete_Four( Add );
  }
  function Stack_Pop()  // 测试SP
  {  
     var str = SP.pop();// 
     var sp = document.getElementById("SP");
     var Add = SP[ SP.length - 1 ] || "##" ;       // 栈顶

     if( Add[0] == "#" && Add[1] == "#")  // 到达主函数底部了
     {
       Add = "0000";
     }
     else if(Add[0] == "#")
     { 
       Add = parseInt( Add.slice(1) ).toString(16).toUpperCase();
     }
     else if(Add[0] == "$")
     {
       Add = parseInt( Add.slice(3) ).toString(16).toUpperCase();
     }

     sp.innerHTML = Complete_Four( Add );
     return str;
  }
  function Get_R(r_num)
  { 
    return R_Arr["R"+r_num];
  }
  function Set_R(r_num,num)
  {  // R后的数字10进制  200F 16进制
    var R = document.getElementById("R"+r_num);
   
    if( R_Arr["R"+r_num] != undefined )
    {
      R_Arr["R"+r_num] = num.toUpperCase();
      R.innerHTML = Complete_Four( num.toUpperCase() );
    }

  }   
  function Complete_Four(str)
  {
    for (var i = str.length; i < 4; i++) {
      str = "0" + str;
    }
    return str;
  }
  function Get_Port(port_num)
  {
    return PORT[port_num]; 
  }
  function Set_Port(port_num,num)
  {
    PORT[port_num] =  num;
  }

  function  Hex_To_Binary(hex)
  {
    return parseInt(hex,16).toString(2);
  }
  function Binary_To_Hex(binary)
  {
    return parseInt(binary,2).toString(16).toUpperCase();
  }
  function Complete_Binary(binary)  /////16位长度,不够补0
  {
    var len = binary.length;
    var str = binary;

    for (var i = len; i < 16; i++) 
    {
       str = '0' + str;
    }
    return str;
  }
  function Get_Minus(positive_number)
  { 
    var Num = Complete_Binary( Hex_To_Binary(positive_number) );
    var str = "";
    for (var i = 0; i < Num.length; i++) 
    {
          if( Num[i] == '0')
          {
            str = str + '1';
          }
          else
          {
            str = str + '0';
          }
          
    };
    str = (parseInt(str,2) + 1).toString(2);
    // 17位时取舍
    if(str.length > 16)
    { 
      str = str.slice(1,17);
    }
    return Binary_To_Hex(str);
  }

  function Str_Hex_To_Num(arr)
  {
    return parseInt(arr,16);
  }

         ////////////////////////////   ////////////////////////////   ////////////////////////////   ////////////////////////////

         function MVRD(arr)
         {  
            //寄存器R对应的号码 arr[0]; 
            //要赋值的数字 arr[1];  
            Set_R(arr[0],arr[1]);
         }
         function ADD(arr)
         {
            // arr[0] arr[1]
              
              var R_First = Complete_Binary( Hex_To_Binary( Get_R(arr[0]) ) );
              var R_Second = Complete_Binary( Hex_To_Binary( Get_R(arr[1]) ) );
              ////  1000 0000 0001 0000
             ////  1000 0001 0001 0001 
               var Arr_First = R_First.split("");
               var Arr_Second = R_Second.split("");
               var ALU;
               // 迭代求C
              for (var i = 15; i >= 0; i--) 
              {   // 1000 0000 0001 0000
                   // 1000 0001 0001 0001
                  if( ( parseInt(Arr_First[i]) + parseInt(Arr_Second[i]) + parseInt(C) ) > 1 ) 
                  {
                     C = "1";
                  }
                  else
                  {
                     C = "0";
                  }
              }
              ALU = (parseInt( R_First,2) + parseInt( R_Second,2 ) ).toString(2);
              if( ALU.length > 16)
              {
                 ALU = ALU.slice(1,17);
              }
             ALU = parseInt(ALU,2).toString(16).toUpperCase();
             Set_R(arr[0],ALU);
             /// ALU == 0 -> Z = '1' ; 
             if( parseInt(ALU) == 0)
             {
               Z = "1";
             }
             else{
              Z = "0";
             }
         }
         function SUB(arr)
         {
            // 被减数寄存器的值存为负数
            Set_R( arr[1] , Get_Minus( Get_R(arr[1]) )  );///// 还需要改回来
            ADD(arr);
            Set_R( arr[1] , Get_Minus( Get_R(arr[1]) )  );
         }
         function CMP(arr)
         {
              // arr[0] arr[1]
             var res = parseInt( Get_R(arr[0]) , 16 ) - parseInt( Get_R(arr[1]) , 16 );

             if( res > 0 )        
             {
              C = "1";
             }
             else
             {
              C = "0";
             }

             if( res == 0)
             {
              Z = "1";
             }
             else
             {
              Z = "0";
             }
         }
         function AND(arr)
         {
            var R_First = Complete_Binary( Hex_To_Binary( Get_R(arr[0]) ) );
            var R_Second = Complete_Binary( Hex_To_Binary( Get_R(arr[1]) ) );
            var str = "";
              for (var i = 0; i < R_First.length; i++) {
                if( R_First[i] == '1' && R_Second[i] == '1')
                {
                  str = str + "1";
                }
                else{
                  str = str + "0";
                }
              };
              Check_Z(str);
              Set_R( arr[0] , Binary_To_Hex(str) );
         }         
         function XOR(arr)
         {
           var R_First = Complete_Binary( Hex_To_Binary( Get_R(arr[0]) ) );
           var R_Second = Complete_Binary( Hex_To_Binary( Get_R(arr[1]) ) );
           var str = "";
           for (var i = 0; i < R_First.length; i++) {
            if( R_First[i] ==  R_Second[i] )
            {
              str = str + "0";
            }
            else{
              str = str + "1";
            }
           };
           Check_Z(str);
           Set_R( arr[0] , Binary_To_Hex(str) );
         }
         function TEST(arr)
         {
            var R_First = Complete_Binary( Hex_To_Binary( Get_R(arr[0]) ) );
            var R_Second = Complete_Binary( Hex_To_Binary( Get_R(arr[1]) ) );
            var str = "";
               for (var i = 0; i < R_First.length; i++) 
               {
                  if( R_First[i] == '1' && R_Second[i] == '1')
                  {
                    str = str + "1";
                  }
                  else
                  {
                    str = str + "0";
                  }
               }
               Check_Z(str);
         }
         function OR(arr)
         {
            var R_First = Complete_Binary( Hex_To_Binary( Get_R(arr[0]) ) );
            var R_Second = Complete_Binary( Hex_To_Binary( Get_R(arr[1]) ) );
            var str = "";
            for (var i = 0; i < R_First.length; i++) {
              if( R_First[i] == '1' || R_Second[i] == '1' )
              {
                str = str + "1";
              }
              else{
                str = str + "0";
              }
            };
            Check_Z(str);
            Set_R( arr[0] , Binary_To_Hex(str) );
         }
         function MVRR(arr)
         {   
            // arr[0] dr arr[1] sr
            Set_R( arr[0] , Get_R(arr[1]) );
         }
         function DEC(arr)
         {
              //arr[0]
              // 减1加FFFF
              var str =  Hex_To_Binary( (parseInt( Get_R(arr[0]),16 ) + parseInt("FFFF",16) ).toString(16) );
              if( str.length > 16)
              {
                  str = str.slice(1);
                  C = '1';
              }
              else
              {
                  C = '0';
              }

              if( parseInt(str) == 0)
              {
                  Z = "1";
              }
              else
              {
                  Z = "0";
              }
                Set_R(arr[0], Binary_To_Hex(str) );

         }
         function INC(arr)
         {
              //arr[0] 0
              var str =  Hex_To_Binary( (parseInt( Get_R(arr[0]),16 )+1).toString(16) );
              if( str.length > 16)
              {
                  str = str.slice(1);
                  C = '1';
              }
              else
              {
                  C = '0';
              }

              if( parseInt(str) == 0)
              {
                  Z = "1";
              }
              else
              {
                  Z = "0";
              }

              Set_R(arr[0], Binary_To_Hex(str) );
         }
         function SHR(arr)  /// 无符号左移
         {
                  var str = "";
                  //获得R0
                  var R = Get_R( arr[0] );

                  //
                  str = Complete_Binary(  Hex_To_Binary(R) );
                  C = str.slice(0,1);  // 0001 0000 0000 0000 取最高位第一个
                  str = str.slice(1,str.length)+"0" ;
                  str = Binary_To_Hex(str);

                  parseInt(str) == 0 ? Z = "1" :Z = "0";
                  //设置R0
                  Set_R( arr[0] , str );
         }
         function SHL(arr) // 无符号右移
         {  
            var str = "";
            var R = Get_R( arr[0] );
            str = Complete_Binary( Hex_To_Binary(R) );
            /// 0000 0000 1000 1100
            str = "0" + str.slice(0,str.length-1);
            str = Binary_To_Hex(str);
            Set_R(arr[0],str);
         }
         function JR(arr)/// 写到excute 原子性的
         {
            //cursor = Str_Hex_To_Num(arr[0]);
         }
         function JRC(arr)
         {
            // if ( C == '1') 
            // {
            //   cursor = Str_Hex_To_Num(arr[0]);
            // }
         }
         function JRNC(arr)
         {   
            // if( C == '0')
            // {
            //   cursor = Str_Hex_To_Num(arr[0]);
            // }
         }
         function JRZ(arr)
         {
            // if( Z == '1')
            // {
            //    cursor = Str_Hex_To_Num(arr[0]);
            // }
         }
         function JRNZ(arr)
         {
           // if ( Z =='0') 
           // {
           //    cursor = Str_Hex_To_Num(arr[0]);
           // }
         }
         function JMPA(arr)
         {

         }
         function IN(arr)
         { 
            // arr[0] -> 80/81
            // PORT[] -> R0
            Set_R( '0', Get_Port(arr[0]) );
         } 
         function PUSH(arr)
         { 
              // R -> SP
             Stack_Push( Get_R(arr[0]) );
         }
         function POP(arr)
         {    // SP -> R
              Set_R( arr[0] , Stack_Pop() );
         }
         function OUT(arr)
         {  
             // arr[0] -> 80/81
             // R0 -> PORT 80/81
             // 输出PORT 80/81
             // PORT 81最高位变一
             var port_num = arr[0]; //80
             var p = document.getElementById('now');

             Set_Port( port_num , Get_R("0") );
             ///////// 模拟外设输出
             //console.log( "R0" + Get_R('0') + " PORT_80 " + Get_Port(arr[0]) );
             console.log( "输出 : " + String.fromCharCode( parseInt(Get_Port(port_num),16)) ); 
            
             p.innerHTML += String.fromCharCode( parseInt(Get_Port(port_num),16) );
             /////////
             var t = Complete_Binary( Hex_To_Binary( Get_Port("81") ) );
             // t 0100 0000 0000 0000
             Set_Port("81", Binary_To_Hex( "1" + t.slice(1) ) );
         }


         function RET(arr)
         {
             var add = Stack_Pop();
             if( add[0] == "#" && add[1] == "#")
             {  // ## 为主函数返回标志
                  console.log("main函数结束！");
                  Finish();
                  cursor = -1;
                  return ; 
             }
             else if( add[0] == "$") // 中断返回标志 $0#8190
             { 
                Level =  parseInt( add.slice(1,2) );
                cursor = parseInt( add.slice( add.indexOf("#")+1 ) );
             }
             else if( add[0] == "#" )
             {
                 cursor = parseInt( add.slice(1) );
             }
             else
             { 
               console.log("错误的返回值！");
             }
         }
         function CALA(arr)
         { //arr[0] 地址
           Stack_Push( "#" + cursor);
           cursor = parseInt( arr[0], 16);
           console.log( cursor );
           console.log( memory[cursor] );
         }
         function EI()
         {

         }
         function DI()
         {

         }
         function IRET()
         {

         }