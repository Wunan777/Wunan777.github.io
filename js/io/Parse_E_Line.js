function Parse_E_Line(content)
{
          if( content == "")
          {
             this.status = 0; // 在A状态下遇到 空串退出到0状态
             newLine.call(this,"> ");
          }
          else
          {
            this.memory[this.PC++] = content;
            new_line_num.call(this,"");
          }
}