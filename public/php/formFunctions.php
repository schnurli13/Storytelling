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
	case 'getCurrentPicture':
		getCurrentPicture();
		break;
	case 'getAllPictures':
		getAllPictures();
		break;
	case 'setAsNewProfilePic':
		setAsNewProfilePic();
		break;
	case 'deletePic':
		deletePic();
		break;
}

function deletePic(){

	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
	
	$path = $_POST['path'];
	$path = str_replace('/Storytelling/public/images/profile/', '', $path);
		
	$pictureId = $mysqlObject->queryDataBase('SELECT id FROM profile_images WHERE path = "'.$path.'"')[0]['id'];
	
	$filePath = '../images/profile/'.$path;
	
	$deletedOnDatabase = $mysqlObject->commandDataBase('DELETE FROM `storytelling_platform`.`profile_images` WHERE `profile_images`.`path` = "'.$path.'"');
	
	if(file_exists($filePath) && $deletedOnDatabase){
		unlink($filePath);
	}else{
	}
	
	echo ($deletedOnDatabase) ? 'Delete successful!' : 'Delete failed!';
	
}

function setAsNewProfilePic(){
	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
	
	$path = $_POST['path'];
	$path = str_replace('/Storytelling/public/images/profile/', '', $path);
	
	$pictureId = $mysqlObject->queryDataBase('SELECT id FROM profile_images WHERE path = "'.$path.'"')[0]['id'];
	
	$mysqlObject->commandDataBase('UPDATE `users` SET img_id = "'.$pictureId.'" WHERE name = "'.$sessionObject->getUserName().'"');
	
	echo $pictureId;
}

function getAllPictures(){
	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
	$returnArray = array();
	$foundPictures = $mysqlObject->queryDataBase('SELECT path FROM profile_images WHERE user = "'.$sessionObject->getUserName().'"');
	for($i = 0; $i<sizeof($foundPictures); $i++){
		array_push($returnArray, $foundPictures[$i]['path']);
	}
	echo json_encode($returnArray);
}

function getCurrentPicture(){
	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
	$profileImageId = $mysqlObject->queryDataBase('SELECT img_id FROM users WHERE name = "'.$sessionObject->getUserName().'"')[0]['img_id'];
	echo $mysqlObject->queryDataBase('SELECT path FROM profile_images WHERE id = "'.$profileImageId.'"')[0]['path'];
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
			$filename = $dateString.$fileending;
			/*echo "Upload: " . $_FILES["file"]["name"] . "<br>";
			echo "Type: " . $_FILES['file']['type'] . "<br>";
			echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
			echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";*/
			$mysqlObject->commandDataBase('INSERT INTO `profile_images` (`user`, `path`) VALUES ("'.$sessionObject->getUserName().'", "'.$filename.'")');

			move_uploaded_file($_FILES['file']['tmp_name'], '../images/profile/' . $filename);
			echo 'Successfull upload!';
		}
	} else {
		echo 'Invalid file';
	}
}