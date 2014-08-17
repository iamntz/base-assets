module.exports = function( files, extend, isDev ){

  var returnOptions = {
    sprites  : [],
    watch : []
  };

  function cssVarMap( sprite, options ) {
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
  }//cssVarMap


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

      // cssVarMap : cssVarMap,

      cssOpts : {
        "baseClass" : '' + sprite_group_name + '',
        "hasHover?" : options.hasHover,
        "functions" : true
      }
    }, options);
  }//get_sprites_config


  returnOptions.sprites = {
    // widgets : get_sprites_config( 'widgets_spr', {
    //   hasHover : 'a'
    // } ),
    spr : get_sprites_config( 'spr' ),
  };

  Object.keys( returnOptions.sprites ).forEach( function(sprite){
    returnOptions.watch.push( returnOptions.sprites[sprite].src );
  });

  return returnOptions;
};