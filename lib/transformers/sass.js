var sass = require('node-sass');
var replaceExtname = require('./../helpers/replace-extname');

/**
 * @param {string} sourcePath
 *
 * @param {Object}   options
 * @param {Function} options.source - Async loader content from source fs
 * @param {Function} options.result - Sync loader content from result fs
 *
 * @param {transformCallback} cb
 */
function transformer(sourcePath, options, cb) {
  options.source(sourcePath, function(err, buffer) {
    if (err) {
      return cb(err, null);
    }

    var params = {
      data: String(buffer),
      importer: importer
    };

    sass.render(params, result);
  });

  function importer(url, prev, done) {
    options.source(url, function(err, buffer) {
      if (err) {
        return cb(err, null);
      }

      done({contents: String(buffer)})
    });
  }

  function result(err, res) {
    cb(err, {
      path: replaceExtname(sourcePath, 'css'),
      content: String(res.css)
    });
  }
}

module.exports = transformer;
