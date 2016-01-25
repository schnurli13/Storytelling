var initialize;
var handleReInitialize;

var form;
var submitForm;
var activateSubmit;
var activateCloseButton;
var loadStandardValue;

var changePictureButton;
var changePictureActivation;
var loadPictureChangeElements;
var changePicLoaded;

var loadCurrentPicture;

var loadAndUpdatePics;
var setAsProfilePic;
var deleteProfilePic;

var getCurrentUser;

var loadCropper;

activateSubmit = function(){
	form = $('.ajaxForm');
	form.on('submit', function(e){
		e.preventDefault();
		submitForm($(this));
	});
	loadStandardValue(form);
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
			loadStandardValue(submitForm);
		});
	return false;	
}

loadStandardValue = function(forms){
	forms.each(function(){
	
		var fd = new FormData();
		fd.append('function', 'fetchCurrentValues');
		fd.append('form_id', $(this).attr('id'));
		var myElement = $(this);
			$.ajax({
				url: '/Storytelling/public/php/formFunctions.php',
				type: 'POST',
				data: fd,
				enctype: 'multipart/form-data',
				processData: false,  // tell jQuery not to process the data
				contentType: false   // tell jQuery not to set contentType
			}).done(function( data ) {
				console.log('Data for forms:');
				console.log(data);
				myElement.children('input').val('');
				myElement.children('.loadData').attr('placeholder', data);
			});
		
	})
	
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
			picSection.append('<div class="profilePicContainer"><img src="/Storytelling/public/images/profile/'+parsedArray[i]+'" class="profilePic" alt="pic'+picNumber+'"><span class="deleteThisPic">X</span></div>');
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
	//upload.append('<label class="selectFileLable" >Select a file:</label><br>');
	//upload.append('<input class="selectFileFile" type="file" name="file" required />');
	//upload.append('<input class="selectFileSubmit" type="submit" value="Upload Picture" />');
	upload.append('<div id="cropField" />');
	button.parent().after('<div id="profilePicSection"></div>');
	
	loadCropper();
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

activateCloseButton = function(){
	$('.closeFancyBox').on('click', function(){
		$.fancybox.close();
	});
}

getCurrentUser = function(){
	var user = '';
	var fd = new FormData();
	fd.append('function', 'getCurrentUser');
	return $.ajax({
		url: '/Storytelling/public/php/formFunctions.php',
		type: 'POST',
		data: fd,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	});
}

initialize = function(){
	changePicLoaded = false;
	activateSubmit();
	loadCurrentPicture();
	changePictureActivation();
}

loadCropper = function(){

	var cropperOptions = {
			uploadUrl:'/Storytelling/public/plugins/croppic/img_save_to_file.php',
			cropUrl:'/Storytelling/public/plugins/croppic/img_crop_to_file.php',
			onAfterImgCrop:	function(){ loadAndUpdatePics() }
		}		
		
	var cropperHeader = new Croppic('cropField', cropperOptions);

}

$(document).ready(function(){
	var fancybox = $('.fancybox');
	if(fancybox.length > 0){
		fancybox.fancybox({
			beforeShow: function(current, previous){
				initialize();
				activateCloseButton();
			},
			afterClose: function() {
				var currentUser = getCurrentUser();
				currentUser.success(function (data) {
					window.location.href = '/Storytelling/users/'+data;
				});
				
			}
		});
	}
	
	initialize();
	
		
	

});
