var _ = require('underscore');

function SourceResultRelation() {
  // sourcePath -> resultPath;
  this.relations = {};
}

SourceResultRelation.prototype.get = function (sourcePath) {
  return this.relations[sourcePath];
};

SourceResultRelation.prototype.set = function (sourcePath, resultPath) {
  this.relations[sourcePath] = resultPath;
};

SourceResultRelation.prototype.remove = function (sourcePath) {
  delete this.relations[sourcePath];
};

SourceResultRelation.prototype.removeResult = function (resultPath) {
  var self = this;
  var sourcePath;

  sourcePath = _.findKey(self.relations, function(_resultPath, _sourcePath) {
    return resultPath === _resultPath;
  });

  delete self.relations[sourcePath];
};

module.exports = SourceResultRelation;
