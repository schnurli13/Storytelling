<?php

require('../../framework/modules/mysqlModule.php');
require('../../framework/modules/basicInformationModule.php');

$mysqlModule = new mysqlModule();
$basicInformationObject = new basicInformationModule();

if($_POST['function'] == 'handleForm'){
    handleForm();
}

function validateForm(){
	$valid = true;
	
	return $valid;
}

function handleForm(){
	if(validateForm()){
		handleDataBase();
		handleFileUpload();
	}
}

function handleDataBase(){
	return true;
}

function handleFileUpload(){
	$allowedExts = array('gif', 'jpeg', 'jpg', 'png');
	$temp = explode('.', $_FILES['file']['name']);
	$extension = end($temp);
	if ((($_FILES['file']['type'] == 'image/gif')
	|| ($_FILES['file']['type'] == 'image/jpeg')
	|| ($_FILES['file']['type'] == 'image/jpg')
	|| ($_FILES['file']['type'] == 'image/pjpeg')
	|| ($_FILES['file']['type'] == 'image/x-png')
	|| ($_FILES['file']['type'] == 'image/png'))
	&& ($_FILES['file']['size'] < 2000000)
	&& in_array($extension, $allowedExts)) {
		if ($_FILES['file']['error'] > 0) {
			echo 'Return Code: ' . $_FILES['file']['error'] . '<br>';
		} else {
			$date = new DateTime();
			$dateString = sha1(str_replace(' ','',$date->format('Y-m-d H:i:s')));
			$filename = $dateString.$_FILES['file']['name'];
			/*echo "Upload: " . $_FILES["file"]["name"] . "<br>";
			echo "Type: " . $_FILES['file']['type'] . "<br>";
			echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
			echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";*/
			move_uploaded_file($_FILES['file']['tmp_name'], '../images/uploads/' . $filename);
			echo 'Successfull upload!';
		}
	} else {
		echo 'Invalid file';
	}
}