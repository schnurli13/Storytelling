<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */

class loginContentModule{

	private $sessionObject;

	function __construct($sessionObject){
		$this->sessionObject = $sessionObject;
	}

	function setSession($userName){
		$this->sessionObject->setUserName($userName);
		$this->sessionObject->setSafeHash($this->sessionObject->encodeKey($userName));
		$this->sessionObject->setLogState(true);
	}
	
	function generateHtml(){
	
		$msqlObject = new mysqlModule();
		
		$template = new contentTemplateModule('loginTemplate');
		$template->addLogState($this->sessionObject);
	
		$returnString = '';
				
		if($this->sessionObject->getLogState()){
			$returnString.='I just noticed, that you are already logged in!<br>'."\n".
				'<a href="index">Click to go back to the main page</a><br>'."\n";
		}else{
			if ($_SERVER['REQUEST_METHOD'] == 'POST'){
			$formErrors = array();
			if($_POST['userName'] === ''){
				array_push($formErrors, 'no user name set');
			}
			if(strlen($_POST['userName']) < 4){
				array_push($formErrors, 'username too short/ atleast 4 signs');
			}
			if(!$msqlObject->isUserExisting($_POST['userName'])){
				array_push($formErrors, 'User does not exists');
			}else{
				$queryResult = $msqlObject->queryDataBase('SELECT name, password FROM users WHERE name = "'.$_POST['userName'].'"');
				if($queryResult[0]['password'] != $this->sessionObject->encodeKey($_POST['passWord'])){
					array_push($formErrors, 'Wrong password');
				}
			}
			if(empty($formErrors)){
				$this->setSession($_POST['userName']);
				$returnString.='<h2>Login successful!</h2>'."\n".
					'<a href="login">Click to go to login</a><br>'."\n";
			}else{
				for($i = 0; $i<sizeof($formErrors); $i++){
					$returnString.=$formErrors[$i].'<br>'."\n";
				}
				$returnString.=$this->getForm($_POST['userName']);
			}
		}else{
			$returnString.=$this->getForm('');
		}
	}	
	
		$returnString.='Session: '.$this->sessionObject->getUserName().' | '.($this->sessionObject->getLogState() ? 'true' : 'false')."\n";
		$template->addContent('FORM', $returnString);
		return $template->generateHtml();
	}
	
	function getForm($name){
		return '<form action="login" method="post">'."\n".'
			<p class="label">USERNAME<br> <input class="inputField" type="text" name="userName" value="'.$name.'"/></p>'."\n".'
			<p class="label lastLabel">PASSWORD<br> <input class="inputField" type="text" name="passWord" /></p>'."\n".'
			<p><input type="hidden" name="proof" value="proofForMe"/></p>'."\n".'
			<p><div class="buttonFrameContainer firstButton"><input class="button" type="submit" value="LOGIN"/></div></p>'."\n".'
			<p><div class="buttonFrameContainer secondButton"><div class="buttonSize"><a class="buttonLookLink" href="./register">REGISTER</a></div></div></p>
			</form>'."\n";
	}

	
}