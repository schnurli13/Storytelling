<?php
require('framework/MotherMapper.php');

class FrontendMapper extends MotherMapper{

	public function mappings(){
	
		//default values for error page
		$this->myPage->setTitle('404');
		$this->myPage->setBodyTemplate('testBodyTemplate');
		$this->myPage->setHtmlTemplate('testHtmlTemplate');
		$this->myPage->setAdditionalHead('default');
		$this->myPage->setMetaInformation('default');
		$this->myPage->useSource('css', 'default');
		$this->myPage->useSource('javascript', 'jquery-2.1.0.min');
		$this->myPage->useSource('javascript', 'default');
		
		//values if another url is called
		if($this->basicInformationObject->getUriArray()[1] === 'index' || $this->basicInformationObject->getUriArray()[1] === '' || $this->basicInformationObject->getUriArray()[1] === 'de'){
			$this->myPage->setTitle('Index');
			$indexControllerObject = new IndexController('indexTemplate');
			$this->myPage->setContent($indexControllerObject->execute());
			
		}else if($this->basicInformationObject->getUriArray()[1] === 'uploadTest'){
			$this->addCroppic();
			$this->myPage->useSource('javascript', 'formHandler');
			$this->myPage->setTitle('uploadTest');
			$userListContentObject = new userListContentModule($mySession);
			$this->myPage->setContent($userListContentObject->generateHtml());
			
		}else if($this->basicInformationObject->getUriArray()[1] === 'register'){
			$this->myPage->setTitle('Register');
			$registerControllerObject = new RegisterController('registrationTemplate');
			$this->myPage->setContent($registerControllerObject->execute());

		}else if($this->basicInformationObject->getUriArray()[1] === 'login'){
			$this->myPage->setTitle('Login');
			$loginControllerObject = new LoginController('loginTemplate');
			$this->myPage->setContent($loginControllerObject->execute());

		}else if($this->basicInformationObject->getUriArray()[1] === 'logout'){
			$this->myPage->setTitle('Logout');
			$logoutControllerObject = new LogoutController('logoutTemplate');
			$this->myPage->setContent($logoutControllerObject->execute());
			
		}else if($this->basicInformationObject->getUriArray()[1] === 'search'){
			$this->myPage->setTitle('Search');
			$searchControllerObject = new SearchController('searchTemplate');
			$this->myPage->setContent($searchControllerObject->execute());

		}else if($this->basicInformationObject->getUriArray()[1] === 'users'){

			if(count($this->basicInformationObject->getUriArray()) == 3){
			$this->addCroppic();
			$this->addFancyBox();
			$this->myPage->useSource('javascript', 'formHandler');
				$this->myPage->setTitle($this->basicInformationObject->getUriArray()[2]);
				$userContentObject = new UserContentController('userTemplate');
				$this->myPage->setContent($userContentObject->execute());
				
			}else if(count($this->basicInformationObject->getUriArray()) == 4){
				$this->myPage->setTitle($this->basicInformationObject->getUriArray()[3].'/ '.$this->basicInformationObject->getUriArray()[2]);
				$userStoryContentControllerObject = new UserStoryContentController('userStoryTemplate');
				$this->myPage->setContent($userStoryContentControllerObject->execute());
				
			}else if(count($this->basicInformationObject->getUriArray()) == 5 && $this->basicInformationObject->getUriArray()[4] == "edit"){
				$this->myPage->setTitle('Edit: '.$this->basicInformationObject->getUriArray()[3]);
				$this->myPage->useSource('javascript', 'konva');
				$this->myPage->useSource('javascript', 'function');
				$this->myPage->useSource('css', 'style');
				$this->myPage->useSource('css', 'component');
				$this->myPage->useSource('javascript', 'classie');
				$this->myPage->useSource('javascript', 'modernizr.custom');
				$userStoryEditContentControllerObject = new UserStoryEditContentController('nodeEditorTemplate');
				$this->myPage->setContent($userStoryEditContentControllerObject->execute());

				
			}else if(count($this->basicInformationObject->getUriArray()) == 5 && $this->basicInformationObject->getUriArray()[4] == "published"){
				$this->myPage->setTitle($this->basicInformationObject->getUriArray()[3]);
				$this->myPage->setBodyTemplate('publishedModeBodyTemplate');
				$this->myPage->discardSource('css', 'default');
				$this->myPage->useSource('css', 'publishedView');
				$this->myPage->useSource('javascript', 'publishedStoryHandler');
				$userStoryPresentationControllerObject = new UserStoryPresentationController('userStoryPresentationTemplate');
				$this->myPage->setContent($userStoryPresentationControllerObject->execute());
						
			}else{
				header('Location: '.$this->basicInformationObject->getUriArray()[0].'/404');
			}

		}else if($this->basicInformationObject->getUriArray()[1] === '404'){
			$errorControllerObject = new ErrorController('errorTemplate');
			$this->myPage->setContent($errorControllerObject->execute());
			
		}else{
			header('Location: '.$this->basicInformationObject->getUriArray()[0].'/404');
		}
	
	}
	
	function addFancyBox(){
		$this->myPage->useSource('pluginCss', 'fancybox/source/jquery.fancybox');
		$this->myPage->useSource('pluginCss', 'fancybox/source/helpers/jquery.fancybox-buttons');
		$this->myPage->useSource('pluginCss', 'fancybox/source/helpers/jquery.fancybox-thumbs');
		$this->myPage->useSource('pluginJs', 'fancybox/source/jquery.fancybox');
		$this->myPage->useSource('pluginJs', 'fancybox/source/helpers/jquery.fancybox-buttons');
		$this->myPage->useSource('pluginJs', 'fancybox/source/helpers/jquery.fancybox-media');
		$this->myPage->useSource('pluginJs', 'fancybox/source/helpers/jquery.fancybox-thumbs');
		$this->myPage->useSource('javascript', 'activateFancyBox');
	}

	function addCroppic(){
		$this->myPage->useSource('pluginCss', 'croppic/croppic');
		$this->myPage->useSource('pluginJs', 'croppic/croppic');
		$this->myPage->useSource('css', 'crop');
	}

}


