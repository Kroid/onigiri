var jade = require('jade');
var replaceExtname = require('./../helpers/replace-extname');


module.exports = function(_path, buffer, source, cb) {
  var html = jade.render(String(buffer));
  var newPath = replaceExtname(_path, 'html');

  cb(newPath, html);
};
