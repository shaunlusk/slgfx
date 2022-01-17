import * as TypeMoq from 'typemoq';
import { MoveOrder } from '../src/MoveOrder';
import { IGfxElement } from '../src/GfxElement';

describe("MoveOrder", function(){
  const gfxElementMock: TypeMoq.IMock<IGfxElement> = TypeMoq.Mock.ofType<IGfxElement>();

  beforeEach(() => {
    gfxElementMock.reset();
    gfxElementMock.setup(x => x.getX()).returns(() => 10);
    gfxElementMock.setup(x => x.getY()).returns(() => 20);
  });

  describe("#update()", function(){
    it('should not move the parent element if not started', () => {
      const mo = new MoveOrder(gfxElementMock.object, 100, 110, 10, () => {});

      mo.update(1);

      gfxElementMock.verify(x => x.setX(TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
      gfxElementMock.verify(x => x.setY(TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
    });
    it('should move the parent element', () => {
      const mo = new MoveOrder(gfxElementMock.object, 100, 110, 10, () => {});
      mo.start();

      mo.update(1);

      gfxElementMock.verify(x => x.setX(TypeMoq.It.isValue(19)), TypeMoq.Times.once());
      gfxElementMock.verify(x => x.setY(TypeMoq.It.isValue(29)), TypeMoq.Times.once());
    });
    it('should not move the parent element if already done.', () => {
      const mo = new MoveOrder(gfxElementMock.object, 100, 110, 10, () => {});
      mo.start();
      mo.end();

      mo.update(1);

      // should only move it to final position - no further updates
      gfxElementMock.verify(x => x.setX(TypeMoq.It.isValue(100)), TypeMoq.Times.once());
      gfxElementMock.verify(x => x.setY(TypeMoq.It.isValue(110)), TypeMoq.Times.once());
    });
    it('should end when time reached', () => {
      let done = false;
      const mo = new MoveOrder(gfxElementMock.object, 100, 110, 10, () => {done = true;});
      mo.start();

      mo.update(10);

      gfxElementMock.verify(x => x.setX(TypeMoq.It.isValue(100)), TypeMoq.Times.once());
      gfxElementMock.verify(x => x.setY(TypeMoq.It.isValue(110)), TypeMoq.Times.once());
      expect(done).toBeTruthy();
    });
    it('should callback', () => {
      let callbackCalled = false;
      const mo = new MoveOrder(gfxElementMock.object, 100, 110, 10, () => {}, () => {callbackCalled = true;});
      mo.start();

      mo.update(10);

      gfxElementMock.verify(x => x.setX(TypeMoq.It.isValue(100)), TypeMoq.Times.once());
      gfxElementMock.verify(x => x.setY(TypeMoq.It.isValue(110)), TypeMoq.Times.once());
      expect(callbackCalled).toBeTruthy();
    });
  });
});
