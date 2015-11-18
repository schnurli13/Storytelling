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
			$returnString .= '<a href="'.$this->sessionObject->getUserName().'">'.$this->sessionObject->getUserName().' | <a href="logout">Logout</a><br/>';
		}else{
			$returnString .= '<a href="login">Login</a> | <a href="register">Register</a><br/>';
		}
		$returnString .= $this->getForm();
		
		return $returnString;
		
	}
	
		function getForm(){
		return '<form action="search" method="get">'."\n".'
			<p><input type="text" name="key"/></p>'."\n".'
			<p><input type="submit" value="search"/></p>'."\n".'
			</form>'."\n";
	}

	
}