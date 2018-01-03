<?php
$result = null;
if (isset($_GET['key'])){
  $key = $_GET['key'];
  $mmc = memcache_init();
  if ($mmc){
    $result = memcache_get($mmc, $key);
    if ($result === null){
      if (isset($_GET['addval']))
        $result = intval($_GET['addval']);
      else
        $result = 1;
    }else{
      if (isset($_GET['addval']))
        $result += intval($_GET['addval']);
      else
        $result += 1;
    }
    memcache_set($mmc, $key, $result);
  }
}
die(json_encode(array('success' => $result !== null, 'result' => $result)));