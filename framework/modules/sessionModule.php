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
	
	function getLogState(){
		return $_SESSION['loggedIn'];
	}
	
	function setLogState($LogState){
		$_SESSION['loggedIn'] = $LogState;
	}
	
	function encodeKey($key){
        $salt=sha1($key.'CkTcUoYXpx');
        $encodedKey=$salt.sha1($key);
		return $encodedKey;
	}

}