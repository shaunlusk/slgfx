import * as TypeMoq from 'typemoq';
import { BackgroundLayer } from '../src/BackgroundLayer';
import { ICanvasContextWrapper } from '../src/CanvasContextWrapper';
import { IGfxElement } from '../src/GfxElement';

describe('BackgroundLayer', function() {
  let canvasContextWrapperMock: TypeMoq.IMock<ICanvasContextWrapper> = TypeMoq.Mock.ofType<ICanvasContextWrapper>();
  let gfxElementMock: TypeMoq.IMock<IGfxElement> = TypeMoq.Mock.ofType<IGfxElement>();
  let bglayer: BackgroundLayer;
  
  beforeEach(() => {
    canvasContextWrapperMock.reset();
    gfxElementMock.reset();
    bglayer = new BackgroundLayer({canvasContextWrapper: canvasContextWrapperMock.object});
    bglayer.addElement(gfxElementMock.object);
  });
  describe('#update', function() {
    it('should set elements dirty', function() {
      
      bglayer.setDirty(true);

      bglayer.update(0, 0);

      gfxElementMock.verify(x => x.setDirty(TypeMoq.It.isValue(true)), TypeMoq.Times.once());
    });
    it('should update element', function() {
      bglayer.update(0, 0);

      gfxElementMock.verify(x => x.update(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.once());
    });
  });
});
