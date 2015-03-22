var path = require('path');

var jade = require('./transformers/jade');
var sass = require('./transformers/sass');


function Transform(config) {
  var self = this;

  self.source = config.source;

  self.exts = {
    sass: sass,
    scss: sass,
    jade: jade
  }
}


Transform.prototype.start = function(_path, options, cb) {
  var self = this;

  self.source.read(_path, function(buffer) {
    self.before(_path, buffer, options, function(respPath1, content, options) {
      self.transform(respPath1, content, options, function(respPath2, content, options) {
        self.after(respPath2, content, options, function(respPath3, content, options) {
          cb(respPath3, content);
        });
      });
    });
  });


};


Transform.prototype.before = function(_path, content, options, cb) {
  if (!options.beforeTransform) {
    return cb(_path, content, options);
  }

  cb();
};


Transform.prototype.transform = function(_path, content, options, cb) {
  var self = this;

  if (options.transform) {
    return options.transform(_path, content, self.source, function(_path, content) {
      cb(_path, content, options);
    });
  }

  var ext = path.extname(_path).slice(1);
  var fn  = self.exts[ext];

  if (ext && fn) {
    return fn(_path, content, self.source, function(_path, content) {
      cb(_path, content, options);
    });
  }

  return cb(_path, content, options);
};


Transform.prototype.after = function(_path, content, options, cb) {
  if (!options.afterTransform) {
    return cb(_path, content, options);
  }

  cb();
};


module.exports = Transform;

