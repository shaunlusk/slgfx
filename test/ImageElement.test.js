describe("ImageElement", function() {
  var imageElement, calledRenderImage;
  beforeEach(function() {
    calledRenderImage = false;
    imageElement = new SL.ImageElement(
      SL.Mocks.getMockScreen(),
      SL.Mocks.getMockLayer(),
      {
        imageRenderer : {
          renderImage : function() {
            calledRenderImage = true;
          }
        }
      }
    );
  });
  describe("#render()", function() {
    it("should call renderImage", function(done) {
      imageElement.render(1, 1);

      assert(calledRenderImage === true, "should have called renderImage");
      done();
    });
  });
});
