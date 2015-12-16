var form;
var submitForm;
var activateSubmit;

var changePictureButton;
var changePictureActivation;
var changePictureFunction;

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
	});
	return false;	
}

changePictureActivation = function(){
	changePictureButton = $('#changePictureButton');
	changePictureButton.on('click', function(){
		changePictureFunction($(this));
		activateSubmit();
	})
}

changePictureFunction = function(button){
	button.after('<form method="POST" id="changePic" name="changePic"></form>');
	var upload = $('#changePic');
	upload.append('<label>Select a file:</label><br>');
	upload.append('<input type="file" name="file" required />');
	upload.append('<input type="submit" value="Change Picture" />');
}

$(document).ready(function(){
	activateSubmit();
	changePictureActivation();
});
