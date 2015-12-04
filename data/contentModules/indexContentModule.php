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
		return '<form action="search" method="get">'."\n".'
			<p class="searchLabel">SEARCH:
				<input class="inputField" type="text" name="key"/>'."\n".'
				<input class="button searchIcon" type="submit" value="&#xf002;"/>'."\n".'
			</p>
			</form>'."\n";
	}

	
}