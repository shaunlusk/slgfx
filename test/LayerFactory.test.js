describe("LayerFactory", function() {
  describe("#constructor", function() {
    it("should setup default layer type creator functions", function(done) {
      var lf = new SL.LayerFactory();

      assert(lf._registeredTypes !== null, "_registeredTypes was not created");
      assert(SL.Utils.isFunction(lf._registeredTypes.GfxLayer), "_registeredTypes does not contain function for GfxLayer");
      assert(SL.Utils.isFunction(lf._registeredTypes.BackgroundLayer), "_registeredTypes does not contain function for BackgroundLayer");
      done();
    });
    it("should setup default layer type creator functions and those passed in", function(done) {
      var lf = new SL.LayerFactory({
        "BogusLayer":function() {}
      });

      assert(lf._registeredTypes !== null, "_registeredTypes was not created");
      assert(SL.Utils.isFunction(lf._registeredTypes.GfxLayer), "_registeredTypes does not contain function for GfxLayer");
      assert(SL.Utils.isFunction(lf._registeredTypes.BackgroundLayer), "_registeredTypes does not contain function for BackgroundLayer");
      assert(SL.Utils.isFunction(lf._registeredTypes.BogusLayer), "_registeredTypes does not contain function for BogusLayer");
      done();
    });
  });
  describe("#getLayer", function() {
    it("should create GfxLayer", function(done) {
      var lf = new SL.LayerFactory();

      var result = lf.getLayer(null, "GfxLayer", null);

      assert(result !== null, "should have created layer");
      assert(result instanceof SL.GfxLayer, "should have created GfxLayer type");
      done();
    });
    it("should create BackgroundLayer", function(done) {
      var lf = new SL.LayerFactory();

      var result = lf.getLayer(null, "BackgroundLayer", null);

      assert(result !== null, "should have created layer");
      assert(result instanceof SL.BackgroundLayer, "should have created BackgroundLayer type");
      done();
    });
    it("should create other layer", function(done) {
      var lf = new SL.LayerFactory({
        "BogusLayer":function() {return "fakeLayer";}
      });

      var result = lf.getLayer(null, "BogusLayer", null);

      assert(result === "fakeLayer", "should have created fake layer");
      done();
    });
  });
});
