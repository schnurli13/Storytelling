<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */

class indexContentModule{

	private $sessionObject;
	
	function __construct($sessionObject){
		$this->sessionObject = $sessionObject;
	}
	
	function generateHtml(){
	
		$returnString = '';
	
		if($this->sessionObject->getLogState()){
			$returnString .= 'Eingeloggt als '.$this->sessionObject->getUserName().'!<br/>';
		}
		$returnString .= 'Das hier ist die Startseite unserer interaktiven Storytelling-Plattform! Viel Spaﬂ!';
		
		return $returnString;
		
	}

	
}