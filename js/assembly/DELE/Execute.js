function execute()
{  
       /// E_To_Fn()
      /// 输入 : 0012指令 
     /// 输出 : [ fn:ADD, [1,2] ];
    /// 过程中解析不正确返回null

     var str;// 当前行命令
     //1 首先有当前行
     if( memory[cursor] == undefined)
     { 
       console.log(cursor.toString(16)+"行为und");
       Finish();
       return ;
     }
     else
     {
       str = memory[cursor];
     }

     var arr_fn = E_To_Fn(str); 
     var fn;
     var parameter_arr = [];
    console.log("当前行数:"+ cursor.toString(16) );
    //2 当前行可以解析
     if( arr_fn == null)
     { 
       console.log("命令有错误,不继续执行！");
       Finish();
       return ;
     }
     else if( arr_fn[0] == MVRD ) // 当为MVRD的时候,指针再次移动指向其存储的值
     {   
        cursor++;
        if( memory[cursor] != undefined )
        {
           arr_fn[1].push( memory[cursor] );
        }
        else
        {  
           console.log("赋值数没有！");
           Finish();
           return ;
        }
     }
     else if(arr_fn[0] == CALA)
     {
         cursor++;
         if (memory[cursor] != undefined) 
         {
            arr_fn[1].push( memory[cursor] );
         }
         else
         {
            console.log("未取到CALA的值.");
            Finish();
            return ;
         }
     }
     
      fn = arr_fn[0];
      parameter_arr = arr_fn[1];
      setTimeout(fn,100,parameter_arr);
     
//    console.log("当前行:"+cursor);
      cursor++;
      setTimeout(execute,100);

   
}