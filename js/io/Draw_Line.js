function newLine(content)
{ 
  var console_div = document.getElementById('console'+this.num);
  var p   = console_div.getElementsByTagName('p');
  var new_p = document.createElement("p");
  var max_height = console_div.offsetHeight;
  var now_height = p.length * 22;
  new_p.innerHTML = content;
  console_div.appendChild(new_p);
  if( now_height > max_height)
  {
      console_div.scrollTop = console_div.scrollHeight;
  }
}
function AddCharToLastLine(content)
{   // this 指向当前tec
    var console_div; 
    var p;
    var excute_num = this.num;
    console_div = document.getElementById('console'+excute_num);//哪个tec调用,获得哪个屏幕
    p = console_div.getElementsByTagName('p');
    p[p.length-1].innerHTML += content;
}
function RecCharAtLastLine()
{
    var console_div; 
    var p;
    var excute_num = this.num;
    console_div = document.getElementById('console'+excute_num);
    p = console_div.getElementsByTagName('p');
    p[p.length-1].innerHTML = p[p.length-1].innerHTML.slice(0,-1);
}   

/////////////////
// 生成PC序号的列
function new_line_num()
{  
  newLine.call( this, add_zore( this.PC.toString(16).length ) + this.PC.toString(16).toUpperCase() + " : " );

}
function error()
{  //生成错误提示
   newLine.call(this,'         \b         ^error! ');
}
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