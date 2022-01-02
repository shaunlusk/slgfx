import * as TypeMoq from 'typemoq';
import { ICanvasContextWrapper } from '../src/CanvasContextWrapper';
import { ImageRenderer } from '../src/ImageRenderer';

describe("ImageRenderer", function() {
  const canvasContextMock: TypeMoq.IMock<ICanvasContextWrapper> = TypeMoq.Mock.ofType<ICanvasContextWrapper>();

  beforeEach(() => {
    canvasContextMock.reset();
  });
  describe("#renderImage()", function() {
    it("should call drawImage on context", function(done) {
      var screenScaleX = 2, screenScaleY = 2;
      var renderer = new ImageRenderer(screenScaleX, screenScaleY);

      var image = null;
      var sx = 10, sy = 12, sWidth = 8, sHeight = 16;
      var tx = 50, ty = 72, tWidth = 8, tHeight = 16;
      var imageScaleX = 2, imageScaleY = 3;

      renderer.renderImage(
        canvasContextMock.object, 
        image, 
        sx, sy, 
        sWidth, sHeight, 
        tx, ty, 
        tWidth, tHeight, 
        imageScaleX, imageScaleY
      );

      canvasContextMock.verify(x => x.drawImage(
        image,
        sx,
        sy,
        sWidth,
        sHeight,
        tx * screenScaleX,
        ty * screenScaleY,
        tWidth * imageScaleX * screenScaleX,
        tHeight * imageScaleY * screenScaleY

      ), TypeMoq.Times.once());

      done();
    });
  });
});
