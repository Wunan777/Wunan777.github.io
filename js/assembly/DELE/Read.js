// 读取
function Read()
{  
   var show_content;
   var order;
  
   // MVRD  88 连读
   // CALA  CE 连读
   

   for(var z=PC; ;z++)
   {   
      
      if(memory[z] == undefined)
      {
         break;  // 当为空时跳出
      }
      else
      { 
         // E指令 
             
        // 本行要输出内容 show_content 为转换为A指令后的
         show_content = [];
         order  = memory[z][0]+memory[z][1];

         if(  order == "88" || order == "CE" )// MVRD 是连存的，所以连读
         {  
            show_content = E_To_A(memory[z]);
            if( ++z < memory.length )       // 连读前判断是否越界
            {
              show_content.push(memory[z]);
            }

            read_line( show_content,(z-1) );
         }
         else
         {   
           read_line(  E_To_A(memory[z]) , z );
         }
      }

   }
    newLine('> ');

}



function read_line(arr,num)  // arr由 1到3项组成
{  

   //将p添加到console_div 
   var console_div = document.getElementById('console');
   var p = document.createElement('p');
   var span1 = document.createElement('span');
   var span2 = document.createElement('span');
   var span3 = document.createElement('span');
   var add = "";
   p.setAttribute("class",'rel');//relative
   span1.setAttribute("class",'abs');
   span2.setAttribute("class",'abs');
   span3.setAttribute("class","abs");
   span1.style.left = 0 + 'px';
   span2.style.left = 100 + 'px';
   span3.style.left  = 160 + 'px';

   for(var i=0 ; i < 4 - num.toString(16).length ; i++)
   {
     add += "0";
   }
   span1.innerHTML = add +  num.toString(16) + " : " + arr.shift();                   // 第一个参数存储
   if(  (item = arr.shift()) != undefined )// 如果有第二个参数
   {   
      span2.innerHTML = item;
         
   }
   if(  (item = arr.shift()) != undefined )// 如果有第三个参数
   {
      span3.innerHTML = item;
   }

   p.appendChild(span1);
   p.appendChild(span2);
   p.appendChild(span3);

   console_div.appendChild(p);
   

}