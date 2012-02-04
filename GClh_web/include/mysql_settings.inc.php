<?php
$mysql_host = "localhost";
$mysql_user = "GClh_web";
$mysql_pw = "blabla1234";
$mysql_db = "GClh_web";

mysql_connect($mysql_host, $mysql_user, $mysql_pw) or die(mysql_error());
mysql_select_db($mysql_db) or die(mysql_error());
?>
