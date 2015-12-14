//////////////////////////////////////////////////////////////////
///////////////////////CHANGE PICTURE/////////////////////////////
//////////////////////////////////////////////////////////////////
var changePicForm;
var submitChangePic;
var activatesubmitChangePic;

activatesubmitChangePic = function(){
	changePicForm = $('#changePic');
	changePicForm.on('submit', function(e){
		e.preventDefault();
		submitChangePic();
	});
}

submitChangePic = function(){
	console.log("submit event");
            var fd = new FormData(document.getElementById('changePic'));
            fd.append('function', 'handlePicture');
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

//////////////////////////////////////////////////////////////////
///////////////////////CHANGE NAME////////////////////////////////
//////////////////////////////////////////////////////////////////
var changeNameForm;
var submitChangeName;
var activatesubmitChangeName;

activatesubmitChangeName = function(){
	changeNameForm = $('#changeName');
	changeNameForm.on('submit', function(e){
		e.preventDefault();
		submitChangeName();
	});
}

submitChangeName = function(){
	console.log("submit event");
            var fd = new FormData(document.getElementById('changeName'));
            fd.append('function', 'handleName');
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

//////////////////////////////////////////////////////////////////
///////////////////////CHANGE EMAIL///////////////////////////////
//////////////////////////////////////////////////////////////////
var changeMailForm;
var submitChangeMail;
var activatesubmitChangeMail;

activatesubmitChangeMail = function(){
	changeMailForm = $('#changeEmail');
	changeMailForm.on('submit', function(e){
		e.preventDefault();
		submitChangeMail();
	});
}

submitChangeMail = function(){
	console.log("submit event");
            var fd = new FormData(document.getElementById('changeEmail'));
            fd.append('function', 'handleEmail');
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

//////////////////////////////////////////////////////////////////
///////////////////////CHANGE PASSWORD///////////////////////////////
//////////////////////////////////////////////////////////////////
var changePasswordForm;
var submitChangePassword;
var activatesubmitChangePassword;

activatesubmitChangePassword = function(){
	changePasswordForm = $('#changePassword');
	changePasswordForm.on('submit', function(e){
		e.preventDefault();
		submitChangePassword();
	});
}

submitChangePassword = function(){
	console.log("submit event");
            var fd = new FormData(document.getElementById('changePassword'));
            fd.append('function', 'handlePassword');
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
	activatesubmitChangePic();
	activatesubmitChangeName();
	activatesubmitChangeMail();
	activatesubmitChangePassword();
});
