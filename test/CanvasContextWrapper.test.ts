import * as TypeMoq from 'typemoq';
import { CanvasContextWrapper } from '../src/CanvasContextWrapper';

describe('CanvasContextWrapper', () => {
  const canvasContextMock: TypeMoq.IMock<CanvasRenderingContext2D> = TypeMoq.Mock.ofType<CanvasRenderingContext2D>();
  let wrapper: CanvasContextWrapper;
  
  beforeEach(() => {
    canvasContextMock.reset();

    wrapper = new CanvasContextWrapper({
      canvasContext: canvasContextMock.object,
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

      canvasContextMock.verify(cc => cc.clearRect(x, y, width, height), TypeMoq.Times.once());
    });
    it('should call clearRect on canvasContext if rect intersects bounds', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.clearRect(x, y, width, height);

      canvasContextMock.verify(cc => cc.clearRect(x, y, width, height), TypeMoq.Times.once());
    });
    it('should not call clearRect on canvasContext if rect outside bounds', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.clearRect(x, y, width, height);

      canvasContextMock.verify(cc => cc.clearRect(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
    });

    it('should call clearRect on canvasContext if rect is in bounds with view offset', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.clearRect(x, y, width, height);

      canvasContextMock.verify(cc => cc.clearRect(x - 1, y - 1, width, height), TypeMoq.Times.once());
    });
    it('should call clearRect on canvasContext if rect intersects bounds with view offset', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.setViewOriginX(1);
      wrapper.setViewOriginY(1);
      wrapper.clearRect(x, y, width, height);

      canvasContextMock.verify(cc => cc.clearRect(x + 1, y + 1, width, height), TypeMoq.Times.once());
    });
    it('should not call clearRect on canvasContext if rect outside bounds with view offset', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.clearRect(x, y, width, height);

      canvasContextMock.verify(cc => cc.clearRect(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
    });

  });
  describe('#fillRect', () => {
    it('should call fillRect on canvasContext if rect is in bounds', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.fillRect(x, y, width, height);

      canvasContextMock.verify(cc => cc.fillRect(x, y, width, height), TypeMoq.Times.once());
    });
    it('should not call fillRect on canvasContext if rect outside bounds', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.fillRect(x, y, width, height);

      canvasContextMock.verify(cc => cc.fillRect(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
    });
    it('should call fillRect on canvasContext if rect is in bounds with view offset', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.fillRect(x, y, width, height);

      canvasContextMock.verify(cc => cc.fillRect(x - 1, y - 1, width, height), TypeMoq.Times.once());
    });
    it('should call fillRect on canvasContext if rect intersects bounds with view offset', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.setViewOriginX(1);
      wrapper.setViewOriginY(1);
      wrapper.fillRect(x, y, width, height);

      canvasContextMock.verify(cc => cc.fillRect(x + 1, y + 1, width, height), TypeMoq.Times.once());
    });
    it('should not call fillRect on canvasContext if rect outside bounds with view offset', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.fillRect(x, y, width, height);

      canvasContextMock.verify(cc => cc.fillRect(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
    });
  });
  describe('#drawImage', () => {
    const mockImage: TypeMoq.IMock<HTMLImageElement> = TypeMoq.Mock.ofType<HTMLImageElement>();
    it('should call drawImage on canvasContext if rect is in bounds', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.drawImage(mockImage.object, 0, 0, 0, 0, x, y, width, height);

      canvasContextMock.verify(cc => cc.drawImage(mockImage.object, 0, 0, 0, 0, x, y, width, height), TypeMoq.Times.once());
    });
    it('should call drawImage on canvasContext if rect intersects bounds', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.drawImage(mockImage.object, 0, 0, 0, 0, x, y, width, height);

      canvasContextMock.verify(cc => cc.drawImage(mockImage.object, 0, 0, 0, 0, x, y, width, height), TypeMoq.Times.once());
    });
    it('should not call drawImage on canvasContext if rect outside bounds', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.drawImage(mockImage.object, 0, 0, 0, 0, x, y, width, height);

      canvasContextMock.verify(cc => cc.drawImage(TypeMoq.It.isAny(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
    });
    it('should call drawImage on canvasContext if rect is in bounds with view offset', () => {
      let x = 2, y = 2, width = 2, height = 2;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.drawImage(mockImage.object, 0, 0, 0, 0, x, y, width, height);

      canvasContextMock.verify(cc => cc.drawImage(mockImage.object, 0, 0, 0, 0, x - 1, y - 1, width, height), TypeMoq.Times.once());
    });
    it('should call drawImage on canvasContext if rect intersects bounds with view offset', () => {
      let x = 8, y = 8, width = 4, height = 4;
      wrapper.setViewOriginX(1);
      wrapper.setViewOriginY(1);
      wrapper.drawImage(mockImage.object, 0, 0, 0, 0, x, y, width, height);

      canvasContextMock.verify(cc => cc.drawImage(mockImage.object, 0, 0, 0, 0, x + 1, y + 1, width, height), TypeMoq.Times.once());
    });
    it('should not call drawImage on canvasContext if rect outside bounds with view offset', () => {
      let x = 12, y = 12, width = 4, height = 4;
      wrapper.setViewOriginX(-1);
      wrapper.setViewOriginY(-1);
      wrapper.drawImage(mockImage.object, 0, 0, 0, 0, x, y, width, height);

      canvasContextMock.verify(cc => cc.drawImage(TypeMoq.It.isAny(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
    });
  });
});
