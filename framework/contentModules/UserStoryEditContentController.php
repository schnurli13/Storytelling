<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class UserStoryEditContentController extends MotherController{

	function actions(){
		$this->model->addLogState($this->sessionObject);
	}
	
}