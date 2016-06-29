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
             else if(/\s*MVRD\s+R(1(0|1|2|3|4|5)|0?\d{1}|0)\s*,\s*[0-9A-F]{1,4}\s*/.exec(content)!= null)  /// 特殊的两个
             {   
                 content = content.replace(order,'');
                 res += A_Get_R(content,1);                                                            // R后面的数字12
                 res += content.replace( ('R'+A_Get_R(content,1)),"").replace(" ","").replace(",",""); // ,后面  e值
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
             console.log("save is "+PC);
             if( order == 'MVRD'  )
             {
               // 88 0 123{1,4} 
               memory[PC++] = res.slice(0,3);
               memory[PC++] = res.slice(3);
             }
             else if( order == "CALA")
             {
                // CE 2000
                memory[PC++] = res.slice(0,2);
                memory[PC++] = res.slice(2);
             }
             else //ADD等 
             {
                memory[PC++] = res;
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