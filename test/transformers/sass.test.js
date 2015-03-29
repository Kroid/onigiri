var fs   = require('fs');
var path = require('path');

var expect = require("chai").expect;
var transformer = require('../../lib/transformers/sass');

describe('jade transformer', function() {
  var sourcePath, options, content;

  beforeEach(function() {
    sourcePath = 'sample.sass';
    options = {
      source: function(sourcePath, cb) {
        fs.readFile(path.join(__dirname, sourcePath), function(err, content) {
          cb(err, content);
        });
      },
      result: function() { return undefined; }
    };
    content = 'body {\n  background-color: gray; }\n';
  });

  it('does output with filename "sample.css"', function(done) {
    transformer(sourcePath, options, function(err, response) {
      expect(response.path).to.equal("sample.css");
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
