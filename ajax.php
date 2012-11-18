<?php
session_start();
$photoId = $_GET["id"];
$id = explode("-",$photoId);
$class = "icon-heart favIcon";
if(!is_array($_SESSION['photos'])){
	$_SESSION['photos'] = array();
}
if(!array_key_exists($id[1],$_SESSION['photos'])){
	$_SESSION['photos'][$id[1]] = $photoId;
}else{
	$class = "icon-heart-empty favIcon";
	unset($_SESSION['photos'][$id[1]]);
}
$var = array("val"=>$class,"photos"=>$_SESSION['photos']);
echo json_encode($var);
?>
