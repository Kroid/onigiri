var _         = require('underscore');
var anymatch  = require('anymatch');
var Transform = require('./transform');
var SourceResultRelation = require('./source-result-relation');
var TransformRelation = require('./transform-relation');

/**
 * @param {Object} options
 * @param {Object} options.source
 * @param {Object} options.result
 * @param {Array}  options.src
 */
function Controller(options) {
  var self = this;

  self.src       = options.src;
  self.source    = options.source;
  self.result    = options.result;
  self.transform = new Transform();
  self.transformRelation    = new TransformRelation();
  self.sourceResultRelation = new SourceResultRelation();

  self.source.addHandler = function(sourcePath) {
    self.onSourceChange(sourcePath);
  };

  self.source.changeHandler = function(sourcePath) {
    self.onSourceChange(sourcePath);
  };

  self.source.removeHandler = function(sourcePath) {
    self.onSourceRemove(sourcePath);
  };

  self.source.start();
}

Controller.prototype.onSourceChange = function(sourcePath) {
  var self = this;

  var src = _.find(self.src, function(src) {
    return anymatch(src.files, sourcePath)
  });

  if (src) {
    self.transform.transform(sourcePath, {
      transformer: src.transformer,
      source: self.createSourceReader(sourcePath),
      result: self.createResultReader(sourcePath),
    }, self.createResultWriter(sourcePath));
  }

  var parents = self.transformRelation.getParents(sourcePath);
  parents.map(function(parent) {
    self.onSourceChange(parent);
  });
};

Controller.prototype.onSourceRemove = function(sourcePath) {
  var resultPath = this.sourceResultRelation.get(sourcePath);
  this.result.remove(resultPath);
  this.sourceResultRelation.remove(sourcePath);
};

Controller.prototype.createResultReader = function() {
  return this.result.get;
};

Controller.prototype.createResultWriter = function(sourcePath) {
  var self = this;

  return function(err, response) {
    if (err) {
      return console.error(err);
    }

    self.result.set(response.path, response.content);
    self.sourceResultRelation.set(sourcePath, response.path);
  };
};

Controller.prototype.createSourceReader = function(sourcePath) {
  var self = this;

  return function(childSourcePath, cb) {
    if (sourcePath !== childSourcePath) {
      self.transformRelation.set(sourcePath, childSourcePath);
    }

    self.source.get(childSourcePath, cb);
  };
}

module.exports = Controller;
