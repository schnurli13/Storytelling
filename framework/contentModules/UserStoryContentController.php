<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class UserStoryContentController extends MotherController{

	function actions(){
	
		$urlArray = $this->basicInformationObject->getUriArray();
		$searchedUser = $urlArray[2];
		$searchedStory = $urlArray[3];
		$root = $urlArray[0];		
		
		$returnString = '';
		
		$template = new contentTemplateModule('userStoryTemplate');	
		
		$queryResult = array();
		
		$userIDQueryResult = $this->msqlObject->queryDataBase('SELECT id FROM users WHERE name = "'.$searchedUser.'"');
		if(isset($userIDQueryResult[0]['id'])){
			$userID = $userIDQueryResult[0]['id'];
			$queryResult = $this->msqlObject->queryDataBase('SELECT * FROM story WHERE user = "'.$userID.'" AND name = "'.$searchedStory.'"');

			if(isset($queryResult[0]['name'])){
			$returnString.='<h2>'.$searchedStory.'</h2>'."\n";
			$returnString.='<p><div class="buttonFrameContainerUserStoryContentModule"><div class="buttonSize"><a href="'.$root.'/users/'.$searchedUser.'/'.$searchedStory.'/published" class="buttonLookLink">LOOK AT IT</a></div></div></p>'."\n";
			if($searchedUser === $this->sessionObject->getUserName()){
				$returnString.='<p><div class="buttonFrameContainerUserStoryContentModule"><div class="buttonSize"><a class="buttonLookLink" href="'.$root.'/users/'.$searchedUser.'/'.$searchedStory.'/edit">EDIT</a></div></div></p>'."\n";
			}
		}else{
			$returnString.='<h2>no story found!</h2>'."\n";
		}
			
		}else{
			$returnString.='<h2>no story found!</h2>'."\n";
		}
		
		
		
		$this->model->addLogState($this->sessionObject);
		$this->model->addAttribute('INFO', $returnString);
		
	}
	
}