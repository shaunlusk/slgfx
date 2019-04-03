var LayerFactory = require('../src/LayerFactory');
var Utils = require('../src/Utils');
var GfxLayer = require('../src/GfxLayer');
var BackgroundLayer = require('../src/BackgroundLayer');

describe("LayerFactory", function() {
  describe("#constructor", function() {
    it("should setup default layer type creator functions", function(done) {
      var lf = new LayerFactory();

      expect(lf._registeredTypes).toBeTruthy();
      expect(Utils.isFunction(lf._registeredTypes.GfxLayer)).toBeTruthy();
      expect(Utils.isFunction(lf._registeredTypes.BackgroundLayer)).toBeTruthy();
      done();
    });
    it("should setup default layer type creator functions and those passed in", function(done) {
      var lf = new LayerFactory({
        "BogusLayer":function() {}
      });

      expect(lf._registeredTypes).toBeTruthy();
      expect(Utils.isFunction(lf._registeredTypes.GfxLayer)).toBeTruthy();
      expect(Utils.isFunction(lf._registeredTypes.BackgroundLayer)).toBeTruthy();
      expect(Utils.isFunction(lf._registeredTypes.BogusLayer)).toBeTruthy();
      done();
    });
  });
  describe("#getLayer", function() {
    it("should create GfxLayer", function(done) {
      var lf = new LayerFactory();

      var result = lf.getLayer("GfxLayer", {});

      expect(result).toBeTruthy();
      expect(result).toBeInstanceOf(GfxLayer);
      done();
    });
    it("should create BackgroundLayer", function(done) {
      var lf = new LayerFactory();

      var result = lf.getLayer("BackgroundLayer", {});

      expect(result).toBeTruthy();
      expect(result).toBeInstanceOf(BackgroundLayer);
      done();
    });
    it("should create other layer", function(done) {
      var lf = new LayerFactory({
        "BogusLayer":function() {return "fakeLayer";}
      });

      var result = lf.getLayer("BogusLayer", {});

      expect(result).toBe("fakeLayer");
      done();
    });
  });
});
