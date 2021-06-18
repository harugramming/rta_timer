"use strict";

document.getElementById("hour").onchange = function(){
    var input_hour = document.getElementById("hour").value;
    var input_minute = document.getElementById("minute").value;
    var input_second = document.getElementById("second").value;

    var hour = Number(input_hour);
    var minute = Number(input_minute);
    var second = Number(input_second);

    var result
    result = hour*3600000+minute*60000+second*1000;

    document.getElementById("all").value=result;
};

document.getElementById("minute").onchange = function(){
    var input_hour = document.getElementById("hour").value;
    var input_minute = document.getElementById("minute").value;
    var input_second = document.getElementById("second").value;

    var hour = Number(input_hour);
    var minute = Number(input_minute);
    var second = Number(input_second);

    var result
    result = hour*3600000+minute*60000+second*1000;

    document.getElementById("all").value=result;
};

document.getElementById("second").onchange = function(){
    var input_hour = document.getElementById("hour").value;
    var input_minute = document.getElementById("minute").value;
    var input_second = document.getElementById("second").value;

    var hour = Number(input_hour);
    var minute = Number(input_minute);
    var second = Number(input_second);

    var result
    result = hour*3600000+minute*60000+second*1000;

    document.getElementById("all").value=result;
};