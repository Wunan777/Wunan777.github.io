function E_To_A(content)  // 0010
{    
	var content = content;
	var code = content.slice(0,2);
	var Each_Date = [];
	var res = [];
    
    if( content.length < 2 ) // 
    {
        res.push("Code^Error!");
    	return res;
    }
	for (var i = 0; i < table.length; i++) 
	{
	    Each_Date = table[i].split(" "); 
	    if( code == Each_Date[1]) // 找到序号 0012 
	    {                         // 找参数去除前两位00 得到12
             res.push(Each_Date[0]);  // res : ADD 
	    	 content = content.slice(2);
	    	 break;
	    }
	}
	// 未找到则返回
    if( i == table.length)
    {
        res.push("Code^Error!");
        return res;
    }

    // 找到则继续寻找参数
     if( Each_Date[2]  == 'R_2' )//低位舍弃
     {  
     	if( /^[0-9A-F]{2,}$/.exec(content)!=null )  // 允许多 但是参数必须够 而且要在0-9A-F之间
     	{
           res.push( "R" + parseInt( content[0],16).toString() );
           res.push( "R" + parseInt( content[1],16).toString() );
     	}
     	else
     	{
            res.push("Missing_Parameter^Error!");
     	}
     }
     else if( Each_Date[2]  ==  'R_1' )         // 低位舍弃   MVRD R0也在此处判断 880
     {   
     	 if( /^[0-9A-F]{1,}$/.exec(content)!=null )
     	 {
     	 	 res.push( "R" + parseInt( content[0],16).toString() );
     	 }
     	 else{
     	 	res.push("Missing_Parameter^Error!");
     	 }
     }
     else if( Each_Date[2] == 'OFFSET' )
     {    
     	  if( (/^[0-9A-F]{1,}$/).exec(content)!=null )
     	  {   
              content.length>4?res.push(content.slice(0,4)): res.push(content);
     	  }
          else if( code == "CE" ) //CALA 特殊 memory[PC] = CE 其值存在下一行 这一行只有对应码code
          {
               if( content.replace(" ","") != "" )  //
               { 
                  res.push("Parameter^Error!");
               }
          }
     	  else
     	  {
     	  	 res.push("Missing_Parameter^Error!");
     	  }
     }
     else if( Each_Date[2] == 'PORT'  )
     {    
     	  if( (/^(81|80)$/).exec(content)!=null )
     	  {
              res.push(content);
     	  }
     	  else
     	  {
     	  	 res.push("Missing_Parameter^Error!");
     	  }
     }
     else if( Each_Date[2] == 'NONE')
     {
     	//// 无
     }
     else
     {    
     	 res.push("参数标志位写错了！");
     }
     return res; // 已经找到对应参数 跳出; 
  
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
