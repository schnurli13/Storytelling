<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class userStoryContentModule{

	private $sessionObject;
	private $searchedUser;
	private $searchedStory;

	function __construct($sessionObject, $uriArray){
		$this->sessionObject = $sessionObject;
		$this->searchedUser = $uriArray[2];
		$this->searchedStory = $uriArray[3];
	}

	function generateHtml(){
	
		$msqlObject = new mysqlModule();
	
		$returnString = '';
		
		$template = new contentTemplateModule('userStoryTemplate');	
		
		$queryResult = array();
		
		$userIDQueryResult = $msqlObject->queryDataBase('SELECT id FROM users WHERE name = "'.$this->searchedUser.'"');
		if(isset($userIDQueryResult[0]['id'])){
			$userID = $userIDQueryResult[0]['id'];
			$queryResult = $msqlObject->queryDataBase('SELECT * FROM story WHERE user = "'.$userID.'" AND name = "'.$this->searchedStory.'"');

			if(isset($queryResult[0]['name'])){
			$returnString.='<h2>'.$this->searchedStory.'</h2>'."\n";
			$returnString.='<p><div class="buttonFrameContainerUserStoryContentModule"><div class="buttonSize"><a href="published" class="buttonLookLink">LOOK AT IT</a></div></div></p>'."\n";
			if($this->searchedUser === $this->sessionObject->getUserName()){
				$returnString.='<p><div class="buttonFrameContainerUserStoryContentModule"><div class="buttonSize"><a class="buttonLookLink" href="edit">EDIT</a></div></div></p>'."\n";
			}
		}else{
			$returnString.='<h2>no story found!</h2>'."\n";
		}
			
		}else{
			$returnString.='<h2>no story found!</h2>'."\n";
		}
		
		
		
		$template->addLogState($this->sessionObject);
		$template->addContent('INFO', $returnString);

	
		return $template->generateHtml();
		
	}
	
}