var form;
var submitForm;
var activateSubmit;

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

$(document).ready(function(){
	activateSubmit();
});
