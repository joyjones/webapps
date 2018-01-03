<?php
$mmc = memcache_init();
if ($mmc == false)
    die("[memcache error]");

$prefix = 'festival-';
$list = array(
	$prefix."visit" => '访问页面',
	$prefix."openCover" => '揭开明星头像',
	$prefix."clickAbout" => '点击关于',
	$prefix."clickMake" => '点击制作',
	$prefix."clickSelPattern" => '确定选择模板',
	$prefix."submitPost" => '提交帖子照片',
	$prefix."sharePage" => '分享'
);
header("Content-Type: text/html;charset=utf-8");

echo "<h2>项目数据统计 - festival</h2><br>";

foreach ($list as $key => $desc) {
	$val = memcache_get($mmc, $key);
	if (empty($val))
		$val = '0';
	echo $desc."：".$val."<br>";
}
