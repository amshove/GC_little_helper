<?php
require("include/mysql_settings.inc.php");
$json = $_POST["json"];

ob_start();
echo "##Base64: \n";
echo $json."\n\n";
$json = base64_decode($json);
echo "##Klartext: \n";
echo $json."\n\n";

//$json = str_replace("\n","\\n",$json);
//$json = utf8_encode($json);
//$json = str_replace(array("&amp;"),"%26",$json);
//$json = str_replace(array("\\xC4","\\xE4","\\xD6","\\xF6","\\xDC","\\xFC"),array("Ä","ä","Ö","ö","Ü","ü"),$json);
////$json = utf8_encode($json);
//
//echo "##Par Sachen korrigiert:\n";
//echo $json."\n\n";
echo "##JSON_Decode: \n";
var_dump(json_decode($json));
echo "##JSON_Encode: \n";
echo "\n\n".json_encode(json_decode($json));

$settings = json_decode($json);
foreach($settings as $k => $v){
  $k = base64_decode($k);

  if(is_array($v)){
    $new_v = array();
    foreach($v as $val) $new_v[] = base64_decode($val);
    mysql_query("INSERT INTO settings SET `key` = '".$k."', `value` = '".implode("#T#",$new_v)."' ON DUPLICATE KEY UPDATE `value` = '".implode("#T#",$new_v)."'");
  }else{
    $v = base64_decode($v);
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
