<?php
/**
 * Created by David Hondl.
 * Version: 0.1
 */

class IndexController extends MotherController{

	function actions(){
		$this->model->addLogState($this->sessionObject);
		$this->model->addAttribute('FORM',$this->getForm());
	}
	
	function getForm(){
		return '<form action="search" method="get">'."\n".'
			<p class="searchLabel">SEARCH:
				<input class="inputField" type="text" name="key"/>'."\n".'
				<input class="button searchIcon" type="submit" value="&#xf002;"/>'."\n".'
			</p>
			</form>'."\n";
	}

	
}