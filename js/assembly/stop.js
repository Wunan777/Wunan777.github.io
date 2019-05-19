var timer = null;

function stopAndReset(obj){
    clearTimeout(timer);

    ReSet();

    PC = 0;      // 10进制
    cursor = 0;
    status = 0;
    FLAG = 0;  // 默认是开中断的
    Level = 0;
    Level_Change = 0;
    newLine("> ");
    // newLine.call(TEC1,"> ");
}