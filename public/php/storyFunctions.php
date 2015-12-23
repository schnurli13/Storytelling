<?php

require('../../framework/modules/mysqlModule.php');
require('../../framework/modules/sessionModule.php');
require('../../framework/modules/basicInformationModule.php');

session_start();

switch($_POST['function']){
	case 'loadTargetPage':
		loadTargetPage($_POST['page_id']);
		break;
	case 'loadFirstPage':
		loadFirstPage();
		break;
}

function loadTargetPage($page_id){
	$mysqlObject = new mysqlModule();
	$returnArray = array();
	$page_information = $mysqlObject->queryDataBase('SELECT * FROM page WHERE id = "'.$page_id.'"');
	
	array_push($returnArray, $page_information[0]['title']);
	array_push($returnArray, $page_information[0]['text']);
	array_push($returnArray, $page_information[0]['imageLink']);
	array_push($returnArray, $page_information[0]['NextPageID1']);
	array_push($returnArray, $page_information[0]['NextPageID2']);
	array_push($returnArray, $page_information[0]['NextPageID3']);
	array_push($returnArray, $page_information[0]['NextPageID4']);
	array_push($returnArray, $page_information[0]['OptionText1']);
	array_push($returnArray, $page_information[0]['OptionText2']);
	array_push($returnArray, $page_information[0]['OptionText3']);
	array_push($returnArray, $page_information[0]['OptionText4']);
	
	echo json_encode($returnArray);
}

function loadFirstPage(){
	$mysqlObject = new mysqlModule();
		
	$page_id = $mysqlObject->queryDataBase('SELECT firstPage FROM story WHERE name = "'.$_POST['story'].'"')[0]['firstPage'];
		
	loadTargetPage($page_id);

}