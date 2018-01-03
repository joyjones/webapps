<?php
$mmc = memcache_init();
if ($mmc == false)
    die("[memcache error]");

$list = array(
	"visits" => '打开首页',
	"clickAbout" => '点击【涂料环保性能】',
	"clickStart" => '点击【游戏挑战】',
	"clickClub" => '点击【百色熊俱乐部】',
	"clickAnswers" => '点击【查看答案】',
	"clickRetry" => '点击【再试一次】',
	"clickShare" => '点击【分享到朋友圈】',
	"shares" => '实际分享到朋友或朋友圈',
	"finishes" => '答完所有题目次数',
	"successes" => '答对所有题目次数',
	"fails" => '未答对所有题目次数',
);
header("Content-Type: text/html;charset=utf-8");

foreach ($list as $key => $desc) {
	echo $desc."：".memcache_get($mmc, $key)."<br>";
}
