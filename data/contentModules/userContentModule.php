<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class userContentModule{

	private $sessionObject;
	private $searchedUser;
	private $root;

	function __construct($sessionObject, $uriArray){
		$this->sessionObject = $sessionObject;
		$this->searchedUser = $uriArray[2];	
		$this->root = $uriArray[0];
	}

	function generateHtml(){
	
		$date = new DateTime();
		echo sha1(str_replace(' ','',$date->format('Y-m-d H:i:s')));
	
		$msqlObject = new mysqlModule();
	
		$returnString = '';
		
		$template = new contentTemplateModule('userTemplate');	
		
		$queryResult = $msqlObject->queryDataBase('SELECT * FROM users WHERE name = "'.$this->searchedUser.'"');
		
		if(!isset($queryResult[0]['name'])){
			header('Location: '.$this->root.'/404');
		}
		
		$template->addContent('USERNAME', $queryResult[0]['name']);
		$template->addContent('USERMAIL', $queryResult[0]['email']);
		$template->addContent('USERLEVEL', $queryResult[0]['tutorialDone'] ? 'Advanced User' : 'Beginner');
		$template->addContent('USERIMAGE', ($queryResult[0]['imgPath'] != '') ? 'profile/'.$queryResult[0]['imgPath'] : 'dummyProfile.jpg');
	
		$storyQueryResult = $msqlObject->queryDataBase('SELECT * FROM story WHERE user = "'.$queryResult[0]['id'].'"');
				
		$stories = '';
		
		if(isset($storyQueryResult[0]['name'])){
			for ($i = 0; $i < sizeof($storyQueryResult); $i++){
				$storyImagePath = ($storyQueryResult[$i]['imgPath'] != '') ? $this->root.'/public/images/story/'.$storyQueryResult[$i]['imgPath'] : $this->root.'/public/images/dummyStory.jpg';
				$stories.='<div class="storyPicFrame clearfix">'."\n";
					$stories.='<a href="'.$this->root.'/users/'.$this->searchedUser.'/'.$storyQueryResult[$i]['name'].'"><img class="storyPic" src="'.$storyImagePath.'" alt="story" />'."\n";
					$stories.='<p class="storyTitle">'.$storyQueryResult[$i]['name'].'</p></a>'."\n";
					if($this->searchedUser === $this->sessionObject->getUserName()) {
						$stories.='<div class="buttonFrameContainerStory"><a href="'.$this->root.'/users/'.$this->searchedUser.'/'.$storyQueryResult[$i]['name'].'/edit"><input class="buttonStory" type="submit" value="EDIT"/></a></div>'."\n";
					}
				$stories.='</div>'."\n";
			}
		}
	
		if($this->searchedUser === $this->sessionObject->getUserName()){
			$returnString.='<div class="buttonFrameContainerStoryInfo"><a><input class="buttonStoryInfo" type="submit" value="EDIT PROFILE"/></a></div>';
		}
		
		$template->addLogState($this->sessionObject);
		$template->addContent('INFO', $returnString);
		$template->addContent('STORIES', $stories);

		return $template->generateHtml();

		}
	
}