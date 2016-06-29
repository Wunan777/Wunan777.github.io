var test_table = [
                 "0001",
                 "0101",
                 "0201",
                 '0301','0401','05FA','06FF','07AA','08A','091',
                 '0AA','0BA','411234','44AAAA','451234','461234','474321',
                 '8281','851','8680','871','881','8F','CE1234','6E','6F','EF'
                 ];
var test_res = [ 
                 [ADD,['1','1']],
                 [SUB,['0','1']]
]



for (var i = 0; i < test_table.length; i++) 
{

   var t = [];
   var t = E_To_Fn(test_table[0]);
   var flag = 1;
   if( t[0] == test_res[0][0]  )
   { 
     for(var i=0; i < t[1].length-1 ;i++)
     { 
        console.log("1:  "+t[1][i]);
        console.log("2:  "+test_res[0][1][i]);
       if( t[0][i] !== test_res[0][1][i])
       {  

          flag = 0;
       }
     }

   }
   else
   { 
     // console.log(t[0]);
     // console.log(test_res[0][0]);
     // console.log(t[1]);
     // console.log(test_res[0][1]);
     // console.log('fla');
     flag = 0;
   }
   if(flag == 0)
   {
     console.log(i+"行有错")
   }
   else if( flag == 1)
   {
     console.log('right');
   }



};


