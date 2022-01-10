import * as TypeMoq from 'typemoq';
import { BackgroundLayer } from '../src/BackgroundLayer';
import { ICanvasContextWrapper } from '../src/CanvasContextWrapper';
import { GfxLayer } from '../src/GfxLayer';
import { ILayerProps } from '../src/Layer';
import { LayerFactory } from '../src/LayerFactory';

class FakeLayer extends GfxLayer {
  public option: boolean;
  constructor(props: IFakeLayerProps) {
    super(props);
    this.option = props.option
  }
}

interface IFakeLayerProps extends ILayerProps {
  option: boolean;
}

describe("LayerFactory", function() {
  const canvasContextWrapperMock: TypeMoq.IMock<ICanvasContextWrapper> = TypeMoq.Mock.ofType<ICanvasContextWrapper>();
  const lf: LayerFactory = new LayerFactory();

  describe("#createLayer", function() {
    it("should create GfxLayer", function(done) {

      var result = lf.createLayer("GfxLayer", {
        canvasContextWrapper: canvasContextWrapperMock.object
      });

      expect(result).toBeTruthy();
      expect(result).toBeInstanceOf(GfxLayer);
      done();
    });
    it("should create BackgroundLayer", function(done) {
      var lf = new LayerFactory();

      var result = lf.createLayer("BackgroundLayer", {
        canvasContextWrapper: canvasContextWrapperMock.object
      });

      expect(result).toBeTruthy();
      expect(result).toBeInstanceOf(BackgroundLayer);
      done();
    });
    it("should create other layer", function(done) {
      var lf = new LayerFactory({
        "FakeLayer": (props: IFakeLayerProps) => new FakeLayer(props)
      });

      var result = lf.createLayer<FakeLayer, IFakeLayerProps>("FakeLayer", {
        canvasContextWrapper: canvasContextWrapperMock.object,
        option: true
      });

      expect(result.option).toBeTruthy();
      done();
    });
  });
});
