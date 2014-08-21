module.exports = function(config) {
  var extend  = require("extend");
  var fs      = require("fs");
  var assets  = ( JSON.parse( fs.readFileSync("assets.json", "utf8") ) );
  var jsFiles = require('./grunt-tasks/js-files.js')( assets.javascripts, extend );


  var filesToTest = jsFiles.tests;
  var files = [];

  function loopArray( item ) {
    for (var i = 0; i < item.length; i++) {
      files.push( item[i] );
    }
  }

  Object.keys( filesToTest ).forEach(function( key ){
    loopArray( filesToTest[key].options.vendor );
    loopArray( filesToTest[key].src );
    files.push( filesToTest[key].options.specs );
    files.push( filesToTest[key].options.helpers );
  });

  config.set({
    basePath: '',
    frameworks: ['jasmine'], // https://npmjs.org/browse/keyword/karma-adapter
    files: files,
    exclude: [],
    preprocessors: {}, //  https://npmjs.org/browse/keyword/karma-preprocessor
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    usePolling : true,
    browsers: ['PhantomJS'],
    reporters: ['beep', 'dots'],
    singleRun: false
  });
};
