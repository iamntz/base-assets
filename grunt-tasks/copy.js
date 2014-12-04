module.exports = function( files, extend, isDev  ){
  var returnOptions = {
    copy : {
      assets: {
        files: files
      }
    },
    watch : []
  };


  files.forEach( function(file_group, i){
    var files = [];
    for (var i = 0; i < file_group.src.length; i++) {
      files.push( file_group.cwd + '/' + file_group.src[i] );
    }

    returnOptions.watch[i] = {
      files : files,
      tasks : 'copy'
    };
  });

  return returnOptions;
};
