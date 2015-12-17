var initialize;
var handleReInitialize;

var form;
var submitForm;
var activateSubmit;

var changePictureButton;
var changePictureActivation;
var loadPictureChangeElements;
var changePicLoaded;

var loadCurrentPicture;

var loadAndUpdatePics;
var setAsProfilePic;
var deleteProfilePic;

activateSubmit = function(){
	form = $('form');
	form.on('submit', function(e){
		e.preventDefault();
		submitForm($(this));
	});
}

submitForm = function(submitForm){
	console.log("submit event");
	var fd = new FormData(submitForm[0]);
	fd.append('function', submitForm.attr('id'));
		$.ajax({
			url: '/Storytelling/public/php/formFunctions.php',
			type: 'POST',
			data: fd,
			enctype: 'multipart/form-data',
			processData: false,  // tell jQuery not to process the data
			contentType: false   // tell jQuery not to set contentType
		}).done(function( data ) {
			console.log('PHP Output:');
			console.log( data );
			if(submitForm.attr('id') === 'changePic'){
				loadAndUpdatePics();
			}
		});
	return false;	
}

changePictureActivation = function(){
	changePictureButton = $('#changePictureButton');
	changePictureButton.on('click', function(){
	if(!changePicLoaded){
		loadPictureChangeElements($(this));
		activateSubmit();
		changePicLoaded = true;
		loadAndUpdatePics();
		}
	})
}

loadAndUpdatePics = function(){
	var fd = new FormData();
	fd.append('function', 'getAllPictures');
	$.ajax({
		url: '/Storytelling/public/php/formFunctions.php',
		type: 'POST',
		data: fd,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	}).done(function( data ) {
		console.log('PHP Output:');
		var picSection = $('#profilePicSection')
		picSection.empty();
		var i;
		var picNumber
		var parsedArray = JSON.parse(data);
		for(i = 0; i<parsedArray.length; i++){
			picNumber = i+1;
			picSection.append('<div class="profilePicContainer"><span class="deleteThisPic">X</span><img src="/Storytelling/public/images/profile/'+parsedArray[i]+'" class="profilePic" alt="pic'+picNumber+'"></div>');
		}
		$('.profilePic').on('click', function(){
			setAsProfilePic($(this));
		})
		$('.deleteThisPic').on('click', function(){
			deleteProfilePic($(this));
		})
		console.log( data );
	});
	return false;	
}

deleteProfilePic = function(deleteButton){
	console.log(deleteButton.parent().children('img').attr('alt'));
	var fd = new FormData();
	fd.append('function', 'deletePic');
	fd.append('path', deleteButton.parent().children('img').attr('src'));
	$.ajax({
		url: '/Storytelling/public/php/formFunctions.php',
		type: 'POST',
		data: fd,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	}).done(function( data ) {
	loadAndUpdatePics();
	console.log( data );
	});

	
}

setAsProfilePic = function(picture){
	console.log(picture.attr('alt'));
	
	var fd = new FormData();
	fd.append('function', 'setAsNewProfilePic');
	fd.append('path', picture.attr('src'));
	$.ajax({
		url: '/Storytelling/public/php/formFunctions.php',
		type: 'POST',
		data: fd,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	}).done(function( data ) {
	loadCurrentPicture();
	console.log( data );
	});
}

loadPictureChangeElements = function(button){
	button.parent().after('<form method="POST" id="changePic" name="changePic"></form>');
	var upload = $('#changePic');
	upload.wrap('<div id="changePicSection"></div>');
	//upload.atfter('<div id="profilePicSection"></div>');
	upload.append('<label class="selectFileLable" >Select a file:</label><br>');
	upload.append('<input class="selectFileFile" type="file" name="file" required />');
	upload.append('<input class="selectFileSubmit" type="submit" value="Upload Picture" />');
	button.parent().after('<div id="profilePicSection"></div>');
}

loadCurrentPicture = function(){
	var fd = new FormData();
	fd.append('function', 'getCurrentPicture');
	$.ajax({
		url: '/Storytelling/public/php/formFunctions.php',
		type: 'POST',
		data: fd,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	}).done(function( data ) {
		console.log('PHP Output:');
		if(data != ''){
			$('#currentPicture').attr('src', '/Storytelling/public/images/profile/'+data);
		}
		console.log( data );
	});
	return false;	
}

initialize = function(){
	changePicLoaded = false;
	activateSubmit();
	loadCurrentPicture();
	changePictureActivation();
}

$(document).ready(function(){
	var fancybox = $('.fancybox');
	if(fancybox.length > 0){
		fancybox.fancybox({
			beforeShow: function(current, previous){
				initialize();
			}
		});
	}
	initialize();
});