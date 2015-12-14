<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 

class basicInformationModule{

	private $root = '/Storytelling';

	function getRoot(){
		return $this->root;
	}
	
	    function getCurrentUri(){

        $basepath = implode('/', array_slice(explode('/', $_SERVER['SCRIPT_NAME']), 0, -1)) . '/';
        $uri = substr($_SERVER['REQUEST_URI'], strlen($basepath));
        if (strstr($uri, '?')) $uri = substr($uri, 0, strpos($uri, '?'));
        $uri = '/' . trim($uri, '/');

        return $uri;

    }

    function getUriArray(){
		$basicInformationObject = new basicInformationModule();
        $base_url = $this->getCurrentUri();
        $routes = array();
        $routes = explode('/', $base_url);	
		$routes[0] = $basicInformationObject->getRoot();

        return $routes;
    }

}