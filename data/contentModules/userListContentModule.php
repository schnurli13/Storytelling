<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
class userListContentModule{

	private $sessionObject;

	function __construct($sessionObject){
		$this->sessionObject = $sessionObject;
	}

	function generateHtml(){
	
		$returnString = '';
	
		$returnString.=$this->getForm();
		
		return $returnString;

		}
		
	function getForm(){
		$returnString = '';
		
		$returnString.='<form method="POST" id="changeName" name="changeName">'."\n";
		$returnString.='<label>Name:</label><br>'."\n";
        $returnString.='<input type="text" name="userName" required />'."\n";
        $returnString.='<input type="submit" value="Change Name" />'."\n";
		$returnString.='</form>'."\n";
		
		$returnString.='<form method="POST" id="changeEmail" name="changeEmail">'."\n";
		$returnString.='<label>E-Mail:</label><br>'."\n";
        $returnString.='<input type="email" name="userMail" required />'."\n";
        $returnString.='<input type="submit" value="Change Email" />'."\n";
		$returnString.='</form>'."\n";
		
		$returnString.='<form method="POST" id="changePassword" name="changePassword">'."\n";
		$returnString.='<label>Password:</label><br>'."\n";
        $returnString.='<input type="text" name="userPassword" required /><br><br>'."\n";
		$returnString.='<label>Password Again:</label><br>'."\n";
        $returnString.='<input type="text" name="userPasswordAgain" required />'."\n";
        $returnString.='<input type="submit" value="Change Password" />'."\n";
		$returnString.='</form>'."\n";
		
		$returnString.='<form method="POST" id="changePic" name="changePic">'."\n";
        $returnString.='<label>Select a file:</label><br>'."\n";
        $returnString.='<input type="file" name="file" required />'."\n";
        $returnString.='<input type="submit" value="Change Picture" />'."\n";
		$returnString.='</form>'."\n";

		return $returnString;
	}
	
}