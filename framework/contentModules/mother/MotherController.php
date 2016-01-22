<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class MotherController{

	protected $sessionObject;
	protected $msqlObject;
	protected $basicInformationObject;
	protected $model;

	public function __construct($templateName){
		$this->sessionObject = new sessionModule();
		$this->msqlObject = new mysqlModule();
		$this->basicInformationObject = new basicInformationModule();
		$this->model = new contentTemplateModule($templateName);
	}
	
	public function actions(){
	
	}

	function execute(){
		$this->actions();
		return $this->model->generateHtml();
	}
	
}