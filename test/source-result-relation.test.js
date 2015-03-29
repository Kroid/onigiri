var expect = require("chai").expect;
var SourceResultRelation = require('./../lib/source-result-relation');


describe('SourceResultRelation', function() {
  var srr;

  describe('#get', function() {
    beforeEach(function() {
      srr = new SourceResultRelation();
      srr.relations = {
        'exist/source/path': 'exist/result/path'
      };
    });

    it('does return "exist/result/path"', function() {
      expect(srr.get('exist/source/path')).to.equal('exist/result/path');
    });

    it('does return undefined', function() {
      expect(srr.get('not/exist')).to.equal(undefined);
    });
  });

  describe('#set', function() {
    beforeEach(function() {
      srr = new SourceResultRelation();
    });

    it('does set value', function() {
      srr.set('source', 'result');
      expect(srr.get('source')).to.equal('result');
    });
  });

  describe('#remove', function() {
    beforeEach(function() {
      srr = new SourceResultRelation();
      srr.relations = {
        'source': 'result'
      };
    });

    it('does remove value', function() {
      srr.remove('source');
      expect(srr.get('source')).to.equal(undefined);
    });
  });

  describe('#removeResult', function() {
    beforeEach(function() {
      srr = new SourceResultRelation();
      srr.relations = {
        'source': 'result'
      };
    });

    it('does remove by result value', function() {
      srr.removeResult('result');
      expect(srr.get('source')).to.equal(undefined);
    });
  });

});
