<?php
define('TBNAME', 'becurious_user');

$mmc = memcache_init();
if ($mmc == false)
    die("[memcache error]");

$list = array(
	"visits" => '进入H5活动页面',
	"clickDownAndroid" => '点击安卓下载',
	"clickDownIos" => '点击苹果下载',
	"starts" => '点击开始答题',
	"successes" => '完成十道题目60%及以上',
	"fails" => '完成十道题目60%以下',
	"shares" => '点击分享给好友'
);
header("Content-Type: text/html;charset=utf-8");

foreach ($list as $key => $desc) {
	echo $desc."：".memcache_get($mmc, $key)."<br>";
}
echo "<br><br><br><br>";

$mysql = new SaeMysql();
$mysql->setAppname('galleries');
$mysql->setAuth('5x0oljlyyw', 'w0wwyx41m2l4iz53w5yk33h5hlmhh145xw4jlwl1');
$sql = "select nickname,score,total_score from ".TBNAME." order by score desc,total_score desc,record_time";
echo "<table>";
echo "<tr>";
echo "<th>名次</th>";
echo "<th>昵称</th>";
echo "<th>最高分</th>";
echo "<th>累计答对</th>";
echo "</tr>";
$rows = $mysql->getData($sql);
$index = 1;
foreach ($rows as $row) {
	echo "<tr>";
	echo "<td>".$index."</td>";
	echo "<td>".$row['nickname']."</td>";
	echo "<td>".($row['score']*100)."</td>";
	echo "<td>".$row['total_score']."</td>";
	echo "<tr>";
	$index++;
}
echo "</table>";
$mysql->closeDb();
