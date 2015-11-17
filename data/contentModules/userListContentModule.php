<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class userListContentModule{

	private $sessionObject;

	function __construct($sessionObject){
		$this->sessionObject = $sessionObject;
	}

	function generateHtml(){
	
		$returnString = '';
	
		if($this->sessionObject->getLogState()){
			$returnString.='Hey '.$this->sessionObject->getUserName().'!<br/>'."\n";
		}

		$returnString.="Hier wird die Liste der User mit einer Suche ausgegeben!";
		
		return $returnString;

		}
	
}