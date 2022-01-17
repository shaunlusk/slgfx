import * as TypeMoq from 'typemoq';
import { IImageRenderer } from '../src';
import { ICanvasContextWrapper } from '../src/CanvasContextWrapper';
import { IGfxPanel } from '../src/GfxPanel';
import { IImageElementProps, ImageElement } from '../src/ImageElement';

describe("ImageElement", function() {
  const canvasContextMock: TypeMoq.IMock<ICanvasContextWrapper> = TypeMoq.Mock.ofType<ICanvasContextWrapper>();
  const gfxPanelMock: TypeMoq.IMock<IGfxPanel> = TypeMoq.Mock.ofType<IGfxPanel>();
  const imageRendererMock: TypeMoq.IMock<IImageRenderer> = TypeMoq.Mock.ofType<IImageRenderer>();
  const imageMock: TypeMoq.IMock<HTMLImageElement> = TypeMoq.Mock.ofType<HTMLImageElement>();
  let imageElement: ImageElement;
  let elementProps: IImageElementProps;

  beforeEach(function() {
    canvasContextMock.reset();
    gfxPanelMock.reset();
    imageRendererMock.reset();
    imageMock.reset();

    elementProps = {
      gfxPanel: gfxPanelMock.object,
      image: imageMock.object,
      imageRenderer: imageRendererMock.object,
      sourceWidth: 4,
      sourceHeight: 3,
      sourceX: 1,
      sourceY: 2,
      width: 5,
      height: 6
    };
    imageElement = new ImageElement(elementProps);
  });
  describe("#render()", function() {
    it("should call renderImage", function(done) {
      imageElement.render(canvasContextMock.object, 0, 0);

      imageRendererMock.verify(x => x.renderImage(
        canvasContextMock.object,
        imageMock.object,
        TypeMoq.It.isValue(elementProps.sourceX),
        TypeMoq.It.isValue(elementProps.sourceY),
        TypeMoq.It.isValue(elementProps.sourceWidth),
        TypeMoq.It.isValue(elementProps.sourceHeight),
        TypeMoq.It.isValue(0), 
        TypeMoq.It.isValue(0), 
        TypeMoq.It.isValue(elementProps.width),
        TypeMoq.It.isValue(elementProps.height),
        TypeMoq.It.isValue(1),
        TypeMoq.It.isValue(1), 
        TypeMoq.It.isValue(false),
        TypeMoq.It.isValue(false),
        TypeMoq.It.isValue(null)
      ), TypeMoq.Times.once());
      done();
    });
  });
});
