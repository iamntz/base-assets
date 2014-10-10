module.exports = function( jsFiles ){
  return {
    files: jsFiles.lint,
    options: {
      reporter: require('jshint-stylish'),
      globals: {
        jQuery  : true,
        console : true,
        module  : true,
        document: true
      },
      laxcomma: true,
      laxbreak: true,
      sub     : true
    }
  };
};