"use strict";

const lapCount  = 200; // ラップ保持数
let lapNum = 1;

const storage = getStorage();

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
    // 停止中ならリセット
    if(state === 0) {
        stopTime    = 0;
        lapStopTime = 0;
        // 表示初期化
        document.querySelector('#lap').innerHTML = '';
        document.querySelector('#disp').textContent = '0:00:00.000 / 0:00:00.000';
    }
    // 動作中ならLAP動作
    else {
        // #lap内の最後にdiv要素追加
        document.querySelector('#lap').appendChild(document.createElement("div"));

        // 追加した要素に経過時間表示
        document.querySelector('#lap>div:last-of-type').textContent = (lapNum++) + ' : ' + getTimeString();

        lapTime = Date.now();

        // lap保持数を超えたら先頭の子要素を削除
        if(document.querySelector('#lap').childElementCount > lapCount)
            document.querySelector('#lap').removeChild(document.querySelector('#lap').childNodes[0]);

        // スクロール位置を最下部に
        document.querySelector('#lap').scrollTop = document.querySelector('#lap').scrollHeight;

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
    document.querySelector('#disp').textContent = getTimeString();
}

function getTimeString() {
    const
        now       = Date.now(),
        time      = now - startTime,
        splitTime = now - lapTime,

        main =
            Math.floor(time / 3600000) + ':' +
            String(Math.floor(time / 60000) % 60).padStart(2, '0') + ':' +
            String(Math.floor(time / 1000) % 60).padStart(2, '0') + '.' +
            String(time % 1000).padStart(3, '0'),

        split =
            Math.floor(splitTime / 3600000) + ':' +
            String(Math.floor(splitTime / 60000) % 60).padStart(2, '0') + ':' +
            String(Math.floor(splitTime / 1000) % 60).padStart(2, '0') + '.' +
            String(splitTime % 1000).padStart(3, '0');

    return main + ' / ' + split;
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