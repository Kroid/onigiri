var fs      = require('fs');
var path    = require('path');
var pathIsAbsolute = require('path-is-absolute');
var _       = require('underscore');
var Watcher = require('./watcher');
var join    = require('./helpers/join');


function SourceFS(config, eventCb) {
  var self    = this;

  /* path/to/file -> Buffer */
  self.fs = {};

  /* path/to/file -> everything */
  self.unreadyFs = {};
  self.unreadyEvents = [];
  self.isReady = false;

  self.root    = config.root;
  self.eventCb = eventCb;


  var watcher = new Watcher(
    join(config.root, config.watch),
    config.stopOnReady,
    function(event, _path) {
      self.onWatcherEvent(event, _path);
    },
    function() {
      self.onWatcherReady();
    }
  );

}



SourceFS.prototype.onWatcherEvent = function(event, _path) {
  var self    = this;
  var relPath = path.relative(self.root, _path);

  if (self.isReady) {

    if (event === 'add' || event === 'change') {
      self.readFromDisk(relPath, function(err, buffer) {
        if (err) {
          throw err;
        }

        self.fs[relPath] = buffer;
        self.eventCb(event, relPath);
      });
    }

    if (event === 'unlink') {
      delete self.fs[relPath];
      self.eventCb(event, relPath);
    }

  }


  if (!self.isReady) {
    self.unreadyFs[relPath] = true;
    self.unreadyEvents.push({event:event, path:relPath});

    if (event === 'add' || event === 'change') {
      self.readFromDisk(relPath, function(err, buffer) {
        if (err) {
          throw err;
        }

        self.fs[relPath] = buffer;
        delete self.unreadyFs[relPath];
      });
    }

    if (event === 'unlink') {
      delete self.fs[relPath];
      delete self.unreadyFs[relPath];
    }

  }
}



SourceFS.prototype.onWatcherReady = function() {
  var self = this;

  if (_.size(self.unreadyFs)) {
    setTimeout(function() {
      self.onWatcherReady();
    }, 100);

    return;
  }

  self.unreadyEvents.map(function(item) {
    self.eventCb(item.event, item.path);
  });

  self.unreadyEvents = [];
  self.isReady = true;
}



SourceFS.prototype.readFromDisk = function(_path, cb) {
  if (!pathIsAbsolute(_path)) {
    _path = join(this.root, _path);
  }

  fs.readFile(_path, cb);
}



SourceFS.prototype.read = function(_path, cb) {
  var self    = this;

  if (self.fs[_path]) {
    return cb(self.fs[_path]);
  }

  var absPath = path.resolve(self.root, _path);
  self.readFromDisk(absPath, function(err, buffer) {
    if (err) {
      throw err;
    }

    self.fs[_path] = buffer;

    cb(buffer);
  });
}


module.exports = SourceFS;
