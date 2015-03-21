var fs      = require('fs');
var _       = require('underscore');
var Watcher = require('./watcher');


function Source(watch, stopOnReady, eventCb) {
  var self    = this;


  self.fs = {
    // 'path/to/file': {
    //   ready: true,
    //   content: 'Buffer'
    // }
  };

  self.eventsQueue = [];
  self.ready = false;


  var watcher = new Watcher(
    watch,
    stopOnReady,
    function(event, path) {
      switch (event) {
        case 'add':
          self.readFile(path, function(){
            if (!self.ready) {
              self.eventsQueue.push({event: event, path: path});
            }
          });
          break;

        case 'change':
          self.readFile(path, function(){
            if (!self.ready) {
              self.eventsQueue.push({event: event, path: path});
            }
          });
          break;

        case 'unlink':
          delete self.fs[path];
          if (!self.ready) {
            self.eventsQueue.push({event: event, path: path});
          }
          break;
      }

      if (self.ready) {
        eventCb(event, path);
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
        eventCb(ele.event, ele.path);
      });

      return;
    }

    setTimeout(function() {
      ready();
    }, 100);
  }
}



Source.prototype.readFile = function(path, cb) {
  var self = this;

  if (!self.fs[path]) {
    self.fs[path] = {};
  }

  self.fs[path].ready = false;

  fs.readFile(path, function(err, content) {
    if (err) {
      console.log('Error on read file:', err);
      delete self.fs[path];
      return;
    }

    self.fs[path].content = content;
    self.fs[path].ready = true;

    cb(content);
  });
}



Source.prototype.get = function(path, cb) {
  if (this.fs[path]) {
    return cb(null, this.fs[path].content);
  }

  this.readFile(path, cb);
}


module.exports = Source;
