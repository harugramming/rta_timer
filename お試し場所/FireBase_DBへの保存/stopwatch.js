'use strict';

var database = firebase.database();

var room = "test";
const send = document.getElementById("send");


var nameArray = [];
var timeArray = [];


send.addEventListener('click', function() {

  var username = document.getElementById("username").value;
  room += "/" + username;

  for(var i = 0; i < 5; i++){
    var name = "name" + (i+1);
    var time = "time" + (i+1);

    nameArray[i] = document.getElementById(name).value;
    timeArray[i] = document.getElementById(time).value;
  
    document.getElementById(name).value="";
    document.getElementById(time).value="";
    document.getElementById("username").value="";
  }
  console.log(nameArray);
  console.log(timeArray);

  
    database.ref(room).push({
        username:username,
        name:nameArray,
        time:timeArray
    });

    
});

//データの取得

var names = firebase.database().name;

const output = document.getElementById('output');
var nameOutputArray = [];
var timeOutputArray = [];


//"test/はる/-MQBEFAbMQ_xyJfG1RF-"


output.addEventListener('click', function(){

  //DBのパス名を設定
  var db_path = document.getElementById('db_path').value;


  

  //JSON形式のデータをDBから取得
  firebase.database().ref(db_path).once('value').then((snapshot) => {
    var json = (snapshot.val());
  
    console.log(json);
    console.log(json['name']);
    console.log(json['time']);
    nameOutputArray = json['name'];
    timeOutputArray = json['time'];

    //テキストボックスへ表示
    for(var i = 0; i < nameOutputArray.length; i++){
      var name_output = "name_output" + (i+1);
      var time_output = "time_output" + (i+1);
  
      document.getElementById(name_output).value = nameOutputArray[i];
      document.getElementById(time_output).value = timeOutputArray[i];
  
    }

  });

})