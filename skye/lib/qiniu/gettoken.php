<?php
	require_once("./src/rs.php");

	// for skey by 84844847@qq.com
	$accessKey = 'V6pICL7V63_uR24r1yMgRdSMifcfSgg0sSwiCgW5';
	$secretKey = '_bV6HCJZQlLMkNR0Ivqtg0HyhQA5l_-2ORJLXY2o';

	Qiniu_SetKeys($accessKey, $secretKey);
	$putPolicy = new Qiniu_RS_PutPolicy('skye');
	$upToken = $putPolicy->Token(null);

	echo '{"uptoken" : "'.$upToken.'"}';
?>
