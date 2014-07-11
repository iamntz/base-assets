jQuery(document).ready(function($){

  var doc = $(document);
  $(window).on('resize', function(){
    window.requestAnimationFrame( function(){
      doc.trigger('resize-raf');
    } );
  }).trigger('resize');

});