"use strict";

// -----------------------
//  初期化
// -----------------------

var records_array = [];

//区間ベストを更新するための配列
var SegmentTimeBest_number = [];
var SegmentTimeBest_time = [];

const lapCount  = 200; // ラップ保持数

let lapNum = 1;
let lapflag = 0;//ダイアログ表示を管理する。
var recieve_records_flag = 0;

//BestPossibleTimeを作る。
let bps_current_time=0;
let best_data_length=0;

//スクロールでlapとるやつを考える。
let scrollflag=0;
let scroll_timer_flag=0;

//PB更新した時に更新するデータの配列
var PB_sumtime = [];
var PB_segmenttime=[];
var PB_segmentTimebest=[];

let first_play=0;
let segment_color = '#53769e';      // 計測中の区間の背景色 

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

//-------------------------
// START押下時イベント
//-------------------------
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
            lapflag=1;
            scroll_timer_flag=1;

            if(lapNum == 1){ //計測途中で一時停止をし、再開した場合を除く
                $('#seg0').css('background-color',segment_color);
            }
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

// RESETボタン押下時
document.querySelector('#reset').addEventListener(eventHandlerType, function() {
    reset_lap();
}, false);

//-------------------------
// reset(lap)押下時の関数
//-------------------------
function reset_lap(){

    let timeArray = getTime();
    let lapcomparison = (timeArray[0] - records_array[lapNum-1].PbSumTime);
    
    // 停止中ならリセット
    if(state === 0) {
        stopTime    = 0;
        lapStopTime = 0;
        lapNum      = 1;

        // 表示初期化
        
        //王冠の削除
        if(recieve_records_flag===1){
            for(let i=0;i<best_data_length;i++){
                $('#crown').remove();
                $('#seg' + (i)).css({'cssText': 'grid-template-columns: 102px 60px 1fr !important;'});
            }
        }
        //タイマーの表示を初期化
        document.querySelector('#all_timer').textContent = '00:00.0';
        if(recieve_records_flag===1){
            for(let i=0;i<best_data_length;i++){
                document.querySelector('#seg_comparison'+i).textContent=' ';
            }
        }
        document.querySelector('#segment_timer').textContent='00:00.0';
        
        //区間タイムの初期化
        for(var i=0; i<records_array.length; i++){
            $('#seg_time' + i).text(getTimetoString(records_array[i].PbSumTime));
        }
        scroll_timer_flag=0;
        PB_sumtime.length=0;
        PB_segmentTime.length=0;
        PB_segmentTimebest.length=0;
        SegmentTimeBest_number.length=0;
        SegmentTimeBest_time.length=0;
    }


    // 動作中ならLAP動作
    else {
        $('#seg' + (lapNum-1)).css('background-color','#202020');
        if(records_array[records_array.length-1].PbSumTime==0){
            //最初の人の処理
            //PBの区間タイムを、現タイムに書き換える
            $('#seg_time' + (lapNum-1)).text(getTimetoString(timeArray[0]));

            //Previous_Segmentは常に表示させない
            $('#PS_time').text("");

            //Previous_Segment(PB)は常に表示させない
            $('#PS_PB_time').text("");

            //Possible_Time_Saveは常に表示させない
            $('#PBT_time').text("");

            //PBに全てを保存させる
            PB_sumtime.push(timeArray[0]);
            PB_segmenttime.push(timeArray[1]);
            PB_segmentTimebest.push(timeArray[1]);

            //ラップタイムを表示
            document.querySelector('#segment_timer').textContent = getTimetoString(timeArray[1]);
            lapTime = Date.now();

            // lap保持数を超えたら先頭の子要素を削除
            if(document.querySelector('#rap_display').childElementCount > lapCount)
                document.querySelector('#rap_display').removeChild(document.querySelector('.rap').childNodes[0]);

            // スクロール位置を最下部に
            if(lapNum > 6){
                document.querySelector('#rap_display').scrollTop = 24 * lapNum;
            }

            $('#BPT_time').text("");
            setStorage();

            $('#seg'+lapNum).css('background-color',segment_color);

            //ラップナンバーを増やす
            lapNum++;

        }
        else{
            //PBの区間タイムを、現タイムに書き換える
            $('#seg_time' + (lapNum-1)).text(getTimetoString(timeArray[0]));

            //区間タイムを更新した場合
            if(timeArray[1] < records_array[lapNum-1].SegmentTimeBest){
                SegmentTimeBest_number.push(lapNum);
                SegmentTimeBest_time.push(timeArray[1]);
            }

            //Previous_Segment
            var Previous_Segment = 0;
            Previous_Segment = timeArray[1] - (records_array[lapNum-1].SegmentTimeBest);
            $('#PS_time').text(getTimetoString(Previous_Segment));

            //Previous_Segment(PB)
            var Previous_Segment_PB = 0;
            Previous_Segment_PB = timeArray[1] - (records_array[lapNum-1].PbSegmentTime);
            $('#PS_PB_time').text(getTimetoString(Previous_Segment_PB));

            //Possible_Time_Save
            if(lapNum < records_array.length){
                var Possible_Time_Save = 0;
                Possible_Time_Save = records_array[lapNum].PbSegmentTime - records_array[lapNum].SegmentTimeBest;
                $('#PBT_time').text(getTimetoString(Possible_Time_Save));
            }

            //自己べとの比較を表示
            if(lapcomparison < 0){
            $('#seg_comparison' + (lapNum-1)).text(getTimetoString(lapcomparison)).css('color', '#20caff');   
            }else{
                $('#seg_comparison' + (lapNum-1)).text(getTimetoString(lapcomparison)).css('color', '#ff909a');
            }

            
            //PB出た時用の処理
            PB_sumtime.push(timeArray[0]);
            PB_segmenttime.push(timeArray[1]);
            //ゴールデン出た時の処理
            if(timeArray[1]<records_array[lapNum-1].SegmentTimeBest){
                PB_segmentTimebest.push(timeArray[1]);
                $('#seg_comparison' + (lapNum-1)).before("<img src='crown.png' style='width:20px; height:20px' id='crown'>");
                $('#seg' + (lapNum-1)).css('grid-template-columns', '77px 25px 60px 1fr');
                $('#seg_comparison' + (lapNum-1)).text(getTimetoString(lapcomparison)).css('color', '#ffff22');
            }else{
                PB_segmentTimebest.push(records_array[lapNum-1].SegmentTimeBest);
            }

            //ラップタイムを表示
            document.querySelector('#segment_timer').textContent = getTimetoString(timeArray[1]);
            lapTime = Date.now();

            // lap保持数を超えたら先頭の子要素を削除
            if(document.querySelector('#rap_display').childElementCount > lapCount)
                document.querySelector('#rap_display').removeChild(document.querySelector('.rap').childNodes[0]);

            // スクロール位置を最下部に
            if(lapNum > 6){
                document.querySelector('#rap_display').scrollTop = 24 * lapNum;
            }

            //BPTを作成する。
            $('#BPT_time').text(getTimetoString(bestpossibetime(timeArray[0],lapNum)));



            setStorage();
            $('#seg'+lapNum).css('background-color',segment_color);
            //ラップナンバーを増やす
            lapNum++;
            
        }
        
    }

    //END　最終区間で"LAP"ボタンを押下したときの挙動
    if(lapNum-1 == records_array.length){
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

        document.getElementById("end_save").style.display="block";
        document.getElementById("home_btn_container").style.display="none";

       

        if(records_array[lapNum-2].PbSumTime>PB_sumtime[lapNum-2]){
            document.getElementById("end_save").style.display="none";
            document.getElementById("PB-containers").style.display="block";
        }

        if(records_array[records_array.length-1].PbSumTime==0){
            document.getElementById("end_save").style.display="none";
            document.getElementById("PB-containers").style.display="block";
        }

        scroll_timer_flag=0;
       
    }

}
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
    if(records_array[records_array.length-1].PbSumTime==0){

    }
    else{
        segmentCountDown(timeArray[0]);
    }
    
}
//区間ベスト（PB）との比較のカウントダウン
function segmentCountDown(time){
    //自己ベストから5秒前〜0秒 の場合
    if(Number(time + 5000) > records_array[lapNum-1].PbSumTime && Number(time) < records_array[lapNum-1].PbSumTime)
    {
        $('#seg_comparison' + (lapNum-1)).text(getTimetoString(time - records_array[lapNum-1].PbSumTime));
        $('#seg_comparison' + (lapNum-1)).css('color', '#20caff');
    }else if(Number(time) > records_array[lapNum-1].PbSumTime){ //自己ベストから0秒以降の場合
        $('#seg_comparison' + (lapNum-1)).text(getTimetoString(time - records_array[lapNum-1].PbSumTime));
        $('#seg_comparison' + (lapNum-1)).css('color', '#ff909a');
    }
}

