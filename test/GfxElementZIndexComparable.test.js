var GfxElementZIndexComparable = require('../src/GfxElementZIndexComparable');

describe("GfxElementZIndexComparable", function() {
  var zIndexComparable;
  beforeEach(function(){
    zIndexComparable = new GfxElementZIndexComparable();
  });
  describe("#getElement()", function() {
    it("should return element", function(done) {
      zIndexComparable._parentElement = 1;

      var result = zIndexComparable.getElement();

      expect(result).toBe(zIndexComparable._parentElement);
      done();
    });
  });
  describe("#compareTo()", function() {
    it("should return -1", function(done) {
      zIndexComparable._parentElement = {
        getZIndex : function() {return 0;}
      };
      var other = new GfxElementZIndexComparable({
        getZIndex : function() {return 1;}
      });
      var expected = -1;
      var result = zIndexComparable.compareTo(other);

      expect(result).toBe(expected);
      done();
    });
    it("should return 0", function(done) {
      zIndexComparable._parentElement = {
        getZIndex : function() {return 0;}
      };
      var other = new GfxElementZIndexComparable({
        getZIndex : function() {return 0;}
      });
      var expected = 0;
      var result = zIndexComparable.compareTo(other);

      expect(result).toBe(expected);
      done();
    });
    it("should return 1", function(done) {
      zIndexComparable._parentElement = {
        getZIndex : function() {return 2;}
      };
      var other = new GfxElementZIndexComparable({
        getZIndex : function() {return 1;}
      });
      var expected = 1;
      var result = zIndexComparable.compareTo(other);

      expect(result).toBe(expected);
      done();
    });
  });
  describe("#equals()", function() {
    it("should return true", function(done) {
      zIndexComparable._parentElement = {
        getZIndex : function() {return 1;}
      };
      var other = new GfxElementZIndexComparable({
        getZIndex : function() {return 1;}
      });
      var expected = true;
      var result = zIndexComparable.equals(other);

      expect(result).toBe(expected);
      done();
    });
    it("should return false", function(done) {
      zIndexComparable._parentElement = {
        getZIndex : function() {return 1;}
      };
      var other = new GfxElementZIndexComparable({
        getZIndex : function() {return 2;}
      });
      var expected = false;
      var result = zIndexComparable.equals(other);

      expect(result).toBe(expected);
      done();
    });
  });
  describe("#getKey()", function() {
    it("should return id", function(done) {
      zIndexComparable._parentElement = {
        getId:function() {return 3;}
      };

      var expected = 3;
      var result = zIndexComparable.getKey();

      expect(result).toBe(expected);
      done();
    });
  });
});
