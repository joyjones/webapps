<?php

function cvt($name){
	return iconv("GBK", "UTF-8", $name);
}
function curl($url) {
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_TIMEOUT, 500);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($curl, CURLOPT_URL, $url);
	$res = curl_exec($curl);
	curl_close($curl);
	return $res;
}

header("Content-type: text/html; charset=utf8");

$db = new SaeMysql();
$db->setAppname('galleries');
$db->setAuth('5x0oljlyyw', 'w0wwyx41m2l4iz53w5yk33h5hlmhh145xw4jlwl1');
$rows = $db->getData("select * from exh1_artist_works");

foreach ($rows as $row){
	$id = $row['id'];
	$url = $row['url'];
	$info = curl("http://7xp4ff.com1.z0.glb.clouddn.com/$url?imageInfo");
	if ($info){
		$info = json_encode($info);
		$info = preg_replace("/^\"/", '', $info);
		$info = preg_replace("/\"$/", '', $info);
	}
	$db->runSql("update exh1_artist_works set resinfo='$info' where id=$id");
}
$db->closeDb();
echo 'finished';