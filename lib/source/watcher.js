var fs = require('fs');
var chokidar = require('chokidar');


function Watcher(watch, stopOnReady, eventCb, readyCb) {
  var self    = this;
  var watcher = chokidar.watch(watch);

  watcher.on('add', function(path) {
    eventCb('add', path);
  });

  watcher.on('change', function(path) {
    eventCb('change', path);
  });

  watcher.on('unlink', function(path) {
    eventCb('unlink', path);
  });

  watcher.on('error', function(error) {
    console.log('Watch error:', error);
  });

  watcher.on('ready', function() {
    if (stopOnReady) {
      watcher.close();
    }

    readyCb();
  });
}


module.exports = Watcher;
