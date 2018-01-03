<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<title>注册列表</title>
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
		$rows = $this->mysql->getData("select count(id) as c from leader_user");
		return $rows[0]['c'];
	}
	public function statsRows(){
		$rows = $this->mysql->getData("select * from leader_user order by lcd desc");
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
				echo "<!-- <td>".$row['id']."</td> -->";
				echo "<td>".$row['nickname']."</td>";
				echo "<td>".$row['email']."</td>";
				echo "<td>".$row['province']."</td>";
				echo "<td>".$row['Industry']."</td>";
				echo "<td>".$row['ip']."</td>";
				echo "<td>".$row['lcd']."</td>";
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
	<h2>注册列表（<?= $access->getCount() ?>）</h2>
	<table width="98%" border="1" cellspacing="0" class="gridtable">
		<tr>
			<th>序号</th>
			<!-- <th>ID</th> -->
			<th>微信昵称</th>
			<th>电子邮箱</th>
			<th>所在省份</th>
			<th>所属行业</th>
			<th>IP地址</th>
			<th>注册时间</th>
		</tr>
		<?= $access->statsRows() ?>
	</table>
</body>
</html>
<?php
$access->close();
?>