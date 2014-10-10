module.exports = function(){
  var groups = Array.prototype.slice.call(arguments);

  var watchable = {
    options: {
      livereload   : true
    },
    templates: {
      files: [ 'src/views/**/*.html' ],
      tasks : ['jst']
    },
  };

  groups.forEach(function( group ){
    var tasks = Object.keys( group );
    tasks.forEach(function(task){
      watchable[task] = group[task];
    });
  });

  return watchable;
};