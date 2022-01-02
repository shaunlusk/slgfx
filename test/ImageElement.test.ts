import * as TypeMoq from 'typemoq';
import { ICanvasContextWrapper } from '../src/CanvasContextWrapper';
import { ImageElement } from '../src/ImageElement';

describe("ImageElement", function() {
  const canvasContextMock: TypeMoq.IMock<ICanvasContextWrapper> = TypeMoq.Mock.ofType<ICanvasContextWrapper>();
  let imageElement: ImageElement;
  
  beforeEach(() => {
    canvasContextMock.reset();
  });
  beforeEach(function() {
    imageElement = new ImageElement({
      screenContext : Mocks.getMockScreen(),
      canvasContextWrapper:Mocks.getMockCanvasContextWrapper(),
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
