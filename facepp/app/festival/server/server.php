<?php

require_once('festival.php');

$fe = new Festival();
$act = $_GET['act'];
$userId = isset($_COOKIE[USERID_NAME]) ? $_COOKIE[USERID_NAME] : null;

switch ($act) {
    case 'wx-sign':{
        if (isset($_SERVER['HTTP_REFERER']))
            $url = $_SERVER['HTTP_REFERER'];
        else
            $url = $_SERVER["REQUEST_URI"];
        $entry = new wxEntry();
        echo json_encode($entry->GetSignPackage($url));
        break;
    }
    case 'login':{
        echo json_encode($fe->login($userId));
        break;
    }
    case 'data': {
        $postId = isset($_GET['post_id']) ? $_GET['post_id'] : null;
        echo json_encode($fe->getDefinesData($postId));
        break;
    }
    case 'fetch':{
        $mediaId = $_POST['media_id'];
        $group = $_POST['group'];
        $cacher = new Memcacher();
        echo json_encode($fe->fetchResource($mediaId, $group));
        break;
    }
    case 'submit':{
        $patId = $_POST['pattern_id'];
        $words = $_POST['words'];
        $faces = $_POST['faces'];
        $nickname = $_POST['nickname'];
        echo json_encode($fe->createPost($userId, $patId, $words, $faces, $nickname));
        break;
    }
    default:
        break;
}
