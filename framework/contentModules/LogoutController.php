<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class LogoutController extends MotherController{

	function actions(){	
		$this->sessionObject->destroySession();
	}
	
}