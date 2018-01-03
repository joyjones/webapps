<?php

class DBAccess
{
	protected $mysql = null;
	public $lastError = null;

	public function __construct() {
		$this->mysql = new SaeMysql();
	}
	public function close(){
		$this->mysql->closeDb();
	}
    public function response($success, $msg = '', $data = null){
    	return json_encode(array(
    		'success' => $success,
    		'message' => $msg,
    		'data' => $data
		));
    }
    public function runSql($sql){
		$this->mysql->runSql($sql);
		if ($this->mysql->errno()){
			$this->lastError = $this->mysql->errmsg();
			return false;
		}
		return true;
    }
    public function findAll($sql){
    	return $this->mysql->getData($sql);
    }
    public function findOne($sql){
		$rows = $this->mysql->getData($sql);
		if (!$rows)
			return null;
		return $rows[0];
    }
}