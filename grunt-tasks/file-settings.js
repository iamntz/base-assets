module.exports = function( files ){
  var extend = require( 'extend' );

  function FileSettings( files ) {
    this.files = files;
    this.defaultOptions = this.files.defaults;
    delete this.files.defaults;
    this.groups = Object.keys( this.files );
  }

  FileSettings.prototype = {
    getTaskOptions : function( taskName ){
      var task = this.files[taskName];
      var options = extend( ( task.options || {} ), this.defaultOptions );
      var dest = task.dest || options.dest.replace( "{{task_key}}", taskName );

      return {
        task : task,
        options: options,
        dest: dest,
        src : task.src
      };
    }
  };

  return new FileSettings( files );
};