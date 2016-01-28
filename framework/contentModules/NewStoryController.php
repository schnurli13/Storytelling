<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class NewStoryController extends MotherController{

	function actions(){
	
		$returnString = '';
				

		if ($_SERVER['REQUEST_METHOD'] == 'POST'){
			$foundStories = $this->msqlObject->queryDataBase('SELECT * FROM story WHERE name = "'.$_POST['storyName'].'"');
			if(isset($foundStories[0]['name']) || $_POST['storyName'] === ''){
				header('Location: .');
			}else{
				$userId = $this->msqlObject->queryDataBase('SELECT id FROM users WHERE name = "'.$this->sessionObject->getUserName().'"')[0]['id'];
				$this->msqlObject->commandDataBase('INSERT INTO `story` (`name`, `hasImage`, `hasText`, `isPublished`, `user`, `img_id`) VALUES ("'.$_POST['storyName'].'", "1", "1", "0", "'.$userId.'", "1")');
				echo $_POST['storyName'];
				
				$newStoryId = $this->msqlObject->queryDataBase('SELECT * FROM story WHERE name = "'.$_POST['storyName'].'"')[0]['id'];
				$this->msqlObject->commandDataBase('INSERT INTO `page` (`level`, `position`, `story`, `title`) VALUES (0, 1, "'.$newStoryId.'", "Your first page!")');
				$newPageId = $this->msqlObject->queryDataBase('SELECT * FROM page WHERE story = "'.$newStoryId.'" AND level = 0')[0]['id'];
				
				$this->msqlObject->commandDataBase('UPDATE `story` SET firstPage = "'.$newPageId.'" WHERE id = "'.$newStoryId.'"');
				
				header('Location: '.$this->basicInformationObject->getUriArray()[0].'/users/'.$this->sessionObject->getUserName().'/'.$_POST['storyName'].'/edit');
			}
		}else{
			header('Location: '.$this->basicInformationObject->getUriArray()[0].'/404');
		}
		//echo $returnString;
	}
}