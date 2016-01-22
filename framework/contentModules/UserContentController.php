<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class UserContentController extends MotherController{

	function actions(){
	
		$urlArray = $this->basicInformationObject->getUriArray();
		$searchedUser = $urlArray[2];	
		$root = $urlArray[0];		
		
		$msqlObject = new mysqlModule();
	
		$returnString = '';
				
		$queryResult = $msqlObject->queryDataBase('SELECT * FROM users WHERE name = "'.$searchedUser.'"');
		
		if(!isset($queryResult[0]['name'])){
			header('Location: '.$root.'/404');
		}
		
		$fetchProfilePicPath = $msqlObject->queryDataBase('SELECT path FROM profile_images WHERE id = "'.$queryResult[0]['img_id'].'"');
		
		$this->model->addAttribute('USERNAME', $queryResult[0]['name']);
		$this->model->addAttribute('USERMAIL', $queryResult[0]['email']);
		$this->model->addAttribute('USERLEVEL', $queryResult[0]['tutorialDone'] ? 'Advanced User' : 'Beginner');
		$this->model->addAttribute('USERIMAGE', $fetchProfilePicPath[0]['path']);
	
		$storyQueryResult = $msqlObject->queryDataBase('SELECT * FROM story WHERE user = "'.$queryResult[0]['id'].'"');
				
		$stories = '';
		
		if(isset($storyQueryResult[0]['name'])){
			for ($i = 0; $i < sizeof($storyQueryResult); $i++){
				$fetchStoryPicPath = $msqlObject->queryDataBase('SELECT path FROM story_images WHERE id = "'.$storyQueryResult[$i]['img_id'].'"');
				$storyImagePath = $root.'/public/images/story/'.$fetchStoryPicPath[0]['path'];
				$stories.='<div class="storyPicFrame clearfix">'."\n";
					$stories.='<a href="'.$root.'/users/'.$searchedUser.'/'.$storyQueryResult[$i]['name'].'"><img class="storyPic" src="'.$storyImagePath.'" alt="story" />'."\n";
					$stories.='<p class="storyTitle">'.$storyQueryResult[$i]['name'].'</p></a>'."\n";
					if($searchedUser === $this->sessionObject->getUserName()) {
						$stories.='<div class="buttonFrameContainerStory"><a href="'.$root.'/users/'.$searchedUser.'/'.$storyQueryResult[$i]['name'].'/edit"><input class="buttonStory" type="submit" value="EDIT"/></a></div>'."\n";
					}
				$stories.='</div>'."\n";
			}
		}
	
		if($searchedUser === $this->sessionObject->getUserName()){
			$returnString.='<div class="buttonFrameContainerStoryInfo"><a class="fancybox fancybox.ajax" href="../data/templates/uploadTestForm.html"><input class="buttonStoryInfo" type="submit" value="EDIT PROFILE"/></a></div>';
		}
		
		$this->model->addLogState($this->sessionObject);
		$this->model->addAttribute('INFO', $returnString);
		$this->model->addAttribute('STORIES', $stories);

	}
	
}