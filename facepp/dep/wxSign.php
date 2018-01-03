<?php

require('wxEntry.php');

$entry = new wxEntry();

if (isset($_SERVER['HTTP_REFERER']))
  $url = $_SERVER['HTTP_REFERER'];
else
  $url = $_SERVER["REQUEST_URI"];

$data = $entry->GetSignPackage($url);
echo json_encode($data);