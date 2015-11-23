<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
 require('framework/modules/mysqlModule.php');
 
class registerContentModule{

	private $sessionObject;

	function __construct($sessionObject){
		$this->sessionObject = $sessionObject;
	}

	function generateHtml(){
		
		$msqlObject = new mysqlModule();
			
		$returnString = '';
		
		$template = new contentTemplateModule('registrationTemplate');
		
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
			if($msqlObject->isUserExisting($_POST['userName'])){
				array_push($formErrors, 'already exists');
			}
			if($_POST['eMail'] === ''){
				array_push($formErrors, 'no email set');
			}
			if($_POST['pwOriginal'] === ''){
				array_push($formErrors, 'no password set');
			}
			if(strlen($_POST['pwOriginal']) < 6){
				array_push($formErrors, 'password too short/ atleast 6 signs');
			}
			if($_POST['pwCopy'] === ''){
				array_push($formErrors, 'password not set a second time');
			}
			if($_POST['pwCopy'] != $_POST['pwOriginal']){
				array_push($formErrors, 'password doesn\'t match first and second time');
			}
			if(empty($formErrors)){
				$msqlObject->commandDataBase('INSERT INTO `users` (`name`, `email`, `password`) VALUES ("'.$_POST['userName'].'", "'.$_POST['eMail'].'", "'.$_POST['pwOriginal'].'")');
				$returnString.='<h2>Registration successful!</h2>'."\n".
					'<a href="login">Click to go to login</a>';
			}else{
				for($i = 0; $i<sizeof($formErrors); $i++){
					$returnString.=$formErrors[$i].'<br>'."\n";
				}
				$returnString.=$this->getForm($_POST['userName'], $_POST['eMail']);
			}
		}else{
			$returnString.=$this->getForm('', '');
		}
	}				

		$template->addContent('FORM', $returnString);
		
		 return $template->generateHtml();
		
	}
	
	function getForm($name, $email){
		return '<form action="register" method="post">'."\n".'
			 <p>Ihr Username: <input type="text" name="userName" value="'.$name.'"/></p>'."\n".'
			 <p>Ihre Mail-Adresse: <input type="email" name="eMail" value="'.$email.'"/></p>'."\n".'
			 <p>Ihr Passwort: <input type="text" name="pwOriginal" /></p>'."\n".'
			 <p>Erneut ihr Passwort: <input type="text" name="pwCopy" /></p>'."\n".'
			 <p><input type="hidden" name="proof" value="proofForMe"/></p>'."\n".'
			 <p><input type="submit" /></p>'."\n".'
			</form>'."\n";
	}
	
}