var Source = require('./lib/source');

var source = new Source('./.tmp/**/*', true, function(event, path) {
  source.get(path, function(err, content) {
    console.log(path);
    console.log(String(content));
  });
});
