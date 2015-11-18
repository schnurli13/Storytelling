<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */

class searchContentModule{

	private $sessionObject;
	
	private $urlArray = array();

	function __construct($sessionObject, $urlArray){
		$this->sessionObject = $sessionObject;
		$this->urlArray = $urlArray;
	}

	function generateHtml(){
	
		$msqlObject = new mysqlModule();
	
		$returnString = '';
		
		$returnString.='<h1>Search</h1>'."\n";
		
		$returnString.=$this->getForm($_GET["key"]);
		
		$queryResult = $msqlObject->queryDataBase('SELECT name, password FROM users WHERE name LIKE "%'.$_GET["key"].'%"');
		
		if(isset($queryResult[0]['name'])){
		
			$returnString.='<h2>Found Users:</h2>';
			
			$returnString.='<ul>';
			
			for($i = 0; $i < sizeof($queryResult); $i++){
				$returnString.='<li><a href="'.$this->urlArray[0].'/users/'.$queryResult[$i]['name'].'">'.$queryResult[$i]['name'].'</a></li>';
			}
			
			$returnString.='</ul>';
		
		}
	
		return $returnString;
	}
	
		function getForm($key){
			return '<form action="search" method="get">'."\n".'
				<p><input type="text" name="key" value="'.$key.'"/></p>'."\n".'
				<p><input type="submit" value="search"/></p>'."\n".'
				</form>'."\n";
		}
	
}