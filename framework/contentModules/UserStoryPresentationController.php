<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class UserStoryPresentationController extends MotherController{

	function generateHtml(){
	
		$this->model->addAttribute('STORYTITLE', $this->basicInformationObject->getUriArray()[3]);
		
	}
	
}