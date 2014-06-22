module.exports = function(grunt) {
  var extend = require( 'extend' );
  var args = process.argv;

  var isDev = args.indexOf( 'dev' ) != -1;

  require('time-grunt')(grunt);

  require('jit-grunt')(grunt, {
    sprite: 'grunt-spritesmith'
  });

  var jsFilesToLint = [ 'Gruntfile.js' ];

  var filesToWatch = {};

  var package_json = grunt.file.readJSON('package.json');
  var assets       = grunt.file.readJSON('assets.json');

  var javascripts  = assets.javascripts;
  var jsKeys  = Object.keys( javascripts );
  var uglifyFiles = [];
  var concatFiles = [];

  jsKeys.forEach(function( taskName ){
    var task    = javascripts[taskName];
    var options = task.options || {};
    var dest    = task.dest || 'dist/javascripts/' + taskName;

    if( !task.src ){ return; }

    if( !options.skipUglify ){
      uglifyFiles[taskName] = {
        src : task.src,
        dest: dest + '.min.js'
      };
    }

    concatFiles[taskName] = {
      src : task.src,
      dest: dest + '.dev.js'
    };

    if( !options.skipLint ){
      jsFilesToLint.push( task.src );
    }

    filesToWatch[taskName] = {
      files : task.src,
      tasks : [ 'js' ]
    };
  });

  var stylesheets  = assets.stylesheets;
  var cssKeys = Object.keys( stylesheets );
  var sassFiles = [];

  cssKeys.forEach(function( taskName ){
    var task    = stylesheets[taskName];
    var options = typeof task.options !== 'undefined' ? task.options : {};
    var dest    = task.dest || 'dist/stylesheets/' + taskName + '.css';

    if( !task.src ){ return; }

    sassFiles[taskName] = {
      src : task.src,
      dest: dest
    };

    if( !options.skipWatch ){
      filesToWatch[taskName] = {
        files : task.src,
        tasks : [ 'css' ]
      };
    }
  });


  var defaultSpriteOptions = {
    algorithm  : 'binary-tree',
    padding    : 10,
    engine     : 'auto',
    cssTemplate: 'helpers/spritesmith.sass.template.mustache',
    engineOpts : {
      'imagemagick': true
    }
  };


  grunt.initConfig({
    pkg: package_json,


    jshint: {
      files: jsFilesToLint,
      options: {
        reporter: require('jshint-stylish'),
        globals: {
          jQuery   : true,
          console : true,
          module  : true,
          document: true
        },
        laxcomma: true,
        laxbreak: true,
        sub     : true
      }
    },


    uglify: extend( uglifyFiles, {
      options : {
        sourceMap: !isDev ? false : function( path ){ return path + 'map'; }
      },
    }),

    concat: extend( concatFiles, {
      options : {
      },
    }),


    sass: extend( sassFiles, {
      options: {
        style    : isDev ? 'expanded' : 'compressed',
        sourcemap: isDev,
        // compass  : true
      }
    }),


    copy : {
      assets: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: [
              'images/*',
              'images/**/*',
              'fonts/**/*'
            ],
            dest: 'dist/'
          }
        ]
      }
    },


    sprite:{
      spr: extend( defaultSpriteOptions, {
        src        : [ 'src/images/sprites/spr/*.png' ],
        destImg    : 'dist/images/spr.png',
        imgPath    : '../images/spr.png',
        destCSS    : 'src/stylesheets/sprites/_spr.scss',

        cssOpts : {
          "baseClass" : "spr",
          "functions" : true
        },
      })
    },


    clean: {
      build: [ "src/stylesheets/sprites/", "dist"]
    },


    watch: extend( filesToWatch, {
      options: {
        nospawn       : true,
        livereload   : true
      },

      assets : {
        files: [
          'src/images/*',
          'src/images/**/*',
          'src/fonts/**/*'
        ],
        tasks: [ 'copy' ]
      }
    })
  });

  grunt.registerTask('js', [ 'jshint', ( isDev ? 'concat' : 'uglify' ) ] );
  grunt.registerTask('css', [ 'sprite', 'sass' ]);
  grunt.registerTask('assets', [ 'copy' ]);

  grunt.registerTask('default', [ 'clean', 'js', 'css', 'assets' ]);
  grunt.registerTask('dev', [ 'default', 'watch' ]);
};