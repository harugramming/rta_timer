"use strict";

let rapNum = 0;
let editflag = 0;//最初0にしておく
let firsteditcheck=0//
let checkcharaflag=0;//文字が半角数字で打たれているかチェックする
var removesegmentNum;//警告処理を削除する時に

document.getElementById("add_button").onclick = function(){
    add_segment();
};

function add_segment(){
    rapNum++;

    //div要素segmentIDを取得する。
    var div = document.getElementById("segment_editor");
    var segmentElement = div.getElementsByClassName("segment_form"); 
    
    //idの変更を行うためにコピーを行う。
    var segment_form_clone = segmentElement[0].cloneNode(true);
    
    if(firsteditcheck===1){
        var removeelement=segment_form_clone.querySelector("#addtext0")
        removeelement.remove();  
    }
    //セグメントのid名をsegmentform(rapNum)にする。
    segment_form_clone.id="segmentform"+rapNum;

    //マイナスボタンのid名を変更(minau_button(rapNum)にする)
    var minus_button_element = segment_form_clone.querySelector("i");
    minus_button_element.id="minus_button"+rapNum;
    minus_button_element.addEventListener('click',minus,false);

    //上矢印ボタンのid名を変更
    var up_button_element = segment_form_clone.querySelector('#up_button1');
    up_button_element.id = "up_button" + rapNum;
    up_button_element.addEventListener('click', up_segment, false);
    //下矢印ボタンのid名を変更
    var down_button_element = segment_form_clone.querySelector('#down_button1');
    down_button_element.id = "down_button" + rapNum;
    down_button_element.addEventListener('click', down_segment, false);
    //セグメントの番号を変更する。
    var nobr_element = segment_form_clone.querySelector("nobr");
    nobr_element.textContent =(rapNum+1)+"";
    
    
    //segment_editorにsegment_form_cloneを追加する。
    var segmentDiv = document.getElementById("segment_editor");
    segmentDiv.appendChild(segment_form_clone);

    //新規作成したセグメントの入力フォームを空にする。
    $('#segmentform'+ rapNum + ' input').val('');

    editflag=1;
    
}

//標準されているマイナスボタンの処理
document.getElementById("minus_button1").onclick = function(){
    if(rapNum===0){
        /*セグメントが一つの時は何もしない*/
    }
    else{
        //削除するセグメントのクラス名を取得する。
        var segmentElement = document.getElementsByClassName("segment_form");
        segmentElement[0].remove();
        for(let i=0;i<rapNum;i++){
            var renameSegment=document.getElementsByClassName("segment_form");
            //セグメントのidを変更
            renameSegment[i].id="segmentform"+i;
            //テキストを変更
            var rename_nobr_element = renameSegment[i].querySelector("nobr");
            rename_nobr_element.textContent =(i+1);
            //マイナスボタンのidを変更
            var minus_button_id=segmentElement[i].querySelector("i");
            minus_button_id.id="minus_button"+i;
        }
        rapNum--;
    }
};

function minus(){
    if(rapNum===0){
        
    }
    else{
        //押されたマイナスボタンのIDを取得する。
        var segment_id_name=this.id;
        var segmentNumString=segment_id_name.replace("minus_button","");
        var segmentNum=parseInt(segmentNumString,10);//int型の数字にした。

        var segmentElement = document.getElementsByClassName("segment_form");
        segmentElement[segmentNum].remove();
        
        for(let i=segmentNum;i<rapNum;i++){
            var renameSegment=document.getElementsByClassName("segment_form");
            //セグメントのidを変更
            renameSegment[(i)].id="segmentform"+i;
            //テキストを変更
            var rename_nobr_element = renameSegment[i].querySelector("nobr");
            rename_nobr_element.textContent = (i+1);
            //マイナスボタンのidを変更
            var minus_button_id=segmentElement[i].querySelector("i");
            minus_button_id.id="minus_button"+i;
        }
        rapNum--;
    }
    
};

function up_segment(){
    if(rapNum===0){
        
    }
    else{
        //ボタンを押下したフォームのIDを取得する。
        var segment_id_name=this.id;
        var segmentNumString=segment_id_name.replace("up_button","");
        var segmentNum=parseInt(segmentNumString,10);//int型の数字にした。

        swap_segment(segmentNum, segmentNum-1);
    }
    
};

function down_segment(){
    if(rapNum===0){
        
    }
    else{
        //ボタンを押下したフォームのIDを取得する。
        var segment_id_name=this.id;
        var segmentNumString=segment_id_name.replace("down_button","");
        var segmentNum=parseInt(segmentNumString,10);//int型の数字にした。

        swap_segment(segmentNum, segmentNum+1);
    }
}
//segmentformの入力フォームの値を入れ替える関数
function swap_segment(segmentNum1, segmentNum2){

    // temp___にボタンを押下したフォームの、入力フォームの値を仮変数に保存
    var temp_segment_name = $('#segmentform' + segmentNum1 + ' input:eq(0)').val();
    var temp_pbsumtime = $('#segmentform' + segmentNum1 + ' input:eq(1)').val();
    var temp_pbsegtime = $('#segmentform' + segmentNum1 + ' input:eq(2)').val();
    var temp_bestsegtime = $('#segmentform' + segmentNum1 + ' input:eq(3)').val();

    $('#segmentform' + segmentNum1 + ' input:eq(0)').val($('#segmentform' + segmentNum2 + ' input:eq(0)').val());
    $('#segmentform' + segmentNum2 + ' input:eq(0)').val(temp_segment_name);

    $('#segmentform' + segmentNum1 + ' input:eq(1)').val($('#segmentform' + segmentNum2 + ' input:eq(1)').val());
    $('#segmentform' + segmentNum2 + ' input:eq(1)').val(temp_pbsumtime);

    $('#segmentform' + segmentNum1 + ' input:eq(2)').val($('#segmentform' + segmentNum2 + ' input:eq(2)').val());
    $('#segmentform' + segmentNum2 + ' input:eq(2)').val(temp_pbsegtime);

    $('#segmentform' + segmentNum1 + ' input:eq(3)').val($('#segmentform' + segmentNum2 + ' input:eq(3)').val());
    $('#segmentform' + segmentNum2 + ' input:eq(3)').val(temp_bestsegtime);

}

