var _    = require('underscore');
var glob = require('glob');

module.exports = function(globs, cb) {
  if (_.isArray(globs)) {
    globs.map(function(_glob) {
      getFiles(_glob);
    });
  } else {
    getFiles(globs);
  }


  function getFiles(_glob) {
    glob(_glob, {nodir: true}, cb);
  }
};
