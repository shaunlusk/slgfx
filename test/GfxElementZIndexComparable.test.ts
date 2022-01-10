import * as TypeMoq from 'typemoq';
import { IGfxElement } from '../src/GfxElement';
import { GfxElementZIndexComparable } from '../src/GfxElementZIndexComparable';

describe("GfxElementZIndexComparable", function() {
  const gfxElementMockA: TypeMoq.IMock<IGfxElement> = TypeMoq.Mock.ofType<IGfxElement>();
  const gfxElementMockB: TypeMoq.IMock<IGfxElement> = TypeMoq.Mock.ofType<IGfxElement>();
  let zIndexComparableA: GfxElementZIndexComparable, 
    zIndexComparableB: GfxElementZIndexComparable;

  beforeEach(function(){
    gfxElementMockA.reset();
    gfxElementMockB.reset();
    zIndexComparableA = new GfxElementZIndexComparable(gfxElementMockA.object);
    zIndexComparableB = new GfxElementZIndexComparable(gfxElementMockB.object);
  });
  describe("#getElement()", function() {
    it("should return element", function(done) {
      const result = zIndexComparableA.getElement();

      expect(result).toBe(gfxElementMockA.object);
      done();
    });
  });
  describe("#compareTo()", function() {
    it("should return -1", function(done) {
      gfxElementMockA.setup(x => x.getZIndex()).returns(() => 1);
      gfxElementMockB.setup(x => x.getZIndex()).returns(() => 2);

      const expected = -1;
      const result = zIndexComparableA.compareTo(zIndexComparableB);

      expect(result).toBe(expected);
      done();
    });
    it("should return 0", function(done) {
      const expected = 0;
      gfxElementMockA.setup(x => x.getZIndex()).returns(() => 1);
      gfxElementMockB.setup(x => x.getZIndex()).returns(() => 1);
      
      const result = zIndexComparableA.compareTo(zIndexComparableB);

      expect(result).toBe(expected);
      done();
    });
    it("should return 1", function(done) {
      const expected = 1;
      gfxElementMockA.reset();
      gfxElementMockA.setup(x => x.getZIndex()).returns(() => 3);
      gfxElementMockB.setup(x => x.getZIndex()).returns(() => 2);
      const result = zIndexComparableA.compareTo(zIndexComparableB);

      expect(result).toBe(expected);
      done();
    });
  });
  describe("#equals()", function() {
    it("should return true", function(done) {
      const expected = true;
      gfxElementMockA.setup(x => x.getZIndex()).returns(() => 4);
      gfxElementMockB.setup(x => x.getZIndex()).returns(() => 4);
      const result = zIndexComparableA.equals(zIndexComparableB);

      expect(result).toBe(expected);
      done();
    });
    it("should return false", function(done) {
      const expected = false;
      gfxElementMockA.setup(x => x.getZIndex()).returns(() => 1);
      gfxElementMockB.setup(x => x.getZIndex()).returns(() => 2);
      const result = zIndexComparableA.equals(zIndexComparableB);

      expect(result).toBe(expected);
      done();
    });
  });
  describe("#getKey()", function() {
    it("should return id", function(done) {
      gfxElementMockA.setup(x => x.getId()).returns(() => 3);

      const expected = "3";
      const result = zIndexComparableA.getKey();

      expect(result).toBe(expected);
      done();
    });
  });
});
