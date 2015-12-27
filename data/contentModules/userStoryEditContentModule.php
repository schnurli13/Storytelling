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
	
		if($this->searchedUser != $this->sessionObject->getUserName()){
			header('Location: .');
		}
	
		$returnString = '';
	
		if($this->sessionObject->getLogState()){
			$returnString.='Hey '.$this->sessionObject->getUserName().'!<br/>'."\n";
		}
		
		$returnString.='Hier wird folgende Story editiert: '.$this->searchedStory.',<br/>';
		$returnString.='von folgendem User: '.$this->searchedUser;

		$returnString.='<div id="wrapper"><div id="container"></div>';
	/*	$returnString.='<div id="buttons">';
		$returnString.='<input type="button" value="Add new page" id="addNode" disabled="true">';
		$returnString.='<input type="button" value="Delete page" id="deleteNode" disabled="true">';*/

		$returnString.='<div id="pageeditor"><input type="text" value="click on node" id="textEdit"><input type="button" value="Save" id="save"></div>';
		$returnString.='</div>';
		$returnString.='<script type="text/javascript" src="/Storytelling/public/javascript/function.js"></script>';
		
		return $returnString;
	}
	
}