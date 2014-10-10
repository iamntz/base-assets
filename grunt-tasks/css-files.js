module.exports = function( files, extend, isDev  ){
  var settings = require( './helpers/file-settings' )( files, extend, isDev  );
  var Sprites = require( './helpers/sprites' )( files, extend, isDev );

  var returnOptions = {
    watch  : [],
    sass   : [],
    sprites: []
  };

  function getSassTask( task ) {
    return {
      src : task.src,
      dest: task.dest,
      options: {
        style : isDev ? 'expanded' : 'compressed'
      }
    };
  }

  function setSprites( sprites, task ) {
    Object.keys( sprites ).forEach( function( group_name ){
      var spritesConfig = new Sprites( group_name, sprites[group_name] ).getConfig();
      returnOptions.sprites[group_name] = spritesConfig;

      if( !task.options.skipWatch ){
        var tasks = task.options.watch_tasks;
        returnOptions.watch[group_name] = {
          files : spritesConfig.src,
          tasks : task.options.sprites.watch_tasks
        };
      }
    });
  }

  settings.groups.forEach(function( taskName ){
    var task = settings.getTaskOptions( taskName );
    if( !task.src ){ return; }

    returnOptions.sass[taskName] = getSassTask( task );

    if( task.task.sprites ){
      task.task.sprites.forEach( function( sprite ){
        setSprites( sprite, task );
      });
    }

    if( !task.options.skipWatch ){
      returnOptions.watch[taskName] = {
        files : task.src,
        tasks : task.options.watch_tasks
      };
    }
  });

  return returnOptions;
};