var init;
var tracks;
var getTracks;

init = function(){
   tracks = [];
   //firstnode +
    var optionButtons = $('.pageOption');
    $('.pageOptions').bind('DOMNodeInserted', function() {
        $('.pageOption').off('click').click(function(){
        tracks.push($(this).attr('data-pageId'));
        });
    });
}


$(document).ready(function(){
    init();
});
