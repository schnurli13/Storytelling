var form;
var submitForm;
var activateForm;

activateForm = function(){
	form = $('#fileinfo');
	form.on('submit', function(e){
		e.preventDefault();
		submitForm();
	});
}

submitForm = function(){
	console.log("submit event");
            var fd = new FormData(document.getElementById('fileinfo'));
            fd.append('function', 'handleForm');
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
	activateForm();
});
