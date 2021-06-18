<?php
// GETメソッドでリクエストした値を取得
$Username = $_GET['Username'];

// データベース接続
// $host = mysql1.php.xdomain.ne.jpで動かなければipアドレスを記載

    //Machino
        $host = 'localhost';
        $dbname = 'rta_timer';
        $dbuser = 'root';
        $dbpass = 'root';

    //Haruuchi
        // $host = '192.168.33.10';
        // $dbname = 'rta_timer';
        // $dbuser = 'root';
        // $dbpass = 'Haru_Machino0219';

// データベース接続クラスPDOのインスタンス$dbhを作成する
try {
    $dbh = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8", $dbuser, $dbpass);
// PDOExceptionクラスのインスタンス$eからエラーメッセージを取得
} catch (PDOException $e) {
    // 接続できなかったらvar_dumpの後に処理を終了する
    var_dump($e->getMessage());
    exit;
}

// データ取得用SQL
// 値はバインドさせる
$sql = "SELECT DISTINCT Username, GameTitle, SegmentName, SegmentNumber, PbSumTime, PbSegmentTime, SegmentTimeBest
 FROM records WHERE Username = ? ORDER BY SegmentNumber ASC";
// SQLをセット
$stmt = $dbh->prepare($sql);
// SQLを実行
$stmt->execute(array($Username));

// あらかじめ配列$productListを作成する
// 受け取ったデータを配列に代入する
// 最終的にhtmlへ渡される
$recordsList = array();

// fetchメソッドでSQLの結果を取得
// 定数をPDO::FETCH_ASSOC:に指定すると連想配列で結果を取得できる
// 取得したデータを$productListへ代入する
while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
    $recordsList[] = array(
        'Username'    => $row['Username'],
        'GameTitle'  => $row['GameTitle'],
        'SegmentName' => $row['SegmentName'],
        'SegmentNumber' => $row['SegmentNumber'],
        'PbSumTime' => $row['PbSumTime'],
        'PbSegmentTime' => $row['PbSegmentTime'],
        'SegmentTimeBest' => $row['SegmentTimeBest']
    );
}

// ヘッダーを指定することによりjsonの動作を安定させる
header('Content-type: application/json');
// htmlへ渡す配列$productListをjsonに変換する
echo json_encode($recordsList);