function getTime(){
    const
        now       = Date.now(),
        time      = now - startTime,
        splitTime = now - lapTime;

    return [time, splitTime];
}
//--------------------------------------------------------
//" time(数値) "を受け取り、" ○○：○○(文字列) "に変換して返します。
//--------------------------------------------------------
function getTimetoString(time){
    var
        StrirngTime = 0;

        //1時間以上
        if(Math.floor(time - 3600000) > 1){
        var StringTime =
            String(Math.floor(time / 3600000)) + ':' +
            String(Math.floor(time / 60000) % 60).padStart(2, '0') + ':' +
            String(Math.floor(time / 1000) % 60).padStart(2, '0') + '.' +
            String(Math.floor(time % 1000 / 100));
            return StringTime;
        }//1時間未満 1分以上
        else if(Math.floor(time - 3600000) < 0　&& Math.floor(time - 60000) >= 0){
            StrirngTime =
            String(Math.floor(time / 60000) % 60).padStart(2, '0') + ':' +
            String(Math.floor(time / 1000) % 60).padStart(2, '0')+ '.' +
            String(Math.floor(time % 1000 / 100));
        }
        //1分未満 0秒以上
        else if(Math.floor(time - 60000) < 0 && time >= 0){
            StrirngTime =
            String(Math.floor(time / 1000) % 60).padStart(2, '0') + '.' +
            String(Math.floor(time % 1000 / 100));
        }
        //0秒未満 -1分以上
        else if(time < 0 && Math.floor(time + 60000) >= 0){
            time = Math.floor(-1 * time);
            StrirngTime =
            String(-1 * Math.floor(time / 1000) % 60).padStart(2, '0') + '.' +
            String(Math.floor(time % 1000 / 100));
        }
        //-1分未満 -1時間以上
        else if(Math.floor(time + 60000) < 0 && Math.floor(time + 3600000) >= 0){
            time = Math.floor(-1 * time);
            StrirngTime =
            String(-1 * Math.floor(time / 60000) % 60).padStart(2, '0') + ':' +
            String(Math.floor(time / 1000) % 60).padStart(2, '0') + '.' +
            String(Math.floor(time % 1000 / 100));
        }else{
            time = Math.floor(-1 * time);
            StrirngTime =
            Math.floor(time / 3600000) + ':' +
            String(-1 * Math.floor(time / 60000) % 60).padStart(2, '0') + ':' +
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

//編集画面に変更するボタンの処理
document.getElementById("edit_button").onclick=function(){
    //lapflagでダイアログ表示させるタイミングを変更
    if(lapflag===0){
        document.getElementById("timer_body").style.display="none";
        document.getElementById("lap_editor").style.display="block";
        document.getElementById("home_btn_container").style.display="none";
        document.getElementById("edit_btn_container").style.display="block";
    }
    else{
        //セグメントのデータがある時に編集画面に行っていいかどうか聞く
        var result = window.confirm("セグメントの記録を破棄しますか？");
        if(result){
            //Yesなら画面変更
            document.getElementById("timer_body").style.display="none";
            document.getElementById("lap_editor").style.display="block";
            document.getElementById("home_btn_container").style.display="none";
            document.getElementById("edit_btn_container").style.display="block";
        }
        else{
            //Noなら何もしない
        }
    }
}
document.getElementById("home_button").onclick=function(){

    document.getElementById("timer_body").style.display="block";
    document.getElementById("lap_editor").style.display="none";
    document.getElementById("home_btn_container").style.display="block";
    document.getElementById("edit_btn_container").style.display="none";

}

document.getElementById("send_username").onclick=function(){
    if(recieve_records_flag == 0){
        DB_show();
    }

    else{ // 既に、ラップ表示部分に記録が表示されている場合

        // ラップ表示部分の子要素を削除
        $('#rap_display').empty();

        // 記録を保存する配列を空にする
        records_array.length =0;

        DB_show();

        //  reset処理
        stopTime    = 0;
        lapStopTime = 0;
        lapNum      = 1;
        scroll_timer_flag=0;
        PB_sumtime.length=0;
        PB_segmentTime.length=0;
        PB_segmentTimebest.length=0;
        SegmentTimeBest_number.length=0;
        SegmentTimeBest_time.length=0;
    }

    return false;
}

function DB_show(){
    $.ajax({
        // リクエスト方法
        type: "GET",
        // 送信先ファイル名
        url: "ajax_test_show.php",
        // 受け取りデータの種類
        datatype: "json",
        // 送信データ
        data:{
            // #id_numberのvalueをセット
            "Username" : $('#user_name1').val()
        },
        // 通信が成功した時
        success: function(data) {
          
              for(var i=0; i<data.length; i++){
                records_array.push({
                    Username : data[i].Username,
                    GameTitle : data[i].GameTitle,
                    SegmentName : data[i].SegmentName,
                    SegmentNumber : data[i].SegmentNumber,
                    PbSumTime : data[i].PbSumTime,
                    PbSegmentTime : data[i].PbSegmentTime,
                    SegmentTimeBest : data[i].SegmentTimeBest
                });
            }
               
            var PlayBestTime = 0;
            var BestPossibleTime = 0;
            best_data_length=data.length;

            for(var i=0; i<data.length; i++){
                $('#rap_display').append("<div class='seg' id='seg"+i+"'> </div>");
                $('#seg'+i).append("<div class='seg_name' id='seg_name" + i +"'>" + data[i].SegmentName + "</div>");
                $('#seg'+i).append("<div class='seg_comparison' id='seg_comparison"+ i + "'>" + " " + "</div>");
                $('#seg'+i).append("<div class='seg_time' id='seg_time"+ i + "'>" + getTimetoString(Number(data[i].PbSumTime))  + "</div>");
                    
                PlayBestTime += Number(data[i].PbSegmentTime);
                BestPossibleTime += Number(data[i].SegmentTimeBest);
            }
            console.log("ajax通信成功");
            recieve_records_flag = 1;

            //Possible_Time_Save
            var Possible_Time_Save = 0;
            Possible_Time_Save 
                = records_array[0].PbSegmentTime - records_array[0].SegmentTimeBest;;
                    $('#PBT_time').text(getTimetoString(Possible_Time_Save));
         
            //BestPossibeTime
            var Best_Possible_Time=0;
            Best_Possible_Time =bestpossibetime(bps_current_time,0);
            $('#BPT_time').text(getTimetoString(Best_Possible_Time))
        
            //edit画面へ入力
            edit_get(); 
         },
        // 通信が失敗した時
        error: function(data) {
            console.log("通信失敗");
        }
    });
}
function bestpossibetime(currenttime,bpslapnum){
    let Best_Possible_Time =currenttime;

    for(bpslapnum;bpslapnum<best_data_length;bpslapnum++){
        Best_Possible_Time +=Number(records_array[bpslapnum].SegmentTimeBest);
    }

    return Best_Possible_Time;
}

//スクロールした時の処理(lapボタンと同じ挙動)
document.body.onscroll = function(){
    let timeArray = getTime();
    if(scroll_timer_flag===1){
        let lapcomparison = (timeArray[0] - records_array[lapNum-1].PbSumTime);
        var scrollpoint =document.documentElement.scrollTop;
        if(scrollpoint>10){
            scrollflag=1;
        }
        
        if(scrollpoint===0&&scrollflag===1){
            $('#seg' + (lapNum-1)).css('background-color','#202020');
            if(records_array[records_array.length-1].PbSumTime==0){
                //最初の人の処理
                //PBの区間タイムを、現タイムに書き換える
                $('#seg_time' + (lapNum-1)).text(getTimetoString(timeArray[0]));
    
                //Previous_Segmentは常に表示させない
                $('#PS_time').text("");
    
                //Previous_Segment(PB)は常に表示させない
                $('#PS_PB_time').text("");
    
                //Possible_Time_Saveは常に表示させない
                $('#PBT_time').text("");
    
                //PBに全てを保存させる
                PB_sumtime.push(timeArray[0]);
                PB_segmenttime.push(timeArray[1]);
                PB_segmentTimebest.push(timeArray[1]);
    
                //ラップタイムを表示
                document.querySelector('#segment_timer').textContent = getTimetoString(timeArray[1]);
                lapTime = Date.now();
    
                // lap保持数を超えたら先頭の子要素を削除
                if(document.querySelector('#rap_display').childElementCount > lapCount)
                    document.querySelector('#rap_display').removeChild(document.querySelector('.rap').childNodes[0]);
    
                // スクロール位置を最下部に
                if(lapNum > 6){
                    document.querySelector('#rap_display').scrollTop = 24 * lapNum;
                }
    
                $('#BPT_time').text("");
                setStorage();

                $('#seg'+lapNum).css('background-color',segment_color);
    
                //ラップナンバーを増やす
                lapNum++;
    
            }
            else{
                //PBの区間タイムを、現タイムに書き換える
                $('#seg_time' + (lapNum-1)).text(getTimetoString(timeArray[0]));
    
                //区間タイムを更新した場合
                if(timeArray[1] < records_array[lapNum-1].SegmentTimeBest){
                    SegmentTimeBest_number.push(lapNum);
                    SegmentTimeBest_time.push(timeArray[1]);
                   
                }
    
                //Previous_Segment
                var Previous_Segment = 0;
                Previous_Segment = timeArray[1] - (records_array[lapNum-1].SegmentTimeBest);
                $('#PS_time').text(getTimetoString(Previous_Segment));
    
                //Previous_Segment(PB)
                var Previous_Segment_PB = 0;
                Previous_Segment_PB = timeArray[1] - (records_array[lapNum-1].PbSegmentTime);
                $('#PS_PB_time').text(getTimetoString(Previous_Segment_PB));
    
                //Possible_Time_Save
                if(lapNum < records_array.length){
                    var Possible_Time_Save = 0;
                    Possible_Time_Save = records_array[lapNum].PbSegmentTime - records_array[lapNum].SegmentTimeBest;
                    $('#PBT_time').text(getTimetoString(Possible_Time_Save));
                }
    
                //自己べとの比較を表示
                if(lapcomparison < 0){
                $('#seg_comparison' + (lapNum-1)).text(getTimetoString(lapcomparison)).css('color', '#20caff');
                }else{
                    $('#seg_comparison' + (lapNum-1)).text(getTimetoString(lapcomparison)).css('color', '#ff909a');
                }

                //PB出た時用の処理
                PB_sumtime.push(timeArray[0]);
                PB_segmenttime.push(timeArray[1]);
                //ゴールデン出た時の処理
                if(timeArray[1]<records_array[lapNum-1].SegmentTimeBest){
                    PB_segmentTimebest.push(timeArray[1]);
                    $('#seg_comparison' + (lapNum-1)).before("<img src='crown.png' style='width:20px; height:20px' id='crown'>");
                    $('#seg' + (lapNum-1)).css('grid-template-columns', '77px 25px 60px 1fr');
                    $('#seg_comparison' + (lapNum-1)).text(getTimetoString(lapcomparison)).css('color', '#ffff22');
                }else{
                    PB_segmentTimebest.push(records_array[lapNum-1].SegmentTimeBest);
                }
    
                //ラップタイムを表示
                document.querySelector('#segment_timer').textContent = getTimetoString(timeArray[1]);
                lapTime = Date.now();
    
                // lap保持数を超えたら先頭の子要素を削除
                if(document.querySelector('#rap_display').childElementCount > lapCount)
                    document.querySelector('#rap_display').removeChild(document.querySelector('.rap').childNodes[0]);
    
                // スクロール位置を最下部に
                if(lapNum > 6){
                    document.querySelector('#rap_display').scrollTop = 24 * lapNum;
                }
    
                //BPTを作成する。
                $('#BPT_time').text(getTimetoString(bestpossibetime(timeArray[0],lapNum)));
    
    
    
                setStorage();
                
                $('#seg'+lapNum).css('background-color',segment_color);

                //ラップナンバーを増やす
                lapNum++;
            }
            scrollflag=0;
        }

        //END　最終区間で"LAP"ボタンを押下したときの挙動
        if(lapNum-1 == records_array.length){

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

            document.getElementById("end_save").style.display="block";
            document.getElementById("home_btn_container").style.display="none";

            if(records_array[lapNum-2].PbSumTime>PB_sumtime[lapNum-2]){
                document.getElementById("end_save").style.display="none";
                document.getElementById("PB-containers").style.display="block";
            }

            if(records_array[records_array.length-1].PbSumTime==0){
                document.getElementById("end_save").style.display="none";
                document.getElementById("PB-containers").style.display="block";
            }

            scroll_timer_flag=0;
        
        }
    }
}



//編集画面 セーブボタン押下
$('#save').on('click',function(){

    //押下時にテキストをチェックマークに変える
    $('#save').val("✔︎");

    const Username = $('#user_name1').val();
    const GameTitle = "test";

    //全削除
    DB_delete(Username);

    //データの追加
    $('.segment_form').each(function(index, element) {
        $.ajax({
            // リクエスト方法
            type: "GET",
            // 送信先ファイル名
            url: "ajax_test_update.php",
            //　受け取りデータのタイプ
            dataType: 'text',
            //　同期処理にする（コールバックを待つ）
            async:false,
            // 送信データ
            data:{
                "Username" : Username,
                "GameTitle" : GameTitle,
                "SegmentName" : $('#segmentform'+ index + ' input').eq(0).val(),
                "SegmentNumber" : index + 1,
                "PbSumTime" : getTimetoInt($('#segmentform'+ index + ' input').eq(1).val()),
                "PbSegmentTime" : getTimetoInt($('#segmentform'+ index + ' input').eq(2).val()),
                "SegmentTimeBest" : getTimetoInt($('#segmentform'+ index + ' input').eq(3).val())

            },
            // 通信が成功した時
            success: function(data) {
                console.log("ajax通信成功");
            },
    
            // 通信が失敗した時
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus);
              }
        });
     
    })


    

    return false;
});


