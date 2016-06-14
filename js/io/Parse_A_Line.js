/////////   A命令,解析并存储;
function Parse_A_Line(content)
{
   if( content == "")
   {
     this.status = 0; // 在A状态下遇到 空串退出到0状态
     newLine.call(this,"> ");
   }
   else
   {
     if( A_To_E.call(this,content) )
     {
        new_line_num.call(this,"");
     }
     else
     {
        error.call(this,"");
        new_line_num.call(this,"");
     }
   }
}

function A_To_E(content)
{    
     var cur = 0;
     var order = "";
     var each_date = [];
     var res  = "";
     var flag = 1; //标志位 是否解析成功

     // 先将首字母前面的空格消除
     while(content[0] == " ")
     {
     	content = content.slice(1);
     }

     // 找到空格或者到了末尾 截取此部分作为命令
     while( content[cur]!=" " && cur != content.length)
     {
        cur++;
     }
      
     order = content.slice(0,cur);

     for(var i=0; i<table.length; i++)
     {  
        each_date = table[i].split(" ");
     	if( order == each_date[0] )
     	{
     		 // 找到指令对应的code 找参数
     		 res = (each_date[1]);
             break;
     	}
     }

     //未找到则返回错误
     if( i == table.length )
     {
     	flag = 0;
     	return flag;
     }
     else
     {
             //找到对应的order

             if( /^(\s*(ADD|SUB|AND|CMP|XOR|TEST|OR|MVRR)\s+R(1(0|1|2|3|4|5)|0?\d{1}|0)\s*,\s*R(1(0|1|2|3|4|5)|0?\d{1}|0)\s*)$/.exec(content)!= null ) //R2
             {
                // 两个参数 ADD R0,R1 
                // 去除指令ADD -> R0,R1  0,1
                 content = content.replace(order,"");
                 content = content.replace(" ",'');
                 res += ( A_Get_R(content,2) );
             }
             else if( /^\s*(DEC|INC|SHL|SHR|PUSH|POP)\s+R(1(0|1|2|3|4|5)|0?\d{1}|0)\s*$/.exec(content)!=null ) // R1
             {   
                 content = content.replace(order,"");
                 content = content.replace(" ",'');
                 res += ( A_Get_R(content,1) );
             }
             else if(/^\s*(JR|JRC|JRNC|JRZ|JRNZ|JMPA|CALA)\s+[0-9A-F]{1,4}\s*$/.exec(content)!=null) // OFFSET
             {   
                 content = content.replace(order,"");
                 content = content.replace(" ",'');
                 res +=  content ;
             }           
             else if(/^\s*(IN|OUT)\s+(80|81)\s*$/.exec(content)!=null) //PORT
             {   
                 content = content.replace(order,"");
                 content = content.replace(" ",'');
                 res +=  content ;
             }
             else if(/^\s*(EI|DI|RET|IRET)\s*$/.exec(content)!=null)   //NONE
             { 
                /////无操作
             }
             else if(/\s*MVRD\s+R(1(0|1|2|3|4|5)|0?\d{1}|0)\s*,\s*[0-9A-F]{1,4}\s*$/.exec(content)!= null)  /// 特殊的两个
             {   //MVRD R15,123
                 content = content.replace(order,'');
                 res += A_Get_R(content,1);          
                 res += content.replace( ('R'+ parseInt( A_Get_R(content,1) ,16 ) ),"").replace(" ","").replace(",",""); // ,后面  e值
             }
             else if(/^\s*CALA\s+[0-9A-F]{1,4}\s*$/.exec(content)!=null)
             {   
                 content = content.replace(order,'');//CALA 2000
                 content = content.replace(" ",'');  // 剩余2000
                 res += content;            
             }
             else /// 找到了指令 但是对应的参数不对 报错
             {
                 // res += "Parmeter^Error";
                 flag = 0;
                 return flag;
             } 
             
             //参数也找到 进行存储
             //MVRD CALA 单独存储
             console.log("save is "+this.PC);
             if( order == 'MVRD'  )
             {
               // 88 0 123{1,4} 
               this.memory[this.PC++] = res.slice(0,3);
               this.memory[this.PC++] = res.slice(3);
             }
             else if( order == "CALA")
             {
                // CE 2000
                this.memory[this.PC++] = res.slice(0,2);
                this.memory[this.PC++] = res.slice(2);
             }
             else //ADD等 
             {
                this.memory[this.PC++] = res;
             }
            
             return flag; // flag为1
             
     }
}
function A_Get_R(content,num)   //  A命令下传入两位参数的.
{ 

    var r1_pos = content.indexOf('R');
    var r2_pos = content.lastIndexOf('R');
    var r1_num = "";
    	var r2_num = "";
    r1_pos++;   
     while( content[ r1_pos ] <='9' && content[ r1_pos ] >='0' )
     {   
       r1_num += content[ r1_pos ];
       r1_pos++;
     
     }
     r2_pos++;
    while( content[ r2_pos ] <='9' && content[ r2_pos ] >='0' )
     {
       r2_num += content[ r2_pos ];
       r2_pos++;
     }

    if( num == 2)
    {

      return parseInt(r1_num).toString(16).toUpperCase() + parseInt(r2_num).toString(16).toUpperCase() ;

    }
    else if( num == 1)
    { 
      return parseInt(r1_num).toString(16).toUpperCase() ;
    }

}
function A_Get_MvrdNum(content)
{     
    content = content.replace(" ",'');
    var data_pos = content.indexOf(',');
    var data_num = "";
    data_pos++;   
  while(( content[ data_pos ] <='9' && content[ data_pos ] >='0' ) || 
      ( content[ data_pos ] <='F' && content[ data_pos ] >='A' ))
  {   
    data_num += content[ data_pos ];
    data_pos++;
  }
  return data_num;
}
function A_Get_JRNum(content)    // A命令下获得JR offset的值  12FC
{      
       content = content.replace(/ /g,'');
       content = content.replace(/JR/,'');
       return content;
}
function A_Get_InNum(content)
{
        content = content.replace(/ /g,'');
        content = content.replace(/IN/,'');
        return content;
}
function A_Get_OutNum(content)
{
        content = content.replace(/ /g,'');
        content = content.replace(/OUT/,'');
        return content;
}

function A_command_one(content)    // A命令下传入一位参数 寄存器R0-R15
{
	 var r1_pos = content.indexOf('R');
	 var r1_num = "";
	 r1_pos++;   
     while( content[ r1_pos ] <='9' && content[ r1_pos ] >='0' )
     {   
          r1_num += content[ r1_pos ];
          r1_pos++;
     }
     return parseInt(r1_num).toString(16);
}
function A_command_two(content)   //  A命令下传入两位参数的.
{     
    var r1_pos = content.indexOf('R');
    var r2_pos = content.lastIndexOf('R');
    var r1_num = "";
    var r2_num = "";
    r1_pos++;   
    while( content[ r1_pos ] <='9' && content[ r1_pos ] >='0' )
    {   
          r1_num += content[ r1_pos ];
          r1_pos++;
        
    }
    r2_pos++;
      while( content[ r2_pos ] <='9' && content[ r2_pos ] >='0' )
    {
          r2_num += content[ r2_pos ];
          r2_pos++;
    }
      return parseInt(r1_num).toString(16) + parseInt(r2_num).toString(16);
}