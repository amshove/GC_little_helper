<?php
require("include/mysql_settings.inc.php");
$json = $_POST["json"];

ob_start();

$json = str_replace("\n","\\n",$json);
$json = utf8_encode($json);
$json = str_replace(array("\\xC4","\\xE4","\\xD6","\\xF6","\\xDC","\\xFC"),array("Ä","ä","Ö","ö","Ü","ü"),$json);
//$json = utf8_encode($json);

echo $json."\n\n";
var_dump(json_decode($json));
echo "\n\n".json_encode(json_decode($json));

$settings = json_decode($json);
foreach($settings as $k => $v){
  if(is_array($v)){
    mysql_query("INSERT INTO settings SET `key` = '".$k."', `value` = '".implode("#T#",$v)."' ON DUPLICATE KEY UPDATE `value` = '".implode("#T#",$v)."'");
  }else{
    mysql_query("INSERT INTO settings SET `key` = '".$k."', `value` = '".$v."' ON DUPLICATE KEY UPDATE `value` = '".$v."'");
  }
}
echo mysql_error();

$c=ob_get_contents();
ob_end_clean();

$fp=fopen("/tmp/file.txt", "w");
fwrite($fp, $c);
fclose($fp);
?>
