<?php

header("Content-type: text/html; charset=gb2312");

function cvt($name){
	return iconv("UTF-8", "gb2312", $name);
}

$result = [];
$autoCounter = 0;

if (!is_dir('./out'))
	mkdir('./out');

function listDir($dir, $subdir = '', $id = null, $name = null){
	global $result;
	global $autoCounter;

	if(is_dir($dir)) {
	    if ($dh = opendir($dir)) {
	        while (($file = readdir($dh)) !== false) {
	        	if ($file === "." || $file === "..")
	        		continue;
	            if (is_dir("$dir/$file")) {
	            	if (preg_match_all("/(\d+).+-(\w+)/", $file, $mats)){
		                echo "<b><font color='red'>ID: ".$mats[1][0].", PY: ".$mats[2][0]."</font></b><br><hr>";
		                listDir("$dir/$file/", "$subdir/$file", $mats[1][0], $mats[2][0]);
		            }
	            }
	            else if ($id && $name && preg_match("/^.+\.((jpg)|(jpeg))$/i", $file)){
                    echo $file."<br>";
                    $autoCounter++;
                    $newName = "W${autoCounter}A${id}.jpg";
                    $result[] = [$newName => "$id-$name/$file"];
                    copy("$dir/$file", "./out/$newName");
	            }else{
	            	echo "WARN: NOT MATCH FILE '$dir/$file'.<br>";
	            }
	        }
	        closedir($dh);
	    }
	}
}
listDir($_REQUEST['dir']);

file_put_contents('./remap.txt', "");
foreach ($result as $item) {
	foreach ($item as $key => $value) {
		file_put_contents('./remap.txt', "$key -> $value\r\n", FILE_APPEND);
	}
}


// var_dump($result);
