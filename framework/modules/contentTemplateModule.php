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
	
		$basicInformationObject = new basicInformationModule();
	
		$returnString = '';
	
		if($sessionObject->getLogState() && $sessionObject->encodeKey($sessionObject->getUserName()) ===  $sessionObject->getSafeHash()){
			$returnString .= '<a href="'.$basicInformationObject->getRoot().'/users/'.$sessionObject->getUserName().'">'.$sessionObject->getUserName().' | <a href="'.$basicInformationObject->getRoot().'/logout">Logout</a><br/>';
		}else{
			$returnString .= '
			<div class="buttonFrameContainerLogState left marginRightLogState"><div class="buttonSize"><a class="buttonLookLink firstLogState" href="login">LOGIN</a></div></div>
			<div class="buttonFrameContainerLogState left"><div class="buttonSize"><a class="buttonLookLink" href="register">REGISTER</a></div></div><br/>';
			$returnString .= '<a href="'.$basicInformationObject->getRoot().'/login">Login</a> | <a href="'.$basicInformationObject->getRoot().'/register">Register</a><br/>';
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