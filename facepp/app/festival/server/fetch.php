<?php
    /*
     *
     * @desc URL安全形式的base64编码
     * @param string $str
     * @return string
     */

    function urlsafe_base64_encode($str){
        $find = array("+","/");
        $replace = array("-", "_");
        return str_replace($find, $replace, base64_encode($str));//.'=';
    }

    /**
     * generate_access_token
     *
     * @desc 签名运算
     * @param string $access_key
     * @param string $secret_key
     * @param string $url
     * @param array$params
     * @return string
     */
    function generate_access_token($access_key, $secret_key, $url, $params = ''){
        $parsed_url = parse_url($url);
        $path = $parsed_url['path'];
        $access = $path;
        if (isset($parsed_url['query'])) {
            $access .= "?" . $parsed_url['query'];
        }
        $access .= "\n";
        if($params){
            if (is_array($params)){
                $params = http_build_query($params);
            }
            $access .= $params;
        }
        $digest = hash_hmac('sha1', $access, $secret_key, true);
        return $access_key.':'.urlsafe_base64_encode($digest);
    }

    function send($url, $header = null) {
        $curl = curl_init($url);
        // curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        // curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HEADER, true);
        if ($header)
            curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        curl_setopt($curl, CURLOPT_POST, true);
        $con = curl_exec($curl);
        if ($con === false) {
            echo 'CURL ERROR: ' . curl_error($curl)."<br>";
        } else {
            return $con;
        }
    }
    /**
     * 测试
     */
    $access_key = 'V6pICL7V63_uR24r1yMgRdSMifcfSgg0sSwiCgW5';
    $secret_key = '_bV6HCJZQlLMkNR0Ivqtg0HyhQA5l_-2ORJLXY2o';

    $fetch = urlsafe_base64_encode('http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=qEVFHJEK3NG3ugLSe29RIWJpqBhV8LAt8O8OBh5RTwi9hldHNfnGzOjAnwi6GPxCM65eQmQuzXT8wpAG2PxsgUvHW0V1BVaFHXPkWj6czv4ySO1tRURBwWMT_x1u4QgGNQOaADAEHF&media_id=yQ4ntvxiB94FGfpJbQZGf5RhOacmcIgvvEgX8NY-yB-5XWZHKzoXVlVmdi3AS3Xm');
    $to = urlsafe_base64_encode('festival:demo.jpg');

    $url = 'http://iovip.qbox.me/fetch/'. $fetch .'/to/' . $to;
    // echo "url:$url<br>";
    $access_token = generate_access_token($access_key, $secret_key, $url);
    // echo "token:$access_token<br>";

    $header = array();
    // $header[] = 'Referer: http://iovip.qbox.me';
    // $header = array('Host: iovip.qbox.me');
    $header[] = 'Access-Control-Allow-Origin: *';
    $header[] = 'Accept: */*';
    $header[] = 'Content-Type: application/x-www-form-urlencoded';
    $header[] = 'Authorization: QBox '. $access_token;

    $u = 'http://iovip.qbox.me/fetch/'.$fetch.'/to/'.$to;
    $con = send($u, $header);
    // echo "sent::$u<br>";
    echo print_r($con, true);
    // echo $u;
