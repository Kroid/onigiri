var fs      = require('fs');
var path    = require('path');
var isAbs   = require('path-is-absolute');
var glob    = require('./helpers/multi-globs');
var join    = require('./helpers/join');
var Watcher = require('./watcher');


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


Source.prototype.addHandler = function(_path) {}
Source.prototype.changeHandler = function(_path) {}
Source.prototype.removeHandler = function(_path) {}


Source.prototype.get = function(_path, cb) {
  var absPath, relPath;
  var self = this;

  if (isAbs(_path)) {
    absPath = _path;
    relPath = path.relative(self.root, _path);
  } else {
    absPath = join(self.root, _path);
    relPath = _path;
  }

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


Source.prototype.onAdd = function(_path) {
  var self = this;
  var relPath;

  if (isAbs(_path)) {
    relPath = path.relative(self.root, _path);
  } else {
    relPath = _path;
  }

  this.get(_path, function(err, buffer) {
    if (err) {
      return console.log(err);
    }

    self.addHandler(relPath);
  });
};


Source.prototype.onChange = function(_path) {
  var absPath, relPath;
  var self = this;

  if (isAbs(_path)) {
    absPath = _path;
    relPath = path.relative(self.root, _path);
  } else {
    absPath = join(self.root, _path);
    relPath = _path;
  }

  self.readFromDisk(absPath, function(err, buffer) {
    if (err) {
      return console.log(err);
    }

    self.fs[relPath] = buffer;
    self.changeHandler(relPath);
  });
}


Source.prototype.onUnlink = function(_path) {
  delete this.fs[_path];
  this.removeHandler(_path);
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
      self.onAdd(file)
    });
  });
}


module.exports = Source
