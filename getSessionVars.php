<?php
session_start();
if(!is_array($_SESSION['photos'])){
	$_SESSION['photos'] = array();
}
echo json_encode(array("session"=>array_keys($_SESSION['photos'])));
?>
