import Mocks from './Mocks';
import CanvasContextWrapper from '../src/CanvasContextWrapper';

describe('CanvasContextWrapper', () => {
  let canvasContext = null, wrapper = null;
  beforeEach(() => {
    canvasContext = Mocks.getMockCanvasContextWrapper();
    wrapper = new CanvasContextWrapper({
      canvasContext:canvasContext,
      width:10,
      height:10
    });
  });
  describe('#isOutOfView', () => {
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
  describe('#clearRect', () => {
    it('should call clearRect on canvasContext if rect is in bounds', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.clearRect(x, y, width, height);

      expect(canvasContext.clearedX).toBe(x);
      expect(canvasContext.clearedY).toBe(y);
      expect(canvasContext.clearedWidth).toBe(width);
      expect(canvasContext.clearedHeight).toBe(height);
    });
    it('should call clearRect on canvasContext if rect intersects bounds', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.clearRect(x, y, width, height);

      expect(canvasContext.clearedX).toBe(x);
      expect(canvasContext.clearedY).toBe(y);
      expect(canvasContext.clearedWidth).toBe(width);
      expect(canvasContext.clearedHeight).toBe(height);
    });
    it('should not call clearRect on canvasContext if rect outside bounds', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.clearRect(x, y, width, height);

      expect(canvasContext.clearedX).toBeUndefined();
      expect(canvasContext.clearedY).toBeUndefined()
      expect(canvasContext.clearedWidth).toBeUndefined()
      expect(canvasContext.clearedHeight).toBeUndefined()
    });

    it('should call clearRect on canvasContext if rect is in bounds with view offset', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.clearRect(x, y, width, height);

      expect(canvasContext.clearedX).toBe(x-1);
      expect(canvasContext.clearedY).toBe(y-1);
      expect(canvasContext.clearedWidth).toBe(width);
      expect(canvasContext.clearedHeight).toBe(height);
    });
    it('should call clearRect on canvasContext if rect intersects bounds with view offset', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.setViewOriginX(1);
      wrapper.setViewOriginY(1);
      wrapper.clearRect(x, y, width, height);

      expect(canvasContext.clearedX).toBe(x+1);
      expect(canvasContext.clearedY).toBe(y+1);
      expect(canvasContext.clearedWidth).toBe(width);
      expect(canvasContext.clearedHeight).toBe(height);
    });
    it('should not call clearRect on canvasContext if rect outside bounds with view offset', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.clearRect(x, y, width, height);

      expect(canvasContext.clearedX).toBeUndefined();
      expect(canvasContext.clearedY).toBeUndefined()
      expect(canvasContext.clearedWidth).toBeUndefined()
      expect(canvasContext.clearedHeight).toBeUndefined()
    });

  });
  describe('#fillRect', () => {
    it('should call fillRect on canvasContext if rect is in bounds', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.fillRect(x, y, width, height);

      expect(canvasContext.filledX).toBe(x);
      expect(canvasContext.filledY).toBe(y);
      expect(canvasContext.filledWidth).toBe(width);
      expect(canvasContext.filledHeight).toBe(height);
    });
    it('should call fillRect on canvasContext if rect intersects bounds', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.fillRect(x, y, width, height);

      expect(canvasContext.filledX).toBe(x);
      expect(canvasContext.filledY).toBe(y);
      expect(canvasContext.filledWidth).toBe(width);
      expect(canvasContext.filledHeight).toBe(height);
    });
    it('should not call fillRect on canvasContext if rect outside bounds', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.fillRect(x, y, width, height);

      expect(canvasContext.filledX).toBeUndefined();
      expect(canvasContext.filledY).toBeUndefined()
      expect(canvasContext.filledWidth).toBeUndefined()
      expect(canvasContext.filledHeight).toBeUndefined()
    });

    it('should call fillRect on canvasContext if rect is in bounds with view offset', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.fillRect(x, y, width, height);

      expect(canvasContext.filledX).toBe(x-1);
      expect(canvasContext.filledY).toBe(y-1);
      expect(canvasContext.filledWidth).toBe(width);
      expect(canvasContext.filledHeight).toBe(height);
    });
    it('should call fillRect on canvasContext if rect intersects bounds with view offset', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.setViewOriginX(1);
      wrapper.setViewOriginY(1);
      wrapper.fillRect(x, y, width, height);

      expect(canvasContext.filledX).toBe(x+1);
      expect(canvasContext.filledY).toBe(y+1);
      expect(canvasContext.filledWidth).toBe(width);
      expect(canvasContext.filledHeight).toBe(height);
    });
    it('should not call fillRect on canvasContext if rect outside bounds with view offset', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.fillRect(x, y, width, height);

      expect(canvasContext.filledX).toBeUndefined();
      expect(canvasContext.filledY).toBeUndefined()
      expect(canvasContext.filledWidth).toBeUndefined()
      expect(canvasContext.filledHeight).toBeUndefined()
    });
  });
  describe('#drawImage', () => {
    let mockImage = "bogus";
    it('should call drawImage on canvasContext if rect is in bounds', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.drawImage(mockImage, null, null, null, null, x, y, width, height);

      expect(canvasContext.drawImage_image).toBe(mockImage);
      expect(canvasContext.drawImage_sx).toBeNull();
      expect(canvasContext.drawImage_sy).toBeNull();
      expect(canvasContext.drawImage_sWidth).toBeNull();
      expect(canvasContext.drawImage_sHeight).toBeNull();
      expect(canvasContext.drawImage_width).toBe(width);
      expect(canvasContext.drawImage_height).toBe(height);
      expect(canvasContext.drawImage_x).toBe(x);
      expect(canvasContext.drawImage_y).toBe(y);
      expect(canvasContext.drawImage_width).toBe(width);
      expect(canvasContext.drawImage_height).toBe(height);
    });
    it('should call drawImage on canvasContext if rect intersects bounds', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.drawImage(mockImage, null, null, null, null, x, y, width, height);

      expect(canvasContext.drawImage_image).toBe(mockImage);
      expect(canvasContext.drawImage_sx).toBeNull();
      expect(canvasContext.drawImage_sy).toBeNull();
      expect(canvasContext.drawImage_sWidth).toBeNull();
      expect(canvasContext.drawImage_sHeight).toBeNull();
      expect(canvasContext.drawImage_x).toBe(x);
      expect(canvasContext.drawImage_y).toBe(y);
      expect(canvasContext.drawImage_width).toBe(width);
      expect(canvasContext.drawImage_height).toBe(height);
    });
    it('should not call drawImage on canvasContext if rect outside bounds', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.drawImage(mockImage, null, null, null, null, x, y, width, height);

      expect(canvasContext.drawImage_image).toBeUndefined();
      expect(canvasContext.drawImage_sx).toBeUndefined();
      expect(canvasContext.drawImage_sy).toBeUndefined();
      expect(canvasContext.drawImage_sWidth).toBeUndefined();
      expect(canvasContext.drawImage_sHeight).toBeUndefined();
      expect(canvasContext.drawImage_x).toBeUndefined();
      expect(canvasContext.drawImage_y).toBeUndefined()
      expect(canvasContext.drawImage_width).toBeUndefined()
      expect(canvasContext.drawImage_height).toBeUndefined()
    });

    it('should call drawImage on canvasContext if rect is in bounds with view offset', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.drawImage(mockImage, null, null, null, null, x, y, width, height);

      expect(canvasContext.drawImage_image).toBe(mockImage);
      expect(canvasContext.drawImage_sx).toBeNull();
      expect(canvasContext.drawImage_sy).toBeNull();
      expect(canvasContext.drawImage_sWidth).toBeNull();
      expect(canvasContext.drawImage_sHeight).toBeNull();
      expect(canvasContext.drawImage_x).toBe(x-1);
      expect(canvasContext.drawImage_y).toBe(y-1);
      expect(canvasContext.drawImage_width).toBe(width);
      expect(canvasContext.drawImage_height).toBe(height);
    });
    it('should call drawImage on canvasContext if rect intersects bounds with view offset', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.setViewOriginX(1);
      wrapper.setViewOriginY(1);
      wrapper.drawImage(mockImage, null, null, null, null, x, y, width, height);

      expect(canvasContext.drawImage_image).toBe(mockImage);
      expect(canvasContext.drawImage_sx).toBeNull();
      expect(canvasContext.drawImage_sy).toBeNull();
      expect(canvasContext.drawImage_sWidth).toBeNull();
      expect(canvasContext.drawImage_sHeight).toBeNull();
      expect(canvasContext.drawImage_x).toBe(x+1);
      expect(canvasContext.drawImage_y).toBe(y+1);
      expect(canvasContext.drawImage_width).toBe(width);
      expect(canvasContext.drawImage_height).toBe(height);
    });
    it('should not call drawImage on canvasContext if rect outside bounds with view offset', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.drawImage(mockImage, null, null, null, null, x, y, width, height);

      expect(canvasContext.drawImage_image).toBeUndefined();
      expect(canvasContext.drawImage_sx).toBeUndefined();
      expect(canvasContext.drawImage_sy).toBeUndefined();
      expect(canvasContext.drawImage_sWidth).toBeUndefined();
      expect(canvasContext.drawImage_sHeight).toBeUndefined();
      expect(canvasContext.drawImage_x).toBeUndefined();
      expect(canvasContext.drawImage_y).toBeUndefined()
      expect(canvasContext.drawImage_width).toBeUndefined()
      expect(canvasContext.drawImage_height).toBeUndefined()
    });
  });
});
