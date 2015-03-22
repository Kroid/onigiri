var sass = require('node-sass');
var replaceExtname = require('./../helpers/replace-extname');

module.exports = function(_path, buffer, source, cb) {
  sass.render({
    data: String(buffer),
    importer: function(url, prev, done) {
      source.read(url, function(buffer) {
        done({contents: String(buffer)})
      });
    }
  }, function(err, res) {
    cb(replaceExtname(_path, 'css'), res.css);
  });
};
