<?php
$mmc = memcache_init();
if ($mmc == false)
    die("[memcache error]");

$prefix = 'burtonkids-';
$list = array(
	$prefix."index-visits" => '滑屏页-访问页面',
	$prefix."index-clickInfo" => '滑屏页-点击活动信息',
	$prefix."index-clickUpload" => '滑屏页-点击上传照片',
	$prefix."index-clickVote" => '滑屏页-点击为孩子投票',
	$prefix."index-sharePage" => '滑屏页-分享给朋友或朋友圈',
	$prefix."post-visits" => '帖子页-访问页面',
	$prefix."post-clickShare" => '帖子页-点击分享按钮',
	$prefix."post-clickPraise" => '帖子页-点赞',
	$prefix."post-sharePage" => '帖子页-分享给朋友或朋友圈',
	$prefix."upload-visits" => '上传页-访问页面',
	$prefix."upload-clickReset" => '上传页-点击重置按钮',
	$prefix."upload-clickUpload" => '上传页-点击提交按钮',
	$prefix."upload-uploadSuccess" => '上传页-提交成功',
	$prefix."gallery-visits" => '列表页-访问页面',
	$prefix."gallery-clickNew" => '列表页-点击最新',
	$prefix."gallery-clickHot" => '列表页-点击最热',
	$prefix."gallery-clickHome" => '列表页-点击回到首页',
	$prefix."gallery-clickPost" => '列表页-点击帖子',
);
header("Content-Type: text/html;charset=utf-8");

echo "<h2>项目数据统计 - burton-kids</h2><br>";

foreach ($list as $key => $desc) {
	$val = memcache_get($mmc, $key);
	if (empty($val))
		$val = '0';
	echo $desc."：".$val."<br>";
}
