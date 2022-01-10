import * as TypeMoq from 'typemoq';
import { ICanvasContextWrapper } from '../src/CanvasContextWrapper';
import { ImageSprite } from '../src/ImageSprite';
import { EventType } from '../src/EventType';
import { IGfxPanel } from '../src/GfxPanel';
import { IImageRenderer } from '../src/ImageRenderer';

describe('ImageSprite', () => {
  const panelMock: TypeMoq.IMock<IGfxPanel> = TypeMoq.Mock.ofType<IGfxPanel>();
  const imageMock: TypeMoq.IMock<HTMLImageElement> = TypeMoq.Mock.ofType<HTMLImageElement>();
  const imageRendererMock: TypeMoq.IMock<IImageRenderer> = TypeMoq.Mock.ofType<IImageRenderer>();
  const canvasContextWrapperMock: TypeMoq.IMock<ICanvasContextWrapper> = TypeMoq.Mock.ofType<ICanvasContextWrapper>();
  let sprite: ImageSprite;

  beforeEach(() => {
    panelMock.reset();
    imageMock.reset();
    imageRendererMock.reset();
    canvasContextWrapperMock.reset();
    sprite = new ImageSprite({
      gfxPanel: panelMock.object,
      image: imageMock.object,
      imageRenderer: imageRendererMock.object,
      height: 5,
      width: 6
    });
    const mockAnimationFrame1 = {getDuration: () => 2};
    const mockAnimationFrame2 = {getDuration: () => 3};
    sprite.addFrame(mockAnimationFrame1);
    sprite.addFrame(mockAnimationFrame2);
  });

  describe('#setDone', () => {
    it('should set done', () => {
      sprite.setDone(true);

      expect(sprite.isDone()).toBeTruthy();
    });
    it('should notify screen context', () => {
      sprite.setDone(true);

      panelMock.verify(x => x.notify(TypeMoq.It.isAny()), TypeMoq.Times.once());
    });
    it('should notify listener', () => {
      let notified = false;
      sprite.on(EventType.SPRITE_ANIMATION_DONE,() => {
        notified = true;
      });
      sprite.setDone(true);

      expect(notified).toBeTruthy();
    });
  });
  describe('#setCurrentFrameIndex', () => {
    it('should set frame index', () => {
      sprite.setCurrentFrameIndex(1);

      expect(sprite.getCurrentFrameIndex()).toBe(1);
    });
    it('should set dirty', () => {
      sprite.setCurrentFrameIndex(1);
      expect(sprite.isDirty()).toBeTruthy();
    });
  });
  describe('#reset', () => {
    it('should set frame index to 0', () => {
      sprite.reset();
      expect(sprite.getCurrentFrameIndex()).toBe(0);
    });
    it('should set done to false', () => {
      sprite.reset();
      expect(sprite.isDone()).toBeFalsy();
    });
    it('should set dirty', () => {
      sprite.reset();
      expect(sprite.isDirty()).toBeTruthy();
    });
    it('should reset internals', () => {
      sprite.reset();
      expect(sprite.getLoopCount()).toBe(0);
    });
  });
  describe('#update', () => {
    it('should return null if no frames', () => {
      sprite = new ImageSprite({
        gfxPanel: panelMock.object,
        image: imageMock.object,
        imageRenderer: imageRendererMock.object,
        height: 5,
        width: 6
      });

      const result = sprite.update(0, 0);
      expect(result).toBeNull();
    });
    it('should end if exceeded ttl', () => {
      sprite.setTtl(10);
      sprite.update(12,12);

      expect(sprite.isDone()).toBeTruthy();
    });
    it('should update frame', () => {
      sprite.update(5,4);
      expect(sprite.getCurrentFrameIndex()).toBe(1);
    });
    it('should end if not looped', () => {
      sprite.setDoLoop(false);
      sprite.update(10,10);
      expect(sprite.isDone()).toBeTruthy();
    });
    it('should set freeze frame if not looped', () => {
      sprite.setDoLoop(false);
      sprite.setFreezeFrameIndex(0);
      sprite.update(10,10);
      expect(sprite.getCurrentFrameIndex()).toBe(0);
    });
    it('should loop', () => {
      sprite.update(5,5);
      expect(sprite.getCurrentFrameIndex()).toBe(0);
    });
    it('should end after loops-to-live is exceeded', () => {
      sprite.setLoopsToLive(2);

      sprite.update(10,10);

      expect(sprite.isDone()).toBeTruthy();
    });
    it('should return itself if dirty', () => {
      sprite.setDirty(false);
      var result = sprite.update(5,5);

      expect(result).toBe(sprite);
    });
    it('should return null if not dirty', () => {
      sprite.setDirty(false);
      var result = sprite.update(0,0);

      expect(result).toBeNull();
    });
  });
});
