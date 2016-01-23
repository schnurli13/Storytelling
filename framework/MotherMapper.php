<?php

class MotherMapper{

	protected $myPage;
	protected $mySession;
	protected $msqlObject;
	protected $basicInformationObject;
	
	public function __construct(){
		$this->myPage = new pageObject();
		$this->mySession = new sessionModule();
		$this->msqlObject = new mysqlModule();
		$this->basicInformationObject = new basicInformationModule();
	}
	
	public function mappings(){
	
	}
	
	public function start(){	
		$this->mySession->initializeSession();
		$this->mappings();
		$this->myPage->generatePage();
	}

}