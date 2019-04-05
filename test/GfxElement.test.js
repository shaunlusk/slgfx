var GfxElement = require('../src/GfxElement');
var GfxElementZIndexComparable = require('../src/GfxElementZIndexComparable');
var Mocks = require('./Mocks');
var EventType = require('../src/EventType');

describe("GfxElement", function() {
  var element;

  beforeEach(function() {
    element = getGfxElement();
  });

  describe("#getId()", function() {
    it("should return element id", function() {
      var id = element.getId();
      expect(id).toBe(0);
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
    it("should true if hadCollisionPreviousFrame", function() {
      element._hadCollisionPreviousFrame = true;
      var dirty = element.isDirty();
      expect(dirty).toBeTruthy();
    });
  });
  describe("#setDirty()", function() {
    it("should set dirty", function() {
      element.setDirty(true);
      var dirty = element._dirty;
      expect(dirty).toBeTruthy();
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
  describe("#getCanvasContextWrapper()", function() {
    it("should return canvas context", function() {
      var context = element.getCanvasContextWrapper();
      expect(context).toBeTruthy();
    });
  });
  describe("#getScreenContext()", function() {
    it("should return screen context", function() {
      var context = element.getScreenContext();
      expect(context).toBeTruthy();
    });
  });
  describe("#getScreenScaleX()", function() {
    it("should return screen scalex", function() {
      var scaleX = element.getScreenScaleX();
      expect(scaleX).toBe(1);
    });
  });
  describe("#getScreenScaleY()", function() {
    it("should return screen scaley", function() {
      var scaleY = element.getScreenScaleY();
      expect(scaleY).toBe(1);
    });
  });
  describe("#getTotalScaleX()", function() {
    it("should return total scalex", function() {
      element = new GfxElement({
        screenContext:Mocks.getMockScreen({scaleX:2}),
        canvasContextWrapper:Mocks.getMockCanvasContextWrapper(),
        scaleX:3}
      );
      var scaleX = element.getTotalScaleX();
      expect(scaleX).toBe(element.getElementScaleX() * element.getScreenScaleX());
    });
  });
  describe("#getTotalScaleY()", function() {
    it("should return total scaley", function() {
      element = new GfxElement({
        screenContext:Mocks.getMockScreen({scaleY:4}),
        canvasContextWrapper:Mocks.getMockCanvasContextWrapper(),
        scaleY:7
      });
      var scaleY = element.getTotalScaleY();
      expect(scaleY).toBe(element.getElementScaleY() * element.getScreenScaleY());
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
  describe("#getLastX()", function() {
    it("should return last x", function() {
      element._lastX = 3;
      var result = element.getLastX();
      expect(result).toBe(element._lastX);
    });
  });
  describe("#getLastY()", function() {
    it("should return last y", function() {
      element._lastY = 3;
      var result = element.getLastY();
      expect(result).toBe(element._lastY);
    });
  });
  describe("#setLastX()", function() {
    it("should return last x", function() {
      var expected = 7;
      element.setLastX(expected);
      var result = element.getLastX();
      expect(result).toBe(expected);
    });
  });
  describe("#setLastY()", function() {
    it("should return last Y", function() {
      var expected = 8;
      element.setLastY(expected);
      var result = element.getLastY();
      expect(result).toBe(expected);
    });
  });
  describe("#setMoveRates()", function() {
    it("should set move rates", function(done) {
      element.notify = function() {};
      var expectedX = 10, expectedY = 20;
      element.setMoveRates(expectedX, expectedY);
      expect(element._xMoveRate).toBe(expectedX);
      expect(element._yMoveRate).toBe(expectedY);
      done();
    });
    it("should notify element stopped moving", function(done) {
      var result = null;
      element.notify = function(event) {
        result = event.type;
      };
      var expectedX = 0, expectedY = 0;
      element._xMoveRate = 10;
      element.setMoveRates(expectedX, expectedY);
      expect(result).toBe(EventType.ELEMENT_STOPPED_MOVING);
      done();
    });
    it("should notify element started moving", function(done) {
      var result = null;
      element.notify = function(event) {
        result = event.type;
      };
      var expectedX = 10, expectedY = 2;
      element.setMoveRates(expectedX, expectedY);
      expect(result).toBe(EventType.ELEMENT_STARTED_MOVING);
      done();
    });
  });
  describe("#getMoveRateX()", function() {
    it("should return move rate", function() {
      element._xMoveRate = 3;
      var result = element.getMoveRateX();
      expect(result).toBe(element._xMoveRate);
    });
  });
  describe("#getMoveRateY()", function() {
    it("should return move rate", function() {
      element._yMoveRate = 3;
      var result = element.getMoveRateY();
      expect(result).toBe(element._yMoveRate);
    });
  });
  describe("#moveTo()", function() {
    it("should add move to queue", function(done) {
      element._runMove = function() {};
      var x = 10, y = 10, duration = 200;
      element.moveTo(x, y, duration);
      expect(element._moveQueue.size()).toBeGreaterThan(0);
      done();
    });
    it("should call run move", function(done) {
      var result = false;
      element._runMove = function() {
        result = true;
      };
      var x = 10, y = 10, duration = 200;
      element.moveTo(x, y, duration);
      expect(result).toBeTruthy();
      done();
    });
    it("should notify if element started moving", function(done) {
      var result = null;
      element._runMove = function() {};
      element.notify = function(event) {
        result = event.type;
      };
      var x = 10, y = 10, duration = 200;
      element.moveTo(x, y, duration);
      expect(result).toBe(EventType.ELEMENT_STARTED_MOVING);
      done();
    });
  });
  describe("#_runMove()", function() {
    it("start move if one exists", function(done) {
      var mockMove = {
        start:function() {
          this.calledIt = true;
        }
      };
      element._moveQueue.push(mockMove);

      element._runMove();

      expect(mockMove.calledIt).toBeTruthy();
      done();
    });
    it("should notify if element stopped", function(done) {
      var result = null;
      element.notify = function(event) {
        result = event.type;
      };

      element._runMove();

      expect(result).toBe(EventType.ELEMENT_STOPPED_MOVING);
      done();
    });
  });
  describe("#moveOrderCallback()", function() {
    it("should set current moved null", function(done) {
      element._currentMove = {};
      element.moveOrderCallback();
      expect(element._currentMove).toBe(null);
      done();
    });
    it("should set current moved null", function(done) {
      var result = false;
      element._runMove = function() {result = true;};
      element.moveOrderCallback();
      expect(result).toBeTruthy();
      done();
    });
  });
  describe("#clearMoveQueue()", function() {
    it("should clear movequeue", function(done) {
      var result = false;
      element._moveQueue.clear = function() {result = true;};
      element.clearMoveQueue();
      expect(result).toBeTruthy();
      done();
    });
  });
  describe("#turnoff()", function() {
    it("should turn stuff off", function(done) {
      var clearedMoves = false;
      element._moveQueue.clear = function() {clearedMoves = true;};
      var calledHide = false;
      element.hide = function() {calledHide = true;};
      element._currentMove = {};
      element._xMoveRate = 10;
      element._yMoveRate = 20;
      this._xMoveFractionalAccumulator = 8;
      this._yMoveFractionalAccumulator = 18;

      element.turnOff();

      expect(clearedMoves).toBeTruthy();
      expect(calledHide).toBeTruthy();
      expect(element._xMoveRate).toBe(0);
      expect(element._yMoveRate).toBe(0);
      expect(element._xMoveFractionalAccumulator).toBe(0);
      expect(element._yMoveFractionalAccumulator).toBe(0);
      done();
    });
  });
  describe("#show()", function() {
    it("should set hidden false;", function(done) {
      element._hidden = true;
      element.show();
      expect(element.isHidden()).toBeFalsy();
      done();
    });
    it("should set dirty true;", function(done) {
      element._dirty = false;
      element.show();
      expect(element.isDirty()).toBeTruthy();
      done();
    });
  });
  describe("#hide()", function() {
    it("should set hidden true;", function(done) {
      element._hidden = false;
      element.hide();
      expect(element.isHidden()).toBeTruthy();
      done();
    });
    it("should set dirty true;", function(done) {
      element._dirty = false;
      element.hide();
      expect(element.isDirty()).toBeTruthy();
      done();
    });
  });
  describe("#update()", function() {
    it("should call update location from move rates", function(done) {
      var result = false;
      element._updateLocationFromMoveRates = function() {result = true;};

      element.update(1,1);

      expect(result).toBeTruthy();
      done();
    });
    it("should call _updateMoveOrder", function(done) {
      var result = false;
      element._updateLocationFromMoveRates = function() {};
      element._updateMoveOrder = function() {result = true;};

      element.update(1,1);

      expect(result).toBeTruthy();
      done();
    });
    it("should set dirty if element moved", function(done) {
      element._updateLocationFromMoveRates = function() {};
      element._updateMoveOrder = function() {};
      element._x = 10;

      element.update(1,1);

      expect(element.isDirty()).toBeTruthy();
      done();
    });
    it("should notify if element moved", function(done) {
      var result = null;
      element.notify = function(event) {result = event.type;};
      element._updateLocationFromMoveRates = function() {};
      element._updateMoveOrder = function() {};
      element._updateMoveOrder = function() {};
      element._x = 10;

      element.update(1,1);

      expect(result).toBe(EventType.ELEMENT_MOVED);
      done();
    });
    it("should return element", function(done) {
      element.notify = function(event) {result = event.type;};
      element._updateLocationFromMoveRates = function() {};
      element._updateMoveOrder = function() {};
      element._updateMoveOrder = function() {};
      element._x = 10;

      var result = element.update(1,1);

      expect(result).toBeTruthy();
      done();
    });
    it("should return null", function(done) {
      element.notify = function(event) {result = event.type;};
      element._updateLocationFromMoveRates = function() {};
      element._updateMoveOrder = function() {};
      element._updateMoveOrder = function() {};
      element.setDirty(false);

      var result = element.update(1,1);

      expect(result).toBe(null);
      done();
    });
  });
  describe("#_updateLocationFromMoveRates()", function() {
    it("should update location", function(done){
      element.setMoveRates(10,10);

      element._updateLocationFromMoveRates(1000, 1000);

      expect(element.getX()).toBe(10);
      expect(element.getY()).toBe(10);
      expect(element.isDirty()).toBeTruthy();
      done();
    });
    it("should increment accumulator", function(done){
      element.setDirty(false);
      element.setMoveRates(10,10);

      element._updateLocationFromMoveRates(10, 10);

      expect(element._xMoveFractionalAccumulator).toBe(0.10);
      expect(element._yMoveFractionalAccumulator).toBe(0.10);
      expect(element.isDirty()).toBeFalsy();
      done();
    });
    it("should clear accumulator", function(done){
      element._xMoveFractionalAccumulator = 0.57;
      element._xMoveFractionalAccumulator = 0.7;
      element.setMoveRates(0,0);

      element._updateLocationFromMoveRates(10, 10);

      expect(element._xMoveFractionalAccumulator).toBe(0);
      expect(element._yMoveFractionalAccumulator).toBe(0);
      done();
    });
  });
  describe("#_updateMoveOrder()", function() {
    it("should update current moveOrder", function(done) {
      var result = false;
      element.setDirty(false);
      element._currentMove = {
        update : function() {result = true;}
      };

      element._updateMoveOrder(1,1);

      expect(result).toBeTruthy();
      expect(element.isDirty()).toBeTruthy();
      done();
    });
  });
  describe("#clear()", function () {
    it("should clear last frame collision box", function(done) {
      element._lastCollisionBoxX = -1;
      element._lastCollisionBoxY = -1;
      element._lastCollisionBoxWidth = 7;
      element._lastCollisionBoxHeight = 8;
      element.clear();
      var mockContext = element.getCanvasContextWrapper();
      expect(mockContext.clearedX).toBe(-1);
      expect(mockContext.clearedY).toBe(-1);
      expect(mockContext.clearedWidth).toBe(7);
      expect(mockContext.clearedHeight).toBe(8);
      done();
    });
  });
  describe("#postRender()", function() {
    it("should update internal values", function(done) {
      element.setX(10);
      element.setY(10);
      element.setHasCollision(true);
      element.postRender(1,1);

      expect(element.getLastX()).toBe(10);
      expect(element.getLastY()).toBe(10);
      expect(element._dirty).toBeFalsy();
      expect(element._hadCollisionPreviousFrame).toBeTruthy();
      expect(element.hasCollision()).toBeFalsy();
      done();
    });
  });
  describe("#collidesWith()", function() {
    it("should return true if collision boxes overlap", function(done) {
      var other = getGfxElement();
      other.getWidth = function() {return 5;};
      other.getHeight = function() {return 6;};
      element.getWidth = function() {return 5;};
      element.getHeight = function() {return 6;};

      var result = element.collidesWith(other);

      expect(result).toBeTruthy();
      done();
    });
    it("should return false if collision boxes dont overlap", function(done) {
      var other = getGfxElement();
      other.getWidth = function() {return 5;};
      other.getHeight = function() {return 6;};
      other.setX(50);
      element.getWidth = function() {return 5;};
      element.getHeight = function() {return 6;};

      var result = element.collidesWith(other);

      expect(result).toBeFalsy();
      done();
    });
    it("should return true if collision boxes touch", function(done) {
      var other = getGfxElement();
      other.getWidth = function() {return 5;};
      other.getHeight = function() {return 6;};
      other.setX(5);  //
      element.getWidth = function() {return 5;};
      element.getHeight = function() {return 6;};

      var result = element.collidesWith(other);

      expect(result).toBeTruthy();
      done();
    });
    it("should notify on collision", function(done) {
      var other = getGfxElement();
      other.getWidth = function() {return 5;};
      other.getHeight = function() {return 6;};
      element.getWidth = function() {return 5;};
      element.getHeight = function() {return 6;};
      var result = null;
      element.notify = function(event) {
        result = event.type;
      };

      element.collidesWith(other);

      expect(result).toBe(EventType.ELEMENT_COLLISION);
      done();
    });
  });
  describe("#collidesWithCoordinates()", function() {
    it("should return false if coord x < element x", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithCoordinates(-2,0);

      expect(result).toBeFalsy();
      done();
    });
    it("should return false if coord x > element x + element width", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithCoordinates(12,0);

      expect(result).toBeFalsy();
      done();
    });
    it("should return false if coord y < element y", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithCoordinates(0,-2);

      expect(result).toBeFalsy();
      done();
    });
    it("should return false if coord y > element y + element height", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithCoordinates(0,12);

      expect(result).toBeFalsy();
      done();
    });
    it("should return true if coords inside element bounds", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithCoordinates(3,3);

      expect(result).toBeTruthy();
      done();
    });
    it("should return true if coords touch element bounds", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithCoordinates(11,11);

      expect(result).toBeTruthy();
      done();
    });
  });
  describe("#collidesWithX()", function(){
    it("should return false if coord x < element x", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithX(-2);

      expect(result).toBeFalsy();
      done();
    });
    it("should return false if coord x > element x + element width", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithX(12);

      expect(result).toBeFalsy();
      done();
    });
    it("should return true if coords x is inside element bounds", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithX(3);

      expect(result).toBeTruthy();
      done();
    });
    it("should return true if coord x touches element bounds", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithX(11);

      expect(result).toBeTruthy();
      done();
    });
  });
  describe("#collidesWithY()", function(){
    it("should return false if coord y < element y", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithY(-2);

      expect(result).toBeFalsy();
      done();
    });
    it("should return false if coord y > element y + element height", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithY(12);

      expect(result).toBeFalsy();
      done();
    });
    it("should return true if coord is inside element bounds", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithY(10);

      expect(result).toBeTruthy();
      done();
    });
    it("should return true if coord y touches element bounds", function(done) {
      var element = getGfxElement();
      element.getWidth = function() {return 10;};
      element.getHeight = function() {return 10;};

      var result = element.collidesWithY(11);

      expect(result).toBeTruthy();
      done();
    });
  });
  describe("#getCollisionBoxX()", function() {
    it("should return collision box", function(done) {
      element.getScreenScaleX = function() {return 2;};
      element.setX(3);
      var result = element.getCollisionBoxX();

      var expected = 5;
      expect(result).toBe(expected, "should return collision box x. expected " + expected + ", actual " + result);
      done();
    });
  });
  describe("#getCollisionBoxY()", function() {
    it("should return collision box", function(done) {
      element.getScreenScaleY = function() {return 2;};
      element.setY(3);
      var result = element.getCollisionBoxY();

      var expected = 5;
      expect(result).toBe(expected, "should return collision box y. expected " + expected + ", actual " + result);
      done();
    });
  });
  describe("#getCollisionBoxWidth()", function() {
    it("should return collision box", function(done) {
      element.getTotalScaleX = function() {return 4;};
      element.getWidth = function() {return 8;};

      var result = element.getCollisionBoxWidth();

      var expected = 34;
      expect(result).toBe(expected, "should return collision box width. expected " + expected + ", actual " + result);
      done();
    });
  });
  describe("#getCollisionBoxHeight()", function() {
    it("should return collision box", function(done) {
      element.getTotalScaleY = function() {return 4;};
      element.getHeight = function() {return 8;};

      var result = element.getCollisionBoxHeight();

      var expected = 34;
      expect(result).toBe(expected, "should return collision box width. expected " + expected + ", actual " + result);
      done();
    });
  });
  describe("#handleMouseEvent()", function() {
    var result = null;
    beforeEach(function() {
      element.notify = function(event) {
        result = event.type;
      };
      element.collidesWithCoordinates = function() {
        return true;
      };
    });
    it("should notify MOUSE_MOVE_OVER_ELEMENT", function(done) {
      var event = {
        type : EventType.MOUSE_MOVE,
        data : {x:0, y:0, row:0, col:0, time:0}
      };

      element.handleMouseEvent(event);

      expect(result).toBe(EventType.MOUSE_MOVE_OVER_ELEMENT);
      done();
    });
    it("should notify MOUSE_DOWN_ON_ELEMENT", function(done) {
      var event = {
        type : EventType.MOUSE_DOWN,
        data : {x:0, y:0, row:0, col:0, time:0}
      };

      element.handleMouseEvent(event);

      expect(result).toBe(EventType.MOUSE_DOWN_ON_ELEMENT);
      done();
    });
    it("should notify MOUSE_UP_ON_ELEMENT", function(done) {
      var event = {
        type : EventType.MOUSE_UP,
        data : {x:0, y:0, row:0, col:0, time:0}
      };

      element.handleMouseEvent(event);

      expect(result).toBe(EventType.MOUSE_UP_ON_ELEMENT);
      done();
    });
    it("should endEventPropagation of originating event", function(done) {
      var event = {
        type : EventType.MOUSE_UP,
        data : {x:0, y:0, row:0, col:0, time:0}
      };
      element.notify = function(e) {e.endEventPropagation = true;};

      element.handleMouseEvent(event);

      expect(event.endEventPropagation).toBeTruthy();
      done();
    });
  });
  describe("#on()", function(){
    it("should add callback to list", function(done) {
      var eventType = "newType";
      element.on(eventType, function() {
        expect(true).toBeTruthy();
        done();
      }, "testHandler");
      element._eventListeners[eventType].testHandler();
    });
  });
  describe("#clearEventHandlers()", function(){
    it("should add callback to list", function(done) {
      var eventType = "newType";
      element.on(eventType, function() {}, "testHandler");

      element.clearEventHandlers(eventType);

      expect(element._eventListeners[eventType].testHandler).toBeUndefined();
      done();
    });
  });
  describe("#notify()", function() {
    it("should notify listeners", function(done) {
      var event = {type:"blerg"};
      element.getScreenContext = function() {
        return {notify:function(){}};
      };
      var result = false;
      element.on("blerg", function() {
        result = true;
      });

      element.notify(event);
      expect(result).toBeTruthy();
      done();
    });
    it("should notify screenContext", function(done) {
      var event = {type:"blerg"};
      element.on("blerg", function() {});
      var result = false;
      element.getScreenContext = function() {
        return {notify:function(){result = true;}};
      };

      element.notify(event);
      expect(result).toBeTruthy();
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

function getGfxElement(props) {
  var element = new GfxElement({
    ...props,
    screenContext:Mocks.getMockScreen(),
    canvasContextWrapper:Mocks.getMockCanvasContextWrapper()
  });
  return element;
}
