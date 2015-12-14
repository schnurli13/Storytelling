<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */

require('printModule.php');
 
class printPageModule extends printModule{

	private $sourcesArray = array();
	private $metaData;
	private $additionalHead;
	private $title;
	
	function __construct(){
		$this->head = file_get_contents('framework/head/core/defaultPrintHead.html', true);
		$this->content = file_get_contents('data/content/core/defaultPrintContent.html', true);
		$this->body = file_get_contents('data/content/core/defaultPrintBody.html', true);
		$this->template = file_get_contents('data/content/core/printTemplate.html', true);
		$this->metaData = file_get_contents('framework/head/additionalHead/default.html', true);
		$this->additionalHead = file_get_contents('framework/head/metaData/default.html', true);
	}
	
	function setTitle($title){
		$this->title = $title;
	}
	
	function setSources($sourcesArray){
		$this->sourcesArray = $sourcesArray;
	}
	
	function setMetaInformation($metaData){
		$this->metaData = $metaData;
	}
	
	function setAdditionalHead($additionalHead){
		$this->additionalHead = $additionalHead;
	}
	
	function generateHead(){
		
		$toPrintHead = '<title>'.$this->title.'</title>'."\n";
		
		$toPrintHead .= $this->additionalHead.$this->metaData."\n";
		
		$sourcesString = '';
		
		$basicInformationObject = new basicInformationModule();

        foreach($this->sourcesArray as $source){

            switch($source[0]){

                case 'javascript':
                    $sourcesString =  $sourcesString.'<script type="text/javascript" src="'.$basicInformationObject->getRoot().'/public/javascript/'.$source[1].'.js" ></script>'."\n";
                    break;

                case 'css':
                    $sourcesString = $sourcesString.'<link rel="stylesheet" type="text/css" href="'.$basicInformationObject->getRoot().'/public/css/'.$source[1].'.css">'."\n";
                    break;
					
				case 'pluginJs':
                    $sourcesString = $sourcesString.'<script type="text/javascript" src="'.$basicInformationObject->getRoot().'/public/plugins/'.$source[1].'.js" ></script>'."\n";
                    break;
					
				case 'pluginCss':
                    $sourcesString = $sourcesString.'<link rel="stylesheet" type="text/css" href="'.$basicInformationObject->getRoot().'/public/plugins/'.$source[1].'.css">'."\n";
                    break;

            }

        }

		$toPrintHead = $toPrintHead.$sourcesString;
		
		return $toPrintHead;
		
	}
	
	function printPage(){
		$this->setHead($this->generateHead());
		$toPrint = 'default';
		$toPrint = preg_replace('/{{HEAD}}/', $this->head, $this->template);
		$toPrint = preg_replace('/{{BODY}}/', $this->body, $toPrint);
		$toPrint = preg_replace('/{{CONTENT}}/', $this->content, $toPrint);
		echo $toPrint;
	}
}