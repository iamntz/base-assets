module.exports = function( files, isDev ){
  var extend = require( 'extend' );
  var settings = require( './file-settings' )( files );

  var returnOptions = {
    watch : [],
    sass: []
  };

  settings.groups.forEach(function( taskName ){
    var task = settings.getTaskOptions( taskName );
    if( !task.src ){ return; }

    returnOptions.sass[taskName] = {
      src : task.src,
      dest: task.dest,
      options: {
        style    : isDev ? 'expanded' : 'compressed',
        sourcemap: isDev
      }
    };

    if( !task.options.skipWatch ){
      returnOptions.watch[taskName] = {
        files : task.src,
        tasks : task.options.watch_tasks
      };
    }
  });


  return returnOptions;
};