var http = require('http');

function Serve(fs) {
  var self = this;

  self.fs = fs;

  http.createServer(function (req, res) {
    var _path = req.url.substr(1);
    var content = null;

    if (!_path) {
      _path = 'index.html';
    }

    content = self.fs.get(_path);

    res.writeHead(200);
    res.end(content);

  }).listen(1337, '127.0.0.1');
}

module.exports = Serve;
