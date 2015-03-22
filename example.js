var path = require('path');
var Controller = require('./lib/controller');

var config = {
  root: path.join(__dirname, '.tmp'),
  watch: ['index.html', 'scripts/**/*.js'],
  src: [
    {
      files: ['index.html'],
      // transform: 'function or list of functions',
      // beforeTransform: 'function',
      // afterTransform: 'function',
      // extension: 'after transform, not required'
    }
  ]
}


new Controller(config, 'serve');
