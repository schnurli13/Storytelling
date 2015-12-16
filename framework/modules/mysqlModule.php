<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */

class mysqlModule{

	private $servername = 'localhost';
	private $username = 'root';
	private $password = '';
	private $dbname = 'storytelling_platform';
	
	function commandDataBase($sql){
		$conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
		if ($conn->connect_error) {
			die('Connection failed: ' . $conn->connect_error);
		} 
		
		if ($conn->query($sql) === TRUE) {
			return true;
		} else {
			return false;
		}
		$conn->close();
	}
		
	function queryDataBase($sql){
		$conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
		if ($conn->connect_error) {
			die('Connection failed: ' . $conn->connect_error);
		} 
		$result = $conn->query($sql);
		$resultArray = array();
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				array_push($resultArray, $row);
			}
		} else {
			array_push($resultArray, 'no results found');
		}
		$conn->close();
		return $resultArray;	
	}
	
	function isUserExisting($user){
		$searchResult = $this->queryDataBase('SELECT * FROM users WHERE name = "'.$user.'"');
		if(!isset($searchResult[0]['name'])){
			return false;
		}else{
			return true;
		}
	}
}