var expect = require("chai").expect;
var TransformRelation = require('./../lib/transform-relation');

describe('TransformRelation', function() {
  var tr;

  describe('#getChildren', function() {
    beforeEach(function() {
      tr = new TransformRelation();
      tr.relations = {
        parent1: ['child1', 'child2'],
        parent2: []
      };
    });

    it('does return array ["child1", "child2"]', function() {
      expect(tr.getChildren('parent1')).to.deep.equal(["child1", "child2"]);
    });

    it('does return empty array', function() {
      expect(tr.getChildren('parent2')).to.deep.equal([]);
    });

    it('does return empty array from undefined parent', function() {
      expect(tr.getChildren('undefined/parent')).to.deep.equal([]);
    });
  });

  describe('#getParents', function() {
    beforeEach(function() {
      tr = new TransformRelation();
      tr.relations = {
        parent1: ['child1', 'child2'],
        parent2: ['child3', 'child4'],
        parent3: ['child1', 'child3']
      }
    });

    it('does return array ["parent1"]', function() {
      expect(tr.getParents('child2')).to.deep.equal(["parent1"]);
    });

    it('does return array ["parent2"]', function() {
      expect(tr.getParents('child4')).to.deep.equal(["parent2"]);
    });

    it('does return array ["parent1", "parent3"]', function() {
      expect(tr.getParents('child1')).to.deep.equal(["parent1", "parent3"]);
    });

    it('does return array ["parent2", "parent3"]', function() {
      expect(tr.getParents('child3')).to.deep.equal(["parent2", "parent3"]);
    });

    it('does return empty array from undefined parent', function() {
      expect(tr.getParents('undefined/child')).to.deep.equal([]);
    });
  });

  describe('#removeChild', function() {
    beforeEach(function() {
      tr = new TransformRelation();
      tr.relations = {
        parent1: ['child1', 'child2'],
        parent2: ['child3', 'child4'],
        parent3: ['child1', 'child3']
      }
    });

    describe('without parent param', function() {
      it('does remove "child1"', function() {
        tr.removeChild('child1');
        expect(tr.getParents('child1')).to.deep.equal([]);
      });

      it('does remove "child2"', function() {
        tr.removeChild('child2');
        expect(tr.getParents('child2')).to.deep.equal([]);
      });
    });

    describe('with parent param', function() {
      it('does remove "child1"', function() {
        tr.removeChild('child1', 'parent1');
        expect(tr.getParents('child1')).to.deep.equal(['parent3']);
      });

      it('does remove "child2"', function() {
        tr.removeChild('child2', 'parent1');
        expect(tr.getParents('child2')).to.deep.equal([]);
      });

      it('does remove "child1" from undefined parent', function() {
        tr.removeChild('child1', 'undefined/parent');
        expect(tr.getParents('child1')).to.deep.equal(['parent1', 'parent3']);
      });
    });
  });

  describe('#removeParent', function() {
    beforeEach(function() {
      tr = new TransformRelation();
      tr.relations = {
        parent1: ['child1', 'child2'],
        parent2: ['child3', 'child4'],
        parent3: ['child1', 'child3']
      }
    });

    describe('remove exist parent', function() {
      beforeEach(function() {
        tr.removeParent('parent1');
      });

      it('does return empty array', function() {
        expect(tr.getChildren('parent1')).to.deep.equal([]);
      })

      it('does return "parent3"', function() {
        expect(tr.getParents('child1')).to.deep.equal(['parent3']);
      });
    });

    describe('remove undefined parent', function() {
      beforeEach(function() {
        tr.removeParent('undefined/parent');
      });

      it('does return array ["child1", "child2"]', function() {
        expect(tr.getChildren('parent1')).to.deep.equal(["child1", "child2"]);
      });

      it('does return array ["child3", "child4"]', function() {
        expect(tr.getChildren('parent2')).to.deep.equal(["child3", "child4"]);
      });

      it('does return array ["child1", "child3"]', function() {
        expect(tr.getChildren('parent3')).to.deep.equal(["child1", "child3"]);
      });
    });
  });

  describe('#set', function() {
    beforeEach(function() {
      tr = new TransformRelation();
    });

    it('does return array ["child1"]', function() {
      tr.set('parent1', 'child1');
      expect(tr.getChildren('parent1')).to.deep.equal(["child1"]);
    });

    it('does return array ["child1", "child2"]', function() {
      tr.set('parent1', 'child1');
      tr.set('parent1', 'child2');
      expect(tr.getChildren('parent1')).to.deep.equal(["child1", "child2"]);
    });

    it('does set unique values (return array ["child1"])', function() {
      tr.set('parent1', 'child1');
      tr.set('parent1', 'child1');
      expect(tr.getChildren('parent1')).to.deep.equal(["child1"]);
    });
  });

});
