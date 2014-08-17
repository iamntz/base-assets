module.exports = function(){
  var groups = Array.prototype.slice.call(arguments);

  var watchable = {
    options: {
      livereload   : true
    },

    templates: {
      files: [ 'src/javascripts/{%= name %}/app/Templates/**/*.html' ],
      tasks : ['jst']
    },

    common_js : {
      files : [
        'src/javascripts/common/*'
      ],
      tasks : 'js'
    },

    common_css: {
      files : [
        'src/stylesheets/utils/*',
        'src/stylesheets/utils/**/*'
      ],
      tasks : 'css'
    },

    sprites: {
      files : [
        'src/images/sprites/*',
        'src/images/sprites/**/*'
      ],
      tasks : [ 'sprite' ]
    },

    assets : {
      files: [
        'src/images/*',
        'src/images/**/*',
        'src/fonts/**/*'
      ],
      tasks: [ 'copy' ]
    }
  };

  groups.forEach(function( group ){
    var tasks = Object.keys( group );
    tasks.forEach(function(task){
      watchable[task] = group[task];
    });
  });

  return watchable;
};