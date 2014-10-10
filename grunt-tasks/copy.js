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
    returnOptions.watch[i] = {
      files : file_group.src,
      tasks : 'copy'
    };
  });

  return returnOptions;
};