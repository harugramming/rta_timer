// #ajax_showがクリックされた時の処理
// 指定したidのレコードを取得する
$('#ajax_show').on('click',function(){
    console.log("showボタンがクリックされた");
    console.log("Username.val:"+ $('#Username').val());
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
            "Username" : $('#Username').val()
        },
        // 通信が成功した時
        success: function(data) {
           
            var PlayBestTime = 0;
            var BestPossibleTime = 0;

            for(var i=0; i<data.length; i++){
                $('#result').append("<p>" + data[i].Username +  data[i].GameTitle +  data[i].SegmentName + data[i].SegmentNumber+ "　" + getTimetoString(data[i].PbSumTime) + "</p> <p>　" + getTimetoString(data[i].PbSegmentTime) + "　" + getTimetoString(data[i].SegmentTimeBest) + "</p>");

                PlayBestTime += Number(data[i].PbSegmentTime);
                BestPossibleTime += Number(data[i].SegmentTimeBest);
            }

            for(var i=0; i<data.length; i++){
                $('#result').append("<div id='Segmentform" + i + "' class='Segmentform'> </div>");
                $('#Segmentform'+ i).append("<input type='text' id='SegmentName" + i + "'" + "value='" + data[i].SegmentName + "' >");
                $('#Segmentform'+ i).append("<input type='text' id='SegmentNumber" + i + "'" + "value='" + data[i].SegmentNumber + "' >");
                $('#Segmentform'+ i).append("<input type='text' id='PbSumTime" + i + "'" + "value='" + data[i].PbSumTime + "' >");
                $('#Segmentform'+ i).append("<input type='text' id='PbSegmentTime" + i + "'" + "value='" + data[i].PbSegmentTime + "' >");
                $('#Segmentform'+ i).append("<input type='text' id='SegmentTimeBest" + i + "'" + "value='" + data[i].SegmentTimeBest + "' >");
                $('#Segmentform'+ i).append("<h3>-------------------------</h3>");


                PlayBestTime += Number(data[i].PbSegmentTime);
                BestPossibleTime += Number(data[i].SegmentTimeBest);
            }

            $('#result').append("<p>ベスト記録は： " + getTimetoString(Number(PlayBestTime)) + " です。</p>");
            $('#result').append("<p>BPTは： " + getTimetoString(Number(BestPossibleTime)) + " です。</p>");
            console.log(PlayBestTime);
            console.log("ajax通信成功");
            console.log(data);
        },

        // 通信が失敗した時
        error: function(data) {
            console.log("通信失敗");
            console.log(data);
        }
    });

    return false;
});

$('#ajax_delete').on('click',function(){
    console.log("deleteボタンがクリックされた");
    console.log("Username.val:"+ $('#Username').val());
    $.ajax({
        // リクエスト方法
        type: "GET",
        // 送信先ファイル名
        url: "ajax_test_delete.php",
        //　受け取りデータのタイプ
        dataType: 'text',
        // 送信データ
        data:{
            // #id_numberのvalueをセット
            "Username" : $('#Username').val()
        },
        // 通信が成功した時
        success: function(data) {
            console.log("ajax通信成功");
            console.log(data);
        },

        // 通信が失敗した時
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
          }
    });

    return false;
});

$('#ajax_update').on('click',function(){
    console.log("updateボタンがクリックされた");

    const Username = $('#Username').val();
    const GameTitle = "test";
    console.log("Username.val:"+ Username);
    

    $('.Segmentform').each(function(index, element) {
 
        console.log($('#SegmentName' + index).val());
        console.log(index + 1);
        console.log($('#PbSumTime' + index).val());
        console.log($('#PbSegmentTime' + index).val());
        console.log($('#SegmentTimeBest' + index).val());

        $.ajax({
            // リクエスト方法
            type: "GET",
            // 送信先ファイル名
            url: "ajax_test_update.php",
            //　受け取りデータのタイプ
            dataType: 'text',
            // 送信データ
            data:{
                "Username" : Username,
                "GameTitle" : GameTitle,
                "SegmentName" : $('#SegmentName' + index).val(),
                "SegmentNumber" : index + 1,
                "PbSumTime" : $('#PbSumTime' + index).val(),
                "PbSegmentTime" : $('#PbSegmentTime' + index).val(),
                "SegmentTimeBest" : $('#SegmentTimeBest' + index).val()
            },
            // 通信が成功した時
            success: function(data) {
                console.log("ajax通信成功");
                console.log(data);
            },
    
            // 通信が失敗した時
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus);
              }
        });
     
    })


    

    return false;
});

//" time(数値) "を受け取り、" ○○：○○(文字列) "に変換して返します。
function getTimetoString(time){
    let
        StrirngTime = 0;

        if(Math.floor(time - 3600000) > 1){
        StrirngTime =
            String(Math.floor(time / 3600000)).padStart(2, '0') + ':' +
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