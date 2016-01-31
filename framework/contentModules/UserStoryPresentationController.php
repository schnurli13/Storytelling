<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class UserStoryPresentationController extends MotherController{

	function actions(){
	
	$storyQueryResult = $this->msqlObject->queryDataBase('SELECT * FROM story WHERE name = "'.$this->basicInformationObject->getUriArray()[3].'"');
	
	$stories = '';
	$loggedIn = false;
		
	if($this->sessionObject->getLogState() && $this->sessionObject->encodeKey($this->basicInformationObject->getUriArray()[2]) ===  $this->sessionObject->getSafeHash()){
		$loggedIn = true;
	}
	
	if($storyQueryResult[0]['isPublished'] === '1' || $storyQueryResult[0]['isPublished'] === '0' && $loggedIn){
	
	
		$this->model->addAttribute('STORYTITLE', $this->basicInformationObject->getUriArray()[3]);
	}else{
		header('Location: ..');
	}
		
	}
	
}