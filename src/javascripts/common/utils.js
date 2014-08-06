var isTouchDevice = ( "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch );

Array.max = function( array ){return Math.max.apply( Math, array );};
Array.min = function( array ){return Math.min.apply( Math, array );};