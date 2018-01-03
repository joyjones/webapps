<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<title>事件统计</title>
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
	</style>
<?php
class DBAccess
{
	public $dic = array(
		'down_android'=> '进入安卓下载页',
		'down_iphone'=> '进入iTurns下载页',
		'join'=> '进入注册页',
		'logo'=> '点击主页logo',
		'rule'=> '查看规则',
		'share_click'=> '点击分享按钮',
		'signup'=> '提交注册',
		'test'=>'测试 '
	);
	
	protected $mysql = null;
	public function __construct() {
		$this->mysql = new SaeMysql();
		$this->mysql->setAppname('galleries');
		$this->mysql->setAuth('5x0oljlyyw', 'w0wwyx41m2l4iz53w5yk33h5hlmhh145xw4jlwl1');
	}
	public function close(){
		$this->mysql->closeDb();
	}
	public function getCount(){
		$rows = $this->mysql->getData("select count(id) as c from leader_user_event");
		return $rows[0]['c'];
	}
	public function statsRows(){
		$rows = $this->mysql->getData("SELECT type, sum(`count`) as cnt FROM `leader_user_event` group by type");
		$index = 1;
		// $recs = array();
		if($rows){
			foreach ($rows as $row){
				// $found = false;
				// foreach ($recs as $r) {
				// 	if ($r['realname'] == $row['realname'] && $r['cellphone'] == $row['cellphone']){
				// 		$found = true;
				// 		break;
				// 	}
				// }
				// if ($found)
				// 	continue;
				echo '<tr>';
				echo "<td>$index</td>";
				echo "<td>".(($this->dic[$row['type']])?$this->dic[$row['type']]:$row['type'])."</td>";
				echo "<td>".$row['cnt']."</td>";
				echo '</tr>';
				// $recs[] = array('realname' => $row['realname'], 'cellphone' => $row['cellphone']);
				++$index;
			}
		}
	}
}
$access = new DBAccess();
?>
</head>
<body>
	<h2>事件统计（<?= $access->getCount() ?>）</h2>
	<table width="98%" border="1" cellspacing="0" class="gridtable">
		<tr>
			<th>序号</th>
			<th>事件类型</th>
			<th>数量</th>
		</tr>
		<?= $access->statsRows() ?>
	</table>
</body>
</html>
<?php
$access->close();
?>