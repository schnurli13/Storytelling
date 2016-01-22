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
		$this->addAttribute('ROOT', $this->basicInformationObject->getRoot());
		$this->addAttribute('PICPATH', $this->basicInformationObject->getRoot().'/public/images');
	}
	
	function addAttribute($keyWord, $content){
		array_push($this->contents, array($keyWord, $content));
	}
	
	function addLogState($sessionObject){
	
		$returnString = '';
	
		if($sessionObject->getLogState() && $sessionObject->encodeKey($sessionObject->getUserName()) ===  $sessionObject->getSafeHash()){
			$returnString .= '<div class="LogedInHelloState">HELLO <a href="'.$this->basicInformationObject->getRoot().'/users/'.$sessionObject->getUserName().'">'.$sessionObject->getUserName().'</div> <div class="buttonFrameContainerLogState right"><div class="buttonSize"><a class="buttonLookLink" href="'.$this->basicInformationObject->getRoot().'/logout">LOGOUT</a></div></div><br/>';
		}else{
			$returnString .= '
			<div class="buttonFrameContainerLogState left marginRightLogState"><div class="buttonSize"><a class="buttonLookLink firstLogState" href="'.$this->basicInformationObject->getRoot().'/login">LOGIN</a></div></div>
			<div class="buttonFrameContainerLogState left"><div class="buttonSize"><a class="buttonLookLink" href="'.$this->basicInformationObject->getRoot().'/register">REGISTER</a></div></div><br/>';
		}
		
		$this->addAttribute('LOGSTATE', $returnString);

	}
	
	function generateHtml(){
		$returnString = $this->template;
		foreach($this->contents as $singleContent){
			$returnString = preg_replace('/{{'.$singleContent[0].'}}/',  $singleContent[1], $returnString);
		}
	return $returnString;
	}
	
}