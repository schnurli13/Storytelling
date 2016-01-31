<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 

class sessionModule{

	function initializeSession(){
		session_start();
		if(!isset($_SESSION['userName'])){
			$_SESSION['userName'] = '';
		}
		if(!isset($_SESSION['story'])){
			$_SESSION['story'] = '';
		}
		if(!isset($_SESSION['page'])){
			$_SESSION['page'] = '';
		}
		if(!isset($_SESSION['safeHash'])){
			$_SESSION['safeHash'] = '';
		}
		if(!isset($_SESSION['loggedIn'])){
			$_SESSION['loggedIn'] = false;
		}
	}
	
	function destroySession(){
		session_destroy();
	}
	
	function getUserName(){
		return $_SESSION['userName'];
	}
	
	function setUsername($userName){
		$_SESSION['userName'] = $userName;
	}
	
	function getStory(){
		return $_SESSION['story'];
	}
	
	function setStory($story){
		$_SESSION['story'] = $story;
	}
	
	function getPage(){
		return $_SESSION['page'];
	}
	
	function setPage($page){
		$_SESSION['page'] = $page;
	}

	function getLogState(){
		return $_SESSION['loggedIn'];
	}
	
	function setLogState($LogState){
		$_SESSION['loggedIn'] = $LogState;
	}
	
	function getSafeHash(){
		return $_SESSION['safeHash'];
	}
	
	function setSafeHash($safeHash){
		$_SESSION['safeHash'] = $safeHash;
	}
	
	function encodeKey($key){
        $salt=sha1($key.'CkTcUoYXpx');
        $encodedKey=$salt.sha1($key);
		return $encodedKey;
	}

}