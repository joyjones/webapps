<?php
$mmc = memcache_init();
if ($mmc == false)
    die("[memcache error]");

$prefix = 'newsfall1-';
$list = array(
	$prefix."visits" => '访问页面',
	$prefix."clickLinkIOS" => '点击苹果下载按钮',
	$prefix."clickLinkAndroid" => '点击安卓下载按钮',
	$prefix."clickShare" => '点击分享按钮',
	$prefix."sharePage" => '分享给朋友或朋友圈',
	$prefix."openInBrowser" => '在浏览器中打开',
);
header("Content-Type: text/html;charset=utf-8");

echo "<h2>项目数据统计 - newsfall-1</h2><br>";

foreach ($list as $key => $desc) {
	$val = memcache_get($mmc, $key);
	if (empty($val))
		$val = '0';
	echo $desc."：".$val."<br>";
}
