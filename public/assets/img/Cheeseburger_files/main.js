// Loads more posts when user scrolls to the end of the page
(function($) {
  $(document).ready(function(){
    $('#page').scroll( function() {
      
      // Trigger the loadMoreContent if the user has scrolled to within 3x the height of the window. 
      // This should account for repsonsiveness as the trigger point is relative to the screen height. 
      if($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - ($(window).height() * 3 )) ) {
        
        // Only get more posts if the its not already loading. 
        if (!$("nav.load-more").hasClass("disabled")) {          
          var scope = angular.element($("nav.load-more")).scope();

          if (scope != undefined) {
            scope.$apply(function () {
              scope.vm.loadMoreContent();
            });
          }
        }
      }
    });

  });
})(jQuery)