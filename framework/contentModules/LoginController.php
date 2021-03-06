<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */

class LoginController extends MotherController{

	function actions(){
	
		$this->model->addLogState($this->sessionObject);
	
		$returnString = '';
				
		if($this->sessionObject->getLogState()){
			$returnString.='I just noticed, that you are already logged in!<br>'."\n".
				'<div class="buttonFrameContainer infoLink"><div class="buttonSize"><a class="buttonLookLink" href="index">MAIN PAGE</a></div></div><br>'."\n";
		}else{
			if ($_SERVER['REQUEST_METHOD'] == 'POST'){
			$formErrors = array();
			if($_POST['userName'] === ''){
				array_push($formErrors, 'no user name set');
			}
			if(strlen($_POST['userName']) < 4){
				array_push($formErrors, 'username too short/ atleast 4 signs');
			}
			if(!$this->msqlObject->isUserExisting($_POST['userName'])){
				array_push($formErrors, 'User does not exists');
			}else{
				$queryResult = $this->msqlObject->queryDataBase('SELECT name, password FROM users WHERE name = "'.$_POST['userName'].'"');
				if($queryResult[0]['password'] != $this->sessionObject->encodeKey($_POST['passWord'])){
					array_push($formErrors, 'Wrong password');
				}
			}
			if(empty($formErrors)){
				$this->setSession($_POST['userName']);
				header('Location: '.$this->basicInformationObject->getUriArray()[0].'/index');
				$returnString.='<h2>Login successful!</h2>'."\n".
					'<div class="buttonFrameContainer infoLink"><div class="buttonSize"><a href="index">MAIN PAGE</a></div></div><br>'."\n";
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
			$this->model->addAttribute('FORM', $returnString);
	}
	
	function setSession($userName){
		$this->sessionObject->setUserName($userName);
		$this->sessionObject->setSafeHash($this->sessionObject->encodeKey($userName));
		$this->sessionObject->setLogState(true);
	}
	
	function getForm($name){
		return '<form action="login" method="post">'."\n".'
			<p class="label">USERNAME<br> <input class="inputField" type="text" name="userName" value="'.$name.'"/></p>'."\n".'
			<p class="label lastLabel">PASSWORD<br> <input class="inputField" type="password" name="passWord" /></p>'."\n".'
			<p><input type="hidden" name="proof" value="proofForMe"/></p>'."\n".'
			<p><div class="buttonFrameContainer firstButton"><input class="button" type="submit" value="LOGIN"/></div></p>'."\n".'
			<p><div class="buttonFrameContainer secondButton"><div class="buttonSize"><a class="buttonLookLink" href="./register">REGISTER</a></div></div></p>
			</form>'."\n";
	}

	
}