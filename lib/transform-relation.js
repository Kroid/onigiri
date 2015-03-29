var _ = require('underscore');


function TransformRelation() {
  // parent -> [child]
  this.relations = {};
}

TransformRelation.prototype.getChildren = function (parent) {
  return this.relations[parent] || [];
};

TransformRelation.prototype.getParents = function (child) {
  var parents = [];

  _.mapObject(this.relations, function(children, parent) {
    if (_.indexOf(children, child) !== -1) {
      parents.push(parent);
    }
  });

  return parents;
};

TransformRelation.prototype.removeChild = function (child, parent) {
  // if parent not defined, remove child from all parents

  var self = this;

  if (parent) {
    var children = this.getChildren(parent);
    children = _.without(children, child);
    this.relations[parent] = children;
    return;
  }

  _.mapObject(this.relations, function(children, parent) {
    self.removeChild(child, parent);
  });
};

TransformRelation.prototype.removeParent = function (parent) {
  delete this.relations[parent];
};

TransformRelation.prototype.set = function (parent, child) {
  var children = this.getChildren(parent)
  children.push(child);
  this.relations[parent] = _.uniq(children);
};

module.exports = TransformRelation;
