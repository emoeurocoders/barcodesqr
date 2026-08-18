jQuery(document).ready(function($) {
    //mobile menu toggle
    // menu toggle 
    $('.nav-hamburger').on('touchstart click', function(e) {
        if (event.handled === false) return
        e.preventDefault();
        e.stopPropagation();
        event.handled = true;
        $('body').toggleClass('menuOpen');
    });
   
});