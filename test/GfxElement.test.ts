import * as TypeMoq from 'typemoq';
import { ICanvasContextWrapper } from '../src/CanvasContextWrapper';
import { EventType } from '../src/EventType';
import { GfxElement } from '../src/GfxElement';
import { GfxElementZIndexComparable } from '../src/GfxElementZIndexComparable';
import { IGfxPanel } from '../src/GfxPanel';
import { SLGfxMouseEvent } from '../src/SLGfxMouseEvent';

class TestGfxElement extends GfxElement {
  public render(canvasContext: ICanvasContextWrapper, time: number, diff: number): void {
    
  }
}

describe("GfxElement", function() {
  let element: GfxElement;
  const gfxPanelMock: TypeMoq.IMock<IGfxPanel> = TypeMoq.Mock.ofType<IGfxPanel>();
  const canvasContextMock: TypeMoq.IMock<ICanvasContextWrapper> = TypeMoq.Mock.ofType<ICanvasContextWrapper>();

  beforeEach(function() {
    gfxPanelMock.reset();
    gfxPanelMock.setup(x => x.getScaleX()).returns(() => 1);
    gfxPanelMock.setup(x => x.getScaleY()).returns(() => 1);
    canvasContextMock.reset();
    element = new TestGfxElement({
      gfxPanel: gfxPanelMock.object,
      width: 24,
      height: 32
    });
  });

  describe("#isDirty()", function() {
    it("should true if dirty", function() {
      element.setDirty(true);
      var dirty = element.isDirty();
      expect(dirty).toBeTruthy();
    });
    it("should true if hasCollision", function() {
      element.setHasCollision(true);
      var dirty = element.isDirty();
      expect(dirty).toBeTruthy();
    });
    // it("should true if hadCollisionPreviousFrame", function() {
    //   element._hadCollisionPreviousFrame = true;
    //   var dirty = element.isDirty();
    //   expect(dirty).toBeTruthy();
    // });
  });
  describe("#setDirty()", function() {
    it("should set dirty", function() {
      element.setDirty(true);
      expect(element.isDirty()).toBeTruthy();
    });
  });
  describe("#isHidden()", function() {
    it("should return isHidden", function() {
      element.setHidden(false);
      var hidden = element.isHidden();
      expect(hidden).toBeFalsy();
    });
  });
  describe("#setHidden()", function() {
    it("should return isHidden", function() {
      element.setHidden(true);
      var hidden = element.isHidden();
      expect(hidden).toBeTruthy();
    });
  });
  describe("#hasCollision()", function() {
    it("should return hasCollision", function() {
      element.setHasCollision(true);
      var hasCollision = element.hasCollision();
      expect(hasCollision).toBeTruthy();
    });
  });
  describe("#setHasCollision()", function() {
    it("should set has collision", function() {
      element.setHasCollision(true);
      element.setHasCollision(false);
      var hasCollision = element.hasCollision();
      expect(hasCollision).toBeFalsy();
    });
  });
  describe("#getZIndex()", function() {
    it("should return zindex", function() {
      var expected = 50;
      element.setZIndex(expected);
      var zindex = element.getZIndex();
      expect(zindex).toBeTruthy();
    });
  });
  describe("#setZIndex()", function() {
    it("should set zindex", function() {
      var expected = 250;
      element.setZIndex(50);
      element.setZIndex(expected);
      var zindex = element.getZIndex();
      expect(zindex).toBeTruthy();
    });
  });
  describe("#getPanelScaleX()", function() {
    it("should return screen scalex", function() {
      var scaleX = element.getPanelScaleX();
      expect(scaleX).toBe(1);
    });
  });
  describe("#getPanelScaleY()", function() {
    it("should return screen scaley", function() {
      var scaleY = element.getPanelScaleY();
      expect(scaleY).toBe(1);
    });
  });
  describe("#getTotalScaleX()", function() {
    it("should return total scalex", function() {
      gfxPanelMock.reset();
      gfxPanelMock.setup(x => x.getScaleX()).returns(() => 2);
      element = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 24,
        height: 32,
        scaleX:3
      });
      var scaleX = element.getTotalScaleX();
      expect(scaleX).toBe(element.getElementScaleX() * element.getPanelScaleX());
    });
  });
  describe("#getTotalScaleY()", function() {
    it("should return total scaley", function() {
      gfxPanelMock.reset();
      gfxPanelMock.setup(x => x.getScaleY()).returns(() => 4);
      element = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 24,
        height: 32,
        scaleY: 7
      });
      var scaleY = element.getTotalScaleY();
      expect(scaleY).toBe(element.getElementScaleY() * element.getPanelScaleY());
    });
  });
  describe("#getElementScaleX()", function() {
    it("should return element scalex", function() {
      var scaleX = element.getElementScaleX();
      expect(scaleX).toBe(1);
    });
  });
  describe("#getElementScaleY()", function() {
    it("should return element scaley", function() {
      var scaleY = element.getElementScaleY();
      expect(scaleY).toBe(1);
    });
  });
  describe("#setElementScaleX()", function() {
    it("should set element scalex", function() {
      var expected = 10;
      element.setElementScaleX(expected);
      var scaleX = element.getElementScaleX();
      expect(scaleX).toBe(expected);
    });
  });
  describe("#setElementScaleY()", function() {
    it("should set element scaley", function() {
      var expected = 10;
      element.setElementScaleY(expected);
      var scaleY = element.getElementScaleY();
      expect(scaleY).toBe(expected);
    });
  });
  describe("#getX()", function() {
    it("should return x", function() {
      var expected = 0;
      var x = element.getX();
      expect(x).toBe(expected);
    });
  });
  describe("#getY()", function() {
    it("should return x", function() {
      var expected = 0;
      var y = element.getY();
      expect(y).toBe(expected);
    });
  });
  describe("#setX()", function() {
    it("should set x", function() {
      var expected = 50;
      element.setX(expected);
      var x = element.getX();
      expect(x).toBe(expected);
    });
    it("should mark dirty", function() {
      element.setX(50);
      var result = element.isDirty();
      expect(result).toBeTruthy();
    });
  });
  describe("#getY()", function() {
    it("should set y", function() {
      var expected = 30;
      element.setY(expected);
      var y = element.getY();
      expect(y).toBe(expected);
    });
    it("should mark dirty", function() {
      element.setY(30);
      var result = element.isDirty();
      expect(result).toBeTruthy();
    });
  });
  // describe("#getLastX()", function() {
  //   it("should return last x", function() {
  //     element._lastX = 3;
  //     var result = element.getLastX();
  //     expect(result).toBe(element._lastX);
  //   });
  // });
  // describe("#getLastY()", function() {
  //   it("should return last y", function() {
  //     element._lastY = 3;
  //     var result = element.getLastY();
  //     expect(result).toBe(element._lastY);
  //   });
  // });
  // describe("#setLastX()", function() {
  //   it("should return last x", function() {
  //     var expected = 7;
  //     element.setLastX(expected);
  //     var result = element.getLastX();
  //     expect(result).toBe(expected);
  //   });
  // });
  // describe("#setLastY()", function() {
  //   it("should return last Y", function() {
  //     var expected = 8;
  //     element.setLastY(expected);
  //     var result = element.getLastY();
  //     expect(result).toBe(expected);
  //   });
  // });
  describe("#setMoveRates()", function() {
    it("should set move rates", function(done) {
      element.notify = function() {};
      var expectedX = 10, expectedY = 20;
      element.setMoveRates(expectedX, expectedY);
      expect(element.getMoveRateX()).toBe(expectedX);
      expect(element.getMoveRateY()).toBe(expectedY);
      done();
    });
    it("should notify element stopped moving", function(done) {
      let calledIt = false;
      element.on(EventType.ELEMENT_STOPPED_MOVING, () => calledIt = true);

      element.setMoveRates(10, 3);
      element.setMoveRates(0, 0);
      expect(calledIt).toBeTruthy();
      done();
    });
    it("should notify element started moving", function(done) {
      let calledIt = false;
      element.on(EventType.ELEMENT_STARTED_MOVING, () => calledIt = true);

      element.setMoveRates(10, 3);
      expect(calledIt).toBeTruthy();
      done();
    });
  });
  describe("#getMoveRateX()", function() {
    it("should return move rate", function() {
      const expected = 3;
      element.setMoveRates(expected, 0);
      var result = element.getMoveRateX();
      expect(result).toBe(expected);
    });
  });
  describe("#getMoveRateY()", function() {
    it("should return move rate", function() {
      const expected = 7;
      element.setMoveRates(0, 7);
      const result = element.getMoveRateY();
      expect(result).toBe(expected);
    });
  });
  describe("#moveTo()", function() {
    // it("should add move to queue", function(done) {
    //   element._runMove = function() {};
    //   var x = 10, y = 10, duration = 200;
    //   element.moveTo(x, y, duration);
    //   expect(element._moveQueue.size()).toBeGreaterThan(0);
    //   done();
    // });
    // it("should call run move", function(done) {
    //   var result = false;
    //   element._runMove = function() {
    //     result = true;
    //   };
    //   var x = 10, y = 10, duration = 200;
    //   element.moveTo(x, y, duration);
    //   expect(result).toBeTruthy();
    //   done();
    // });
    it("should notify if element started moving", function(done) {
      let calledIt = false;
      element.on(EventType.ELEMENT_STARTED_MOVING, () => calledIt = true);
      var x = 10, y = 10, duration = 200;
      element.moveTo(x, y, duration);
      expect(calledIt).toBeTruthy();
      done();
    });
  });
  describe("#_runMove()", function() {
    // it("start move if one exists", function(done) {
    //   var mockMove = {
    //     start:function() {
    //       this.calledIt = true;
    //     }
    //   };
    //   element._moveQueue.push(mockMove);

    //   element._runMove();

    //   expect(mockMove.calledIt).toBeTruthy();
    //   done();
    // });
    // it("should notify if element stopped", function(done) {
    //   var result = null;
    //   element.notify = function(event) {
    //     result = event.type;
    //   };

    //   element._runMove();

    //   expect(result).toBe(EventType.ELEMENT_STOPPED_MOVING);
    //   done();
    // });
  });
  // describe("#moveOrderCallback()", function() {
  //   it("should set current moved null", function(done) {
  //     element._currentMove = {};
  //     element.moveOrderCallback();
  //     expect(element._currentMove).toBe(null);
  //     done();
  //   });
  //   it("should set current moved null", function(done) {
  //     var result = false;
  //     element._runMove = function() {result = true;};
  //     element.moveOrderCallback();
  //     expect(result).toBeTruthy();
  //     done();
  //   });
  // });
  // describe("#clearMoveQueue()", function() {
  //   it("should clear movequeue", function(done) {
  //     var result = false;
  //     element._moveQueue.clear = function() {result = true;};
  //     element.clearMoveQueue();
  //     expect(result).toBeTruthy();
  //     done();
  //   });
  // });
  // describe("#turnoff()", function() {
  //   it("should turn stuff off", function(done) {
  //     var clearedMoves = false;
  //     element._moveQueue.clear = function() {clearedMoves = true;};
  //     var calledHide = false;
  //     element.hide = function() {calledHide = true;};
  //     element._currentMove = {};
  //     element._xMoveRate = 10;
  //     element._yMoveRate = 20;
  //     this._xMoveFractionalAccumulator = 8;
  //     this._yMoveFractionalAccumulator = 18;

  //     element.turnOff();

  //     expect(clearedMoves).toBeTruthy();
  //     expect(calledHide).toBeTruthy();
  //     expect(element._xMoveRate).toBe(0);
  //     expect(element._yMoveRate).toBe(0);
  //     expect(element._xMoveFractionalAccumulator).toBe(0);
  //     expect(element._yMoveFractionalAccumulator).toBe(0);
  //     done();
  //   });
  // });
  describe("#show()", function() {
    it("should set hidden false;", function(done) {
      element.setHidden(true);
      element.show();
      expect(element.isHidden()).toBeFalsy();
      done();
    });
    it("should set dirty true;", function(done) {
      element.setHidden(true);
      element.show();
      expect(element.isDirty()).toBeTruthy();
      done();
    });
  });
  describe("#hide()", function() {
    it("should set hidden true;", function(done) {
      element.setHidden(false);
      element.hide();
      expect(element.isHidden()).toBeTruthy();
      done();
    });
    it("should set dirty true;", function(done) {
      element.setHidden(false);
      element.hide();
      expect(element.isDirty()).toBeTruthy();
      done();
    });
  });
  describe("#update()", function() {
    // it("should call update location from move rates", function(done) {
    //   var result = false;
    //   element._updateLocationFromMoveRates = function() {result = true;};

    //   element.update(1,1);

    //   expect(result).toBeTruthy();
    //   done();
    // });
    // it("should call _updateMoveOrder", function(done) {
    //   var result = false;
    //   element._updateLocationFromMoveRates = function() {};
    //   element._updateMoveOrder = function() {result = true;};

    //   element.update(1,1);

    //   expect(result).toBeTruthy();
    //   done();
    // });
    // it("should set dirty if element moved", function(done) {
    //   element._updateLocationFromMoveRates = function() {};
    //   element._updateMoveOrder = function() {};
    //   element._x = 10;

    //   element.update(1,1);

    //   expect(element.isDirty()).toBeTruthy();
    //   done();
    // });
    it("should notify if element moved", function(done) {
      let calledIt = false;
      element.setX(5);
      element.setY(6);
      element.on(EventType.ELEMENT_MOVED, () => calledIt = true);
      element.moveTo(10, 11, 16);

      element.update(17, 16);

      expect(calledIt).toBeTruthy();
      done();
    });
    it("should return element", function(done) {
      element.setX(5);
      element.setY(6);
      element.moveTo(10, 11, 16);

      const result = element.update(17, 16);

      expect(result).toBeTruthy();
      done();
    });
    it("should return null", function(done) {
      element.setDirty(false);

      var result = element.update(1,1);

      expect(result).toBe(null);
      done();
    });
  });
  describe("#_updateLocationFromMoveRates()", function() {
    it("should update location", function(done){
      element.setMoveRates(10, 10);

      element.update(1000, 1000);

      expect(element.getX()).toBe(10);
      expect(element.getY()).toBe(10);
      expect(element.isDirty()).toBeTruthy();
      done();
    });
    // it("should increment accumulator", function(done){
    //   element.setDirty(false);
    //   element.setMoveRates(10,10);

    //   element._updateLocationFromMoveRates(10, 10);

    //   expect(element._xMoveFractionalAccumulator).toBe(0.10);
    //   expect(element._yMoveFractionalAccumulator).toBe(0.10);
    //   expect(element.isDirty()).toBeFalsy();
    //   done();
    // });
    // it("should clear accumulator", function(done){
    //   element._xMoveFractionalAccumulator = 0.57;
    //   element._xMoveFractionalAccumulator = 0.7;
    //   element.setMoveRates(0,0);

    //   element._updateLocationFromMoveRates(10, 10);

    //   expect(element._xMoveFractionalAccumulator).toBe(0);
    //   expect(element._yMoveFractionalAccumulator).toBe(0);
    //   done();
    // });
  });
  // describe("#_updateMoveOrder()", function() {
  //   it("should update current moveOrder", function(done) {
  //     var result = false;
  //     element.setDirty(false);
  //     element._currentMove = {
  //       update : function() {result = true;}
  //     };

  //     element._updateMoveOrder(1,1);

  //     expect(result).toBeTruthy();
  //     expect(element.isDirty()).toBeTruthy();
  //     done();
  //   });
  // });
  describe("#clear()", function () {
    it("should clear last frame collision box", function(done) {
      element = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 7,
        height: 8,
        x: -1,
        y: -1
      });
      
      element.update(1, 1);
      element.postRender(1, 1); // save last collision box

      element.clear(canvasContextMock.object);

      canvasContextMock.verify(x => x.clearRect(
        TypeMoq.It.isValue(element.getX() + GfxElement.AntiAliasCorrection.coordinateOffset),
        TypeMoq.It.isValue(element.getY() + GfxElement.AntiAliasCorrection.coordinateOffset),
        TypeMoq.It.isValue(element.getWidth() + GfxElement.AntiAliasCorrection.sizeAdjustment),
        TypeMoq.It.isValue(element.getHeight() + GfxElement.AntiAliasCorrection.sizeAdjustment)
      ), TypeMoq.Times.once());
      done();
    });
  });
  describe("#postRender()", function() {
    it("should update internal values", function(done) {
      element.setX(10);
      element.setY(10);
      element.setHasCollision(true);
      element.update(1, 1);
      element.postRender(1, 1);
      // deal with collision on previous frame
      element.update(2, 1);

      element.postRender(2, 1);

      expect(element.isDirty()).toBeFalsy();
      expect(element.hasCollision()).toBeFalsy();
      done();
    });
  });
  describe("#collidesWith()", function() {
    it("should return true if collision boxes overlap", function(done) {
      const other = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 5,
        height: 6
      });
      element = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 5,
        height: 6
      });

      const result = element.collidesWith(other);

      expect(result).toBeTruthy();
      done();
    });
    it("should return false if collision boxes dont overlap", function(done) {
      const other = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 5,
        height: 6,
        x: 50
      });
      element = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 5,
        height: 6
      });

      const result = element.collidesWith(other);

      expect(result).toBeFalsy();
      done();
    });
    it("should return true if collision boxes touch", function(done) {
      const other = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 5,
        height: 6,
        x: 5
      });
      element = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 5,
        height: 6
      });

      var result = element.collidesWith(other);

      expect(result).toBeTruthy();
      done();
    });
    it("should notify on collision", function(done) {
      const other = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 5,
        height: 6
      });
      element = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 5,
        height: 6
      });
      var calledIt = false;
      element.on(EventType.ELEMENT_COLLISION, () => calledIt = true);

      element.collidesWith(other);

      expect(calledIt).toBeTruthy();
      done();
    });
  });
  describe("#collidesWithCoordinates()", function() {
    it("should return false if coord x < element x", function(done) {
      var result = element.collidesWithCoordinates(-2, 0);

      expect(result).toBeFalsy();
      done();
    });
    it("should return false if coord x > element x + element width", function(done) {
      var result = element.collidesWithCoordinates(32, 0);

      expect(result).toBeFalsy();
      done();
    });
    it("should return false if coord y < element y", function(done) {
      var result = element.collidesWithCoordinates(0, -2);

      expect(result).toBeFalsy();
      done();
    });
    it("should return false if coord y > element y + element height", function(done) {
      var result = element.collidesWithCoordinates(0, 42);

      expect(result).toBeFalsy();
      done();
    });
    it("should return true if coords inside element bounds", function(done) {
      var result = element.collidesWithCoordinates(3,3);

      expect(result).toBeTruthy();
      done();
    });
    it("should return true if coords touch element bounds", function(done) {
      var result = element.collidesWithCoordinates(24, 32);

      expect(result).toBeTruthy();
      done();
    });
  });
  describe("#collidesWithX()", function(){
    it("should return false if coord x < element x", function(done) {
      var result = element.collidesWithX(-2);

      expect(result).toBeFalsy();
      done();
    });
    it("should return false if coord x > element x + element width", function(done) {
      var result = element.collidesWithX(32);

      expect(result).toBeFalsy();
      done();
    });
    it("should return true if coords x is inside element bounds", function(done) {
      var result = element.collidesWithX(3);

      expect(result).toBeTruthy();
      done();
    });
    it("should return true if coord x touches element bounds", function(done) {
      var result = element.collidesWithX(24);

      expect(result).toBeTruthy();
      done();
    });
  });
  describe("#collidesWithY()", function(){
    it("should return false if coord y < element y", function(done) {
      var result = element.collidesWithY(-2);

      expect(result).toBeFalsy();
      done();
    });
    it("should return false if coord y > element y + element height", function(done) {
      var result = element.collidesWithY(34);

      expect(result).toBeFalsy();
      done();
    });
    it("should return true if coord is inside element bounds", function(done) {
      var result = element.collidesWithY(10);

      expect(result).toBeTruthy();
      done();
    });
    it("should return true if coord y touches element bounds", function(done) {
      var result = element.collidesWithY(32);

      expect(result).toBeTruthy();
      done();
    });
  });
  describe("#getCollisionBoxX()", function() {
    it("should return collision box", function(done) {
      gfxPanelMock.reset();
      gfxPanelMock.setup(x => x.getScaleX()).returns(() => 2);
      element.setX(3);
      var result = element.getCollisionBoxX();

      var expected = 5;
      expect(result).toBe(expected);
      done();
    });
  });
  describe("#getCollisionBoxY()", function() {
    it("should return collision box", function(done) {
      gfxPanelMock.reset();
      gfxPanelMock.setup(x => x.getScaleY()).returns(() => 2);
      element.setY(3);
      var result = element.getCollisionBoxY();

      var expected = 5;
      expect(result).toBe(expected);
      done();
    });
  });
  describe("#getCollisionBoxWidth()", function() {
    it("should return collision box", function(done) {
      gfxPanelMock.reset();
      gfxPanelMock.setup(x => x.getScaleX()).returns(() => 2);
      element = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 8,
        height: 10,
        scaleX: 2
      });

      var result = element.getCollisionBoxWidth();

      var expected = 34;
      expect(result).toBe(expected);
      done();
    });
  });
  describe("#getCollisionBoxHeight()", function() {
    it("should return collision box", function(done) {
      gfxPanelMock.reset();
      gfxPanelMock.setup(x => x.getScaleY()).returns(() => 2);
      element = new TestGfxElement({
        gfxPanel: gfxPanelMock.object,
        width: 8,
        height: 8,
        scaleY: 2
      });

      var result = element.getCollisionBoxHeight();

      var expected = 34;
      expect(result).toBe(expected);
      done();
    });
  });
  describe("#handleMouseEvent()", function() {

    beforeEach(function() {

    });
    it("should notify MOUSE_MOVE_OVER_ELEMENT", function(done) {
      const event = new SLGfxMouseEvent(EventType.MOUSE_MOVE, {
        x: 0, 
        y: 0,
        rawX: 0, 
        rawY: 0,
        viewOriginAdjustedX: 0,
        viewOriginAdjustedY: 0
      });
      let calledId = false;
      element.on(EventType.MOUSE_MOVE_OVER_ELEMENT, () => calledId = true);

      element.handleMouseEvent(event);

      expect(calledId).toBeTruthy();
      done();
    });
    it("should notify MOUSE_DOWN_ON_ELEMENT", function(done) {
      const event = new SLGfxMouseEvent(EventType.MOUSE_DOWN, {
        x: 0, 
        y: 0,
        rawX: 0, 
        rawY: 0,
        viewOriginAdjustedX: 0,
        viewOriginAdjustedY: 0
      });
      let calledId = false;
      element.on(EventType.MOUSE_DOWN_ON_ELEMENT, () => calledId = true);

      element.handleMouseEvent(event);

      expect(calledId).toBeTruthy();
      done();
    });
    it("should notify MOUSE_UP_ON_ELEMENT", function(done) {
      const event = new SLGfxMouseEvent(EventType.MOUSE_UP, {
        x: 0, 
        y: 0,
        rawX: 0, 
        rawY: 0,
        viewOriginAdjustedX: 0,
        viewOriginAdjustedY: 0
      });
      let calledId = false;
      element.on(EventType.MOUSE_UP_ON_ELEMENT, () => calledId = true);

      element.handleMouseEvent(event);

      expect(calledId).toBeTruthy();
      done();
    });
    it("should endEventPropagation of originating event", function(done) {
      const event = new SLGfxMouseEvent(EventType.MOUSE_DOWN, {
        x: 0, 
        y: 0,
        rawX: 0, 
        rawY: 0,
        viewOriginAdjustedX: 0,
        viewOriginAdjustedY: 0
      });
      element.on(EventType.MOUSE_DOWN_ON_ELEMENT, (e) => (e as SLGfxMouseEvent).endEventPropagation = true);

      element.handleMouseEvent(event);

      expect(event.endEventPropagation).toBeTruthy();
      done();
    });
  });

  describe("#clearEventHandlers()", function(){
    it("should add callback to list", function(done) {
      var didNotCallIt = true;
      element.on(EventType.ELEMENT_MOVED, () => didNotCallIt = false);

      element.clearEventListeners(EventType.ELEMENT_MOVED);
      element.setY(50);
      element.update(1000, 1000);

      expect(didNotCallIt).toBeTruthy();
      done();
    });
  });
  describe("#notify()", function() {
    it("should notify fgxPanel", function(done) {
      let calledIt = false;
      gfxPanelMock.setup(x => x.notify(TypeMoq.It.isAny())).callback(() => calledIt = true);

      element.setY(60);
      element.update(1000, 1000);

      expect(calledIt).toBeTruthy();
      done();
    });
  });
  describe("#getZIndexComparable()", function() {
    it("should return zindex comparable", function(done) {
      var result = element.getZIndexComparable();
      expect(result).toBeInstanceOf(GfxElementZIndexComparable);
      done();
    });
  });
});

