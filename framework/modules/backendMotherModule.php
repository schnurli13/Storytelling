<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 

class backendMotherModule{

	public $uriArray = array();
	public $moduleName = 'noModule';
	
	public $printObject;

	function __construct($uriArray) {
		$this->printObject = new printModule();
		$this->uriArray = $uriArray;
		
		if(sizeof($this->uriArray) > 2){
			$this->moduleName = $this->uriArray[2];
		}
	}

	function inBackendDirectory(){
		return (sizeof($this->uriArray) === 2);
	}

}