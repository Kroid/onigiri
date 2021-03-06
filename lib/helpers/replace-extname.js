var path = require('path');
var _ = require('underscore');


module.exports = function(files, ext) {
  if (_.isArray(files)) {
    return files.map(function(file) {
      return replace(file, ext);
    });
  }

  return replace(files, ext);
}


function replace(file, ext) {
  file = String(file);
  var baseExt = path.extname(file);
  return file.substring(0, file.lastIndexOf(baseExt)) + '.' + ext;
}
