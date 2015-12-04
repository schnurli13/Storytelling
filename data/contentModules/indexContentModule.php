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
	
		$template = new contentTemplateModule('indexTemplate');
		$template->addLogState($this->sessionObject);
		$template->addContent('FORM',$this->getForm());
		
		return $template->generateHtml();
		
	}
	
		function getForm(){
			//return '<form action="search" method="get">'."\n".'
			//	<p class="searchLabel">SEARCH:<input class="inputField" type="text" name="key" value="'.$key.'"/></p>'."\n".'
			//	<div class="buttonFrameContainer"><input class="button" type="submit" value="SEARCH"/></div>'."\n".'
			//	</form>'."\n";
			return '<form action="search" method="get">'."\n".'
				<p class="searchLabel">SEARCH:
					<input class="inputField" type="text" name="key"/>
					<input class="button searchIcon" type="submit" value="&#xf002;"/>
				</p>'."\n".'
				</form>'."\n";
	}

	
}