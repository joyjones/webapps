<?php

define('USERID_NAME', 'BURTONSENN_USER_ID_V1');

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
	private function register($id = null){
		if (!$id)
			$id = DBAccess::randomString();
		$time = time();
		$sql = "insert into burtonsenn_user (id,created_at,visited_at) values ('$id',$time,$time)";
		$this->mysql->runSql($sql);
		if ($this->mysql->errno())
			die($this->response(false, $this->mysql->errmsg()));
		
		setcookie(USERID_NAME, $id, time() + 3600 * 24 * 365 * 5);
		return $id;
	}
	private function getUser($id){
		if (!$id)
			return null;
		return $this->getFirstData("select * from burtonsenn_user where id='$id'");
	}
	private function getPost($id){
		if (!$id)
			return null;
		return $this->getFirstData("select * from burtonsenn_post where id=$id");
	}
	// section: 0-placard, 1-creation, 2-postview, 3-gallery-new, 4-gallery-hot
	public function login($id, $section = 0){
		$newuser = false;
		if (!$id){
			$id = $this->register();
			$newuser = true;
		}
		$user = $this->getUser($id);
		if (!$user){
			$this->register($id);
			$user = $this->getUser($id);
		}
		if (!$newuser){
			$time = time();
			$sql = "update burtonsenn_user set visited_at=$time where id='$id'";
			$this->mysql->runSql($sql);
		}
		$post = null; $praised = null;
		if ($section == 2 && isset($_REQUEST['post_id'])){
			$pid = $_REQUEST['post_id'];
			$post = $this->getPost($pid);
			if ($post){
				$rec = $this->getFirstData("select id from burtonsenn_post_action where post_id=$pid and user_id='$id' and action=1");
				$praised = $rec ? true : false;
			}
		}
		$list = null;
		if ($section == 3){
			$list = $this->mysql->getData('select id,imgurl from burtonsenn_post order by created_at desc');
			$this->runSql("update burtonsenn_user set nav_mode=0 where id='$id'", false);
		}
		else if ($section == 4){
			$list = $this->mysql->getData('select id,imgurl from burtonsenn_post order by praised_count desc');
			$this->runSql("update burtonsenn_user set nav_mode=1 where id='$id'", false);
		}

		die($this->response(true, '', array(
			'user' => $user,
			'post' => $post,
			'list' => $list,
			'praised' => $praised
		)));
	}
	public function praisePost($userId, $postId){
		$user = $this->getUser($userId);
		if (!$user)
			die($this->response(false, 'User not found'));
		$post = $this->getPost($postId);
		if (!$post)
			die($this->response(false, 'Post not found'));
		$rec = $this->getFirstData("select id from burtonsenn_post_action where post_id=$postId and user_id='$userId' and action=1");
		if ($rec)
			die($this->response(false));
		$time = time();
		$sql = "insert into burtonsenn_post_action (post_id,user_id,action,created_at) values ($postId,'$userId',1,$time)";
		$this->runSql($sql, false);

		$rec = $this->getFirstData("select count(id) as c from burtonsenn_post_action where post_id=$postId and action=1");
		$count = $rec['c'];
		$this->runSql("update burtonsenn_post set praised_count=$count where id=$postId");
	}
	public function addPost($id, $imgurl, $w, $h, $tplindex){
		$user = $this->getUser($id);
		if (!$user)
			die($this->response(false, 'User not found'));
		if (empty($imgurl))
			die($this->response(false, 'Resource not enough'));
		$time = time();
		$sql = "insert into burtonsenn_post (user_id,imgurl,width,height,template,created_at) values ('$id','$imgurl',$w,$h,$tplindex,$time)";
		$this->runSql($sql, false);
		$this->gainLatestPost($id);
	}
	public function gainLatestPost($userId){
		$sql = "select id from burtonsenn_post where user_id='$userId' order by created_at desc limit 0,1";
		$rec = $this->getFirstData($sql);
		if (!$rec)
			die($this->response(false, 'Post not found'));
		die($this->response(true, '', $rec['id']));
	}
	public function navigatePost($userId, $postId, $dir = '>='){
		$user = $this->getUser($userId);
		if (!$user)
			die($this->response(false, 'User not found'));
		$post = $this->getPost($postId);
		if (!$post)
			die($this->response(false, 'Post not found'));
		$mode = $user['nav_mode'];
		$sql = ''; $ord = ($dir == '>=' ? '' : ' desc');
		if ($mode == 0){
			$time = $post['created_at'];
			$sql = "select id from burtonsenn_post 
					where created_at$dir$time and id<>$postId 
					order by created_at$ord limit 0,1";
		}else{
			$count = $post['praised_count'];
			$sql = "select id from burtonsenn_post 
					where praised_count$dir$count and id<>$postId 
					order by praised_count$ord limit 0,1";
		}
		$rec = $this->getFirstData($sql);
		if (!$rec){
			if ($dir == '>=')
				die($this->response(false, '没有上一个啦~'));
			else
				die($this->response(false, '没有下一个啦~'));
		}
		die($this->response(true, '', $rec['id']));
	}
}

$action = isset($_REQUEST['act']) ? $_REQUEST['act'] : 'login';

$access = new DBAccess();

$userId = isset($_COOKIE[USERID_NAME]) ? $_COOKIE[USERID_NAME] : null;

switch ($action) {
	case 'login':{
		$access->login($userId, $_REQUEST['section']);
		break;
	}
	case 'create':{
		$access->addPost($userId, $_REQUEST['imgurl'], $_REQUEST['width'], $_REQUEST['height'], $_REQUEST['tplindex']);
		break;
	}
	case 'praise':{
		$access->praisePost($userId, $_REQUEST['id']);
		break;
	}
	case 'prev':{
		$access->navigatePost($userId, $_REQUEST['id'], '>=');
		break;
	}
	case 'next':{
		$access->navigatePost($userId, $_REQUEST['id'], '<=');
		break;
	}
}

$access->close();

?>