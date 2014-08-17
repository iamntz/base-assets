module.exports = function( files ){
  var extend = require( 'extend' );

  var returnOptions = {
    lint  : [],
    watch : [],
    concat: [],
    uglify: [],
    tests : []
  };

  var defaults = files.defaults;
  delete files.defaults;
  var jsKeys   = Object.keys( files );

  jsKeys.forEach(function( taskName ){
    var task    = files[taskName];
    var options = task.options || {};
    options = extend( options, defaults );

    var dest    = ( task.dest || defaults.dest.replace( "{{task_key}}", taskName ) );
    if( !task.src ){ return; }


    returnOptions.concat[taskName] = {
      src: task.src,
      dest: dest,
    };

    if( !options.skipUglify ){
      returnOptions.uglify[taskName] = {
        src : dest,
        dest: dest.slice(0, -3) + '.min.js'
      };
    }

    if( !options.skipLint ){
      returnOptions.lint.push( task.src );
    }

    returnOptions.watch[taskName] = {
      files : task.src,
      tasks : options.watch_tasks
    };

    if( options.testable ){
      var testVendors = [];
      var configTestVendor = options.test_options.vendor.slice(0);

      configTestVendor.forEach(function( vendor ){
        var vendorKey = vendor.match( /\{\{(.*?)\}\}/g );

        if( vendorKey ) {
          testVendors = files[ vendorKey[0].replace( /\{|\}/g, '' ) ].src.slice(0);
        }else {
          testVendors.push( vendor );
        }
      });

      options.test_options.vendor = testVendors;

      returnOptions.tests[taskName] = {
        src: task.src,
        options: options.test_options
      };
    }

  });


  return returnOptions;
};