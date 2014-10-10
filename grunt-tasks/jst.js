module.exports = function(){
  return {
    {%= name%}: {
      options: {
        namespace: "{%= name%}Views",
        prettify: true,
        processName: function(src) {
          return src.replace( /(src\/views\/)|(.html)/ig, '');
        }
      },
      files: {
        "dist/javascripts/templates.js": ["src/views/**/*.html"]
      }
    }
  };
};