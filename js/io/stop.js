var timer = null;

function stopAndReset(obj){
    clearTimeout(timer);

    ReSet.call(TEC1,"");
    TEC1.PC = 0;      // 10进制
    TEC1.cursor = 0;
    TEC1.status = 0;
    // newLine.call(TEC1,"> ");
}