 //////////////// 与硬件接口
  function Stack_Push(Add,obj)
  { 
    // alert(Add); //push(R0) 0-9A-F{1,4} CALA 10进制  中断 $0#0-9A-F{1,4}
    obj.SP.push(Add);
    // obj.num 
    var register_div = document.getElementById("register"+obj.num);
    var sp = register_div.getElementsByClassName("SP")[0];
    if( Add[0] == "#" )
    { 
      Add = parseInt( Add.slice(1) ).toString(16).toUpperCase();
    }
    else if( Add[0] == "$" )
    {
      Add = parseInt( Add.slice(3) ).toString(16).toUpperCase();
    }

    sp.innerHTML = Complete_Four( Add );
  }
  function Stack_Pop(obj)  // 测试SP
  {  
     var str = obj.SP.pop();//
     var register_div = document.getElementById("register"+obj.num);
     var sp = register_div.getElementsByClassName("SP")[0];
     var Add = obj.SP[ obj.SP.length - 1 ];// 栈顶
     if(  Add == undefined )
     {
         // SP中无值
        ///值为undefined
        Add = "0000";
     }
     else if( Add[0] == "#" && Add[1] == "#")  // 到达主函数底部了
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
  function Get_R(r_num,obj)
  { 
     return obj.R_Arr["R"+r_num];
  }
  function Set_R(r_num,num,obj)
  {  // R后的数字10进制  200F 16进制
    var register_div = document.getElementById("register" + obj.num);
    var R = register_div.getElementsByClassName("R"+r_num)[0];
    if( obj.R_Arr["R"+r_num] != undefined )
    {
      obj.R_Arr["R"+r_num] = num.toUpperCase();
      R.innerHTML = Complete_Four( num.toUpperCase() );
    }
  }
  function Get_C(obj)
  {
      return obj.C;
  }
  function Set_C(str_num,obj)
  {
     obj.C = str_num;
  }
  function Check_C(str,obj)
  {
      if( str.length > 16)
      {
          str = str.slice(1);
          Set_C('1',obj);
      }
      else
      {
          Set_C('0',obj);
      }
  }
  function Get_Z(obj)
  {
     return obj.Z;
  }
  function Set_Z(str_num,obj)
  {
     obj.Z = str_num;
  }
  function Check_Z(str,obj)
  {
     /// ALU == 0 -> Z = '1' ; 
     if( parseInt(str) == 0)
     {
       Set_Z("1",obj);
     }
     else
     {
       Set_Z("0",obj);
     }
  }
  function Get_Port(port_num)
  {
    return PORT[port_num]; 
  }
  function Set_Port(port_num,num)
  {
    PORT[port_num] =  num;
  }


  function Complete_Four(str)
  {
    for (var i = str.length; i < 4; i++) {
      str = "0" + str;
    }
    return str;
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

         function MVRD(arr,obj)
         {  
            //寄存器R对应的号码 arr[0]; 
            //要赋值的数字 arr[1];  
            Set_R(arr[0],arr[1],obj);
         }
         function ADD(arr,obj)
         {
              var R_First  = Complete_Binary( Hex_To_Binary( Get_R(arr[0],obj) ) );
              var R_Second = Complete_Binary( Hex_To_Binary( Get_R(arr[1],obj) ) );
              ////  1000 0000 0001 0000
             ////  1000 0001 0001 0001
               var Arr_First = R_First.split("");
               var Arr_Second = R_Second.split("");
               var ALU;
               // 迭代求C
              for (var i = 15; i >= 0; i--) 
              {    // 1000 0000 0001 0000
                   // 1000 0001 0001 0001
                  if( ( parseInt(Arr_First[i]) + parseInt(Arr_Second[i]) + parseInt( Get_C(obj) ) ) > 1 ) 
                  {
                     Set_C("1",obj);
                  }
                  else
                  {
                     Set_C("0",obj);
                  }
              }
              ALU = (parseInt( R_First,2) + parseInt( R_Second,2 ) ).toString(2);
              if( ALU.length > 16)
              {
                 ALU = ALU.slice(1,17);
              }
             ALU = parseInt(ALU,2).toString(16).toUpperCase();
             Set_R(arr[0],ALU,obj);
             Check_Z(ALU,obj);

         }
         function SUB(arr,obj)
         {
            // 被减数寄存器的值存为负数
            Set_R( arr[1] , Get_Minus( Get_R(arr[1]) ) , obj );///// 还需要改回来
            ADD(arr,obj);
            Set_R( arr[1] , Get_Minus( Get_R(arr[1]) ) , obj );
         }
         function CMP(arr,obj)
         {
              // arr[0] arr[1]
             var res = parseInt( Get_R(arr[0] , obj) , 16 ) - parseInt( Get_R(arr[1] , obj) , 16 );

             if( res > 0 )        
             {
               Set_C("1",obj);
             }
             else
             {
               Set_C("0",obj);
             }

             Check_Z(res,obj);
         }
         function AND(arr,obj)
         {
            var R_First  = Complete_Binary( Hex_To_Binary( Get_R(arr[0],obj) ) );
            var R_Second = Complete_Binary( Hex_To_Binary( Get_R(arr[1],obj) ) );
            var str = "";
              for (var i = 0; i < R_First.length; i++) 
              {
                if( R_First[i] == '1' && R_Second[i] == '1')
                {
                  str = str + "1";
                }
                else{
                  str = str + "0";
                }
              };
              Check_Z(str,obj);
              Set_R( arr[0] , Binary_To_Hex(str) ,obj);
         }         
         function XOR(arr)
         {
           var R_First  = Complete_Binary( Hex_To_Binary( Get_R(arr[0] , obj ) ) );
           var R_Second = Complete_Binary( Hex_To_Binary( Get_R(arr[1] , obj ) ) );
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
           Check_Z(str,obj);
           Set_R( arr[0] , Binary_To_Hex(str) , obj );
         }
         function TEST(arr)
         {
            var R_First  = Complete_Binary( Hex_To_Binary( Get_R( arr[0] , obj ) ) );
            var R_Second = Complete_Binary( Hex_To_Binary( Get_R( arr[1] , obj ) ) );
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
               Check_Z(str,obj);
         }
         function OR(arr)
         {
            var R_First  = Complete_Binary( Hex_To_Binary( Get_R( arr[0] , obj ) ) );
            var R_Second = Complete_Binary( Hex_To_Binary( Get_R( arr[1] , obj ) ) );
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
            Check_Z(str,obj);
            Set_R( arr[0] , Binary_To_Hex(str) , obj );
         }
         function MVRR(arr,obj)
         {   
            // arr[0] dr arr[1] sr
            Set_R( arr[0] , Get_R( arr[1] , obj ) ,obj );
         }
         function DEC(arr,obj)
         {
              //arr[0]
              // 减1加FFFF
              var str =  Hex_To_Binary( (parseInt( Get_R( arr[0] , obj ) , 16 ) + parseInt("FFFF",16) ).toString(16) );
              Check_C(str,obj);
              Check_Z(str,obj);
              Set_R( arr[0], Binary_To_Hex(str), obj );
         }
         function INC(arr,obj)
         {
              //arr[0] 0
              var str =  Hex_To_Binary( (parseInt( Get_R( arr[0], obj),16 )+1).toString(16) );
              Check_C(str,obj);
              Check_Z(str,obj);
              Set_R( arr[0], Binary_To_Hex(str), obj);
         }
         function SHR(arr,obj)  /// 无符号左移
         {
                var str = "";
                //获得R0
                var R = Get_R( arr[0] , obj);
                //
                str = Complete_Binary(  Hex_To_Binary(R) );
                Set_C( str.slice(0,1) ,obj );  // 0001 0000 0000 0000 取最高位第一个
                str = str.slice(1,str.length)+"0" ;
                str = Binary_To_Hex(str);

                Check_Z(str,obj);
                //设置R0
                Set_R( arr[0] , str ,obj);
         }
         function SHL(arr,obj) // 无符号右移
         {  
            var str = "";
            var R = Get_R( arr[0] , obj);
            str = Complete_Binary( Hex_To_Binary(R) );
            /// 0000 0000 1000 1100
            str = "0" + str.slice(0,str.length-1);
            str = Binary_To_Hex(str);
            Set_R( arr[0], str, obj);
         }
         function IN(arr,obj)
         { 
            // arr[0] -> 80/81
            // PORT[] -> R0
            Set_R( '0', Get_Port(arr[0]) , obj);
         } 
         function PUSH(arr,obj)
         { 
              // R -> SP
             Stack_Push( Get_R(arr[0]) , obj);
         }
         function POP(arr,obj)
         {  
            // SP -> R
            Set_R( arr[0] , Stack_Pop(obj) ,obj);
         }
         function OUT(arr,obj)
         {  
             var port_num = arr[0]; //80
             Set_Port( port_num , Get_R("0",obj) );
             ///////// 模拟外设输出
             console.log( "输出 : " + String.fromCharCode( parseInt(Get_Port(port_num),16)) ); 
             AddCharToLastLine.call(obj, String.fromCharCode( parseInt(Get_Port(port_num),16) ) );
             /////////
             var t = Complete_Binary( Hex_To_Binary( Get_Port("81") ) );
             // t 0100 0000 0000 0000
             Set_Port("81", Binary_To_Hex( "1" + t.slice(1) ) );
         }
         function RET(arr,obj)
         {   
             var add = Stack_Pop(obj);
             if( add[0] == "#" && add[1] == "#")
             {  // ## 为主函数返回标志
                  console.log("main函数结束！");
                  obj.cursor = -1;
                  return ; 
             }
             else if( add[0] == "$") // 中断返回标志 $0#8190
             { 
                obj.Level =  parseInt( add.slice(1,2) );
                obj.cursor = parseInt( add.slice( add.indexOf("#")+1 ) );
             }
             else if( add[0] == "#" )
             {
                 obj.cursor = parseInt( add.slice(1) );
             }
             else
             { 
               console.log("错误的返回值！");
             }
         }
         function CALA(arr,obj)
         { //arr[0] 地址
           Stack_Push( "#" + obj.cursor, obj);
           obj.cursor = parseInt( arr[0], 16);
           console.log( obj.cursor );
           console.log( obj.memory[obj.cursor] );
         }
         function EI(obj)
         {
           obj.FLAG = 1;
         }
         function DI(obj)
         {
           obj.FLAG = 0;
         }
         function IRET(arr,obj)
         {  
           RET(arr,obj);
         }

         function JR(){}
         function JRC(){}
         function JRNC(){}
         function JRZ(){}
         function JRNZ(){}
         function JMPA(){}