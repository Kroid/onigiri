var _ = require('underscore');
var Source = require('./source');
var Result = require('./result');
var Serve  = require('./serve');
var Controller = require('./controller');

function init(options) {
  var source = new Source({
    root: options.root,
    globs: prepareGlobs(options.src),
    watching: options.watching
  });

  var result = new Result();

  var controller = new Controller({
    source: source,
    result: result,
    src: options.src
  });

  if (options.watching) {
    new Serve(result);
  }
}

function prepareGlobs(arr) {
  arr = arr || [];
  arr = arr.map(function(obj) { return obj.files; });
  return _.flatten(arr);
}

module.exports = init;
