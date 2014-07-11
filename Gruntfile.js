module.exports = function(grunt) {
  var extend = require( 'extend' );
  var args = process.argv;

  require('time-grunt')(grunt);

  require('jit-grunt')(grunt, {
    sprite: 'grunt-spritesmith'
  });

  var jsFilesToLint = [ 'Gruntfile.js' ];
  var filesToWatch  = {};
  var package_json  = grunt.file.readJSON('package.json');
  var assets        = grunt.file.readJSON('assets.json');
  var javascripts   = assets.javascripts;
  var jsKeys        = Object.keys( javascripts );
  var uglifyFiles   = [];
  var concatFiles   = [];

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

      uglifyFiles[taskName + 'dev'] = {
        src : task.src,
        dest: dest + '.dev.js',
        options : {
          sourceMap: function( path ){ return path + 'map'; }
        }
      };
    }

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
    var dest    = task.dest || 'dist/stylesheets/' + taskName;

    if( !task.src ){ return; }

    sassFiles[taskName] = {
      src : task.src,
      dest: dest + '.min.css',
      options: {
        style    : 'compressed'
      }
    };

    sassFiles[taskName + 'dev'] = {
      src : task.src,
      dest: dest + '.dev.css',
      options: {
        style    : 'expanded',
        sourcemap: true
      }
    };

    if( !options.skipWatch ){
      filesToWatch[taskName] = {
        files : task.src,
        tasks : [ 'css' ]
      };
    }
  });


  function get_sprites_config( sprite_group_name, options ) {
    options = options || {};

    return extend({
      algorithm  : 'binary-tree',
      padding    : 10,
      engine     : 'auto',
      cssTemplate: 'helpers/spritesmith.sass.template.mustache',

      engineOpts : {
        'imagemagick': true
      },

      src        : [ 'src/images/sprites/' + sprite_group_name + '/*.png' ],
      destImg    : 'dist/images/' + sprite_group_name + '.png',
      imgPath    : '../images/' + sprite_group_name + '.png',
      destCSS    : 'src/stylesheets/sprites/_' + sprite_group_name + '.scss',

      cssVarMap : function(sprite){
        sprite.sprite_name = sprite.name;
        if( options.hasHover &&  sprite.sprite_name.indexOf( '-hover' ) > -1  ){
          sprite.sprite_name = sprite.sprite_name.replace('-hover', '');

          if( typeof options.hasHover == 'string' ){
            sprite.skip_if_has_hover_on_parent = true;
            sprite.sprite_name = options.hasHover + ':hover .' + sprite_group_name + '.' + sprite.sprite_name;
          }else {
            sprite.sprite_name += ':hover';
          }
        }
      },

      cssOpts : {
        "baseClass" : '' + sprite_group_name + '',
        "hasHover?" : options.hasHover,
        "functions" : true
      }
    }, options);
  }//get_sprites_config


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


    uglify: extend( uglifyFiles),

    concat: extend( concatFiles, {
      options : {
      },
    }),


    sass: extend( sassFiles ),


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
      widgets: get_sprites_config( 'widgets_spr', {
        hasHover : 'a'
      } ),
      spr    : get_sprites_config( 'spr' ),
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

  grunt.registerTask('js', [ 'jshint', 'uglify', 'concat' ] );
  grunt.registerTask('css', [ 'sprite', 'sass' ]);
  grunt.registerTask('assets', [ 'copy' ]);

  grunt.registerTask('default', [ 'clean', 'js', 'css', 'assets' ]);
  grunt.registerTask('dev', [ 'default', 'watch' ]);
};