var ImageElement = require('../src/ImageElement');
var Mocks = require('./Mocks');

describe("ImageElement", function() {
  var imageElement, calledRenderImage;
  beforeEach(function() {
    calledRenderImage = false;
    imageElement = new ImageElement({
      screenContext : Mocks.getMockScreen(),
      canvasContextWrapper:Mocks.getMockCanvasContext(),
      imageRenderer : {
        renderImage : function() {
          calledRenderImage = true;
        }
      }
    });
  });
  describe("#render()", function() {
    it("should call renderImage", function(done) {
      imageElement.render(1, 1);

      expect(calledRenderImage).toBeTruthy();
      done();
    });
  });
});
