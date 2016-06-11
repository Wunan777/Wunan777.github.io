 window.onload = function(){
        	//  获得两组数据
        	// 主要是 两组 24个 0/1开关
        	// innerHTML 中的0和1 均为字符串
          var num_list =  document.getElementsByClassName("num");
          var one = num_list[0].getElementsByTagName("dd");   // 获得是 dom元素
          var two = num_list[1].getElementsByTagName("dd");
          var reset = document.getElementById("reset");
          var data = document.getElementById("data");
          var start = document.getElementById("start");
          var alu = document.getElementById("ALU");
          var alu_res  =  alu.getElementsByTagName("dd");
          
          var register_arr = [];
          var one_inner = [];  // 获取dom元素对应innerHTML的值集合
          var two_inner = [];  
          var arr = [];   // one,two合集
    	    for (var i = 0; i < one.length; i++) {
    	    	arr.push(one[i]);
    	    };
    	    for (var i = 0; i < two.length; i++) {
    	    	arr.push(two[i]);
    	    };
            
          for (var i = 0; i < arr.length; i++) 
          {
          	  arr[i].addEventListener('click',function(){
             			//  点击改变0/1开关
             			if(this.innerHTML == "1")
            			{
                     this.innerHTML = "0";
            			}
            			else{
            				this.innerHTML = "1";
            			}
          		});
          }


            // 将所有数字清空 
          reset.addEventListener("click",Button_Reset);
	        start.addEventListener("click",cal);


  // 计算
  function cal()
  {
            // 1 获取I0 -  I8   注意实时获取
            //   获取 PORT_A PORT_B   
            //   获取SST SSH SCI
            // 将one,two的值分别放在数组中
            var ALU;
            var Q;
            var F;
            var one = num_list[0].getElementsByTagName("dd");
            var one_inner = [];
            var two = num_list[1].getElementsByTagName("dd");
            var two_inner = [];


            for (var i = 0; i < one.length; i++) {
              one_inner.push(one[i].innerHTML);
            };
            for (var i = 0; i < two.length; i++) {
              two_inner.push(two[i].innerHTML);
            };

            var I8_6 = one_inner[0] + one_inner[1] + one_inner[2];
            var I5_3 = one_inner[3] + one_inner[4] + one_inner[5];
            var I2_0 = one_inner[6] + one_inner[7] + one_inner[8];
            var SST = one_inner[9] + one_inner[10] + one_inner[11];


            var SSH = two_inner[0] + two_inner[1];
            var SCI = two_inner[2] + two_inner[3];
            // PORT_A PORT_B 指向寄存器
            var PORT_B = two_inner[4] + two_inner[5] + two_inner[6] + two_inner[7] ;
            var PORT_A = two_inner[8] + two_inner[9] + two_inner[10] + two_inner[11] ;
            // D 只取四位
            var D = rule_4( parseInt(data.value,16) );
            var R;
            var S;
      

            // 2 进行 -设定运算两边取值来源 -> 确定运算符号 -> 将输出结果处理输出.
              // PORT_A : 11时, 将其转为2进制整数, 其赋值给num_a 为10进制的3
            var num_a = parseInt(PORT_A,2);
            var num_b = parseInt(PORT_B,2);

            if( SST != "001" || SSH != "00")
            {
              alert("注意SST和SSH的设置！");
              return ;
            }


            //2.1 确定来源
            switch(I2_0)
            {
              case "000":
                  R = register_arr[num_a];
                  S = Q;
                  break;
              case "001":
                  R = register_arr[num_a];
                  S = register_arr[num_b];
                  break;
              case "010":
                  R = 0;
                  S = Q;
                  break;
              case "011":
                  R = 0;
                  S = register_arr[num_b];
                  break;
              case "100":
                  R = 0;
                  S = register_arr[num_a];
                  break;
              case "101":
                  R = D;
                  S = register_arr[num_a];
                  break;
              case "110":
                  R = D;
                  S = Q;
                  break;
              case "111":
                  R = D;
                  S = 0;
                  break;
              default:
                  console.log("I2_0 wrong");
                  break;
            }
      

            // 2.2确定运算符
            // 考虑负数问题

            switch(I5_3)
            {
              case "000":
                  F = R + S;
                  break;
              case "001":
                   if(SCI != "01")
                     {
                       alert("注意SCI的值!")
                       return ;
                     }


                  if(S > R || S == R)
                  {
                    F = S - R;
                  }
                  else
                  {
                    F = rule_5( S , R);
                  }
                  break;
              case "010":
                  if(R > S || R == S)
                  {
                    F = R - S;
                  }
                  else
                  {
                    F = rule_5( R , S);
                  }
                  break;
              case "011":
                  F = R | S;
                  break;
              case "100":
                  F = R & S;
                  break;
              case "101":
                  F = 0xffff ^ (R & S);
                  break;
              case "110":
                  F = R^S;
                  break;
              case "111": // x取反为 ffff - x  即为相反数 或 0xffff^x
                  F = 0xffff ^ ( R^S );
                  break;
              default:
                  console.log("I5_3 wrong");
                  break;
            }

            // 调用rule_4将超出4位的位 截除.
            F = rule_4(F);


            //2.3 对计算结果的处理
            if(I8_6 == "000")
            {
               Q = F;
               ALU = F;
            }
            else if(I8_6 == "001")
            {
               ALU = F;
            }
            else if( I8_6 == "010")
            {
               register_arr[num_b] = F;
               ALU = A;
            }
            else if( I8_6 == "011")
            {
               register_arr[num_b] = F;
               ALU = F;
            }
            else if( I8_6 == "100")
            {
               register_arr[num_b] = F >> 1;
               Q  = Q >> 1;
               ALU = F;
            }
            else if( I8_6 == "101")
            {
               register_arr[num_b] = F >> 1;
               ALU = F;
            }
            else if( I8_6 == "110")
            {
               register_arr[num_b] = 1 << F;
               Q = Q << 1;
               ALU = F;
            }
            else if( I8_6 == "111")
            {  
               register_arr[num_b] = F << 1;
               ALU = F;
            }
            else
            {
              console.log("I8_6 wrong!!!");
            }
         

           // 将计算后的结果显示出来
           var res = change(  ALU.toString(16) );
           document.getElementById("alu_span").innerHTML = res;
           for( i in register_arr)
           {
              var t = document.getElementById("register");
              var t_arr =t.getElementsByTagName("dd");
              var t_show = change( register_arr[i].toString(16) );
              t_arr[parseInt(i)].innerHTML ="R" + i + " : " +t_show;
           } 
  }
  // 重置按钮
  function Button_Reset() 
  {
        for (var i = 0; i < arr.length; i++)
        {
          arr[i].innerHTML = "0";
        };
  }

} // window 末尾

    


