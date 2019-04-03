import Sprite from '../src/Sprite';
import EventType from '../src/EventType';
import Mocks from './Mocks';
import GfxElement from '../src/GfxElement';

describe('Sprite', () => {
  let mockScreen = null;
  let sprite = null;

  beforeEach(() => {
    mockScreen = Mocks.getMockScreen();
    mockScreen.notify = function(e) {
      this.event = e;
    };
    sprite = new Sprite({
      screenContext:mockScreen
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

      expect(mockScreen.event.type).toBe(EventType.SPRITE_ANIMATION_DONE);
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
      expect(sprite._currentFrameElapsed).toBe(0);
      expect(sprite._loopCount).toBe(0);
      expect(sprite._elapsed).toBe(0);
    });
  });
  describe('#update', () => {
    it('should return null if no frames', () => {
      sprite = new Sprite({
        screenContext:mockScreen
      });

      const result = sprite.update();
      expect(result).toBeNull();
    });
    it('should call base method', () => {
      let calledIt = false;
      const savedMethod = GfxElement.prototype.update;
      GfxElement.prototype.update = () => {calledIt = true;};
      sprite.update(1,1);
      GfxElement.prototype.update = savedMethod;
      expect(calledIt).toBeTruthy();
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
