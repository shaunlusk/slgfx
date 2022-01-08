import * as TypeMoq from 'typemoq';
import { ICanvasContextWrapper } from '../src/CanvasContextWrapper';
import { Layer, ILayerProps } from '../src/Layer';
import { SLGfxMouseEvent } from '../src/SLGfxMouseEvent';

class TestLayer extends Layer {
  constructor(props: ILayerProps) {
    super(props);
  }
  public update(diff: number) {
  }
  public render(diff: number) {
  }
  public handleMouseEvent(event: SLGfxMouseEvent) {
  }
  
}

describe('Layer', function() {
  let canvasContextWrapperMock: TypeMoq.IMock<ICanvasContextWrapper> = TypeMoq.Mock.ofType<ICanvasContextWrapper>();

  beforeEach(() => {
    canvasContextWrapperMock.reset();
  });

  describe('dirty', function() {
    var layer = new TestLayer({canvasContextWrapper: canvasContextWrapperMock.object, width: 400, height: 300});
    it('should be dirty', function() {
      layer.setDirty(true);

      expect(layer.isDirty()).toBeTruthy();
    });
    it('should not be dirty', function() {
      layer.setDirty(false);

      expect(layer.isDirty()).toBeFalsy();
    });
  });
  describe('ImageSmoothing', function() {
    var layer = new TestLayer({canvasContextWrapper: canvasContextWrapperMock.object});
    it('should set dirty', function() {
      layer.setDirty(false);

      layer.setImageSmoothingEnabled(true);

      expect(layer.isDirty()).toBeTruthy();
    });
    it('should set image smoothing', function() {
      layer.setDirty(false);
      
      layer.setImageSmoothingEnabled(true);

      canvasContextWrapperMock.verify(x => x.setImageSmoothingEnabled(TypeMoq.It.isValue(true)), TypeMoq.Times.once());

    });
  });
  describe('#preRender', function() {
    var layer = new TestLayer({canvasContextWrapper: canvasContextWrapperMock.object});
    it('should clear canvas if dirty', function() {
      layer.setDirty(true);

      layer.preRender(0, 0);

      canvasContextWrapperMock.verify(x => x.clear(), TypeMoq.Times.once());

    });
    it('should set view origin x on canvas context', function() {
      var xval = 10;
      layer.setViewOriginX(xval);

      layer.preRender(0, 0);

      canvasContextWrapperMock.verify(x => x.setViewOriginX(TypeMoq.It.isValue(xval)), TypeMoq.Times.once());
    });
    it('should set view origin y on canvas context', function() {
      var yval = 10;
      layer.setViewOriginY(yval);

      layer.preRender(0, 0);

      canvasContextWrapperMock.verify(x => x.setViewOriginY(TypeMoq.It.isValue(yval)), TypeMoq.Times.once());
    });
  });
});
