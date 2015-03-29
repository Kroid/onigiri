var _ = require('underscore');
var Controller = require('./lib/controller');
var Serve  = require('./lib/serve');
var Source = require('./lib/source');
var Result = require('./lib/result');

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
