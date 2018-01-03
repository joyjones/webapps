<?php

define('USERID_NAME', 'BECURIOUS_USER_ID_V2');
define('TBNAME', 'becurious_user');

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
	public static function randomString($length = 16) {
		$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		$str = "";
		for ($i = 0; $i < $length; $i++) {
			$str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
		}
		return $str;
	}
    private function response($success, $msg = '', $data = null){
    	return json_encode(array(
    		'success' => $success, 
    		'message' => $msg,
    		'data' => $data
		));
    }
    private function runSql($sql, $todie = true){
		$this->mysql->runSql($sql);
		if ($this->mysql->errno())
			die($this->response(false, $this->mysql->errmsg()));
		if ($todie)
			die($this->response(true));
    }
    private function getFirstData($sql){
		$rows = $this->mysql->getData($sql);
		if (!$rows)
			return null;
		return $rows[0];
    }
    public function login($id){
    	$user = null;
		if (!$id)
			$id = DBAccess::randomString();
		else
			$user = $this->getUser($id);
		setcookie(USERID_NAME, $id, time() + 3600 * 24 * 365 * 5);
		return $this->response(true, '', array('id' => $id, 'nickname' => $user ? $user['nickname'] : ''));
    }
	public function recordScore($id = null, $nickname, $score){
		if (!$id)
			$id = DBAccess::randomString();
		$user = $this->getUser($id);
		$sql = null;
		$time = time();
		$bestScore = $score;
		$totalScore = intval($score * 10);
		if ($user != null){
			if (empty($nickname))
				$nickname = $user['nickname'];
			$totalScore += $user['total_score'];
			if ($score > $user['score'])
				$sql = "update ".TBNAME." set nickname='$nickname',score=$score,total_score=$totalScore,record_time=$time where id='$id'";
			else{
				$sql = "update ".TBNAME." set total_score=$totalScore where id='$id'";
				$bestScore = $user['score'];
			}
		}else{
			$sql = "insert into ".TBNAME." (id,nickname,score,total_score,record_time) values ('$id','$nickname',$score,$totalScore,$time)";
		}
		if ($sql){
			$this->runSql($sql, false);
		}
		return $this->getRankList($id, $bestScore, $totalScore);
	}
	public function getUser($id){
		if (!$id)
			return null;
		return $this->getFirstData("select * from ".TBNAME." where id='$id'");
	}
	public function getRankList($userId, $bestScore, $totalScore){
		$list = array();
		$count = 20; $rank = 0; $rank06 = 0;
		$sql = "select nickname,score,total_score from ".TBNAME." where score>=0.6 order by score desc,total_score desc,record_time limit 0,$count";
		$rows = $this->mysql->getData($sql);
		foreach ($rows as $row) {
			$list[] = array(
				'nickname' => $row['nickname'],
				'score' => $row['score'],
				'total_score' => $row['total_score'],
			);
		}
		$r = $this->getFirstData("select count(id) as c from ".TBNAME." where score>$bestScore");
		if ($r)
			$rank = $r['c'] + 1;
		if ($bestScore >= 0.6){
			$r = $this->getFirstData("select count(id) as c from ".TBNAME." where score>=0.6");
			if ($r)
				$rank06 = $r['c'] + 1;
		}
		return $this->response(true, '', array(
			'list' => $list,
			'rank' => $rank,
			'rank06' => $rank06,
			'bestScore' => $bestScore,
			'totalScore' => $totalScore
		));
	}
}

$action = $_REQUEST['act'];

$access = new DBAccess();

$userId = isset($_COOKIE[USERID_NAME]) ? $_COOKIE[USERID_NAME] : null;

switch ($action) {
	case 'login':{
		echo $access->login($userId);
		break;
	}
	case 'record':{
		echo $access->recordScore($userId, $_REQUEST['nickname'], $_REQUEST['score']);
		break;
	}
}

$access->close();

?>