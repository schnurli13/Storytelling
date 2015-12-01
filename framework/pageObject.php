<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */
 
require('modules/printPageModule.php');
 
class pageObject{

    private $sources = array();

    private $externCode = 'default';
    private $externName = 'default';
	
	private $activatedBackend = false;
	private $backendUri = 'backend';
	private $backendObject;
	
	private $root = '/';
	
	private $printObject;
		
	function __construct($newRoot) {
		$this->printObject = new printPageModule();
		$this->root = $newRoot;
	}
	
	function setTitle($title){
		$this->printObject->setTitle($title);
	}
	
    function getCurrentUri(){

        $basepath = implode('/', array_slice(explode('/', $_SERVER['SCRIPT_NAME']), 0, -1)) . '/';
        $uri = substr($_SERVER['REQUEST_URI'], strlen($basepath));
        if (strstr($uri, '?')) $uri = substr($uri, 0, strpos($uri, '?'));
        $uri = '/' . trim($uri, '/');

        return $uri;

    }

    function getUriArray(){
        $base_url = $this->getCurrentUri();
        $routes = array();
        $routes = explode('/', $base_url);	
		$routes[0] = $this->root;

        return $routes;
    }
	
    function setContent($content){
		$this->printObject->setContent($content);
    }

	function setBodyTemplate($bodyTemplate){

		$bodyTemplateLink = 'data/templates/'.$bodyTemplate.'.html';
		$this->printObject->setBody(file_get_contents($bodyTemplateLink, true));
    }
	
	function setHtmlTemplate($htmlTemplate){		
		$htmlTemplateLink = 'data/templates/'.$htmlTemplate.'.html';
		$this->printObject->setTemplate(file_get_contents($htmlTemplateLink, true));
    }

	
	function setAdditionalHead($additionalHead){		
		$additionalHeadLink = 'framework/head/additionalHead/'.$additionalHead.'.html';
		$this->printObject->setAdditionalHead(file_get_contents($additionalHeadLink, true));
	}
	
	function setMetaInformation($metaData){
		$metaDataLink = 'framework/head/metaData/'.$metaData.'.html';
		$this->printObject->setMetaInformation(file_get_contents($metaDataLink, true));
	}

    function useSource($format, $source){

        array_push($this->sources, array($format, $source));

    }

    public function discardSource($sourceFormat, $discardedSource){

        $counter = 0;

        foreach($this->sources as $source){

            if($source[0] == $sourceFormat && $source[1] == $discardedSource){
                unset($this->sources[$counter]);
                $this->sources = array_values($this->sources);
            }

            $counter++;

        }

    }

    public function generatePage(){
	
		$this->printObject->setSources($this->sources);
	
		if($this->activatedBackend && sizeof($this->getUriArray()) > 1){
			if($this->getUriArray()[1] === $this->backendUri){
				$this->backendObject->generateBackendPage();
				return 'backend loaded';
			}
		}
		
		$this->printObject->printPage();
		return 'frontend loaded';
		
    }

}
