<?php

$commands = [];
$sql = "INSERT INTO exh1_artist_article (artist_id,title,type,icon,content,date,author) VALUES (%VALS%);";

function cvt($name){
	return iconv("GBK", "UTF-8", $name);
}
function parseDir($dir, $subdir = '', $id = null, $name = null){
	global $commands;
	global $sql;

	if(is_dir($dir)) {
	    if ($dh = opendir($dir)) {
	        while (($file = readdir($dh)) !== false) {
	        	if ($file === "." || $file === "..")
	        		continue;
	            if (is_dir("$dir/$file")) {
	            	if (preg_match_all("/(\d+).+-(\w+)/", $file, $mats)){
		                echo "<b><font color='red'>ID: ".$mats[1][0].", PY: ".$mats[2][0]."</font></b><br><hr>";
		                parseDir("$dir/$file/", "$subdir/$file", $mats[1][0], $mats[2][0]);
		            }
	            }
	            else if ($id && $name && preg_match_all("/^(\d+)(.+)\.html$/i", $file, $matsName)){
                    echo $file."<br>";
                    $type = $matsName[1][0];
                    $title = $matsName[2][0];
                    $author = '';
                    if ($type == 1){
                    	if (preg_match_all("/^(.+)-(.+?)$/", $title, $matsTitle)){
                    		$title = $matsTitle[1][0];
                    		$author = $matsTitle[2][0];
                    	}
                    }
                    $content = file_get_contents("$dir/$file");
					$vals = "$id,'$title',$type,'','$content','','$author'";
					$cmd = preg_replace("/%VALS%/", $vals, $sql);
					$commands[] = $cmd;
	            }else{
	            	echo "WARN: NOT MATCH FILE '$dir/$file'.<br>";
	            }
	        }
	        closedir($dh);
	    }
	}
}

header("Content-type: text/html; charset=utf8");

parseDir($_REQUEST['dir']);
file_put_contents('./articles.sql', '');
foreach ($commands as $cmd) {
	file_put_contents('./articles.sql', "$cmd;\r\n", FILE_APPEND);
}
echo 'finished<br>';