var initializeEditHandler;
var handleReinitializeEditHandler;

var activateCloseButton;
var loadStandardValue;

var changePictureButton;
var changePictureActivation;
var loadPictureChangeElements;
var deletePictureChangeElements;

var loadCurrentPictures;

var loadAndUpdatePics;
var setAsProfilePic;
var deleteProfilePic;

var getCurrentUser;

var loadCropper;

changePictureActivation = function(){
	changePictureButton = $('.changePictureButton');
	var changePictureAttr;
	var correctPath;
	if(changePictureButton.hasClass('userPicture')){
		changePictureAttr = 'currentUserPicture';
		correctPath = 'profile';
	}else if(changePictureButton.hasClass('storyPicture')){
		changePictureAttr = 'currentStoryPicture';
		correctPath = 'story';
	}else if(changePictureButton.hasClass('pagePicture')){
		changePictureAttr = 'currentPagePicture';
		correctPath = 'page';
	}
	changePictureButton.on('click', function(){
	
		var correctPath;
		var changePictureAttr;
		if($(this).hasClass('userPicture')){
			changePictureAttr = 'currentUserPicture';
			correctPath = 'profile';
		}else if($(this).hasClass('storyPicture')){
			changePictureAttr = 'currentStoryPicture';
			correctPath = 'story';
		}else if($(this).hasClass('pagePicture')){
			changePictureAttr = 'currentPagePicture';
			correctPath = 'page';
		}
	
		if(!$(this).hasClass('open')){
			$(this).attr('value', 'CLOSE SELECTION');
			loadPictureChangeElements($(this), changePictureAttr, correctPath);
			$(this).addClass('open');
			loadAndUpdatePics($(this), changePictureAttr, correctPath);
		}else{
			$(this).attr('value', 'SELECT PICTURE');
			deletePictureChangeElements($(this), correctPath);
			$(this).removeClass('open');
		}
	})
}

loadAndUpdatePics = function(segment, picAttr, correctPath){
	var fd = new FormData();
	var storyname = $('.storyInformationDiv').attr('data-story');
	var pagename = $('.titleEdit').val();
	fd.append('pageName', pagename);
	fd.append('function', 'getAllPictures');
	fd.append('storyName', storyname);
	fd.append('pictureType', picAttr);
	$.ajax({
		url: '/Storytelling/public/php/formFunctions.php',
		type: 'POST',
		data: fd,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	}).done(function( data ) {
		console.log('PHP Output:');
		var picSection = segment.parent().siblings('.profilePicSection');
		picSection.empty();
		var i;
		var picNumber
		var parsedArray = JSON.parse(data);
		for(i = 0; i<parsedArray.length; i++){
			picNumber = i+1;
			picSection.append('<div class="profilePicContainer"><span class="deleteThisPic">X</span><img src="/Storytelling/public/images/'+correctPath+'/'+parsedArray[i]+'" class="profilePic" alt="pic'+picNumber+'"></div>');
		}
		$('.profilePic').on('click', function(){
			setAsProfilePic($(this), segment, picAttr, correctPath);
		})
		$('.deleteThisPic').on('click', function(){
			deleteProfilePic($(this), segment, picAttr, correctPath);
		})
		console.log( data );
	});
	return false;
}

deleteProfilePic = function(deleteButton, segment, picAttr, correctPath){
	console.log(deleteButton.parent().children('img').attr('alt'));
	var fd = new FormData();
	fd.append('function', 'deletePic');
	fd.append('path', deleteButton.parent().children('img').attr('src'));
	var storyname = $('.storyInformationDiv').attr('data-story');
	var pagename = $('.titleEdit').val();
	fd.append('pageName', pagename);
	fd.append('storyName', storyname);
	fd.append('pictureType', picAttr);
	$.ajax({
		url: '/Storytelling/public/php/formFunctions.php',
		type: 'POST',
		data: fd,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	}).done(function( data ) {
	loadAndUpdatePics(segment, picAttr, correctPath);
	console.log( data );
	});

	
}

setAsProfilePic = function(picture, segment, picAttr, correctPath){
	console.log(picture.attr('alt'));
	
	var fd = new FormData();
	fd.append('function', 'setAsNewProfilePic');
	fd.append('path', picture.attr('src'));
	var pagename = $('.titleEdit').val();
	fd.append('pageName', pagename);
	var storyname = $('.storyInformationDiv').attr('data-story');
	fd.append('storyName', storyname);
	fd.append('pictureType', picAttr);
	$.ajax({
		url: '/Storytelling/public/php/formFunctions.php',
		type: 'POST',
		data: fd,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	}).done(function( data ) {
	loadCurrentPictures(segment, picAttr, correctPath);
	console.log( data );
	});
}

deletePictureChangeElements = function(button, correctPath){
	button.parent().siblings('.changePicSection').remove();
	button.parent().siblings('.profilePicSection').remove();
}


loadPictureChangeElements = function(button, changePictureAttr, correctPath){

	var uniqueId = 'cropField'+changePictureAttr;
	button.parent().after('<form method="POST" class="changePic" name="changePic"></form>');
	var upload = button.parent().siblings('.changePic');
	upload.wrap('<div class="changePicSection"></div>');
	upload.append('<div id="'+uniqueId+'" class="cropField"/>');
	button.parent().after('<div class="profilePicSection"></div>');
	
	loadCropper(button, changePictureAttr, correctPath, uniqueId);
}

loadCurrentPictures = function(){
	var allPictures = $('#currentPicture');
	var fd = new FormData();
	var pagename = $('.titleEdit').val();
	fd.append('pageName', pagename);
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

initializeEditHandler = function(){
	changePicLoaded = false;
	loadCurrentPictures();
	changePictureActivation();
}

loadCropper = function(button, changePictureAttr, correctPath, uniqueId){

	var cropperPath = '';
	
	if(changePictureAttr == 'currentUserPicture'){
		cropperPath = 'img_crop_to_file_user'
	}else if(changePictureAttr == 'currentStoryPicture'){
		cropperPath = 'img_crop_to_file_story'
	}else if(changePictureAttr == 'currentPagePicture'){
		cropperPath = 'img_crop_to_file_page'
	}

	var cropperOptions = {
			uploadUrl:'/Storytelling/public/plugins/croppic/img_save_to_file.php',
			cropUrl:'/Storytelling/public/plugins/croppic/'+cropperPath+'.php',
			onAfterImgCrop:	function(){ loadAndUpdatePics(button, changePictureAttr, correctPath); }
		}		
	var cropperHeader = new Croppic(uniqueId, cropperOptions);

}

$(document).ready(function(){
	var fancybox = $('.fancybox');
	if(fancybox.length > 0){
		fancybox.fancybox({
			beforeShow: function(current, previous){
				initializeEditHandler();
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
	initializeEditHandler();
});
