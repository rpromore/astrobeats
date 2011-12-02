<?php

include_once("services.php");
$page = !empty($_GET["page"]) ? $_GET["page"] : 0;
$reddit = new Reddit();
// $soundcloud = new SoundCloud();

$n = $page * LIMIT;

header("Content-type: application/json");
$items = array_merge($reddit->getItems());
echo json_encode($items);
// echo json_encode($reddit->getItems($n, LIMIT));	
// echo json_encode($soundcloud->getItems($n, LIMIT));	

?>
