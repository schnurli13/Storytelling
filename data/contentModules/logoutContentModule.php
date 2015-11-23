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
		
		$this->sessionObject->destroySession();
		$template = new contentTemplateModule('logoutTemplate');
		return $template->generateHtml();
	}
	
}