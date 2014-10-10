module.exports = function( files, extend, isDev ){
  var settings = require( './helpers/file-settings' )( files, extend, isDev  );

  var returnOptions = {
    lint  : [],
    watch : [],
    concat: [],
    uglify: [],
    tests : []
  };


  settings.groups.forEach(function( taskName ){
    var task = settings.getTaskOptions( taskName );
    if( !task.src ){ return; }


    returnOptions.concat[taskName] = {
      src: task.src,
      dest: task.dest,
    };

    if( !task.options.skipUglify ){
      returnOptions.uglify[taskName] = {
        src : task.dest,
        dest: task.dest.slice(0, -3) + '.min.js'
      };
    }

    if( !task.options.skipLint ){
      returnOptions.lint.push( task.src );
    }

    returnOptions.watch[taskName] = {
      files : task.src,
      tasks : task.options.watch_tasks
    };

    if( task.options.testable ){
      var testVendors = [];
      var configTestVendor = task.options.test_options.vendor.slice(0);

      configTestVendor.forEach(function( vendor ){
        var vendorKey = vendor.match( /\{\{(.*?)\}\}/g );

        if( vendorKey ) {
          testVendors = files[ vendorKey[0].replace( /\{|\}/g, '' ) ].src.slice(0);
        }else {
          testVendors.push( vendor );
        }
      });

      task.options.test_options.vendor = testVendors;

      returnOptions.tests[taskName] = {
        src: task.src,
        options: task.options.test_options
      };
    }

  });


  return returnOptions;
};