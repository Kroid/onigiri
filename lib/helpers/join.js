var path = require('path');
var _ = require('underscore');


module.exports = function() {
  var _path = '';
  var arr = null;

  _.each(arguments, function(arg) {
    if (_.isArray(arg)) {
      return arr = arg;
    }

    _path = path.join(_path, arg || '');
  });

  if(arr) {
    return _.map(arr, function(ele) {
      return prepare(path.join(_path,ele));
    })
  }

  return prepare(_path);

}


function prepare(raw) {
  var negative;

  if (raw.indexOf('!') != -1) {
    negative = true;
  }

  raw = raw.replace(/!/g, '');

  if (negative){
    raw = '!' + raw;
  }

  return raw;
}
