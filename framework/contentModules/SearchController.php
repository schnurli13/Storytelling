<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */

class SearchController extends MotherController{

	function actions(){
	
		$urlArray = $this->basicInformationObject->getUriArray();
	
		$returnString = '';
		$fetchedString = '';
				
		if(isset($_GET['key'])){
			$returnString.=$this->getForm($_GET['key']);
		}else{
			$returnString.=$this->getForm('');
		}
		
		$fetchedString.=$this->fetchUsers($urlArray);
		$fetchedString.=$this->fetchStories($urlArray);
		
		if($fetchedString === ''){$fetchedString = '<h2>Sorry, no results found!</h2>'."\n";}
				
		$returnString.=$fetchedString;
		
		$this->model->addLogState($this->sessionObject);
		$this->model->addAttribute('FORM', $returnString);
		
	}
	
		function getForm($key){
			return '<form action="search" method="get">'."\n".'
				<p class="darkBlue searchLabel">SEARCH:
					<input class="inputField" type="text" name="key" value="'.$key.'"/>'."\n".'
					<input class="button searchResultIcon" type="submit" value="&#xf002;"/>'."\n".'
				</p>
				</form>'."\n";
		}
		
		function fetchUsers($urlArray){
			$returnString = '';
			$queryResult = array();	
			if(isset($_GET['key']) && $_GET['key'] != ''){
				$queryResult = $this->msqlObject->queryDataBase('SELECT * FROM users WHERE name LIKE "%'.$_GET['key'].'%"');
			}
			if(isset($queryResult[0]['name'])){
				$returnString.='<div class="foundUsers">'."\n";
				$returnString.='<h2>USERS</h2>'."\n";
				$returnString.='<ul>'."\n";
				for($i = 0; $i < sizeof($queryResult); $i++){
					$fetchedProfilePath = $this->msqlObject->queryDataBase('SELECT path FROM profile_images WHERE id = "'.$queryResult[$i]['img_id'].'"');
					$storyImagePath = $urlArray[0].'/public/images/profile/'.$fetchedProfilePath[0]['path'];
					$returnString.='<li><a href="'.$urlArray[0].'/users/'.$queryResult[$i]['name'].'"><img class="searchPic" src="'.$storyImagePath.'" alt="profil" /></a><a class="searchLink" href="'.$urlArray[0].'/users/'.$queryResult[$i]['name'].'">'.$queryResult[$i]['name'].'</a></li>'."\n";
				}
				$returnString.='</ul>'."\n";
				$returnString.='</div>'."\n";
			}
			return $returnString;
		}
		
		function fetchStories($urlArray){
			$displayedStories = 0;
			$returnString = '';
			$queryResult = array();	
			$queryUserResult = array();
			if(isset($_GET['key']) && $_GET['key'] != ''){
				$queryResult = $this->msqlObject->queryDataBase('SELECT * FROM story WHERE name LIKE "%'.$_GET['key'].'%"');
				$queryUserResult = $this->msqlObject->queryDataBase('SELECT name FROM story WHERE name LIKE "%'.$_GET['key'].'%"');
			}
			if(isset($queryResult[0]['name'])){
				$returnString.='<div class="foundStories">'."\n";
				$returnString.='<h2>STORIES</h2>'."\n";
				$returnString.='<ul>'."\n";
				for($i = 0; $i < sizeof($queryResult); $i++){
					if($queryResult[$i]['isPublished'] === '1'){
						$displayedStories++;
						$fetchedUser = $this->msqlObject->queryDataBase('SELECT name FROM users WHERE id = "'.$queryResult[$i]['user'].'"');
						$fetchedStoryPath = $this->msqlObject->queryDataBase('SELECT path FROM story_images WHERE id = "'.$queryResult[$i]['img_id'].'"');
						$storyImagePath = $urlArray[0].'/public/images/story/'.$fetchedStoryPath[0]['path'];
						$returnString.='<li><a href="'.$urlArray[0].'/users/'.$fetchedUser[0]['name'].'/'.$queryResult[$i]['name'].'"><img class="searchPic" src="'.$storyImagePath.'" alt="profil" /></a><a class="searchLink" href="'.$urlArray[0].'/users/'.$fetchedUser[0]['name'].'/'.$queryResult[$i]['name'].'">'.$queryResult[$i]['name'].'</a></li>'."\n";
					}
				}
				$returnString.='</ul>'."\n";
				$returnString.='</div>'."\n";
			}
			
			if($displayedStories < 1){
				$returnString = '';
			}
			
			return $returnString;
		}
}