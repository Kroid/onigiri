var expect = require("chai").expect;
var replaceExtname = require('../../lib/helpers/replace-extname');

describe('replaceExtname', function() {

  describe('single file', function() {

    it('does replace "filename.jade" to "filename.html"', function() {
      expect(replaceExtname('filename.jade', 'html')).to.equal('filename.html');
    });

    it('does replace ".jade" to ".jade.html"', function() {
      expect(replaceExtname('.jade', 'html')).to.equal('.jade.html');
    });

    it('does replace "filename" to "filename.html"', function() {
      expect(replaceExtname('filename', 'html')).to.equal('filename.html');
    });

    it('does replace "" to ".html"', function() {
      expect(replaceExtname('', 'html')).to.equal('.html');
    });

    it('does replace 123 to "123.html"', function() {
      expect(replaceExtname(123, 'html')).to.equal('123.html');
    });

  });

  it('does replace array of filenames', function() {
    var source = ['file.html', '.js', 'filename'];
    var result = ['file.ext', '.js.ext', 'filename.ext'];
    expect(replaceExtname(source, 'ext')).to.deep.equal(result);
  });

});
