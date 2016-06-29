function Parse_Init_Order(content)
{        
  // console.log("content:"+content);
	if( command_legal(content) )
	{
	  if( content == "")
	  {
	    newLine('> ');
	  }
	  else   
	  {       
	        content = content.replace(/ /g,'');
	        PC = parseInt( get_num(content),16 );
	          
	        if( content[0] == 'A' ) // 解析到有A命令
	        {   
	               new_line_num();                
	               status = 1;                         
	        }
	        else if( content[0] == 'E' ) // 解析到有E命令
	        { 
	              new_line_num();                
	              status = 2;
	        }
	        else if( content[0] == 'G')
	        {
	             cursor = parseInt( content.replace("G","").replace(" ","") , 16 );
	             status = 3;
	             G_Run(); /////开始从cursor处进行解析
	        }
	        else if( content[0] == 'U') // 显示出保存内容
	        {   
	             status = 4;
	             U_Show();
	             status = 0;
	        }
	        
	    }
	}
	else
	{
	error();
	newLine("> ");
	}
}
function command_legal(str)
{
  if( str == "")
  {
      return true;                                   
  }
  // 合法 E 2000  A 2000 U 2000或者空
  if( (/^\s*(E|A|U|G)\s+([0-9A-F]{1,4})$/).exec(str)!=null )
  {
    return true
  }
  else
  {
    return  false;                                       // false
  }
}
function get_num(content)    // 传入字符串  A|E|U|G2300
{     
    arr = content.split('');
    arr.shift();
    content = arr.join(''); // 2300
    return content;
}