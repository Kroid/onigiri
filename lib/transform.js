var _    = require('underscore');
var path = require('path');
var jade = require('./transformers/jade');
var sass = require('./transformers/sass');

/**
 * Callback for transformer, send error, transformed filepath and content
 *
 * @callback transformCallback
 * @param {null|error} error
 * @param {Object}        resp
 * @param {string}        resp.path
 * @param {string|Buffer} resp.content
 */

/**
 * @param {Object} transformers - signature: {string} extname -> {Function} transformer
 */
function Transform(transformers) {
  this.transformers = {
    jade: jade,
    sass: sass,
    scss: sass
  };

  _.extend(this.transformers, transformers || {});
}

/**
 * Transform content by path from source to result
 *
 * @param {string} sourcePath
 *
 * @param {Object}   options
 * @param {Function} options.transformer - Custom function for transform file
 * @param {Function} options.source - Async loader content from source fs
 * @param {Function} options.result - Sync loader content from result fs
 *
 * @param {transformCallback} cb
 */
Transform.prototype.transform = function(sourcePath, options, cb) {
  var transformer = options.transformer;

  if (!transformer) {
    transformer = this.getTransformer(sourcePath);
  }

  if (!transformer) {
    return options.source(sourcePath, function(err, buffer) {
      cb(err, {path: sourcePath, content: buffer});
    });
  }

  transformer(sourcePath, {source: options.source, result: options.result}, cb);
};

Transform.prototype.getTransformer = function(filepath) {
  var extname = path.extname(filepath).slice(1);
  return this.transformers[extname];
};


module.exports = Transform;