// 小数减大数
function rule_5(a,b) 
{ 
  // 处理 小数-大数的函数
  // 因为一切运算都在最高位为4位的情况下模拟 
  // 所以第五位补个1作为借位 --> 10001 - 0010 
  var min = a;
  var max = b;
  var min_str = min.toString(16);
  min_str =  change(min_str);
  min_str = "1" + min_str; // 给小数补位
  return ( parseInt(min_str,16) - max );
}

// 区别change 此函数是对超出4位长度的数进行截取.
// 模拟 只有四位的加减乘除运算.
// 所以将传入的数字 只保留4位 .
function rule_4(a)
{
   var a = a;
   var str = "";
   var a_str = a.toString(16);
   var l = a_str.length;
   if( l > 4)
   {
       for(var i=0; i < 4; i++)
       {
          str += a_str[l-i-1];
       }
       return  parseInt(  str.split("").reverse().join("")  ,16 );
   }
   else
   { 
      return a;
   }
}

// 1 将传入的字符串转为4位 不足位补零
// 2 全部转为大写
// 3 只取后四位
function change(s)  
{                   
     var str = "";    
     if(s.length > 3)
       {
         for (var i = s.length-1 ; i > s.length -5 ; i--) {
           str += s[i];
         };
         str =   str.toUpperCase().split("").reverse().join("");
       }
       else
       { 
         for(var i=0; i< 4 - s.length ;i++)
         {
          str += "0";
         }
         for (var i = 0;  i < s.length ; i++) {
          str += s[i];
         }
       }
       return str;
}