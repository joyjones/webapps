<?php

require("./continents.php");

define('USERID_NAME', 'HELLO_USER_ID_V1');

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
	private function register($id = null){
		if (!$id)
			$id = DBAccess::randomString();
		$time = time();
		$sql = "insert into hello_user (id,created_at,visited_at) values ('$id',$time,$time)";
		$this->mysql->runSql($sql);
		if ($this->mysql->errno())
			die($this->response(false, $this->mysql->errmsg()));
		
		setcookie(USERID_NAME, $id, time() + 3600 * 24 * 365 * 5);
		return $id;
	}
	private function getUser($id){
		if (!$id)
			return null;
		return $this->getFirstData("select * from hello_user where id='$id'");
	}
	private function getPost($id){
		if (!$id)
			return null;
		return $this->getFirstData("select * from hello_post where id=$id");
	}
	private function getFriend($postId, $friendId){
		if (!$postId)
			return null;
		return $this->getFirstData("select * from hello_post_friend where post_id=$postId and friend_id='$friendId'");
	}
	private function getDistance($lng1, $lat1, $lng2, $lat2){
		if ((!$lng1 && !$lat1) || (!$lng2 && !$lat2))
			return 0;
		$r = pi() / 180;
		$lng1 *= $r; $lat1 *= $r;
		$lng2 *= $r; $lat2 *= $r;
		$dlon = $lng2 - $lng1;
		$dlat = $lat2 - $lat1;
		$a = pow(sin($dlat / 2), 2) + cos($lat1) * cos($lat2) * pow(sin($dlon/2), 2);
		$c = 2 * atan2(sqrt($a), sqrt(1 - $a));
		return 6371000.0 * $c;
	}
	private function httpGet($url) {
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_TIMEOUT, 500);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
		curl_setopt($curl, CURLOPT_URL, $url);
		$res = curl_exec($curl);
		curl_close($curl);
		return $res;
	}
	private function getCountryCode($lng, $lat){
		$url = "http://api.geonames.org/countryCode?lat=$lat&lng=$lng&username=shanshuirunhe";
	    $ccode = $this->httpGet($url);
	    $ccode = strtoupper(trim($ccode));
	    return $ccode;
	}
	private function getContinentId($ccode){
	    $ccode = strtoupper(trim($ccode));
		$cts = new Continents();
		foreach ($cts->data as $t) {
			if (in_array($ccode, $t['countries'])){
				return $t['id'];
			}
		}
		return -1;
	}

	public function login($userId, $postId){
		$newuser = false;
		if (!$userId){
			$userId = $this->register();
			$newuser = true;
		}
		$user = $this->getUser($userId);
		if (!$user){
			$this->register($userId);
			$user = $this->getUser($userId);
		}
		if (!$newuser){
			$time = time();
			$sql = "update hello_user set visited_at=$time where id='$userId'";
			$this->mysql->runSql($sql);
		}
		$post = null;
		if ($postId){
			$post = $this->getPost($postId);
			if ($post['status'] != 2)
				$post = null;
		}
		else{
			// $post = $this->getFirstData("select * from hello_post where user_id='$userId' and status=1");
		}
		die($this->response(true, '', array('user' => $user, 'post' => $post)));
	}
	public function setLocation($postId, $lng, $lat, $todie = true){
		$this->runSql("update hello_post set longitude=$lng,latitude=$lat where id=$postId", $todie);
	}
	public function createPost($userId, $todie = true){
		$user = $this->getUser($userId);
		if (!$user)
			die($this->response(false, 'User not found!'));
		$time = time();
		$sql = "insert into hello_post (user_id,created_at) values ('$userId',$time)";
		$this->mysql->runSql($sql);
		if ($this->mysql->errno())
			die($this->response(false, $this->mysql->errmsg()));
		$post = $this->getFirstData("select * from hello_post where user_id='$userId' and created_at=$time");
		die($this->response(true, '', $post));
	}
	public function sharePost($userId, $postId, $todie = true){
		$this->runSql("update hello_post set status=2 where id=$postId and user_id='$userId'", $todie);
	}
	public function setHello($postId, $words, $todie = true){
		$this->runSql("update hello_post set words='$words' where id=$postId", $todie);
	}
	public function addFriend($postId, $friendId, $lng, $lat, $ccode){
		$post = $this->getPost($postId);
		$userFr = $this->getUser($friendId);
		if (!$userFr){
			$friendId = $this->register();
			$userFr = $this->getUser($friendId);
			$this->setLocation($friendId, $lng, $lat, false);
		}
		$postUserId = $post['user_id'];
		$time = time();
		$dist = $this->getDistance($post['longitude'], $post['latitude'], $lng, $lat);
		// $ccode = $this->getCountryCode($lng, $lat);
		$continentId = $this->getContinentId($ccode);
		$friend = $this->getFriend($postId, $friendId);
		if ($friend)
			$sql = "update hello_post_friend set visit_time=$time,longitude=$lng,latitude=$lat,country_code='$ccode',continent=$continentId,distance=$dist where post_id=$postId and friend_id='$friendId'";
		else
			$sql = "insert into hello_post_friend (post_id,friend_id,visit_time,longitude,latitude,country_code,continent,distance) values ($postId,'$friendId',$time,$lng,$lat,'$ccode',$continentId,$dist)";
		$this->runSql($sql, false);

		$sql = "SELECT u.id as user_id, sum(f.distance) as distances, count(distinct(f.country_code)) as countries, count(distinct(f.continent)) as continents
				FROM hello_user as u, hello_post as p, hello_post_friend as f 
				WHERE u.id='$postUserId' and u.id=p.user_id and p.id=f.post_id";
		$data = $this->getFirstData($sql);
		$distTotal = $data['distances'] * 0.001;
		$coutriesTotal = $data['countries'];
		$continentsTotal = $data['continents'];

		$sql = "update hello_user set miles=$distTotal,countries=$coutriesTotal,continents=$continentsTotal where id='$postUserId'";
		$this->runSql($sql);
	}
	public function fillLocation($userId, $postId, $lng, $lat, $ccode){
		$post = $this->getPost($postId);
		if (!$post)
			die($this->response(false, 'Post not found!'));
		if ($userId == $post['user_id'])
			$this->setLocation($postId, $lng, $lat);
		else
			$this->addFriend($postId, $userId, $lng, $lat, $ccode);
	}
	public function requireState($postId){
		$post = $this->getPost($postId);
		if (!$post)
			die($this->response(false, 'Post not found!'));
		$postUserId = $post['user_id'];
		$user = $this->getUser($postUserId);
		$frs = array();
		$sql = "SELECT f.longitude as lng, f.latitude as lat
				FROM hello_post as p, hello_post_friend as f 
				WHERE p.user_id='$postUserId' and p.id=f.post_id";
		$rows = $this->mysql->getData($sql);
		if ($rows){
			foreach ($rows as $row) {
				$frs[] = array('lng' => (float)($row['lng']), 'lat' => (float)($row['lat']));
			}
		}
		die($this->response(true, '', array(
			'user' => $user,
			'post' => $post,
			'friends' => $frs
		)));
	}
}

$action = isset($_GET['act']) ? $_GET['act'] : 'login';

$access = new DBAccess();

$userId = isset($_COOKIE[USERID_NAME]) ? $_COOKIE[USERID_NAME] : null;

try {
	switch ($action) {
		case 'login':
			$access->login($userId, isset($_GET['id']) ? $_GET['id'] : null); break;
		case 'open':
			$access->createPost($userId); break;
		case 'locate':
			$access->fillLocation($userId, $_GET['id'], $_GET['lng'], $_GET['lat'], $_GET['ccode']); break;
		case 'hello':
			$access->setHello($_GET['id'], $_GET['words']); break;
		case 'send':
			$access->sharePost($userId, $_GET['id']); break;
		case 'detect':
			$access->requireState($_GET['id']); break;
	}
} catch (Exception $e) {
	echo $access->response(false, print_r($e, true));
}

$access->close();

?>