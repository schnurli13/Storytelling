<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 

class contentTemplateModule{

	private $template;
	private $contents = array();
	private $basicInformationObject;

	function __construct($templateName){
		$this->template = file_get_contents('data/templates/'.$templateName.'.html', true);
		$this->basicInformationObject = new basicInformationModule();
		$this->addContent('ROOT', $this->basicInformationObject->getRoot());
		$this->addContent('PICPATH', $this->basicInformationObject->getRoot().'/public/images');
	}
	
	function addContent($keyWord, $content){
		array_push($this->contents, array($keyWord, $content));
	}
	
	function addLogState($sessionObject){
	
		$returnString = '';
	
		if($sessionObject->getLogState() && $sessionObject->encodeKey($sessionObject->getUserName()) ===  $sessionObject->getSafeHash()){
			$returnString .= '<a href="'.$this->basicInformationObject->getRoot().'/users/'.$sessionObject->getUserName().'">'.$sessionObject->getUserName().' | <a href="'.$this->basicInformationObject->getRoot().'/logout">Logout</a><br/>';
		}else{
			$returnString .= '
			<div class="buttonFrameContainerLogState left marginRightLogState"><div class="buttonSize"><a class="buttonLookLink firstLogState" href="'.$this->basicInformationObject->getRoot().'/login">LOGIN</a></div></div>
			<div class="buttonFrameContainerLogState left"><div class="buttonSize"><a class="buttonLookLink" href="'.$this->basicInformationObject->getRoot().'/register">REGISTER</a></div></div><br/>';
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