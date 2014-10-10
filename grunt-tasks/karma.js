module.exports = function(){
  return {
    options: {
      configFile: 'karma-config.js'
    },

    dev: {
      browsers: ['PhantomJS'],
      reporters: ['beep', 'dots']
    }
  };
};