//キャンセルボタンを押すとLAPTIMERに以降するようにする。
document.getElementById("cancel").onclick = function(){
    //セグメントのデータがある時に編集画面に行っていいかどうか聞く
    if(editflag===0){
        document.getElementById("rap_timer").style.display="block";
        document.getElementById("lap_editor").style.display="none";
    }
    else{
        var result = window.confirm("変更を破棄しますか?");
        if(result){
            //Yesなら画面遷移
            document.getElementById("rap_timer").style.display="block";
            document.getElementById("lap_editor").style.display="none";
        }
        else{
            //Noならなにもしない
        }
    }
}



//最初からあるテキストボックスに関しても、エラーが表示されるようにする。
function firstmojicheck(){
    //テキストボックスの内容を精査し、半角数字じゃなければ警告文が表示されるようにする。
    var checkchara=this.value;
    if(checkcharaflag===0){
        //一度も警告されていない場合警告文を表示する。
        if(checkchara.match(/[^0-9]+/)){
            //半角数字じゃなかった時の処理
            var addtext = document.createElement("div");
            addtext.setAttribute("id","addtext0");
            addtext.innerHTML = "　　　時間は半角数字で入力してください";
            addtext.style.color="red";
            var segmentDiv = document.getElementsByClassName("segment_form");
            segmentDiv[0].appendChild(addtext);

            removesegmentNum=0;
            firsteditcheck=1;
        }
        else{
            //半角数字だった時は何もしない
                    
        }

        checkcharaflag=1;//一度半角数字の警告が出たら二度目はださない
    }
    else{
        //一度表示された後、半角数字のみになったら警告文は削除する。
        //テキストボックスの内容を精査し、半角数字じゃなければ警告文は表示され続ける。
        if(checkchara.match(/[^0-9]+/)){
            //半角数字じゃなかった時の処理は何もしない
        }
        else{
            //半角数字だった時の処理
            //警告文は削除される。
            //ここにループを作成して全てのテキストボックスに半角数字なかった時に文を削除
            var removeelement=document.getElementById("addtext"+removesegmentNum);
            removeelement.remove();   
            checkcharaflag=0;//またチェックモードに入る。
        }
    }
    
};

//セグメントに半角数字以外を入力すると修正がはいる。
function mojicheck(){
    //テキストボックスの内容を精査し、半角数字じゃなければ警告文が表示されるようにする。
    var checkchara=this.value;
    //変更があったidのラップナンバーを取得する。
    var textbox_lapNum=this.id;
    if(textbox_lapNum.match(/hour/)){
        var textNumString=textbox_lapNum.replace("segment_hour","");
        var segmentNum=parseInt(textNumString,10);//int型の数字にした。
    }
    else if(textbox_lapNum.match(/min/)){
        var textNumString=textbox_lapNum.replace("segment_min","");
        var segmentNum=parseInt(textNumString,10);//int型の数字にした。
    }
    else if(textbox_lapNum.match(/sec/)){
        var textNumString=textbox_lapNum.replace("segment_sec","");
        var segmentNum=parseInt(textNumString,10);//int型の数字にした。
    }
    else{
        window.alert("できてないよ")
    }

    if(checkcharaflag===0){
        //一度も警告されていない場合警告文を表示する。
        if(checkchara.match(/[^0-9]+/)){
            //半角数字じゃなかった時の処理
            var addtext = document.createElement("div");
            addtext.setAttribute("id","addtext"+segmentNum);
            addtext.innerHTML = "　　　時間は半角数字で入力してください";
            addtext.style.color="red";
            var segmentDiv = document.getElementById("segmentform"+segmentNum);
            segmentDiv.appendChild(addtext);

            removesegmentNum=segmentNum;
        }
        else{
            //半角数字だった時は何もしない
                    
        }

        checkcharaflag=1;//一度半角数字の警告が出たら二度目はださない
    }
    else{
        //一度表示された後、半角数字のみになったら警告文は削除する。
        //テキストボックスの内容を精査し、半角数字じゃなければ警告文は表示され続ける。
        if(checkchara.match(/[^0-9]+/)){
            //半角数字じゃなかった時の処理は何もしない
            

        }
        else{
            //半角数字だった時の処理
            //警告文は削除される。
            //ここにループを作成して全てのテキストボックスに半角数字なかった時に文を削除
            var removeelement=document.getElementById("addtext"+removesegmentNum);
            removeelement.remove();   
            checkcharaflag=0;//またチェックモードに入る。
        }
    }
};