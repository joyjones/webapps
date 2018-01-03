<?php

require_once('../../../dep/dbAccess.php');
require_once('../../../dep/wxEntry.php');
require("../../../dep/qiniu/autoload.php");

define('USERID_NAME', 'FESTIVAL_USERID_V1');

use Qiniu\Auth;
use Qiniu\Storage\BucketManager;

/**
* Festival Process Class
*/
class Festival
{
    private $db;
    private $weixin;
    private $qnBucket = 'festival';
    private $qnAccessKey = 'V6pICL7V63_uR24r1yMgRdSMifcfSgg0sSwiCgW5';
    private $qnSecretKey = '_bV6HCJZQlLMkNR0Ivqtg0HyhQA5l_-2ORJLXY2o';

    public function __construct()
    {
        $this->db = new DBAccess();
        $this->weixin = new wxEntry();
    }

    public static function randomString($length = 16)
    {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }

    public function getDefinesData($postId = null)
    {
        $patterns = $this->db->findAll("select * from festival_pattern");
        $slots = $this->db->findAll("select * from festival_pattern_slot");
        $r_patterns = array();
        foreach ($patterns as $pattern) {
            $p = array();
            foreach ($pattern as $key => $value)
                $p[$key] = $value;
            $p['slots'] = array();
            foreach ($slots as $s) {
                if ($s['pattern_id'] === $p['id'])
                    $p['slots'][] = $s;
            }
            $r_patterns[] = $p;
        }
        $r = array(
            'patterns' => $r_patterns,
            'post' => null
        );
        if ($postId){
            $post = $this->db->findOne("select * from festival_user_post where id=$postId");
            $faces = $this->db->findAll("select * from festival_user_post_face where post_id=$postId");
            $user = $this->db->findOne("select * from festival_user where id='".$post['user_id']."'");
            $r['post'] = array(
                'info' => $post,
                'faces' => $faces,
                'user' => $user
            );
        }
        return $r;
    }

    private function getUser($id)
    {
        if (!$id)
            return null;
        return $this->db->findOne("select * from festival_user where id=$id");
    }

    private function register($id = null)
    {
        if (!$id)
            $id = $this->randomString(16);
        $time = time();
        $sql = "insert into festival_user (id,created_at,visited_at) values ('$id',$time,$time)";
        if (!$this->db->runSql($sql))
            return false;
        setcookie(USERID_NAME, $id, time() + 3600 * 24 * 365 * 5);
        return $id;
    }

    public function login($userId)
    {
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
            $this->db->runSql($sql);
        }
        return array('success' => true, 'user' => $user);
    }

    public function fetchResource($mediaId, $prefix)
    {
        $token = $this->weixin->getAccessToken();
        $url = "http://file.api.weixin.qq.com/cgi-bin/media/get";
        $url .= "?access_token=$token";
        $url .= "&media_id=$mediaId";

        $auth = new Auth($this->qnAccessKey, $this->qnSecretKey);
        $bmgr = new BucketManager($auth);

        if (empty($prefix))
            $prefix = '';
        else
            $prefix .= '/';
        $key = $prefix.$mediaId;

        list($ret, $err) = $bmgr->fetch($url, $this->qnBucket, $key);
        if ($err !== null)
            return array('success' => false, 'err' => print_r($err, true));
        return array('success' => true, 'err' => null);
    }

    public function createPost($userId, $patId, $words, $faces, $nickname = null)
    {
        $result = array('success' => false, 'msg' => null, 'postId' => null);
        if (!$userId){
            $result['msg'] = 'no-user';
            return $result;
        }
        if ($nickname && strlen($nickname)){
            $sql = "update festival_user set nickname='$nickname' where id='$userId'";
            $this->db->runSql($sql);
        }
        $time = time();
        $sql = "insert into festival_user_post (user_id,pattern_id,words,created_at) values ('$userId',$patId,'$words',$time)";
        if (!$this->db->runSql($sql)){
            $result['msg'] = 'db-insert-fail';
            return $result;
        }
        $sql = "select * from festival_user_post where user_id='$userId' and pattern_id=$patId and created_at=$time";
        $post = $this->db->findOne($sql);
        $postId = $post['id'];
        foreach ($faces as $face) {
            $fid = $face['face_id'];
            $sid = $face['slot_id'];
            $img = $face['user_image'];
            $pos = $face['position'];
            $x = $pos['x']; $y = $pos['y'];
            $w = $pos['w']; $h = $pos['h'];
            $sql = "insert into festival_user_post_face (id,post_id,slot_id,user_image,x,y,w,h) values ('$fid',$postId,$sid,'$img',$x,$y,$w,$h)";
            $result['sql'] = $sql;
            $this->db->runSql($sql);
        }
        $result['postId'] = $postId;
        $result['success'] = true;
        return $result;
    }
}
