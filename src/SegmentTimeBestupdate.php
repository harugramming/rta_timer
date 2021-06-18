<?php
ini_set('display_errors',1);

// GETメソッドでリクエストした値を取得
$Username = $_GET['Username'];
$SegmentTimeBest = $_GET['SegmentTimeBest'];
$SegmentNumber = $_GET['SegmentNumber'];

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

// SQL文を作成
$sql = "UPDATE records SET SegmentTimeBest = :time WHERE Username = :name AND SegmentNumber = :number";

// SQLをセット
$stmt = $dbh->prepare($sql);

// 値を渡して実行
$result = $stmt->execute(array(
  ':time' => $SegmentTimeBest,
  ':name' => $Username,
  ':number' => $SegmentNumber
));