function edit_get(){
    //ifでreturn
    if($(".segment_form").length!==1){
        console.log("もうあるよ");
        return;
    }
    for(var i=1; i < records_array.length; i++){
        add_segment();
    }
    $('#segmentform0 input').eq(0).val(records_array[0].SegmentName);
    $('#segmentform0 input').eq(1).val(getTimetoString(records_array[0].PbSumTime));
    $('#segmentform0 input').eq(2).val(getTimetoString(records_array[0].PbSegmentTime));
    $('#segmentform0 input').eq(3).val(getTimetoString(records_array[0].SegmentTimeBest));
    for(var i=1; i < records_array.length; i++){
        $('#segmentform'+ i + ' input').eq(0).val(records_array[i].SegmentName);
        $('#segmentform'+ i + ' input').eq(1).val(getTimetoString(records_array[i].PbSumTime));
        $('#segmentform'+ i + ' input').eq(2).val(getTimetoString(records_array[i].PbSegmentTime));
        $('#segmentform'+ i + ' input').eq(3).val(getTimetoString(records_array[i].SegmentTimeBest));
    }
};

//区間ベストを保存しますか？（はい）
$('#yes').on('click',function(){

    //押下時にテキストをチェックマークに変える
    $('#yes').val("✔︎");

    const Username = $('#user_name1').val();

    //データの追加
     for(var i=0; i < SegmentTimeBest_time.length; i++){
        $.ajax({
            // リクエスト方法
            type: "GET",
            // 送信先ファイル名
            url: "SegmentTimeBestupdate.php",
            //　受け取りデータのタイプ
            dataType: 'text',
            // 送信データ
            data:{
                "Username" : Username,
                "SegmentNumber" : SegmentTimeBest_number[i],
                "SegmentTimeBest" : SegmentTimeBest_time[i]
            },
            // 通信が成功した時
            success: function(data) {
                console.log("ajax通信成功");
            },
    
            // 通信が失敗した時
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus);
              }
        });

    };
});

