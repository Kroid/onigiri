var http = require('http');

function Serve(config) {
  var self = this;

  self.fs = config.fs;

  http.createServer(function (req, res) {
    var _path = req.url.substr(1);

    if (!_path) {
      _path = 'index.html';
    }

    res.writeHead(200);
    res.end(self.fs[_path]);

  }).listen(1337, '127.0.0.1');

}


module.exports = Serve;
