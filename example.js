var path = require('path');
var sass = require('node-sass');
var Controller = require('./lib/controller');

var config = {
  root: path.join(__dirname, '.tmp'),
  watch: ['**/*'],
  src: [
    {
      files: ['index.html'],
      // transform: 'function or list of functions',
      // beforeTransform: 'function',
      // afterTransform: 'function',
      // extension: 'after transform, not required'
    },
    {
      files: '**/*.js'
    },
    {
      files: 'styles/app.scss',
      transform: function(_path, buffer, source, cb) {
        sass.render({
          data: String(buffer),
          importer: function(url, prev, done) {
            source.get(url, function(_path, buffer) {
              done({contents: String(buffer)})
            });
          }
        }, function(err, res) {
          cb(_path, res.css);
        })

      }
    }
  ]
}


new Controller(config, 'serve');