//PB保存
$('#pb_save').on('click',function(){

    //押下時にテキストをチェックマークに変える
    $('#pb_save').val("✔︎");

    const Username = $('#user_name1').val();
    const GameTitle = "test";

    DB_delete(Username);

    //データの追加
    $('.seg').each(function(index, element) {   // 'Home'画面、ラップの表示数だけループします。 
        $.ajax({
            // リクエスト方法
            type: "GET",
            // 送信先ファイル名
            url: "ajax_test_update.php",
            //　受け取りデータのタイプ
            dataType: 'text',
            //　同期処理にする（コールバックを待つ）
            async:false,
            // 送信データ
            data:{
                "Username" : Username,
                "GameTitle" : GameTitle,
                "SegmentName" : records_array[index].SegmentName, //'Home'画面、ラップ表示部分から名前を取得しています。
                "SegmentNumber" : index + 1,
                "PbSumTime" : PB_sumtime[index],
                "PbSegmentTime" : PB_segmenttime[index],
                "SegmentTimeBest" : PB_segmentTimebest[index]

            },
            // 通信が成功した時
            success: function(data) {
                console.log("ajax通信成功");
            },
    
            // 通信が失敗した時
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus);
              }
        });
     
    })

    return false;
});

function DB_delete(Username){
        //全削除
        $.ajax({
            // リクエスト方法
            type: "GET",
            // 送信先ファイル名
            url: "ajax_delete.php",
            //　受け取りデータのタイプ
            dataType: 'text',
            //　同期処理にする（コールバックを待つ）
            async:false,
            // 送信データ
            data:{
                "Username" : Username
            },
            // 通信が成功した時
            success: function(data) {
                console.log("ajax通信成功");
            },
    
            // 通信が失敗した時
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus);
              }
        });

}