module.exports = function( files, extend, isDev ){

  var returnOptions = {
    sprites  : [],
    watch : []
  };


  function cssVarMap( options, group_name, sprite ) {
    sprite.sprite_name = sprite.name;
    if( options.hasHover &&  sprite.sprite_name.indexOf( '-hover' ) > -1  ){
      sprite.sprite_name = sprite.sprite_name.replace('-hover', '');

      if( typeof options.hasHover == 'string' ){
        sprite.skip_if_has_hover_on_parent = true;
        sprite.sprite_name = options.hasHover + ':hover .' + group_name + '.' + sprite.sprite_name;
      }else {
        sprite.sprite_name += ':hover';
      }
    }
  }


  function get_sprites_config( group_name, options ) {
    options = options || {};

    return extend({
      algorithm  : 'binary-tree',
      padding    : 10,
      engine     : 'auto',
      cssTemplate: 'helpers/spritesmith.sass.template.mustache',

      engineOpts : {
        'imagemagick': true
      },

      src        : [ 'src/images/sprites/' + group_name + '/*.png' ],
      destImg    : 'dist/images/' + group_name + '.png',
      imgPath    : '../images/' + group_name + '.png',
      destCSS    : 'src/stylesheets/sprites/_' + group_name + '.scss',

      cssVarMap : function( sprite ){
        return cssVarMap( options, group_name, sprite );
      },

      cssOpts : {
        "baseClass" : '' + group_name + '',
        "hasHover?" : options.hasHover,
        "functions" : true
      }
    }, options);
  }


  returnOptions.sprites = {
    // widgets : get_sprites_config( 'widgets_spr', {
    //   hasHover : 'a'
    // } ),
    spr : get_sprites_config( 'spr', {
      hasHover : 'a'
    } ),
  };

  Object.keys( returnOptions.sprites ).forEach( function(sprite){
    returnOptions.watch.push( returnOptions.sprites[sprite].src );
  });

  return returnOptions;
};