var fs   = require('fs');
var path = require('path');

var expect = require("chai").expect;
var transformer = require('../../lib/transformers/jade');

describe('jade transformer', function() {
  var sourcePath, options, content;

  beforeEach(function() {
    sourcePath = 'sample.jade';
    options = {
      source: function(sourcePath, cb) {
        fs.readFile(path.join(__dirname, sourcePath), function(err, content) {
          cb(err, content);
        });
      },
      result: function() { return undefined; }
    };
    content = '<!DOCTYPE html><html><head><link rel="stylesheet" href="styles/app.css"></head><body><p>Hello</p><script src="scripts/app.js"></script></body></html>';
  });

  it('does output with filename "sample.html"', function(done) {
    transformer(sourcePath, options, function(err, response) {
      expect(response.path).to.equal("sample.html");
      done();
    });
  });

  it('does transform content from jade to html', function(done) {
    transformer(sourcePath, options, function(err, response) {
      expect(response.content).to.equal(content);
      done();
    });
  });

});
