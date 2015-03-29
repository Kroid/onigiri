var chokidar = require('chokidar');


/**
 * @params {object}:
 *
 * @params.watch       {array|string}
 * @params.listener    {object with functions: onAdd, onChange, onUnlink, onReady}
 */
function Watcher(params) {
  var self = this;

  self.listener = params.listener;
  self.watcher  = chokidar.watch(params.watch);

  self.watcher
  .on('add', function(path) {
    self.listener.onAdd(path);
  })
  .on('change', function(path) {
    self.listener.onChange(path);
  })
  .on('unlink', function(path) {
    self.listener.onUnlink(path);
  })
  .on('ready', function() {
    self.listener.onReady();
  });
}


Watcher.prototype.add = function(watch) {
  this.watcher.add(watch);
};


module.exports = Watcher;
