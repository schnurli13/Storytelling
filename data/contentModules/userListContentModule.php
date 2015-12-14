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
	
		$returnString.=$this->getForm();
		
		return $returnString;

		}
		
	function getForm(){
		$returnString = '';
		$returnString.='<form method="POST" id="fileinfo" name="fileinfo">'."\n";
        $returnString.='<label>Select a file:</label><br>'."\n";
        $returnString.='<input type="file" name="file" required />'."\n";
        $returnString.='<input type="submit" value="Upload" />'."\n";
		$returnString.='</form>'."\n";
		$returnString.='<div id="output"></div>'."\n";
		return $returnString;
	}
	
}