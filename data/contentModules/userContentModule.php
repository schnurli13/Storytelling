<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class userContentModule{

	private $sessionObject;
	private $searchedUser;

	function __construct($sessionObject, $uriArray){
		$this->sessionObject = $sessionObject;
		$this->searchedUser = $uriArray[2];		
	}

	function generateHtml(){
	
		$returnString = '';
	
		if($this->sessionObject->getLogState()){
			$returnString.='Hey '.$this->sessionObject->getUserName().'!<br/>'."\n";
		}
		
		$returnString.='Hier werden Infos von folgendem User ausgegeben: '.$this->searchedUser;
		
		return $returnString;
	}
	
}