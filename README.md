#### Tools that needs to be installed once
1. Install [NodeJS](http://nodejs.org/);
2. Install [Ruby](https://www.ruby-lang.org/en/downloads/). Windows users can download latest version from [rubyinstaller site](http://rubyinstaller.org/downloads/);
3. Install [Python 2.x](http://www.python.org/download/releases/2.7.6/) (for sprites generators);
4. Install [ImageMagick](http://www.imagemagick.org/script/binary-releases.php);
5. Install latest [SASS](http://sass-lang.com) by running `gem install sass` in console;
6. (optional) Install [CSSCSS](http://zmoazeni.github.io/csscss/)
7. Install [Grunt](http://gruntjs.com/) by running `npm install -g grunt-cli`
8. Install [Bower](http://bower.io) by running `npm install -g bower`

#### Commands that needs to be run for the first time on every project
1. `npm update --save-dev` to get latest version of all Grunt plugins;
2. `npm install`. If you have both Python 3.x and Python 2.x installed you need to run `npm install --python=c:\python27` (you need to change the path accordingly);
3. `bower install` to install any dependencies
4. That's it.


#### List All Available Commands
`grunt` will run all tasks. For development, you should run `grunt dev` which is (mostly) an alias for `grunt` and `grunt watch`. Main difference is that `grunt dev` will generate sourcemaps for sass and javascripts, while simple `grunt` or `grunt watch` won't. For a completely list of tasks, please run `grunt --help`
