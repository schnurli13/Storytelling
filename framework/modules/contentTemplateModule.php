<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 

class contentTemplateModule{

	private $template;
	
	private $contents = array();

	function __construct($templateName){
		$this->template = file_get_contents('data/templates/'.$templateName.'.html', true);
	}
	
	function addContent($keyWord, $content){
		array_push($this->contents, array($keyWord, $content));
	}
	
	function addLogState($sessionObject){
		$returnString = '';
	
		if($sessionObject->getLogState()){
			$returnString .= '<a href="'.$sessionObject->getUserName().'">'.$sessionObject->getUserName().' | <a href="logout">Logout</a><br/>';
		}else{
			$returnString .= '<a href="login">Login</a> | <a href="register">Register</a><br/>';
		}
		
		$this->addContent('LOGSTATE', $returnString);

	}
	
	function generateHtml(){
		$returnString = $this->template;
		foreach($this->contents as $singleContent){
			$returnString = preg_replace('/{{'.$singleContent[0].'}}/',  $singleContent[1], $returnString);
		}
	return $returnString;
	}
	
}