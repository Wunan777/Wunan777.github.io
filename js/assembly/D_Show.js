function D_Show() {
    d_read();
}

function d_read() {
    var show_content;
    var z = PC;
    var add = "";
    for (var i = 0; i < 15; i++) {
        show_content = [];
        for (var j = 0; j < 8; j++) {
            if (memory[z] == undefined) {
                show_content[j] = "0000";
            } else {
                for (var k = 0; k < 4 - memory[z].toString(16).length; k++) {
                    add += "0";
                }
                show_content[j] = add + memory[z];
                add = "";
            }
            z++;
        }
        read_line_D(show_content, (z - 8));
    }
    newLine('>');
}

function read_line_D(arr, num) {
    var console_div = document.getElementById('console');
    var p = document.createElement('p');
    var span1 = document.createElement('span');
    var span2 = document.createElement('span');
    var span3 = document.createElement('span');
    var span4 = document.createElement('span');
    var span5 = document.createElement('span');
    var span6 = document.createElement('span');
    var span7 = document.createElement('span');
    var span8 = document.createElement('span');
    var span9 = document.createElement('span');
    var span10 = document.createElement('span');
    var add = "";


    p.setAttribute("class", 'rel');//relative
    span1.setAttribute("class", 'abs');
    span2.setAttribute("class", 'abs');
    span3.setAttribute("class", 'abs');
    span4.setAttribute("class", 'abs');
    span5.setAttribute("class", 'abs');
    span6.setAttribute("class", 'abs');
    span7.setAttribute("class", 'abs');
    span8.setAttribute("class", 'abs');
    span9.setAttribute("class", 'abs');
    span10.setAttribute("class", 'abs');


    span1.style.left = 0 + 'px';
    span2.style.left = 80 + 'px';
    span3.style.left = 120 + 'px';
    span4.style.left = 160 + 'px';
    span5.style.left = 200 + 'px';
    span6.style.left = 240 + 'px';
    span7.style.left = 280 + 'px';
    span8.style.left = 320 + 'px';
    span9.style.left = 360 + 'px';
    span10.style.left = 400 + 'px';


    for (var i = 0; i < 4 - num.toString(16).length; i++) {
        add += "0";
    }
    span1.innerHTML = add + num.toString(16);

    span2.innerHTML = arr.shift();
    span3.innerHTML = arr.shift();
    span4.innerHTML = arr.shift();
    span5.innerHTML = arr.shift();
    span6.innerHTML = arr.shift();
    span7.innerHTML = arr.shift();
    span8.innerHTML = arr.shift();
    span9.innerHTML = arr.shift();

    span10.innerHTML = ".......";

    p.appendChild(span1);
    p.appendChild(span2);
    p.appendChild(span3);
    p.appendChild(span4);
    p.appendChild(span5);
    p.appendChild(span6);
    p.appendChild(span7);
    p.appendChild(span8);
    p.appendChild(span9);
    p.appendChild(span10);

    console_div.appendChild(p);

}