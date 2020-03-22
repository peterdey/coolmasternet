<?php
include_once "engine.php";
include_once "config.php";

header("Cache-Control: no-cache, must-revalidate");
header("Content-Type: application/json");

if($_SERVER["REQUEST_METHOD"] == "POST"){
	if (
		!isset($_POST['uri']) ||
		(isset($_POST['uri']) && $_POST['uri'] != '/v1.0/device/@sn@/raw') ||
		!isset($_POST['command']) ||
		(isset($_POST['command']) && !preg_match('/(on|off|fspeed|cool|dry|heat|fan|auto|temp)/', $_POST['command'])) ||
		!isset($_POST['unit']) ||
		(isset($_POST['unit']) && strcmp(substr($_POST['unit'],0,5),'L1_10'))
	) {
		http_response_code(405); //method not allowed
		exit;
	}
	
	if (isset($_POST['value'])) {
	   $json_ret = get_json_info($_POST["uri"] . '?command=' . $_POST['command'] . '&' . $_POST['unit'] . '&' . $_POST['value'],$ip);
	} else {
		$json_ret = get_json_info($_POST["uri"] . '?command=' . $_POST['command'] . '&' . $_POST['unit'],$ip);
	}
	//request failed
	if($json_ret===FALSE){
		http_response_code(503); //service Unavailable 
		exit;
	}
	print($json_ret);

}else if($_SERVER["REQUEST_METHOD"] == "GET"){
	//control if uri is sended
	if (
		!isset($_GET["uri"]) ||
		($_GET["uri"] != "/v2.0/device/@sn@/ls2") ||
		(isset($_GET['unit']) && strcmp(substr($_GET['unit'],0,5),'L1_10'))
	) {
		http_response_code(405); //method not allowed
		exit;
	}
	
	if (isset($_GET['unit']))
		$json_info=get_json_info($_GET["uri"] . '&' . $_GET['unit'],$ip);
	else
		$json_info=get_json_info($_GET["uri"],$ip);

	//request failed
	if($json_info===FALSE){
		http_response_code(503); //service Unavailable 
		exit;
	}
	print($json_info);
}
?>
