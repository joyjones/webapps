<?php

$act = $_GET['act'];
if ($act == 'get'){
	$key = isset($_COOKIE['testkey']) ? $_COOKIE['testkey'] : 'NULL';
	echo 'cookie='.$key;
}
else{
	setcookie('testkey', '12345');
	echo 'set cookie ok';
}
