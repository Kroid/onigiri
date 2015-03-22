

function Transform(config) {
  var self = this;

  self.source = config.source;
}


Transform.prototype.start = function(_path, options, cb) {
  var self = this;

  self.source.get(_path, function(err, buffer) {
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

  if (!options.transform) {
    return cb(_path, content, options);
  }

  options.transform(_path, content, self.source, function(_path, content) {
    cb(_path, content, options);
  });

};


Transform.prototype.after = function(_path, content, options, cb) {
  if (!options.afterTransform) {
    return cb(_path, content, options);
  }

  cb();
};


module.exports = Transform;




// self.source.get(_path, function(err, buffer) {
//   console.log(_path);
//   console.log(String(buffer));
// });
