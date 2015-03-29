var fs      = require('fs');
var path    = require('path');
var isAbs   = require('path-is-absolute');
var glob    = require('./helpers/multi-globs');
var join    = require('./helpers/join');
var Watcher = require('./watcher');



function abs(_path, root) {
  return isAbs(_path) ? _path : join(root, _path);
}

function rel(_path, root) {
  return isAbs(_path) ? path.relative(root, _path) : _path;
}


/**
 * @param {object}:
 *
 * @param.root  {string}
 * @param.globs {array|string}
 * @param.watching {boolean}
 */
function Source(params) {
  var self = this;

  self.fs       = {};
  self.root     = params.root;
  self.watching = params.watching;
  self.globs    = join(params.root, params.globs);
}


Source.prototype.changeHandler = function(_path) {}
Source.prototype.removeHandler = function(_path) {}


Source.prototype.get = function(_path, cb) {
  var self = this;
  var absPath = abs(_path, self.root);
  var relPath = rel(_path, self.root);

  if (self.fs[relPath]) {
    return cb(null, self.fs[relPath]);
  }

  self.readFromDisk(absPath, function(err, buffer) {
    if (!err) {
      self.fs[relPath] = buffer;

      if (self.watching) {
        self.watcher.add(absPath);
      }
    }

    cb(err, buffer);
  });
};


Source.prototype.onChange = function(_path) {
  var self = this;
  var absPath = abs(_path, self.root);
  var relPath = rel(_path, self.root);

  self.readFromDisk(absPath, function(err, buffer) {
    if (err) {
      return console.log(err);
    }

    self.fs[relPath] = buffer;
    self.changeHandler(relPath);
  });
}


Source.prototype.onRemove = function(_path) {
  var relPath = rel(_path, this.root);
  delete this.fs[relPath];
  this.removeHandler(relPath);
};


Source.prototype.onReady = function() {
  console.log('ready');
};


Source.prototype.readFromDisk = function(absPath, cb) {
  fs.readFile(absPath, function(err, buffer) {
    if (err) {
      console.log(err);
    }

    cb(err, buffer);
  });
};


Source.prototype.start = function() {
  var self = this;

  if (self.watching) {
    self.watcher = new Watcher({
      watch: self.globs,
      listener: self
    });

    return;
  }

  glob(self.globs, function(err, files) {
    if (err) {
      return console.log(err);
    }

    files.map(function(file) {
      self.onChange(file)
    });
  });
}


module.exports = Source
