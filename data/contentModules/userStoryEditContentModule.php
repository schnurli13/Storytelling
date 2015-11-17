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
	
		$returnString = '';
	
		if($this->sessionObject->getLogState()){
			$returnString.='Hey '.$this->sessionObject->getUserName().'!<br/>'."\n";
		}
		
		$returnString.='Hier wird folgende Story editiert: '.$this->searchedStory.',<br/>';
		$returnString.='von folgendem User: '.$this->searchedUser;
		
		return $returnString;
	}
	
}