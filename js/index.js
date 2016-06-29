$(document).ready(function(){


              // 判断cookie
              if( document.cookie )
              {
                 $("#User").css({display:"block"});
                 $("#Logoff").css({display:"block"});
                 $("#User").html( document.cookie["Account"] );
              }
              else
              {
                 $("#Login").css({display:"block"});
                 $("#Sign_Up").css({display:"block"});
              }
              
              //开启轮播
              $('.carousel').carousel();

              //登陆 
              $("#Login").on("click",function(){
                $("#Login_Form").css( { display:"block"} );
                $("#cover").fadeIn();
              });
              //注册
              $("#Sign_Up").on("click",function(){
               $("#Sign_Form").css( { display:"block"} );
               $("#cover").fadeIn();
              });

             
              
              // 提交登陆表
              $("#Login_Send").on("click",function(){
                    //获取用户名
                    var Login_Account = $("#inputAccount").val();
                    //获取输入密码
                    var Login_PassWord = $("#inputPassword").val();
                
                    $.ajax
                    ({   //请求登录处理页
                        type:"POST",
                        url: "Login.jsp", //登录处理页
                        //传送请求数据
                        data: { Login_Name: Login_Account, Login_Pass: Login_PassWord },//后台获取的信息
                        success: function (strValue) { //登录成功后返回的数据
                            //根据返回值进行状态显示
                            if (strValue == "True") {//注意是True,不是true
                              Login( Login_Account );
                              $("#Login_Form").find(".cancel_btn").trigger("click");
                            }
                            else {
                              $("#Login_Send + span").html("用户/密码错误");
                            }
                        },
                        error:function(){
                     
                           $("#Login_Send + span").html("无法访问服务器");
                        }

                    });
              });
              // 提交注册表
              $("#Sign_Send").on("click",function(){
                  
                    var Sign_Account = $("#Sign_Account").val();
                    var Sign_Password = $("#Sign_Password").val();
                    var Sign_Check_Password = $("#Sign_Check_Password").val();
                    var error = $("#Sign_Form").find(".error");
                    
                    if(/^[a-zA-Z]\w{3,15}$/ig.test(Sign_Account)
                       &&/^[a-zA-Z0-9]{6,16}$/.test(Sign_Password) )//先判断是否合法
                    {    
                        // 在判断密码一致
                        $(".suggestion_area").find("span").html("");
                        if( Sign_Password == Sign_Check_Password)
                        {
                          $.ajax
                          ({   //请求登录处理页
                              type:"POST",
                              url: "Login.jsp", //登录处理页
                              //传送请求数据
                              data: { Sign_Name: Sign_Account, Sign_Pass: Sign_Password },//后台获取的信息
                              success: function (strValue) 
                              {   //登录成功后返回的数据
                                  //根据返回值进行状态显示
                                  if(strValue == "True") {//注意是True,不是true
                                     ////重新定向
                                     alert("ok");
                                  }
                                  else {
                                    $(error).html("用户名已经存在");
                                  }
                              },
                              error:function()
                              {
                                $(error).html("无法访问服务器");
                              }

                          }); 
                        }
                        else
                        {
                          $(error).html("两次密码不一致");
                        }

                    }
                    else
                    {
                      $(".suggestion_area").find("span").html("用户名由字母a～z(不区分大小写),数字0～9,点,减号或下划线组成&#10只能以字母开头,包含字符,数字,下划线&#10用户名长度为4～18个字符.&#10密码由由字母a～z(不区分大小写),数字0～9,长度16个字符.");
                      $(this).parent().find("error").html("");
                    }

                   
              });
              // 退出登录
            　$("#Logoff").on("click",function(){
                  var name = $("#User").html();
                  $.ajax
                  ({   //请求登录处理页
                      type:"POST",
                      url: "Login.jsp", //登录处理页
                      //传送请求数据
                      data: { userName: name },//后台获取的信息
                      success: function (strValue) {  
                         Login_Off();
                      },
                      error:function(){
                        alert("请求注销错误！");
                      }

                  });
              });

              $(".cancel_btn").on("click",function(){
                 $(this).parent().parent().fadeOut();
                 $(this).parent().fadeOut();
                 $(this).parent().find("input").val("");
                 $(this).parent().find("span").html("");
              });
              
              
         });
        
        function Login(name){
           $("#Sign_Up").css({display:"none"});
           $("#Login").css({display:"none"});
           $("#User").html(name);
           $("#User").css({display:"block"});
           $("#Logoff").css({display:"block"});
        }
        function Login_Off(){
           $("#Sign_Up").css({display:"block"});
           $("#Login").css({display:"block"});
           $("#User").html("");
           $("#User").css({display:"none"});
           $("#Logoff").css({display:"none"});
        }