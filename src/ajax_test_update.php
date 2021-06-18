
<?php
// GETメソッドでリクエストした値を取得
$Username = $_GET['Username'];
$GameTitle = $_GET['GameTitle'];
$SegmentName = $_GET['SegmentName'];
$SegmentNumber = $_GET['SegmentNumber'];
$PbSumTime = $_GET['PbSumTime'];
$PbSegmentTime = $_GET['PbSegmentTime'];
$SegmentTimeBest = $_GET['SegmentTimeBest'];

// データベース接続
// $host = mysql1.php.xdomain.ne.jpで動かなければipアドレスを記載
// $host = '192.168.33.10';
// // データベース名
// $dbname = 'rta_timer';
// // ユーザー名
// $dbuser = 'root';
// // パスワード
// $dbpass = 'Haru_Machino0219';

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




// // データ取得用SQL
// // 値はバインドさせる
// $sql = "DELETE FROM records WHERE UserName = :name";
// // SQLをセット
// $stmt = $dbh->prepare($sql);

// $stmt->bindValue(':name', $Username, PDO::PARAM_STR);

// // SQLを実行
// $stmt->execute();





// データ取得用SQL
// 値はバインドさせる
$sql = "INSERT INTO records values (?,?, ?, ?, ?, ?, ?)";

// SQLをセット
$stmt = $dbh->prepare($sql);

$stmt->bindValue(1, $Username, PDO::PARAM_STR);
$stmt->bindValue(2, $GameTitle, PDO::PARAM_STR);
$stmt->bindValue(3, $SegmentName, PDO::PARAM_STR);
$stmt->bindValue(4, $SegmentNumber, PDO::PARAM_STR);
$stmt->bindValue(5, $PbSumTime, PDO::PARAM_STR);
$stmt->bindValue(6, $PbSegmentTime, PDO::PARAM_STR);
$stmt->bindValue(7, $SegmentTimeBest, PDO::PARAM_STR);

// SQLを実行
$stmt->execute();

// SQL実行
$res = $dbh->query($sql);

// ヘッダーを指定することによりjsonの動作を安定させる
header('Content-type: application/json');

$result = $_GET['SegmentName'];