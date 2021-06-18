<?php
// GETメソッドでリクエストした値を取得
$Username = $_GET['Username'];

// データベース接続
// $host = mysql1.php.xdomain.ne.jpで動かなければipアドレスを記載
$host = '192.168.33.10';
// データベース名
$dbname = 'rta_timer';
// ユーザー名
$dbuser = 'root';
// パスワード
$dbpass = 'Haru_Machino0219';

// データベース接続クラスPDOのインスタンス$dbhを作成する
try {
    $dbh = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8mb4", $dbuser, $dbpass);
// PDOExceptionクラスのインスタンス$eからエラーメッセージを取得
} catch (PDOException $e) {
    // 接続できなかったらvar_dumpの後に処理を終了する
    var_dump($e->getMessage());
    exit;
}

// データ取得用SQL
// 値はバインドさせる
$sql = "DELETE FROM records WHERE UserName = :name";
// SQLをセット
$stmt = $dbh->prepare($sql);

$stmt->bindValue(':name', $Username, PDO::PARAM_STR);

// SQLを実行
$stmt->execute();

// SQL実行
$res = $dbh->query($sql);

$result = "delete done.";
