<?php

define('USEMEMCACHE', true);

class Memcacher
{
	public function __construct() {
	}

	public function saveJson($name, $content) {
		if (!USEMEMCACHE){
			file_put_contents("../logs/$name", $content);
		}else{
			$mmc = memcache_init();
			if ($mmc == false)
				echo "mc init failed\n";
			else
				memcache_set($mmc, $name, $content);
		}
	}

	public function getJson($name) {
		if (!USEMEMCACHE){
			if (!is_file("../logs/$name"))
				return '';
			return file_get_contents("../logs/$name");
		}else{
			$mmc = memcache_init();
			if($mmc == false)
				return "";
			else
				return memcache_get($mmc, $name);
		}
	}
}