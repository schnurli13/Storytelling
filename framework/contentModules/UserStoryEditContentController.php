<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class UserStoryEditContentController extends MotherController{

	function actions(){
		if($this->sessionObject->encodeKey($this->basicInformationObject->getUriArray()[2]) != $this->sessionObject->getSafeHash()){
			header('Location: .');
		}else{
			$this->model->addLogState($this->sessionObject);
		}	
	}
}