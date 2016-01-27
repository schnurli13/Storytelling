var initialize;
var handleReInitialize;

var activateCloseButton;
var loadStandardValue;

var changePictureButton;
var changePictureActivation;
var loadPictureChangeElements;

var loadCurrentPictures;

var loadAndUpdatePics;
var setAsProfilePic;
var deleteProfilePic;

var getCurrentUser;

var loadCropper;

changePictureActivation = function(){
	changePictureButton = $('.changePictureButton');
	var changePictureAttr;
	if(changePictureButton.hasClass('userPicture')){
		changePictureAttr = 'userPicture';
	}else if(changePictureButton.hasClass('storyPicture')){
		changePictureAttr = 'storyPicture';
	}else if(changePictureButton.hasClass('pagePicture')){
		changePictureAttr = 'pagePicture';
	}
	changePictureButton.on('click', function(){
	if(!$(this).hasClass('open')){
		loadPictureChangeElements($(this));
		$(this).addClass('open');
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
	loadCurrentPictures();
	console.log( data );
	});
}

loadPictureChangeElements = function(button){
	button.parent().after('<form method="POST" class="changePic" name="changePic"></form>');
	var upload = button.parent().siblings('.changePic');
	upload.wrap('<div id="changePicSection"></div>');
	upload.append('<div id="cropField" />');
	button.parent().after('<div id="profilePicSection"></div>');
	
	loadCropper();
}

loadCurrentPictures = function(){
	var allPictures = $('#currentPicture');
	var fd = new FormData();
	var storyname = $('.storyInformationDiv').attr('data-story');
	allPictures.each(function(){
		var that = $(this);
		var fd = new FormData();
		fd.append('function', 'getCurrentPicture');
		fd.append('storyName', storyname);
		var changePictureAttr;
		if($(this).hasClass('currentUserPicture')){
			changePictureAttr = 'currentUserPicture';
		}else if($(this).hasClass('currentStoryPicture')){
			changePictureAttr = 'currentStoryPicture';
		}else if($(this).hasClass('currentPagePicture')){
			changePictureAttr = 'currentPagePicture';
		}
		fd.append('pictureType', changePictureAttr);
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
				var picPath = '';
				if(changePictureAttr === 'currentUserPicture'){
					picPath = '/Storytelling/public/images/profile';
				}else if(changePictureAttr === 'currentStoryPicture'){
					picPath = '/Storytelling/public/images/story';
				}else if(changePictureAttr === 'currentPagePicture'){
					picPath = '/Storytelling/public/images/page';
				}
				that.attr('src', picPath+'/'+data);
			}
			console.log( data );
		});

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
	loadCurrentPictures();
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
