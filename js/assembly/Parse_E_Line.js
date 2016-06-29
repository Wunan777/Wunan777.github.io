function Parse_E_Line(content)
{
          if( content == "")
          {
             status = 0; // 在A状态下遇到 空串退出到0状态
             newLine("> ");
          }
          else
          {
            memory[PC++] = content;
            new_line_num();
          }
}