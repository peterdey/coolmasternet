<?php
include_once "config.php";

//retrive infos encoded in JSON format
function get_json_info($uri,$aircon_ip){
    global $sn;
    $properuri = str_replace('/@sn@/', "/$sn/", $uri);
	$url= "http://$aircon_ip$properuri";
	$data = @curl_get_contents($url);
	return $data;
}

function curl_get_contents($url) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}
?>
