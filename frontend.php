<?php

require('framework/requirements.php');

$mySession = new sessionModule();

$mySession->initializeSession();

$myPage = new pageObject();

$myPage->setBodyTemplate('testBodyTemplate');
$myPage->setHtmlTemplate('testHtmlTemplate');
$myPage->setAdditionalHead('default');
$myPage->setMetaInformation('default');
$myPage->useSource('css', 'default');
$myPage->useSource('javascript', 'jquery-2.1.0.min');
$myPage->setTitle('404');

//ROUTES FOR PICTURES

if(substr($myPage->getCurrentUri(), -3) == 'jpg' || substr($myPage->getCurrentUri(), -3) == 'png'){
	$filename = $myPage->getUriArray()[sizeof($myPage->getUriArray())-1];
	$image = readfile('public/images/'.$filename);
	echo $image;
	return true;

}

//ROUTES FOR CSS AND JS FILES

else if(substr($myPage->getCurrentUri(), -3) == 'css'){
	$filename = $myPage->getUriArray()[sizeof($myPage->getUriArray())-1];
	header('Content-Type:text/css');
	echo file_get_contents('public/css/'.$filename, true);
	return true;
	
}else if(substr($myPage->getCurrentUri(), -2) == 'js'){
	$filename = $myPage->getUriArray()[sizeof($myPage->getUriArray())-1];
	echo file_get_contents('public/javascript/'.$filename, true);
	return true;

//ROUTES FOR HTML PAGES

}else if($myPage->getUriArray()[1] === 'index' || $myPage->getUriArray()[1] === '' || $myPage->getUriArray()[1] === 'de'){
	$myPage->setTitle('Index');
	$indexContentObject = new indexContentModule($mySession);
    $myPage->setContent($indexContentObject->generateHtml());
	
}else if($myPage->getUriArray()[1] === 'register'){
	$myPage->setTitle('Register');
	$registerContentObject = new registerContentModule($mySession);
	$myPage->setContent($registerContentObject->generateHtml());

}else if($myPage->getUriArray()[1] === 'login'){
	$myPage->setTitle('Login');
	$loginContentObject = new loginContentModule($mySession);
	$myPage->setContent($loginContentObject->generateHtml());

}else if($myPage->getUriArray()[1] === 'logout'){
	$myPage->setTitle('Logout');
	$logoutContentObject = new logoutContentModule($mySession);
	$myPage->setContent($logoutContentObject->generateHtml());
	
}else if($myPage->getUriArray()[1] === 'search'){
	$myPage->setTitle('Search');
	$searchContentObject = new searchContentModule($mySession, $myPage->getUriArray());
	$myPage->setContent($searchContentObject->generateHtml());

}else if($myPage->getUriArray()[1] === 'users'){

	if(count($myPage->getUriArray()) == 2){
		$myPage->setTitle('Users');
		$userListContentObject = new userListContentModule($mySession);
		$myPage->setContent($userListContentObject->generateHtml());
		
	}else if(count($myPage->getUriArray()) == 3){
		$myPage->setTitle($myPage->getUriArray()[2]);
		$userContentObject = new userContentModule($mySession, $myPage->getUriArray());
		$myPage->setContent($userContentObject->generateHtml());
		
	}else if(count($myPage->getUriArray()) == 4){
		$myPage->setTitle($myPage->getUriArray()[3].'/ '.$myPage->getUriArray()[2]);
		$userStoryContentObject = new userStoryContentModule($mySession, $myPage->getUriArray());
		$myPage->setContent($userStoryContentObject->generateHtml());
		
	}else if(count($myPage->getUriArray()) == 5 && $myPage->getUriArray()[4] == "edit"){
		$myPage->setTitle('Edit: '.$myPage->getUriArray()[3]);
		$myPage->useSource('javascript', 'konva');
		$myPage->useSource('css', 'style');
		$userStoryEditContentObject = new userStoryEditContentModule($mySession, $myPage->getUriArray());
		$myPage->setContent($userStoryEditContentObject->generateHtml());
		
	}else{
		header('Location: '.$myPage->getUriArray()[0].'/404');
	}

}else if($myPage->getUriArray()[1] === '404'){
	$errorContentObject = new errorContentModule($mySession);
	$myPage->setContent($errorContentObject->generateHtml());
	
}else{
	header('Location: '.$myPage->getUriArray()[0].'/404');
}

	$myPage->generatePage();
