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
	
		$template = new contentTemplateModule('errorTemplate');
		//$template->addLogState($this->sessionObject);
		
		return $template->generateHtml();

	}
	
}