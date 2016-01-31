<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class UserStoryContentController extends MotherController{

	function actions(){
	
		$storyQueryResult = $this->msqlObject->queryDataBase('SELECT * FROM story WHERE name = "'.$this->basicInformationObject->getUriArray()[3].'"');
	
		$stories = '';
		$loggedIn = false;
			
		if($this->sessionObject->getLogState() && $this->sessionObject->encodeKey($this->basicInformationObject->getUriArray()[2]) ===  $this->sessionObject->getSafeHash()){
			$loggedIn = true;
		}
		
		if($storyQueryResult[0]['isPublished'] === '1' || $storyQueryResult[0]['isPublished'] === '0' && $loggedIn){
			//access granted
		}else{
			header('Location: ..');
		}
	
		$urlArray = $this->basicInformationObject->getUriArray();
		$searchedUser = $urlArray[2];
		$searchedStory = $urlArray[3];
		$root = $urlArray[0];		
		
		$returnString = '';
				
		$queryResult = array();
		
		$imgString = '';
		$authorString = '';
		$coAuthorString = '';
		
		
		$userIDQueryResult = $this->msqlObject->queryDataBase('SELECT id FROM users WHERE name = "'.$searchedUser.'"');
		if(isset($userIDQueryResult[0]['id'])){
			$userID = $userIDQueryResult[0]['id'];
			$queryResult = $this->msqlObject->queryDataBase('SELECT * FROM story WHERE user = "'.$userID.'" AND name = "'.$searchedStory.'"');

			$imagePath = $this->msqlObject->queryDataBase('SELECT path FROM story_images WHERE id = "'.$queryResult[0]['img_id'].'"')[0]['path'];
			
			$imgString = $this->basicInformationObject->getUriArray()[0].'/public/images/story/'.$imagePath;
			$authorString = $queryResult[0]['author_name'];
			$coAuthorString = $queryResult[0]['co_author_name'];
			
			if(isset($queryResult[0]['name'])){
			$returnString.='<h2>'.$searchedStory.'</h2>'."\n";
			$returnString.='<a href="/Storytelling/users/'.$searchedUser.'" class="backLink">by '.$searchedUser.'</a>'."\n";
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
		$this->model->addAttribute('AUTHOR', $authorString);
		$this->model->addAttribute('COAUTHOR', $coAuthorString);
		$this->model->addAttribute('IMAGE', $imgString);
		
	}
	
}