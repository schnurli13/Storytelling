<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */

class printModule{

	protected $head;
	protected $body;
	protected $content;
	protected $template;
	
	function __construct(){
		$this->head = file_get_contents('framework/head/core/defaultPrintHead.html', true);
		$this->content = file_get_contents('data/content/core/defaultPrintContent.html', true);
		$this->body = file_get_contents('data/content/core/defaultPrintBody.html', true);
		$this->template = file_get_contents('data/content/core/printTemplate.html', true);
	}
	
	function setTemplate($template){
		$this->template = $template;
	}
	
	function setHead($head){
		$this->head = $head;
	}
	
	function setContent($content){
		$this->content = $content;
	}
	
	function setBody($body){
		$this->body = $body;
	}

	function printPage(){
		$toPrint = 'default';
		$toPrint = preg_replace('/{{HEAD}}/', $this->head, $this->template);
		$toPrint = preg_replace('/{{BODY}}/', $this->body, $toPrint);
		$toPrint = preg_replace('/{{CONTENT}}/', $this->content, $toPrint);
		echo $toPrint;
	}

}