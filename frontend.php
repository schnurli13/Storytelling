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
$myPage->useSource('javascript', 'default');


$myPage->setTitle('404');
/*
//HANDLING PLUG-INS

if(strpos($myPage->getCurrentUri(), 'plugins')){
	$pluginFound = false;
	$pluginPath = '';
	for($i = 0; $i < sizeof($myPage->getUriArray()); $i++){
		if(!$pluginFound){
			if($myPage->getUriArray()[$i] === 'plugins'){
				$pluginFound = true;
			}
		}else{
			$pluginPath.=$myPage->getUriArray()[$i].'/';
			}
	}
	if($pluginFound){
		echo file_get_contents(rtrim('public/plugins/'.$pluginPath, '/'), true);
		return true;
	}
}
	
//ROUTES FOR PICTURES

if(substr($myPage->getCurrentUri(), -3) == 'jpg' || substr($myPage->getCurrentUri(), -3) == 'png'){
	$filename = $myPage->getUriArray()[sizeof($myPage->getUriArray())-1];
	$image = readfile('public/images/'.$filename);
	echo $image;
	return true;

}

//ROUTES FOR CSS AND JS FILES

if(substr($myPage->getCurrentUri(), -3) == 'css'){
	$filename = $myPage->getUriArray()[sizeof($myPage->getUriArray())-1];
	header('Content-Type:text/css');
	echo file_get_contents('public/css/'.$filename, true);
	return true;
	
}else if(substr($myPage->getCurrentUri(), -2) == 'js'){
	$filename = $myPage->getUriArray()[sizeof($myPage->getUriArray())-1];
	echo file_get_contents('public/javascript/'.$filename, true);
	return true;
}
*/
//ROUTES FOR HTML PAGES

if($myPage->getUriArray()[1] === 'index' || $myPage->getUriArray()[1] === '' || $myPage->getUriArray()[1] === 'de'){
	$myPage->setTitle('Index');
	$indexControllerObject = new IndexController('indexTemplate');
    $myPage->setContent($indexControllerObject->execute());
	
}else if($myPage->getUriArray()[1] === 'uploadTest'){
	addCroppic($myPage);
	$myPage->useSource('javascript', 'formHandler');
	$myPage->setTitle('uploadTest');
	$userListContentObject = new userListContentModule($mySession);
	$myPage->setContent($userListContentObject->generateHtml());
	
}else if($myPage->getUriArray()[1] === 'register'){
	$myPage->setTitle('Register');
	$registerControllerObject = new RegisterController('registrationTemplate');
	$myPage->setContent($registerControllerObject->execute());

}else if($myPage->getUriArray()[1] === 'login'){
	$myPage->setTitle('Login');
	$loginControllerObject = new LoginController('loginTemplate');
	$myPage->setContent($loginControllerObject->execute());

}else if($myPage->getUriArray()[1] === 'logout'){
	$myPage->setTitle('Logout');
	$logoutControllerObject = new LogoutController('logoutTemplate');
	$myPage->setContent($logoutControllerObject->execute());
	
}else if($myPage->getUriArray()[1] === 'search'){
	$myPage->setTitle('Search');
	$searchControllerObject = new SearchController('searchTemplate');
	$myPage->setContent($searchControllerObject->execute());

}else if($myPage->getUriArray()[1] === 'users'){

	if(count($myPage->getUriArray()) == 3){
	addCroppic($myPage);
	addFancyBox($myPage);
	$myPage->useSource('javascript', 'formHandler');
		$myPage->setTitle($myPage->getUriArray()[2]);
		$userContentObject = new UserContentController('userTemplate');
		$myPage->setContent($userContentObject->execute());
		
	}else if(count($myPage->getUriArray()) == 4){
		$myPage->setTitle($myPage->getUriArray()[3].'/ '.$myPage->getUriArray()[2]);
		$userStoryContentControllerObject = new UserStoryContentController('userStoryTemplate');
		$myPage->setContent($userStoryContentControllerObject->execute());
		
	}else if(count($myPage->getUriArray()) == 5 && $myPage->getUriArray()[4] == "edit"){
		$myPage->setTitle('Edit: '.$myPage->getUriArray()[3]);
		$myPage->useSource('javascript', 'konva');
		$myPage->useSource('javascript', 'function');
		$myPage->useSource('css', 'style');
		$myPage->useSource('css', 'component');
		$myPage->useSource('javascript', 'classie');
		$myPage->useSource('javascript', 'modernizr.custom');
		$userStoryEditContentControllerObject = new UserStoryEditContentController('nodeEditorTemplate');
		$myPage->setContent($userStoryEditContentControllerObject->execute());

		
	}else if(count($myPage->getUriArray()) == 5 && $myPage->getUriArray()[4] == "published"){
		$myPage->setTitle($myPage->getUriArray()[3]);
		$myPage->setBodyTemplate('publishedModeBodyTemplate');
		$myPage->discardSource('css', 'default');
		$myPage->useSource('css', 'publishedView');
		$myPage->useSource('javascript', 'publishedStoryHandler');
		$userStoryPresentationControllerObject = new UserStoryPresentationController('userStoryPresentationTemplate');
		$myPage->setContent($userStoryPresentationControllerObject->execute());
				
	}else{
		header('Location: '.$myPage->getUriArray()[0].'/404');
	}

}else if($myPage->getUriArray()[1] === '404'){
	$errorControllerObject = new ErrorController('errorTemplate');
	$myPage->setContent($errorControllerObject->execute());
	
}else{
	header('Location: '.$myPage->getUriArray()[0].'/404');
}

	$myPage->generatePage();

function addFancyBox($myPage){
	$myPage->useSource('pluginCss', 'fancybox/source/jquery.fancybox');
	$myPage->useSource('pluginCss', 'fancybox/source/helpers/jquery.fancybox-buttons');
	$myPage->useSource('pluginCss', 'fancybox/source/helpers/jquery.fancybox-thumbs');
	$myPage->useSource('pluginJs', 'fancybox/source/jquery.fancybox');
	$myPage->useSource('pluginJs', 'fancybox/source/helpers/jquery.fancybox-buttons');
	$myPage->useSource('pluginJs', 'fancybox/source/helpers/jquery.fancybox-media');
	$myPage->useSource('pluginJs', 'fancybox/source/helpers/jquery.fancybox-thumbs');
	$myPage->useSource('javascript', 'activateFancyBox');
}

function addCroppic($myPage){
	$myPage->useSource('pluginCss', 'croppic/croppic');
	$myPage->useSource('pluginJs', 'croppic/croppic');
	$myPage->useSource('css', 'crop');
}