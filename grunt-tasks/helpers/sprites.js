module.exports = function( files, extend, isDev ){
  var returnOptions = {
    sprites: [],
    watch  : []
  };

  function Sprites( group_name, options ) {
    this.group_name = group_name;
    this.options = extend({
      hasHover : false,
      baseClass : null
    }, ( options || {} ) );
  }

  Sprites.prototype.varMap = function( sprite ) {
    var self = this;

    sprite.sprite_name = sprite.name;

    if( self.options.hasHover &&  sprite.sprite_name.indexOf( '-hover' ) > -1  ){
      sprite.sprite_name = sprite.sprite_name.replace('-hover', '');

      if( typeof self.options.hasHover == 'string' ){
        sprite.skip_if_has_hover_on_parent = true;
        sprite.sprite_name = self.options.hasHover + ':hover .' + self.group_name + '.' + sprite.sprite_name;
      }else {
        sprite.sprite_name += ':hover';
      }
    }
  };

  Sprites.prototype.getConfig = function() {
    var self = this;

    return extend( {
      algorithm  : 'binary-tree',
      padding    : 10,
      engine     : 'auto',
      cssTemplate: 'grunt-tasks/helpers/spritesmith.sass.template.mustache',

      engineOpts : {
        'imagemagick': true
      },

      src        : [ 'src/images/sprites/' + self.group_name + '/*.png' ],
      destImg    : 'dist/images/' + self.group_name + '.png',
      imgPath    : '../images/' + self.group_name + '.png',
      destCSS    : 'src/stylesheets/sprites/_' + self.group_name + '.scss',

      cssVarMap : function( sprite ){
        return self.varMap( self.options, self.group_name, sprite );
      },

      cssOpts : {
        "baseClass" : self.options.baseClass ? self.options.baseClass : self.group_name,
        "hasHover?" : self.options.hasHover,
        "functions" : true
      }
    }, self.options );
  };

  // returnOptions.sprites = {
  //   // widgets : get_sprites_config( 'widgets_spr', {
  //   //   hasHover : 'a'
  //   // } ),
  //   spr : get_sprites_config( 'spr', {
  //     hasHover : 'a'
  //   } ),
  // };

  return Sprites;
  // Object.keys( returnOptions.sprites ).forEach( function(sprite){
  //   returnOptions.watch.push( returnOptions.sprites[sprite].src );
  // });

  // return returnOptions;
};