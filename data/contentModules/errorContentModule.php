<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class errorContentModule{

	private $sessionObject;

	function __construct($sessionObject){
		$this->sessionObject = $sessionObject;
	}

	function generateHtml(){
	
		$returnString = '';
	
		if($this->sessionObject->getLogState()){
			$returnString.='Hey '.$this->sessionObject->getUserName().'!<br/>'."\n";
		}
		$returnString.='Hier geht\'s nicht weiter, versuchs doch hier:<br/>'."\n";
		$returnString.='<a href="index">Startseite</a>';
		
		return $returnString;
	}
	
}