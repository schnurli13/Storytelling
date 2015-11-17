<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class logoutContentModule{

	private $sessionObject;

	function __construct($sessionObject){
		$this->sessionObject = $sessionObject;
	}

	function generateHtml(){
	
		$returnString = '';
	
		$this->sessionObject->destroySession();
		$returnString.='session destroyed!<br/>'."\n";
		$returnString.='new session: '.$this->sessionObject->getUserName().' | '.($this->sessionObject->getLogState() ? 'true' : 'false')."\n";
		return $returnString;
	}
	
}