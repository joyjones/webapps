<?php
$mmc = memcache_init();
if ($mmc == false)
    die("[memcache error]");

$list = array(
	"durable-visits" => '打开首页',
	"durable-clickAbout" => '点击【涂料持久性能】',
	"durable-clickStart" => '点击【游戏挑战】',
	"durable-clickClub" => '点击【百色熊俱乐部】',
	"durable-clickAnswers" => '点击【查看答案】',
	"durable-clickRetry" => '点击【再试一次】',
	"durable-clickShare" => '点击【分享到朋友圈】',
	"durable-shares" => '实际分享到朋友或朋友圈',
	"durable-finishes" => '答完所有题目次数',
	"durable-successes" => '答对所有题目次数',
	"durable-fails" => '未答对所有题目次数',
);
header("Content-Type: text/html;charset=utf-8");

foreach ($list as $key => $desc) {
	echo $desc."：".memcache_get($mmc, $key)."<br>";
}
