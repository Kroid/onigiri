

function ResultFS() {
  this.fs = {};
}


ResultFS.prototype.update = function(path, content) {
  this.fs[path] = content;
}


ResultFS.prototype.remove = function(path) {
  delete this.fs[path];
}


module.exports = ResultFS;
