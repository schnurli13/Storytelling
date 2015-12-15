<?php

require('../../framework/modules/mysqlModule.php');
require('../../framework/modules/sessionModule.php');

session_start();

switch($_POST['function']){
	case 'changePic':
		handlePicture();
		break;
	case 'changeName':
		handleName();
		break;
	case 'changeEmail':
		handleEmail();
		break;
	case 'changePassword':
		handlePassword();
		break;
}

function handleName(){
	echo 'New Name '.$_POST['userName'];
}

function handleEmail(){
	echo 'New Email '.$_POST['userMail'];
}

function handlePassword(){
	if($_POST['userPassword'] != $_POST['userPasswordAgain']){
		echo 'Wrong Password!';
	}else{
		echo 'New Password '.$_POST['userPassword'];
	}
}

function handlePicture(){
	handleFileUpload();
}

function handleDataBase(){
	return true;
}

function handleFileUpload(){
	$mysqlObject = new mysqlModule();
	$sessionObject = new sessionModule();
	
	$allowedExts = array('gif', 'jpeg', 'jpg', 'png');
	$temp = explode('.', $_FILES['file']['name']);
	$extension = end($temp);
	if ((($_FILES['file']['type'] == 'image/jpeg')
	|| ($_FILES['file']['type'] == 'image/jpg')
	|| ($_FILES['file']['type'] == 'image/png'))
	&& ($_FILES['file']['size'] < 2000000)
	&& in_array($extension, $allowedExts)) {
		if ($_FILES['file']['error'] > 0) {
			echo 'Return Code: ' . $_FILES['file']['error'] . '<br>';
		} else {
			$date = new DateTime();
			$dateString = sha1(str_replace(' ','',$date->format('Y-m-d H:i:s')));
			$fileending = ($_FILES['file']['type'] == 'image/jpeg' || $_FILES['file']['type'] == 'image/jpg') ? '.jpg' : '.png';
			$filename = $sessionObject->getUserName().$dateString.$fileending;
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