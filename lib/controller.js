var _         = require('underscore');
var anymatch  = require('anymatch');
var SourceFS  = require('./source-fs');
var ResultFS  = require('./result-fs');
var Transform = require('./transform');
var Serve     = require('./serve');


/**
 * modes: serve, serve + sync, build, build + deploy
 */

function Controller(config, mode) {
  var self = this;

  self.config = config;


  var sourceParams = {
    root: config.root,
    watch: config.watch,
    stopOnReady: mode !== 'serve'
  }

  self.source = new SourceFS(sourceParams, function(event, _path) {
    var src = _.find(self.config.src, function(src) {
      return anymatch(src.files, _path)
    });

    if (!src) { return; }

    self.transform.start(_path, src, function(resPath, content) {
      self.result.update(resPath, content);
    });
  });


  var transformParams = {
    source: self.source
  };

  self.transform = new Transform(transformParams);

  self.result = new ResultFS();

  if (mode === 'serve') {
    var serveParams = {
      fs: self.result.fs
    }

    self.serve = new Serve(serveParams);
  }
}


Controller.prototype.beforeTransform = function(_path) {

};


Controller.prototype.transform = function(event, _path, buffer) {
  var self = this;

  console.log(event, _path);
  console.log(String(buffer));

  var src = _.find(self.config.src, function(src) {
    return anymatch(src.files, _path)
  });

  if (!src) { return; }
};


Controller.prototype.afterTransform = function(_path) {

};


module.exports = Controller
