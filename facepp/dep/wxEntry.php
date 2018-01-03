<?php

require_once('memcacher.php');

class wxEntry
{
  private $appId;
  private $appSecret;
  private $memcacher;

  public function __construct($appId="wx4b2ea450223f24c3", $appSecret="0c728673113df289c36e2445f5088f7e") {
    $this->appId = $appId;
    $this->appSecret = $appSecret;
    $this->memcacher = new Memcacher();
  }

  public function getSignPackage($url) {
    $jsapiTicket = $this->getJsApiTicket();
    if (!$url || !strlen($url))
      $url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $timestamp = time();
    $nonceStr = $this->createNonceStr();

    // 这里参数的顺序要按照 key 值 ASCII 码升序排序
    $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";

    $signature = sha1($string);

    $signPackage = array(
      "appId"     => $this->appId,
      "nonceStr"  => $nonceStr,
      "timestamp" => $timestamp,
      "url"       => $url,
      "signature" => $signature,
      "rawString" => $string
    );
    return $signPackage;
  }

  private function createNonceStr($length = 16) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $str = "";
    for ($i = 0; $i < $length; $i++) {
      $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
    }
    return $str;
  }

  private function getJsApiTicket() {
    $time = date('Y-m-d H:i:s',time());

    $ctx = $this->memcacher->getJson("jsapi_ticket");
    $data = json_decode($ctx);
    if (!$data || strlen($ctx) == 0){
      $data = json_decode(json_encode(array('expire_time' => 1, 'jsapi_ticket' => 0)));
    }
    $ticket = '';
    if ($data->expire_time < time()) {
      $accessToken = $this->getAccessToken();
      $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
      $res = json_decode($this->httpGet($url));
      $ticket = $res->ticket;

      if ($ticket) {
        $data->expire_time = time() + 7000;
        $data->jsapi_ticket = $ticket;
        $this->memcacher->saveJson("jsapi_ticket", json_encode($data));
      }
    } else {
      $ticket = $data->jsapi_ticket;
    }

    return $ticket;
  }

  public function getAccessToken() {
    $time = date('Y-m-d H:i:s',time());

    $data = json_decode($this->memcacher->getJson("access_token"));
    if (!$data || $data->expire_time < time()) {
      $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$this->appId&secret=$this->appSecret";
      $res = json_decode($this->httpGet($url));
      $access_token = $res->access_token;

      if ($access_token) {
        $data->expire_time = time() + 7000;
        $data->access_token = $access_token;
        $this->memcacher->saveJson("access_token", json_encode($data));
      }
    } else {
      $access_token = $data->access_token;
    }

    return $access_token;
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
}
