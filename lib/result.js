function Result() {
  this.fs = {};
}

Result.prototype.get = function (_path) {
  return this.fs[_path];
};

Result.prototype.set = function (_path, content) {
  this.fs[_path] = content;
};

Result.prototype.remove = function (_path) {
  delete this.fs[_path];
};

module.exports = Result;
