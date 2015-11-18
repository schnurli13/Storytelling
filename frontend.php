<?php

require('framework/pageObject.php');
require('framework/modules/sessionModule.php');

require('data/contentModules/loginContentModule.php');
require('data/contentModules/logoutContentModule.php');
require('data/contentModules/registerContentModule.php');

require('data/contentModules/userListContentModule.php');
require('data/contentModules/userContentModule.php');
require('data/contentModules/userStoryContentModule.php');
require('data/contentModules/userStoryEditContentModule.php');

require('data/contentModules/indexContentModule.php');
require('data/contentModules/errorContentModule.php');

$mySession = new sessionModule();

$mySession->initializeSession();

$myPage = new pageObject();

$myPage->setRoot('/Storytelling');

$isContent = true;

$myPage->setBodyTemplate('testBodyTemplate');
$myPage->setHtmlTemplate('testHtmlTemplate');
$myPage->setAdditionalHead('default');
$myPage->setMetaInformation('default');
$myPage->useSource('css', 'default');
$myPage->useSource('javascript', 'jquery-2.1.0.min');

//ROUTES FOR CSS AND JS FILES

if(substr($myPage->getCurrentUri(), -3) == 'css'){
	$myPage->setBodyTemplate('noBodyTemplate');
	$myPage->setHtmlTemplate('noHtmlTemplate');
	$filename = $myPage->getUriArray()[sizeof($myPage->getUriArray())-1];
	header('Content-Type:text/css');
	echo file_get_contents('public/css/'.$filename, true);
	$isContent = false;
	
}else if(substr($myPage->getCurrentUri(), -2) == 'js'){
	$myPage->setBodyTemplate('noBodyTemplate');
	$myPage->setHtmlTemplate('noHtmlTemplate');
	$filename = $myPage->getUriArray()[sizeof($myPage->getUriArray())-1];
	echo file_get_contents('public/javascript/'.$filename, true);
	$isContent = false;

//ROUTES FOR HTML PAGES

}else if($myPage->getUriArray()[1] === 'index' || $myPage->getUriArray()[1] === '' || $myPage->getUriArray()[1] === 'de'){
	$indexContentObject = new indexContentModule($mySession);
    $myPage->setContent($indexContentObject->generateHtml());
	
}else if($myPage->getUriArray()[1] === 'register'){
	$registerContentObject = new registerContentModule($mySession);
	$myPage->setContent($registerContentObject->generateHtml());

}else if($myPage->getUriArray()[1] === 'login'){
	$loginContentObject = new loginContentModule($mySession);
	$myPage->setContent($loginContentObject->generateHtml());

}else if($myPage->getUriArray()[1] === 'logout'){
	$logoutContentObject = new logoutContentModule($mySession);
	$myPage->setContent($logoutContentObject->generateHtml());

}else if($myPage->getUriArray()[1] === 'users'){

	if(count($myPage->getUriArray()) == 2){
		$userListContentObject = new userListContentModule($mySession);
		$myPage->setContent($userListContentObject->generateHtml());
	}else if(count($myPage->getUriArray()) == 3){
		$userContentObject = new userContentModule($mySession, $myPage->getUriArray());
		$myPage->setContent($userContentObject->generateHtml());
	}else if(count($myPage->getUriArray()) == 4){
		$userStoryContentObject = new userStoryContentModule($mySession, $myPage->getUriArray());
		$myPage->setContent($userStoryContentObject->generateHtml());
	}else if(count($myPage->getUriArray()) == 5 && $myPage->getUriArray()[4] == "edit"){
		$myPage->useSource('javascript', 'konva');
		$myPage->useSource('css', 'style');
		$userStoryEditContentObject = new userStoryEditContentModule($mySession, $myPage->getUriArray());
		$myPage->setContent($userStoryEditContentObject->generateHtml());
	}else{
		header('Location: '.$myPage->getRoot().'/404');
	}

}else if($myPage->getUriArray()[1] === '404'){
	$errorContentObject = new errorContentModule($mySession);
	$myPage->setContent($errorContentObject->generateHtml());
	
}else{
	header('Location: '.$myPage->getRoot().'/404');
}

if($isContent){
	$myPage->generatePage();
}
