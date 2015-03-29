var jade = require('jade');
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

    var html = jade.render(String(buffer));
    var resultPath = replaceExtname(sourcePath, 'html');

    cb(null, {path: resultPath, content: html});
  });
}

module.exports = transformer;
