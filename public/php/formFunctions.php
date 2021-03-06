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
	case 'setCurrentPage':
		setCurrentPage();
		break;
}

function setCurrentPage(){
	$sessionObject = new sessionModule();
	$sessionObject->setPage($_POST['page']);
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
	
	$table = '';
	$images_table = '';
	$search_name = '';
	$subject = '';
	$search_subject = '';
	$pathType = '';
	if($_POST['pictureType'] === 'currentUserPicture'){
		$table = 'users';
		$subject = 'user';
		$images_table = 'profile_images';
		$search_name = $sessionObject->getUserName();
		$search_subject = 'name';
		$pathType = 'profile';
	}else if($_POST['pictureType'] === 'currentStoryPicture'){
		$table = 'story';
		$subject = 'story';
		$images_table = 'story_images';
		$search_name = $_POST['storyName'];
		$search_subject = 'name';
		$pathType = 'story';
	}else if($_POST['pictureType'] === 'currentPagePicture'){
		$table = 'page';
		$subject = 'page';
		$images_table = 'page_images';
		$search_name = $sessionObject->getPage();
		$search_subject = 'title';
		$pathType = 'page';
	}

	
	$path = $_POST['path'];
	$path = str_replace('/Storytelling/public/images/'.$pathType.'/', '', $path);
		
	//$pictureId = $mysqlObject->queryDataBase('SELECT id FROM profile_images WHERE path = "'.$path.'"')[0]['id'];
	
	$filePath = '../images/'.$pathType.'/'.$path;
	
	$deletedOnDatabase = $mysqlObject->commandDataBase('DELETE FROM `storytelling_platform`.`'.$images_table.'` WHERE `'.$images_table.'`.`path` = "'.$path.'"');
	
	if(file_exists($filePath) && $deletedOnDatabase){
		if($_POST['pictureType'] === 'currentPagePicture'){
			unlink('../images/'.$pathType.'/original/'.$path);
		}
		unlink($filePath);
	}else{
	}
	
	echo ($deletedOnDatabase) ? 'Delete successful!' : 'Delete failed!';
	
}

function setAsNewProfilePic(){
	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
		
	$table = '';
	$images_table = '';
	$search_name = '';
	$subject = '';
	$search_subject = '';
	$pathType = '';
	$imageName = '';
	if($_POST['pictureType'] === 'currentUserPicture'){
		$table = 'users';
		$subject = 'user';
		$images_table = 'profile_images';
		$search_name = $sessionObject->getUserName();
		$search_subject = 'name';
		$pathType = 'profile';
		$imageName = 'img_id';
	}else if($_POST['pictureType'] === 'currentStoryPicture'){
		$table = 'story';
		$subject = 'story';
		$images_table = 'story_images';
		$search_name = $_POST['storyName'];
		$search_subject = 'name';
		$pathType = 'story';
		$imageName = 'img_id';
	}else if($_POST['pictureType'] === 'currentPagePicture'){
		$table = 'page';
		$subject = 'page';
		$images_table = 'page_images';
		$search_name = $sessionObject->getPage();
		$search_subject = 'id';
		$pathType = 'page';
		$imageName = 'imageLink';
	}

	$path = $_POST['path'];
	$path = str_replace('/Storytelling/public/images/'.$pathType.'/', '', $path);
	
	$pictureId = $mysqlObject->queryDataBase('SELECT id FROM '.$images_table.' WHERE path = "'.$path.'"')[0]['id'];
	
	$mysqlObject->commandDataBase('UPDATE `'.$table.'` SET '.$imageName.' = "'.$pictureId.'" WHERE '.$search_subject.' = "'.$search_name.'"');
	
	echo $pictureId;
}

function getAllPictures(){
	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
	$returnArray = array();
	
	$table = '';
	$images_table = '';
	$search_name = '';
	$subject = '';
	$search_subject = '';
	if($_POST['pictureType'] === 'currentUserPicture'){
		$table = 'users';
		$subject = 'user';
		$images_table = 'profile_images';
		$search_name = $sessionObject->getUserName();
		$search_subject = 'name';
	}else if($_POST['pictureType'] === 'currentStoryPicture'){
		$table = 'story';
		$subject = 'story';
		$images_table = 'story_images';
		$search_name = $_POST['storyName'];
		$search_subject = 'name';
	}else if($_POST['pictureType'] === 'currentPagePicture'){
		$table = 'page';
		$subject = 'page';
		$images_table = 'page_images';
		$search_name = $sessionObject->getPage();
		$search_subject = 'id';
	}
	
	$foundId = $mysqlObject->queryDataBase('SELECT id FROM '.$table.' WHERE '.$search_subject.' = "'.$search_name.'"')[0]['id'];
	if($_POST['pictureType'] === 'currentStoryPicture'){$foundId = $_POST['storyName'];}
	if($_POST['pictureType'] === 'currentPagePicture'){$foundId = $sessionObject->getPage();}
	$foundPictures = $mysqlObject->queryDataBase('SELECT path FROM '.$images_table.' WHERE '.$subject.' = "'.$foundId.'"');
	
	for($i = 0; $i<sizeof($foundPictures); $i++){
		array_push($returnArray, $foundPictures[$i]['path']);
	}
	echo json_encode($returnArray);
}


function getCurrentPicture(){
	$sessionObject = new sessionModule();
	$mysqlObject = new mysqlModule();
	
	$table = '';
	$images_table = '';
	$search_name = '';
	$imageName = '';
	if($_POST['pictureType'] === 'currentUserPicture'){
		$table = 'users';
		$images_table = 'profile_images';
		$search_name = $sessionObject->getUserName();
		$imageName = 'img_id';
		$search_subject = 'name';
	}else if($_POST['pictureType'] === 'currentStoryPicture'){
		$table = 'story';
		$images_table = 'story_images';
		$search_name = $_POST['storyName'];
		$imageName = 'img_id';
		$search_subject = 'name';
	}else if($_POST['pictureType'] === 'currentPagePicture'){
		$table = 'page';
		$images_table = 'page_images';
		$search_name = $sessionObject->getPage();
		$imageName = 'imageLink';
		$search_subject = 'title';
	}
	
	if($_POST['pictureType'] === 'currentPagePicture'){ $imageId = $sessionObject->getPage(); }else{
		$imageId = $mysqlObject->queryDataBase('SELECT '.$imageName.' FROM '.$table.' WHERE '.$search_subject.' = "'.$search_name.'"')[0][$imageName];
	}
	echo $mysqlObject->queryDataBase('SELECT path FROM '.$images_table.' WHERE id = "'.$imageId.'"')[0]['path'];
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