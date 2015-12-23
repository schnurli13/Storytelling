<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class userStoryPresentationModule{

	private $sessionObject;
	private $searchedUser;
	private $searchedStory;

	function __construct($sessionObject, $uriArray){
		$this->sessionObject = $sessionObject;
		$this->searchedUser = $uriArray[2];
		$this->searchedStory = $uriArray[3];
		$this->root = $uriArray[0];
	}

	function generateHtml(){
	
		$msqlObject = new mysqlModule();
	
		$returnString = '';
		
		$template = new contentTemplateModule('userStoryPresentationTemplate');	
		
		$queryResult = array();
		
		$template->addContent('STORYTITLE', $this->searchedStory);

		return $template->generateHtml();
		
	}
	
}