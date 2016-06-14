function G_Run()
{ // this 指向调用函数
  this.SP.push("##");// 主函数的RET
  newLine.call(this,"> ");
  this.cursor = this.PC;
  execute(this);  /// this.type 作为参数
}

function Finish(obj)
{  
   var register_div = document.getElementById("register"+obj.num);
   register_div.getElementsByClassName("PC")[0].innerHTML = obj.cursor.toString(16)-1;
   obj.status = 0;
   ReSet.call(obj,"");
   newLine.call(obj,"> ");
}

function ReSet()
{
    /////// 硬件
    this.SP = [];
    this.PORT = {"80":"0000","81":"0000"};
    this.R_Arr = {
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
    this.C = "0";   // 针对每一位的操作,当有进位时为1,没有进位的时候为0;
    this.
    Z = "0";   // 一次计算当计算结果为0时,为1,否则为0;
}



function execute(THIS)
{  
      /// E_To_Fn()
      /// 输入 : 0012指令 
      /// 输出 : [ fn:ADD, [1,2] ];
      /// 过程中解析不正确返回null
      
     var str;// 当前行命令
     var memory = THIS.memory; // 执行的TEC
     

     //1 首先有当前行
     if( memory[THIS.cursor] == undefined )
     { 
       console.log(THIS.cursor.toString(16)+"行是und");
       Finish(THIS);
       return ;
     }
     else
     {
       str = memory[THIS.cursor];
     }

     var arr_fn = E_To_Fn(str); 
     var fn;
     var parameter_arr = [];
    console.log("当前行数:"+ THIS.cursor.toString(16) );

    //2 当前行可以解析/////////////////
    ////////////////////////////////// MVRD CALA是连读并不会立即执行
     if( arr_fn == null)
     { 
       console.log("命令有错误,不继续执行！");
       Finish(THIS);
       return ;
     }
     else if( arr_fn[0] == MVRD ) // 当为MVRD的时候,指针再次移动指向其存储的值
     {   
        Cursor_Move.call(THIS,"");
        if( memory[THIS.cursor] != undefined )
        {
           arr_fn[1].push( memory[THIS.cursor] );
        }
        else
        {  
           console.log("赋值数没有！");
           Finish(THIS);
           return ;
        }
     }
     else if(arr_fn[0] == CALA)
     {
         cursor++;
         if (memory[THIS.cursor] != undefined) 
         {
            arr_fn[1].push( memory[THIS.cursor] );
         }
         else
         {
            console.log("未取到CALA的值.");
            Finish(THIS);
            return ;
         }
     }

     ///////////////////////////// 当JR等跳转 原子性 立即执行;
    // JR等跳转函数不放入等待队列 //BTN1 改变cursor 避免互相影响
    
     if(arr_fn[0] == JR)
     {
       Cursor_Jump.call( THIS, parseInt(arr_fn[1][0],16) );
       ///下一条
       setTimeout(execute,100,THIS);
     }
     else if(arr_fn[0] == JRC)
     {
       if ( THIS.C == '1') 
       {
         Cursor_Jump.call( THIS, parseInt(arr_fn[1][0],16) );
         setTimeout(execute,100,THIS);
       }
       else
       {
          THIS.cursor++;
          setTimeout(execute,100,THIS);
       }
     }
     else if( arr_fn[0] == JRNC)
     {
       if( THIS.C == '0' )
       {
         Cursor_Jump.call( THIS, parseInt(arr_fn[1][0],16) );
         setTimeout(execute,100,THIS);
       }
       else
       {
          THIS.cursor++;
          setTimeout(execute,100,THIS);
       }
     }
     else if( arr_fn[0] == JRZ)
     {
       if( THIS.Z == '1')
       {
          Cursor_Jump.call( THIS , parseInt(arr_fn[1][0],16) );
          setTimeout(execute,100,THIS);
       }
       else
       {
          THIS.cursor++;
          setTimeout(execute,100,THIS);
       }
     }
     else if( arr_fn[0] == JRNZ)
     {
       if ( THIS.Z =='0') 
       {
          Cursor_Jump.call( THIS , parseInt(arr_fn[1][0],16) );
          setTimeout(execute,100,THIS);
       }
       else
       {
          THIS.cursor++;
          setTimeout(execute,100,THIS);
       }
     }
     else if( arr_fn[0] == JMPA)
     {
        Cursor_Jump.call( THIS , parseInt(arr_fn[1][0],16) );
        setTimeout(execute,100,THIS);
     }
     else
     {
        fn = arr_fn[0];
        parameter_arr = arr_fn[1];
        setTimeout(fn,100,parameter_arr,THIS);
        THIS.cursor++;
        setTimeout(execute,100,THIS);
     }
     
   
}

function Cursor_Move()
{
   this.cursor++;
}
function Cursor_Jump(address)
{
   this.cursor = address;
}


function E_To_Fn(content) 
{   
   
    var content = content;
    var code = content.slice(0,2);
    var Each_Date = [];
    var res = []; // 第一项 函数ADD 第二项 参数数组
    var parameter_num = [];
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
               "CALA CE NONE",
               "EI 6E NONE",
               "DI 6F NONE",
               "RET 8F NONE",
               "IRET EF NONE"
           ];
        /// 映射表
    var table_fn = {
          '00':ADD,
          '01':SUB,
          '02':AND,
          '03':CMP,
          '04':XOR,
          '05':TEST,
          '06':OR,
          '07':MVRR,
          '08':DEC,
          '09':INC,
          '0A':SHL,
          '0B':SHR,
          '41':JR,
          '44':JRC,
          '45':JRNC,
          '46':JRZ,
          '47':JRNZ,
          '80':JMPA,
          '82':IN,
          '85':PUSH,
          '86':OUT,
          '87':POP,
          '88':MVRD,
          'CE':CALA,
          '6E':EI,
          '6F':DI,
          '8F':RET,
          'EF':IRET
        }


      if( content.length < 2 ) // 长度必须大于2
      {
          return null;
      }

    for (var i = 0; i < table.length; i++) 
    {
        Each_Date = table[i].split(" "); 
        if( code == Each_Date[1]) // 找到序号 0012 
        {                         // 找参数去除前两位00 得到12
           res.push( table_fn[code] );  // res : ADD 
           content = content.slice(2);
           break;
        }
    }

      // 未找到则返回
      if( i == table.length)
      {
          return null;
      }

      // 前两位找到,继续找参数
      // 允许参数多余所需,从高位开始取,低位舍弃
        
       if( Each_Date[2]  == 'R_2' )//低位舍弃
       {  
        if( /^[0-9A-F]{2,}$/.exec(content)!=null )   
        {   // 参数范围0-9A-F
             parameter_num.push( parseInt( content[0],16).toString() );
             parameter_num.push( parseInt( content[1],16).toString() );
             res.push(parameter_num);
        }
        else
        {
           return null;
        }
       }
       else if( Each_Date[2]  ==  'R_1' )             // MVRD R0也在此处判断 880
       {   
         if( /^[0-9A-F]{1,}$/.exec(content)!=null )
         {   //F 存入的15
           parameter_num.push( parseInt( content[0],16).toString() );
           res.push(parameter_num);
         }
         else
         {
           return null; 
        }
       }
       else if( Each_Date[2] == 'OFFSET' )
       {    
          if( (/^[0-9A-F]{1,}$/).exec(content)!=null )
          {   
              content.length > 4 ? parameter_num.push(content.slice(0,4)) : parameter_num.push(content);
              res.push(parameter_num);
          }
          else
          {
             return null;
          }
       }
       else if( Each_Date[2] == 'PORT'  )
       {    
          if( (/^(81|80)$/).exec(content)!=null )
          {
                parameter_num.push(content);
                res.push(parameter_num);
          }
          else
          {
             return null;
          }
       }
       else if( Each_Date[2] == 'NONE')
       {
          res.push(parameter_num);
       }
      
       return res;
}