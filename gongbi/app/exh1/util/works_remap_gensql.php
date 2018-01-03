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
$file = './remap.txt';
if (!is_file($file))
	die('missing remap.txt file.');

file_put_contents('./remap.sql', "");

$sql = "INSERT INTO exh1_artist_works (artist_id,name,type,url,date,width,height,material,resinfo) VALUES (%VALS%);";
$materials = ['布本','纸本','绢本','底稿','皮纸','生宣'];
$ctx = file_get_contents($file);
$lines = explode("\r\n", $ctx);
foreach ($lines as $line){
	if (preg_match_all("/^(.+)\s+->\s+(.+)$/", $line, $mats)){
		$key = $mats[1][0];
		$value = $mats[2][0];
		if (!preg_match_all("/^(\d+)-(\w+)\/(.+)$/", $value, $matsName)){
			echo "WARNING: matching failed by '$key'.<br>";
			continue;
		}
		$id = $matsName[1][0];
		$url = "works/$key";
		$nameSrc = cvt($matsName[3][0]);
		$nameSrc = preg_replace("/×/", 'x', $nameSrc);

		$name = $nameSrc;
		$width = 0;
		$height = 0;
		$mater = '';
		$year = '';
		$regSize = "/([\d\.]+c?m?)[xX×]([\d\.]+)((\.)|(cm)|(CM))?/";
		if (preg_match_all($regSize, $nameSrc, $matsSize)){
			$width = $matsSize[1][0];
			$height = $matsSize[2][0];
			$width = preg_replace('/cm/', '', $width);
			$height = preg_replace('/\.+$/', '', $height);
			$name = preg_replace($regSize, '', $name);
		}
		$regYear = "/(\d\d\d\d)年/";
		if (preg_match_all($regYear, $nameSrc, $matsYear)){
			$year = $matsYear[1][0];
			$name = preg_replace($regYear, '', $name);
		}
		foreach ($materials as $m) {
			$i = stripos($nameSrc, $m);
			if ($i !== false){
				$mater = $m;
				$name = str_replace($mater, '', $name);
				break;
			}
		}
		$name = str_replace(".jpg", '', $name);
		$info = curl("http://7xp4ff.com1.z0.glb.clouddn.com/$url?imageInfo");
		if ($info){
			$info = json_encode($info);
			$info = preg_replace("/^\"/", '', $info);
			$info = preg_replace("/\"$/", '', $info);
		}

		$vals = "$id,'$name',0,'$url','$year',$width,$height,'$mater','$info'";
		$cmd = preg_replace("/%VALS%/", $vals, $sql);

		file_put_contents('./remap.sql', $cmd."\r\n", FILE_APPEND);
	}
}

echo file_get_contents('./remap.sql');