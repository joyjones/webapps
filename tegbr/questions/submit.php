<?php

define('USERID_NAME', 'QUESTIONS_USERID_V1');

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
	public function submit($userId){
		// $user = $this->getUser($openid);
		// if ($user)
		// 	die($this->response(false));
		$time = time();
		$name = $_REQUEST['name'];
		$phone = $_REQUEST['phone'];
		$email = $_REQUEST['email'];
		$province = $_REQUEST['province'];
		$city = $_REQUEST['city'];
		$industry = $_REQUEST['industry'];
		$corp = $_REQUEST['corp'];
		$position = $_REQUEST['position'];
		$words = $_REQUEST['words'];
		$time = time();
		$sql = "INSERT INTO questions (time,name,email,province,city,industry,phone,corp,position,words)
				VALUES ($time,'$name','$email','$province','$city','$industry','$phone','$corp','$position','$words')";
		$this->runSql($sql);
	}
}
session_start();

$access = new DBAccess();

$userId = $_SESSION[USERID_NAME];

try{
	$access->submit($userId);
}
catch (Exception $e) {
	print_r($e);
}
$access->close();

?>