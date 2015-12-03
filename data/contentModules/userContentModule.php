<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class userContentModule{

	private $sessionObject;
	private $searchedUser;
	private $root;

	function __construct($sessionObject, $uriArray){
		$this->sessionObject = $sessionObject;
		$this->searchedUser = $uriArray[2];	
		$this->root = $uriArray[0];
	}

	function generateHtml(){
	
		$msqlObject = new mysqlModule();
	
		$returnString = '';
		
		$template = new contentTemplateModule('userTemplate');	
		
		$queryResult = $msqlObject->queryDataBase('SELECT * FROM users WHERE name = "'.$this->searchedUser.'"');;
		
		if(!isset($queryResult[0]['name'])){
			header('Location: '.$this->root.'/404');
		}
		
		$template->addContent('USERNAME', $queryResult[0]['name']);
		$template->addContent('USERMAIL', $queryResult[0]['email']);
		$template->addContent('USERLEVEL', ($queryResult[0]['tutorialDone'] ? 'Advanced User' : 'Beginner'));
	
		if($this->searchedUser === $this->sessionObject->getUserName()){
			$returnString.='<a>Edit Profile</a>';
		}
		
		$template->addLogState($this->sessionObject);
		$template->addContent('INFO', $returnString);

		return $template->generateHtml();

		}
	
}