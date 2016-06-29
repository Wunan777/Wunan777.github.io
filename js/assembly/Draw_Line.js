 // 生成PC序号的列
function new_line_num()
{  
  newLine( add_zore( PC.toString(16).length ) + PC.toString(16).toUpperCase() + " : " );
  function add_zore(len)
  {
     var num;                                  // 补足位 如1 --> 0001 num则为3
     var add="";
     if( ( num = 4 - len ) > 0)
     {
      for(var i =0 ;i<num ;i++)
      {
         add +="0";
      }
     }
     return add;
  }
}
function newLine(content)
{ // 传入内容
  var console_div = document.getElementById("console");
  var old_p = document.getElementById("now");       
  var new_p = document.createElement("p");
  var max   = console_div.offsetHeight;             // 显示区域的高度
  var p     = console_div.getElementsByTagName('p');
  var now_height = p.length * 22;                   // 每行22px

  old_p.setAttribute("id","");
  new_p.setAttribute("id","now");

  new_p.innerHTML = content;
  console_div.appendChild(new_p);
    
  if( now_height > max )
  {
      console_div.scrollTop = console_div.scrollHeight;
  }
}    
function error()
{  //生成错误提示
  newLine('         \b         ^error! ');
}