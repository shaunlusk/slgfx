import Mocks from './Mocks';
import CanvasContextWrapper from '../src/CanvasContextWrapper';

describe('CanvasContextWrapper', () => {
  let canvasContext = null;
  describe('#isOutOfView', () => {
    canvasContext = Mocks.getMockCanvasContext();
    let wrapper = new CanvasContextWrapper({
      canvasContext:canvasContext,
      width:10,
      height:10
    });
    it('should return false if inside viewport', () => {
      let result = wrapper.isOutOfView(1,1,2,2);
      expect(result).toBeFalsy();
    });
    it('should return false if intersects edge of viewport', () => {
      let result = wrapper.isOutOfView(8,8,4,4);
      expect(result).toBeFalsy();
    });
    it('should return true if outside of viewport', () => {
      let result = wrapper.isOutOfView(18,18,4,4);
      expect(result).toBeTruthy();
    });
  });
});
