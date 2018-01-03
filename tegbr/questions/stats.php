<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<title>线上互动问题收集 统计</title>
	<style type="text/css">
		table.gridtable {
			font-family: verdana,arial,sans-serif;
			font-size:12px;
			color:#333333;
			border-collapse: collapse;
			border-top-width: 1px;
			border-right-width: 1px;
			border-bottom-width: 1px;
			border-left-width: 1px;
		}
		table.gridtable th {
			border-width: 1px;
			padding: 8px;
			border-style: solid;
			border-color: #eeeeee;
			background-color: #dedede;
		}
		table.gridtable td {
			border-width: 1px;
			padding: 8px;
			border-style: solid;
			border-color: #eeeeee;
			background-color: #ffffff;
		}
		table.gridtable td.ttl {
			font-size: 16px;
			font-weight: bold;
			background-color: rgb(255,214,0);
		}
		table.gridtable td.gray{
			background-color: #eee;
		}
	</style>
<?php
class DBAccess
{
	protected $mysql = null;
	protected $mmc = null;
	public function __construct() {
		$this->mysql = new SaeMysql();
		$this->mysql->setAppname('galleries');
		$this->mysql->setAuth('5x0oljlyyw', 'w0wwyx41m2l4iz53w5yk33h5hlmhh145xw4jlwl1');
		$this->mmc = memcache_init();
	}
	public function close(){
		$this->mysql->closeDb();
	}
	public function getCount(){
		$rows = $this->mysql->getData("select count(time) as c from questions");
		return $rows[0]['c'];
	}
	public function statsRows(){
		$rows = $this->mysql->getData("select * from questions order by time desc");
		$index = 1;
		foreach ($rows as $row) {
			echo '<tr>';
			echo "<td>$index</td>";
			echo "<td>".date('Y-m-d H:i:s', $row['time'])."</td>";
			echo "<td>".$row['name']."</td>";
			echo "<td>".$row['email']."</td>";
			echo "<td>".$row['phone']."</td>";
			echo "<td>".$row['province']."</td>";
			echo "<td>".$row['city']."</td>";
			echo "<td>".$row['industry']."</td>";
			echo "<td>".$row['corp']."</td>";
			echo "<td>".$row['position']."</td>";
			echo '</tr>';
			
			echo '<tr>';
			echo '<td colspan="2"></td>';
			echo '<td colspan="8" class="gray">'.$row['words'].'</td>';
			echo '</tr>';
			++$index;
		}
	}
	public function statsValues(){
		$vals = '';
		$prefix = 'questions-';
		$list = array(
			$prefix."visits" => '访问页面',
			$prefix."submit" => '提交表单',
			$prefix."sharePage" => '分享给朋友或朋友圈',
		);
		foreach ($list as $key => $desc) {
			$val = memcache_get($this->mmc, $key);
			if (empty($val))
				$val = '0';
			$vals .= $desc."：".$val."<br>";
		}
		return $vals;
	}
}
$access = new DBAccess();

?>
</head>
<body>
	<h2>线上互动问题收集 统计（<?= $access->getCount() ?>）</h2>
	<p><?= $access->statsValues() ?></p>
	<table width="98%" border="1" cellspacing="0" class="gridtable">
		<tr>
			<th>序号</th>
			<th>提交时间</th>
			<th>姓名</th>
			<th>邮箱</th>
			<th>手机</th>
			<th>所在省</th>
			<th>所在市</th>
			<th>所在行业</th>
			<th>所在公司</th>
			<th>职位</th>
		</tr>
		<?= $access->statsRows() ?>
	</table>
</body>
</html>
<?php
$access->close();
?>