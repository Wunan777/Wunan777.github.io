function U_Show()
{
   Read();
}

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


