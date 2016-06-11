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
         { 
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