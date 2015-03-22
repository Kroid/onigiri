var fs      = require('fs');
var path    = require('path');
var _       = require('underscore');
var Watcher = require('./watcher');
var join    = require('./helpers/join');


function SourceFS(config, eventCb) {
  var self    = this;


  self.fs = {
    // '_path/to/file': {
    //   ready: true,
    //   content: 'Buffer'
    // }
  };

  self.eventsQueue = [];
  self.ready = false;
  self.root  = config.root;


  var watch = join(config.root, config.watch);

  var watcher = new Watcher(
    watch,
    config.stopOnReady,
    function(event, _path) {
      var sourcePath = path.relative(config.root, _path);

      switch (event) {
        case 'add':
          self.readFile(_path, function(){
            if (!self.ready) {
              self.eventsQueue.push({event: event, _path: sourcePath});
            } else {
              eventCb(event, sourcePath);
            }
          });
          break;

        case 'change':
          self.readFile(_path, function(){
            if (!self.ready) {
              self.eventsQueue.push({event: event, _path: sourcePath});
            } else {
              eventCb(event, sourcePath);
            }
          });
          break;

        case 'unlink':
          delete self.fs[sourcePath];
          if (!self.ready) {
            self.eventsQueue.push({event: event, _path: sourcePath});
          } else {
            eventCb(event, sourcePath);
          }
          break;
      }
    },
    ready
  );


  function ready() {
    var unready = _.find(self.fs, function(ele) {
      return ele.ready === false;
    });

    if (!unready) {
      self.ready = true;

      self.eventsQueue.map(function(ele) {
        eventCb(ele.event, ele._path);
      });

      return;
    }

    setTimeout(function() {
      ready();
    }, 100);
  }
}



SourceFS.prototype.readFile = function(_path, cb) {
  var self = this;

  var sourcePath = path.relative(self.root, _path);

  if (!self.fs[sourcePath]) {
    self.fs[sourcePath] = {};
  }

  self.fs[sourcePath].ready = false;

  fs.readFile(_path, function(err, content) {
    if (err) {
      console.log('Error on read file:', err);
      delete self.fs[sourcePath];
      return;
    }

    self.fs[sourcePath].content = content;
    self.fs[sourcePath].ready = true;

    cb(content);
  });
}



SourceFS.prototype.get = function(_path, cb) {
  if (this.fs[_path]) {
    return cb(null, this.fs[_path].content);
  }

  this.readFile(_path, cb);
}


module.exports = SourceFS;
