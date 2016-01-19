<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class userStoryEditContentModule{

	private $sessionObject;
	private $searchedUser;
	private $searchedStory;

	function __construct($sessionObject, $uriArray){
		$this->sessionObject = $sessionObject;
		$this->searchedUser = $uriArray[2];
		$this->searchedStory = $uriArray[3];
	}

	function generateHtml(){
	
		$template = new contentTemplateModule('nodeEditorTemplate');
		
		$template->addLogState($this->sessionObject);
	
		return $template->generateHtml();
	}
	
}