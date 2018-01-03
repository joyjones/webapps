<?php

define('USERID_NAME', 'EXH1_USERID_V1');
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
	private function getUser($openid){
		if (!$openid)
			return null;
		return $this->getFirstData("select * from exh1_user where openid='$openid'");
	}
	private function register($uinfo, &$overwritten){
		$overwritten = false;
		if (!$uinfo)
			return false;
		$time = time();
		$user = $this->getUser($uinfo->openid);
		if ($user){
			$sql = "UPDATE exh1_user
					SET openid='$uinfo->openid',nickname='$uinfo->nickname',headimgurl='$uinfo->headimgurl',sex=$uinfo->sex,
						city='$uinfo->city',province='$uinfo->province',country='$uinfo->country',created_at=$time 
					WHERE openid='$uinfo->openid'";
			$overwritten = true;
		}else{
			$sql = "INSERT INTO exh1_user (openid,nickname,headimgurl,sex,city,province,country,created_at)
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
		die($this->response(true, '', array(
			'user' => $user,
		)));
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
	////////////////////////////////////////////////////////
	public function getDataInit()
	{
		$rows = $this->mysql->getData("select * from exh1_artist");
		echo json_encode(array(
			'artists' => $rows
		));
	}
	public function getDataArtist($id)
	{
		$artist = $this->mysql->getData("select * from exh1_artist where id=$id");
		$articles = $this->mysql->getData("select * from exh1_artist_article where artist_id=$id");
		$workses = $this->mysql->getData("select * from exh1_artist_works where artist_id=$id");
		echo json_encode(array(
			'artist' => $artist[0],
			'articles' => $articles ? $articles : array(),
			'workses' => $workses ? $workses : array()
		));
	}
	public function getDataArticle($id)
	{
		$artist = null;
		$article = null;

		$articles = $this->mysql->getData("select * from exh1_artist_article where id=$id");
		if ($articles && count($articles)){
			$article = $articles[0];
			$artists = $this->mysql->getData("select * from exh1_artist where id=".$article['artist_id']);
			if ($artists && count($artists)){
				$artist = $artists[0];
			}
		}
		echo json_encode(array(
			'article' => $article,
			'artist' => $artist
		));
	}
	public function recordCount($field)
	{
		$this->runSql("UPDATE statis SET value=value+1 WHERE key='$field'", true);
	}
	public function mindResinfo()
	{
		$workses = $this->mysql->getData("select * from exh1_artist_works");
		$cnt = 0;
		foreach ($workses as $row) {
			$info = $row['resinfo'];
			if ($info){
				$info = preg_replace("/^\"/", '', $info);
				$info = preg_replace("/\"$/", '', $info);
				$id = $row['id'];
				$this->mysql->runSql("update exh1_artist_works set resinfo='$info' where id=$id");
				$cnt++;
			}
		}
		echo "finished $cnt.";
	}
}
session_start();

$action = isset($_REQUEST['act']) ? $_REQUEST['act'] : 'login';

$access = new DBAccess();

// $userOpenId = isset($_COOKIE[USERID_NAME]) ? $_COOKIE[USERID_NAME] : null;
$user = isset($_SESSION[USERID_NAME]) ? $_SESSION[USERID_NAME] : null;

try{
	switch ($action) {
		case 'auth':{
			$access->authorize();
		} break;
		case 'login':{
			$access->login($user ? $user['openid'] : null);
		} break;
		case 'statis':{
			$access->recordCount($_REQUEST['key']);
		} break;
		case 'data-init':{
			$access->getDataInit();
		} break;
		case 'data-artist':{
			$access->getDataArtist($_REQUEST['id']);
		} break;
		case 'data-article':{
			$access->getDataArticle($_REQUEST['id']);
		} break;
		case 'mind-resinfo':{
			$access->mindResinfo();
		} break;
	}
}
catch (Exception $e) {
	print_r($e);
}
$access->close();

?>