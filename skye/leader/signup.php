<?php

define('USERID_NAME', 'BEHR_VIPUSER_ID_V1');
define('UID', 'LEADER_USER_ID_V1');
define("WX_APPID", "wx706693a3b8c06727");
define("WX_APPSECRET", "8746c9934263bc1cdbf9cf330f20567a");

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
	public function log($key, $msg)
	{
		$time = date('Y-m-d H:i:s',time());
		// file_put_contents("$key.log", "[$time] $msg\r\n", FILE_APPEND);
	    // $mmc = memcache_init();
	    // if ($mmc)
	    //     memcache_set($mmc, $key.'_'.$time, $msg);
	    $sql = "insert into logs (`time`,`key`,`content`) values('$time','$key','$msg')";
		$this->mysql->runSql($sql);
		if ($this->mysql->errno())
			die($this->response(false, $this->mysql->errmsg()));
	}
	protected function executeUrl($url, $ispost = false)
	{
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        $rst = curl_exec($curl);
        $_e = curl_error($curl);
        if ($rst)
            $rst = json_decode($rst);
        curl_close($curl);
        return $rst;
	}
    public function response($success, $msg = '', $data = null){
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
	private function getUser($openid){
		if (!$openid)
			return null;
		return $this->getFirstData("select * from vip_user where openid='$openid'");
	}
	private function getSignupInfo($userid){
		if (!$userid)
			return null;
		return $this->getFirstData("select * from vip_signup where user_id=$userid");
	}
	private function register($uinfo, &$overwritten){
		$overwritten = false;
		if (!$uinfo)
			return false;
		$time = time();
		$user = $this->getUser($uinfo->openid);
		if ($user){
			$sql = "UPDATE vip_user
					SET openid='$uinfo->openid',nickname='$uinfo->nickname',headimgurl='$uinfo->headimgurl',sex=$uinfo->sex,
						city='$uinfo->city',province='$uinfo->province',country='$uinfo->country',created_at=$time 
					WHERE openid='$uinfo->openid'";
			$overwritten = true;
		}else{
			$sql = "INSERT INTO vip_user (openid,nickname,headimgurl,sex,city,province,country,created_at)
					VALUES ('$uinfo->openid','$uinfo->nickname','$uinfo->headimgurl',$uinfo->sex,
							'$uinfo->city','$uinfo->province','$uinfo->country',$time)";
		}
		$this->mysql->runSql($sql);
		if ($this->mysql->errno())
			return false;
		// setcookie(USERID_NAME, $uinfo->openid, time() + 3600 * 24 * 7);
		$_SESSION[USERID_NAME] = array('openid' => $uinfo->openid, 'time' => $time);
		return true;
	}
	public function login($openid){
		if (!$openid)
			die($this->response(false));
		$user = $this->getUser($openid);
		if (!$user)
			die($this->response(false));
		$sinfo = $this->getSignupInfo($user['id']);
		die($this->response(true, '', array(
			'user' => $user,
			'registered' => $sinfo ? 1 : 0
		)));
	}
	public function signup($openid){
		if (!$openid)
			die($this->response(false));
		$user = $this->getUser($openid);
		if (!$user)
			die($this->response(false));
		$userid = $user['id'];
		$signInfo = $this->getSignupInfo($userid);
		if ($signInfo)
			die($this->response(false, 'ever-signup'));
		$realname = $_REQUEST['realname'];
		$cellphone = $_REQUEST['cellphone'];
		$email = $_REQUEST['email'];
		$province = $_REQUEST['province'];
		$city = $_REQUEST['city'];
		$ever_bought = $_REQUEST['ever_bought'];
		$decorate_date = $_REQUEST['decorate_date'];
		$favor_code = $_REQUEST['favor_code'];
		$time = time();
		$sql = "INSERT INTO vip_signup (user_id,realname,cellphone,email,province,city,ever_bought,decorate_date,favor_code,created_at)
				VALUES ($userid,'$realname','$cellphone','$email','$province','$city',$ever_bought,'$decorate_date','$favor_code',$time)";
		$this->runSql($sql);
	}
	/// authorization /////
	public function authorize()
	{
		$this->log('authorize', 'begin authorize using code:'.$code);

		$code = $_REQUEST['code'];
		if (!isset($code))
			return;
		$state = $_REQUEST['state'];
		$fromurl = $_REQUEST['fromurl'];

		$errmsg = '';
		$rst = $this->requireAccessToken('authorization_code', "code=$code");
		if (!$rst){
			$errmsg = "FAILED WX REGISTERATION:code=$code|furl=$fromurl|state=$state";
		}
		else if ($rst->openid == null || !strlen($rst->openid)){
			$errmsg = "ERROR WX REGISTERATION:code=$code|furl=$fromurl|state=$state\r\n".print_r($rst, true);
		}
		else{
			if ($this->requireUserInfo($rst->access_token, $rst->openid, $errmsg)){
				$n = strpos($fromurl, '|');
				if ($n === 0 || $n > 0){
					$fromurl = preg_replace("/\|/", '&', $fromurl);
					$fromurl = preg_replace("/[\?&]openid=/", '', $fromurl);
					$n = strpos($fromurl, '&');
					$fromurl = substr($fromurl, 0, $n).'?'.substr($fromurl, $n + 1);
				}

				$url = "http://$fromurl";
				$this->log('authorize', "finish url: $url(code=$code;fromurl=$fromurl;openid=$rst->openid)");
				echo "<script>window.location.href='$url';</script>";
				exit;
			}
		}
		echo $errmsg;
		$this->log('authorize', 'error: '.$errmsg);
	}
	protected function requireAccessToken($grant_type = 'client_credential', $moreargs = '')
	{
		if ($grant_type === 'client_credential')
			$url = 'https://api.weixin.qq.com/cgi-bin/token';
		else if ($grant_type === 'authorization_code')
			$url = "https://api.weixin.qq.com/sns/oauth2/access_token";
		else
			return null;
		$url .= "?grant_type=$grant_type";
		$url .= "&appid=".WX_APPID;
		$url .= "&secret=".WX_APPSECRET;
		if (strlen($moreargs))
			$url .= "&$moreargs";
		$rst = $this->executeUrl($url);
		return $rst;
	}
	protected function requireUserInfo($access_token, $openid, &$errmsg)
	{
        $url = "https://api.weixin.qq.com/sns/userinfo";
        $url .= "?access_token=$access_token";
        $url .= "&openid=$openid";
        $url .= "&lang=zh_CN";
    	$info = $this->executeUrl($url);
    	if ($info && $info->openid){
    		$overwritten = false;
    		if ($this->register($info, $overwritten)){
    			if (!$overwritten)
					$this->log('authorize', 'registered new user: '.$info->openid);
				else
					$this->log('authorize', 'authorized old user: '.$info->openid);
    		}else{
				$errmsg = 'register failed';
				return false;
    		}
		}else{
			$errmsg = print_r($info, true);
			return false;
		}
		return true;
	}
	public function requireSubscribeState($openid)
	{
	    $tokenrst = $this->requireAccessToken();
	    if ($tokenrst && $tokenrst->access_token && strlen($tokenrst->access_token)){
	        $url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=$tokenrst->access_token&openid=$openid&lang=zh_CN";
	        $rst = $this->executeUrl($url);
			$this->log('subscribe', print_r($rst));
	        if (!$rst || $rst->errcode || !$rst->openid)
	        	return false;
	        return $rst->subscribe;
    	}
	    return false;
	}
	
	
	
	
	public function logAtLog()
	{
		$uid = isset($_REQUEST['uid'])?$_REQUEST['uid']:-1;
		$type = isset($_REQUEST['type'])?$_REQUEST['type']:'unkonw';
		$sql = "INSERT INTO leader_user_event (uid,type,count) VALUES ('$uid','$type',1)";
		$this->mysql->runSql($sql);
		if ($this->mysql->errno()){
			die($this->response(false, 'db-error'));
		}else{
			die($this->response(true, ''));
		}
		return;
	}
	public function getUid()
	{
		$uid = isset($_SESSION[UID])?$_SESSION[UID]:-1;
		return $uid;
	}
	public function submitUserInfo(){
		$user = -1;//$this->getUid();
		$rtn_id =-1;
		//uid : configs.user_id ,
		$nickname = isset($_REQUEST['nickname'])?$_REQUEST['nickname']:'';
		$email = isset($_REQUEST['email'])?$_REQUEST['email']:'';
		$province = isset($_REQUEST['province'])?$_REQUEST['province']:'';
		$Industry = isset($_REQUEST['Industry'])?$_REQUEST['Industry']:'';
		
		if ($user==-1){
			$sql = "INSERT INTO leader_user (nickname,email,province,`Industry`) VALUES ('$nickname','$email','$province','$Industry')";
			$this->mysql->runSql($sql);
			if ($this->mysql->errno()){
				$_SESSION[UID] = -1 ;
				die($this->response(false, 'db-error'));
			}else{
				$rtn_id = $this->mysql->lastId (); //mysql_insert_id() ;
				$_SESSION[UID] = (0==$rtn_id)?-1:$rtn_id ;
				die($this->response(true, '',$rtn_id));
			}
		}else{
			$sql = "UPDATE leader_user SET nickname='$nickname',email='$email',province='$province',`Industry`='$Industry' WHERE id='$user'";
			$this->mysql->runSql($sql);
			if ($this->mysql->errno()){
				die($this->response(false, 'db-error'));
			}else{
				// success or 0==mysql_affected_rows()
				die($this->response(true, '',$user));
			}
		}
		return;
	}
}
session_start();

$action = isset($_REQUEST['act']) ? $_REQUEST['act'] : 'login';

$access = new DBAccess();

// $userOpenId = isset($_COOKIE[USERID_NAME]) ? $_COOKIE[USERID_NAME] : null;
$user = $_SESSION[USERID_NAME];

try{
	switch ($action) {
		case 'reg':{
			$access->authorize();
		} break;
		case 'login':{
			$access->login($user ? $user['openid'] : null);
		} break;
		case 'signup':{
			$access->signup($user ? $user['openid'] : null);
		} break;
		case 'log':{
			$access->logAtLog($user ? $user['openid'] : null);
		} break;
		case 'getUid':{
			// http://skyemedia.sinaapp.com/leader/signup.php?act=getUid
			die($access->response(true, '',$access->getUid() ));
		} break;
		case 'setUserInfo':{
			// http://skyemedia.sinaapp.com/leader/signup.php?act=setUserInfo&nickname=nick&email=email@c.cc&province=beijing&Industry=IT
			$access->submitUserInfo();
		} break;
	}
}
catch (Exception $e) {
	print_r($e);
}
$access->close();

?>