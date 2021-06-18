"use strict";

const lapCount  = 200; // ラップ保持数
let lapNum = 1;

const storage = getStorage();
let lapArray = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

let state       = storage.state       ?? 0, // 動作状態
    startTime   = storage.startTime   ?? 0, // スタートタイム
    stopTime    = storage.stopTime    ?? 0, // ストップタイム
    lapTime     = storage.lapTime     ?? 0, // ラップスタートタイム
    lapStopTime = storage.lapStopTime ?? 0, // ラップストップタイム
    id; // setInterval ID

onload = function() {
    // localStorageに動作状態が保存されていた場合は動作状態復元
    if(state === 1) {
        if(id = setInterval(printTime, 1)) {
            document.querySelector('#start').value = 'STOP';
            document.querySelector('#reset').value = 'LAP';
        }
        setStorage();
    }
}

//新規登録処理
register.addEventListener('click', function(e) {
    var mailAddress = document.getElementById('mailAddress').value;
    var password = document.getElementById('password').value;
    
    firebase.auth().createUserWithEmailAndPassword(mailAddress, password)
    .catch(function(error) {
      alert('登録できません（' + error.message + '）');
    });
  });

//ログイン処理
login.addEventListener('click', function(e) {
    var mailAddress = document.getElementById('mailAddress').value;
    var password = document.getElementById('password').value;
    
    firebase.auth().signInWithEmailAndPassword(mailAddress, password)
    .catch(function(error) {
      alert('ログインできません（' + error.message + '）');
    });
    //認証状態の確認
firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      //ログイン状態
      alert("ログインに成功しました");
    }else{
      //ログアウト状態
    }
  });
  });



  
const eventHandlerType =
    window.ontouchstart !== undefined ? 'touchstart' : 'mousedown';

// START押下時イベント
document.querySelector('#start').addEventListener(eventHandlerType, function() {
    // 停止中
    if(state === 0) {
        // カウント開始
        if(id = startCount()) {
            // ボタンのラベル変更
            document.querySelector('#start').value = 'STOP';
            document.querySelector('#reset').value = 'LAP';
            // 動作状態を変更
            state = 1;
            setStorage();
        }
    }
    // 動作中
    else {
        // カウントインターバルが動作中
        if(id) {
            // インターバル停止
            clearInterval(id);
            // カウント停止
            stopCount();
            // ボタンのラベルを戻す
            document.querySelector('#start').value = 'START';
            document.querySelector('#reset').value = 'RESET';
            // 動作状態を変更
            state = 0;
            deleteStorage();
        }
    }
}, false);

// RESET押下時イベント
document.querySelector('#reset').addEventListener(eventHandlerType, function() {
    let timeArray = getTime();

    let lapcomparison = (timeArray[0] - lapArray[lapNum-1])/1000;
    
    // 停止中ならリセット
    if(state === 0) {
        stopTime    = 0;
        lapStopTime = 0;
        lapNum      = 1;

    // 表示初期化
    document.querySelector('.rap').innerHTML = '';
    document.querySelector('#all_timer').textContent = '00:00.0';
    }

    // 動作中ならLAP動作
    else {
        var add_contents = 0;
            add_contents = "<div class=rap>";
            add_contents += "</div>";

        var add_main = 0;
            add_main = "<div class=main>";
            add_main += (lapNum++);
            add_main += " : ";
            add_main += getTimetoString(timeArray[0]);
            add_main += "</div>";

        var add_split = 0;
            add_split = "<div class=split>";
            add_split += Math.floor(lapcomparison * 10) / 10;
            add_split += "</div>";

        
        //タイムを追加
        $('.rap_display').append(add_contents);
        $('.rap:last').append(add_main);
        $('.rap:last').append(add_split);

        //区間タイムごとにCSS（色）を変更
        if(lapcomparison < 0){
            $('.split:last').css('color','blue');
        }
        else if(lapcomparison > 0){
            $('.split:last').css('color','red');
        }


        //ラップタイムを表示
        document.querySelector('#segment_timer').textContent = getTimetoString(timeArray[1]);
        lapTime = Date.now();

        // lap保持数を超えたら先頭の子要素を削除
        if(document.querySelector('.rap').childElementCount > lapCount)
            document.querySelector('.rap').removeChild(document.querySelector('.rap').childNodes[0]);

        // スクロール位置を最下部に
        document.querySelector('.rap').scrollTop = document.querySelector('.rap').scrollHeight;

        setStorage();
    }
}, false);

// カウント開始
function startCount() {
    const now = Date.now();
    startTime = now - stopTime;
    lapTime   = now - lapStopTime;
    return setInterval(printTime, 1);
}

// カウント停止
function stopCount() {
    const now   = Date.now()
    stopTime    = now - startTime;
    lapStopTime = now - lapTime;
}

// 経過時間表示
function printTime() {
    let timeArray = getTime();
    document.querySelector('#all_timer').textContent = getTimetoString(timeArray[0]);
}

function getTime(){
    const
        now       = Date.now(),
        time      = now - startTime,
        splitTime = now - lapTime;

    return [time, splitTime];
}

//" time(数値) "を受け取り、" ○○：○○(文字列) "に変換して返します。
function getTimetoString(time){
    let
        StrirngTime = 0;

        if(Math.floor(time / 3600000) > 1){
        StringTime =
            Math.floor(time / 3600000) + ':' +
            String(Math.floor(time / 60000) % 60).padStart(2, '0') + ':' +
            String(Math.floor(time / 1000) % 60).padStart(2, '0') + '.' +
            String(Math.floor(time % 1000 / 100));
        }else{
        StrirngTime =
            String(Math.floor(time / 60000) % 60).padStart(2, '0') + ':' +
            String(Math.floor(time / 1000) % 60).padStart(2, '0') + '.' +
            String(Math.floor(time % 1000 / 100));
    }
        return StrirngTime;
}

// localStorage保存
function setStorage() {
    localStorage.setItem('stopwatch_params', JSON.stringify({
        state: state,
        startTime: startTime,
        stopTime: stopTime,
        lapTime: lapTime,
        lapStopTime: lapStopTime,
    }));
}

// localStorage削除
function deleteStorage() {
    localStorage.removeItem('stopwatch_params');
}

// localStorage取得
function getStorage() {
    const params = localStorage.getItem('stopwatch_params');
    return params ? JSON.parse(params) : {};
}



var database = firebase.database();

let room = "chat_room";
const send = document.getElementById("send");
const name = document.getElementById("name");
const message = document.getElementById("message");
const output = document.getElementById("output");

send.addEventListener('click', function() {
    database.ref(room).push({
        name:name.value,
        message:message.value
    });
    message.value="";
    name.value="";
});

database.ref(room).on("child_added", function(data) {
    const v = data.val();
    const k = data.key;
    let str = "";
    str += '<div class="name">名前：'+v.name+'</div>';
    str += '<div class="text">メッセージ：'+v.message+'</div>';
    output.innerHTML += str;
});