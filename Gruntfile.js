module.exports = function(grunt) {
  var extend       = require( 'extend' );
  var args         = process.argv;
  var isDev        = args.indexOf('dev') > -1;

  var assets       = grunt.file.readJSON('assets.json');
  var jsFiles      = require('./grunt-tasks/js-files.js')( assets.javascripts, extend, isDev );
  var cssFiles     = require('./grunt-tasks/css-files.js')( assets.stylesheets, extend, isDev );
  var assetsToCopy = require('./grunt-tasks/copy.js')( assets.copy, extend, isDev );
  var package_json = grunt.file.readJSON('package.json');

  require('time-grunt')(grunt);

  require('jit-grunt')(grunt, {
    sprite : 'grunt-spritesmith',
    jasmine: 'grunt-contrib-jasmine'
  });

  grunt.initConfig({
    jshint : require('./grunt-tasks/jshint')( jsFiles ),
    jst    : require('./grunt-tasks/jst')(),
    copy   : assetsToCopy.copy,

    karma  : require('./grunt-tasks/karma')(),
    jasmine: jsFiles.tests,

    concat : jsFiles.concat,
    uglify : jsFiles.uglify,
    sass   : cssFiles.sass,
    sprite : cssFiles.sprites,

    watch  : require('./grunt-tasks/watch-task')( jsFiles.watch, cssFiles.watch ),

    clean  : {
      build: [ "src/stylesheets/sprites/", "dist/*" ]
    },
  });

  grunt.registerTask('js', [ 'jst', 'jshint', 'concat' ]);
  grunt.registerTask('assets', [ 'copy' ]);
  grunt.registerTask('css', [ 'sass' ]);
  grunt.registerTask('default', [ 'clean', 'assets', 'sprite', 'css', 'js', 'uglify' ]);
  grunt.registerTask('dev', [ 'default', 'watch' ]);
};