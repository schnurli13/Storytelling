var initialize;
var initializeStory;
var storyOverhead;
var activateButtons;
var loadPage;
var prepareHtml;
var updatePage;

var pageTitle;
var pageText;
var pageImage;

initializeStory = function(){
	var fd = new FormData();
	var storyName = storyOverhead.attr('data-story-name');
	fd.append('function', 'loadFirstPage');
	fd.append('story', storyName);
	$.ajax({
		url: '/Storytelling/public/php/storyFunctions.php',
		type: 'POST',
		data: fd,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	}).done(function( data ) {
		updatePage(data);
	});
}

updatePage = function(data){
		var parsedArray = JSON.parse(data);
		pageTitle.children('h2').html(parsedArray[0]);
		pageText.html(parsedArray[1]);
		pageImage.children('img').attr('src', '/Storytelling/public/images/page/original/'+parsedArray[2]);
		pageImage.children('img').attr('alt', 'Image of this page');
		
		var pageOptions = $('.pageOptions');
		pageOptions.empty();
		for(i = 3; i < 7; i++){
			if(parsedArray[i] > 0){
				pageOptions.append('<div class="buttonFrameContainer"><div class="pageOption" data-pageId="'+parsedArray[i]+'">'+parsedArray[i + 4]+'</div></div>');
			}
		}
		activateButtons();
}

loadPage = function(button_id){
	var fd = new FormData();
	fd.append('function', 'loadTargetPage');
	fd.append('page_id', button_id);
	$.ajax({
		url: '/Storytelling/public/php/storyFunctions.php',
		type: 'POST',
		data: fd,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	}).done(function( data ) {
		updatePage(data);
	});
}

activateButtons = function(){
	var optionButtons = $('.pageOption');
	optionButtons.on('click', function(){
		loadPage($(this).attr('data-pageId'));
	})
}

prepareHtml = function(){
	$('#storyNav').toggle();
	pageTitle = $('.title');
	pageText = $('.pageText');
	pageImage = $('.pageImage');
	storyOverhead = $('#storyOverhead');
}

initialize = function(){
	prepareHtml();
	initializeStory();
}

$(document).ready(function(){
	initialize();
});
