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
	case 'fetchCurrentValues':
		fetchCurrentValues();
		break;
	case 'getCurrentUser':
		getCurrentUser();
		break;
}

function getCurrentUser(){
	$sessionObject = new sessionModule();
	echo $sessionObject->getUserName();
}

function fetchCurrentValues(){
	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
	$fetchString = '';
	switch($_POST['form_id']){
		case 'changeName':
			$fetchString = 'name';
			break;
		case 'changeEmail':
			$fetchString = 'email';
			break;
		default:
			echo 'forbidden';
			return false;
	}
	echo $mysqlObject->queryDataBase('SELECT '.$fetchString.' FROM users WHERE name = "'.$sessionObject->getUserName().'"')[0][$fetchString];
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
	$userID = $mysqlObject->queryDataBase('SELECT id FROM users WHERE name = "'.$sessionObject->getUserName().'"')[0]['id'];
	$foundPictures = $mysqlObject->queryDataBase('SELECT path FROM profile_images WHERE user = "'.$userID.'"');
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
	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
	$mysqlObject->commandDataBase('UPDATE `users` SET name = "'.$_POST['userName'].'" WHERE name = "'.$sessionObject->getUserName().'"');
	$sessionObject->setUserName($_POST['userName']);
	$sessionObject->setSafeHash($sessionObject->encodeKey($_POST['userName']));
	echo 'New Name '.$_POST['userName'];
}

function handleEmail(){
	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
	$mysqlObject->commandDataBase('UPDATE `users` SET email = "'.$_POST['userMail'].'" WHERE name = "'.$sessionObject->getUserName().'"');
	echo 'New Email '.$_POST['userMail'];
}

function handlePassword(){
	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
	if($_POST['userPassword'] != $_POST['userPasswordAgain']){
		echo 'Wrong Password!';
	}else{
		$mysqlObject->commandDataBase('UPDATE `users` SET password = "'.$sessionObject->encodeKey($_POST['userPassword']).'" WHERE name = "'.$sessionObject->getUserName().'"');
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
			$profileImageId = $mysqlObject->queryDataBase('SELECT id FROM users WHERE name = "'.$sessionObject->getUserName().'"')[0]['id'];
			$mysqlObject->commandDataBase('INSERT INTO `profile_images` (`user`, `path`) VALUES ("'.$profileImageId.'", "'.$filename.'")');

			move_uploaded_file($_FILES['file']['tmp_name'], '../images/profile/' . $filename);
			echo 'Successfull upload!';
		}
	} else {
		echo 'Invalid file';
	}
}