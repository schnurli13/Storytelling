<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */

class searchContentModule{

	private $sessionObject;
	private $msqlObject;
	private $urlArray = array();

	function __construct($sessionObject, $urlArray){
		$this->sessionObject = $sessionObject;
		$this->urlArray = $urlArray;
		$this->msqlObject = new mysqlModule();
	}

	function generateHtml(){
	
		$returnString = '';
		$fetchedString = '';
		
		$template = new contentTemplateModule('searchTemplate');	
		
		if(isset($_GET['key'])){
			$returnString.=$this->getForm($_GET['key']);
		}else{
			$returnString.=$this->getForm('');
		}
		
		$fetchedString.=$this->fetchUsers();
		$fetchedString.=$this->fetchStories();
		
		if($fetchedString === ''){$fetchedString = '<h2>Sorry, no results found!</h2>'."\n";}
				
		$returnString.=$fetchedString;
		
		$template->addLogState($this->sessionObject);
		$template->addContent('FORM', $returnString);
		
		 return $template->generateHtml();
	}
	
		function getForm($key){
			return '<form action="search" method="get">'."\n".'
				<p class="darkBlue searchLabel">SEARCH:
					<input class="inputField" type="text" name="key" value="'.$key.'"/>'."\n".'
					<input class="button searchResultIcon" type="submit" value="&#xf002;"/>'."\n".'
				</p>
				</form>'."\n";
		}
		
		function fetchUsers(){
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
					$storyImagePath = ($queryResult[$i]['imgPath'] != '') ? $this->urlArray[0].'/public/images/profile/'.$queryResult[$i]['imgPath'] : $this->urlArray[0].'/public/images/dummyProfile.jpg';
					$returnString.='<li><img class="searchPic" src="'.$storyImagePath.'" alt="profil" /><a class="searchLink" href="'.$this->urlArray[0].'/users/'.$queryResult[$i]['name'].'">'.$queryResult[$i]['name'].'</a></li>'."\n";
				}
				$returnString.='</ul>'."\n";
				$returnString.='</div>'."\n";
			}
			return $returnString;
		}
		
		function fetchStories(){
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
					$fetchedUser = $this->msqlObject->queryDataBase('SELECT name FROM users WHERE id = "'.$queryResult[$i]['user'].'"');
					$storyImagePath = ($queryResult[$i]['imgPath'] != '') ? $this->urlArray[0].'/public/images/story/'.$queryResult[$i]['imgPath'] : $this->urlArray[0].'/public/images/dummyStory.jpg';
					$returnString.='<li><img class="searchPic" src="'.$storyImagePath.'" alt="profil" /><a class="searchLink" href="'.$this->urlArray[0].'/users/'.$fetchedUser[0]['name'].'/'.$queryResult[$i]['name'].'">'.$queryResult[$i]['name'].'</a></li>'."\n";
				}
				$returnString.='</ul>'."\n";
				$returnString.='</div>'."\n";
			}
			return $returnString;
		}
}