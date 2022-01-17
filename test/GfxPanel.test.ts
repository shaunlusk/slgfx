import * as TypeMoq from 'typemoq';
import { EventType } from '../src/EventType';
import { GfxLayer } from '../src/GfxLayer';
import { GfxPanel } from '../src/GfxPanel';
import { ILayerFactory, LayerFactory } from '../src/LayerFactory';
import { SLGfxMouseEvent } from '../src/SLGfxMouseEvent';

describe("GfxPanel", function() {
  let panel: GfxPanel;
  let calledRequestAnimationFrame: boolean;

  const targetElementMock: TypeMoq.IMock<HTMLElement> = TypeMoq.Mock.ofType<HTMLElement>();
  const canvasContextMock: TypeMoq.IMock<CanvasRenderingContext2D> = TypeMoq.Mock.ofType<CanvasRenderingContext2D>();
  const canvasElementMock: TypeMoq.IMock<HTMLCanvasElement> = TypeMoq.Mock.ofType<HTMLCanvasElement>();
  const documentMock: TypeMoq.IMock<Document> = TypeMoq.Mock.ofType<Document>();
  const gfxLayerMock: TypeMoq.IMock<GfxLayer> = TypeMoq.Mock.ofType<GfxLayer>();
  const layerFactoryMock: TypeMoq.IMock<ILayerFactory> = TypeMoq.Mock.ofType<ILayerFactory>();
  const requestAnimationFrame = function() {calledRequestAnimationFrame = true;};

  beforeEach(function() {
    targetElementMock.reset();
    canvasContextMock.reset();
    canvasElementMock.reset();
    documentMock.reset();
    gfxLayerMock.reset();
    layerFactoryMock.reset();

    canvasElementMock.setup(x => x.getContext("2d")).returns(() => canvasContextMock.object);
    documentMock.setup(x => x.createElement("CANVAS")).returns(() => canvasElementMock.object);
    layerFactoryMock.setup(x => x.createLayer(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).returns(() => gfxLayerMock.object);

    calledRequestAnimationFrame = false;
    
    panel = new GfxPanel({
      targetElement: targetElementMock.object,
      layerFactory: layerFactoryMock.object,
      requestAnimationFrame: requestAnimationFrame,
      document: documentMock.object
    });
  });
  describe("#visibilitychange", function() {
    let eventListeners: {[key: string]: () => void};
    beforeEach(() => {
      eventListeners = {};
      documentMock.reset();
      documentMock.setup(x => x.hidden).returns(() => true);
      documentMock.setup(
        x => x.addEventListener(TypeMoq.It.isAnyString(), TypeMoq.It.isAny(), TypeMoq.It.isAny())
      ).returns((eventType: string, callback: () => void) => {
        eventListeners[eventType] = callback;
      });
    });
    it("should unpause", function(done) {
      panel = new GfxPanel({
        targetElement: targetElementMock.object,
        requestAnimationFrame: requestAnimationFrame,
        document: documentMock.object
      });

      eventListeners['visibilitychange']();

      expect(panel.isPaused()).toBeFalsy();
      done();
    });
    it("should not unpause if explicitly paused", function(done) {
      panel = new GfxPanel({
        targetElement: targetElementMock.object,
        requestAnimationFrame: requestAnimationFrame,
        document: documentMock.object
      });
      panel.setPaused(true);

      eventListeners['visibilitychange']();

      expect(panel.isPaused()).toBeTruthy();
      done();
    });
  });
  describe('#viewOrigin', () => {
    // const 
    it('should set x', () => {
      const value = 5;
      panel.setViewOriginX(value);
      panel.render(0);
      expect(panel.getViewOriginX()).toBe(value);
    });
    it('should set y', () => {
      const value = 6;
      panel.setViewOriginY(value);
      panel.render(0);
      expect(panel.getViewOriginY()).toBe(value);
    });
    it('should set x in layers', () => {
      const value = 7;
      panel.createLayer('whatever', {});

      panel.setViewOriginX(value);
      panel.render(0);

      expect(panel.getViewOriginX()).toBe(value);
      gfxLayerMock.verify(x => x.setViewOriginX(TypeMoq.It.isValue(value)), TypeMoq.Times.once());
    });
  });
  describe("render events", function() {
    it("notify NEXT_FRAME_BEGIN only once", function(done) {
      var calledCount = 0;
      panel.on(EventType.NEXT_FRAME_BEGIN, () => calledCount++);

      panel.render(0);
      expect(calledCount).toBe(1);

      panel.render(0);
      expect(calledCount).toBe(1);
      done();
    });
    it("notify BEFORE_RENDER every time", function(done) {
      var calledCount = 0;
      panel.on(EventType.BEFORE_RENDER, () => calledCount++);

      panel.render(0);
      panel.render(0);

      expect(calledCount).toBe(2);
      done();
    });
    it("notify NEXT_FRAME_END only once", function(done) {
      var calledCount = 0;
      panel.on(EventType.NEXT_FRAME_END, () => calledCount++);

      panel.render(0);
      expect(calledCount).toBe(1);

      panel.render(0);
      expect(calledCount).toBe(1);
      done();
    });
    it("notify AFTER_RENDER every time", function(done) {
      var calledCount = 0;
      panel.on(EventType.AFTER_RENDER, () => calledCount++);

      panel.render(0);
      panel.render(0);

      expect(calledCount).toBe(2);
      done();
    });
  });
  describe('handle mouse events', () => {
    let eventListeners: {[key: string]: (mouseEvent: MouseEvent) => void};

    beforeEach(() => {
      eventListeners = {};
      targetElementMock.setup(
        x => x.addEventListener(TypeMoq.It.isAnyString(), TypeMoq.It.isAny(), TypeMoq.It.isAny())
      ).returns((eventType: string, callback: () => void) => {
        eventListeners[eventType] = callback;
      });
      panel = new GfxPanel({
        targetElement: targetElementMock.object,
        layerFactory: layerFactoryMock.object,
        requestAnimationFrame: requestAnimationFrame,
        document: documentMock.object
      });
      
    });
    it('should notify layers', (done) => {
      const mouseEventMock: TypeMoq.IMock<MouseEvent> = TypeMoq.Mock.ofType<MouseEvent>();
      mouseEventMock.setup(x => x.pageX).returns(() => 8);
      mouseEventMock.setup(x => x.pageY).returns(() => 11);
      panel.createLayer('whatever');

      eventListeners['mousemove'](mouseEventMock.object);
      panel.render(0);

      gfxLayerMock.verify(x => x.handleMouseEvent(TypeMoq.It.isAny()), TypeMoq.Times.once());
      done();
    });
  });
  describe("#setBackgroundColor()", function() {
    it("should set background color", function(done) {
      const color = "yellow";
      const styleMock: TypeMoq.IMock<CSSStyleDeclaration> = TypeMoq.Mock.ofType<CSSStyleDeclaration>();
      targetElementMock.setup(x => x.style).returns(() => styleMock.object);

      panel.setBackgroundColor(color);

      expect(panel.getBackgroundColor()).toBe(color);
      styleMock.verify(x => x.backgroundColor = color, TypeMoq.Times.once());
      done();
    });
  });
  describe("#setBorderColor()", function() {
    it("should set border color", function(done) {
      const color = "lightgreen";
      const styleMock: TypeMoq.IMock<CSSStyleDeclaration> = TypeMoq.Mock.ofType<CSSStyleDeclaration>();
      targetElementMock.setup(x => x.style).returns(() => styleMock.object);

      panel.setBorderColor(color);

      expect(panel.getBorderColor()).toBe(color);
      styleMock.verify(x => x.borderColor = color, TypeMoq.Times.once());
      done();
    });
  });
  describe("#setBorderSize()", function() {
    it("should set border size from number", function(done) {
      const amount = 50;
      const expected = "50px";
      const styleMock: TypeMoq.IMock<CSSStyleDeclaration> = TypeMoq.Mock.ofType<CSSStyleDeclaration>();
      targetElementMock.setup(x => x.style).returns(() => styleMock.object);

      panel.setBorderSize(amount);

      styleMock.verify(x => x.borderWidth = expected, TypeMoq.Times.once());
      done();
    });
    it("should set border size", function(done) {
      const amount = "50px 10px 1px 3px";
      const styleMock: TypeMoq.IMock<CSSStyleDeclaration> = TypeMoq.Mock.ofType<CSSStyleDeclaration>();
      targetElementMock.setup(x => x.style).returns(() => styleMock.object);

      panel.setBorderSize(amount);

      styleMock.verify(x => x.borderWidth = amount, TypeMoq.Times.once());
      done();
    });
  });
  describe("#createLayer()", function() {
    it("should add layer", function(done) {
      panel.createLayer('whatever');

      expect(panel.getLayers().length).toBeTruthy();
      done();
    });
  });
  describe("#setPaused()", function() {
    it("should pause", function(done) {
      let calledIt = false;
      panel.on(EventType.SCREEN_PAUSED, () => calledIt = true);

      panel.setPaused(true);
      panel.render(0);

      expect(panel.isPaused()).toBeTruthy();

      expect(calledIt).toBeTruthy();
      expect(calledRequestAnimationFrame).toBeFalsy();
      done();
    });
    it("should unpause", function(done) {
      let calledIt = false;
      panel.on(EventType.SCREEN_RESUMED, () => calledIt = true);

      panel.setPaused(true);
      panel.setPaused(false);

      expect(panel.isPaused()).toBeFalsy();
      expect(calledIt).toBeTruthy();
      expect(calledRequestAnimationFrame).toBeTruthy();
      done();
    });
  });
  describe("#clearEventHandlers()", function(){
    it("should clear callbacks from list", function(done) {
      let calledIt = false;
      panel.on(EventType.SCREEN_PAUSED, () => calledIt = true);

      panel.clearEventListeners(EventType.SCREEN_PAUSED);
      panel.setPaused(true);

      expect(calledIt).toBeFalsy();
      done();
    });
  });
  // describe("#render()", function() {
  //   it("should return if paused or tab not visible", function(done) {
  //     panel.setPaused(true);
  //     var calledInternalRender = false;
  //     panel._render = function() {calledInternalRender = true;};

  //     panel.render(1);

  //     expect(calledInternalRender).toBeFalsy();
  //     done();
  //   });
  //   it("should call handleMouseMoveEvent if mouse moved", function(done) {
  //     panel._mouseMoved = true;
  //     var calledIt = false;
  //     panel._handleMouseMoveEvent = function() {calledIt = true;};

  //     panel.render(1);

  //     expect(calledIt).toBeTruthy();
  //     done();
  //   });
  //   it("should notify before and after render event", function(done) {
  //     var eventTypes = [];
  //     var calledBeforeRender = false;
  //     var calledAfterRender = false;
  //     panel.on(EventType.BEFORE_RENDER, function(event) {
  //       calledBeforeRender = true;
  //     });
  //     panel.on(EventType.AFTER_RENDER, function(event) {
  //       calledAfterRender = true;
  //     });

  //     panel.render(1);

  //     expect(calledBeforeRender).toBeTruthy();
  //     expect(calledAfterRender).toBeTruthy();
  //     done();
  //   });
  //   it("should call updateFps", function(done) {
  //     var calledIt = false;
  //     panel._updateFps = function() {calledIt = true;};

  //     panel.render(1);

  //     expect(calledIt).toBeTruthy();
  //     done();
  //   });
  //   it("should call _update", function(done) {
  //     var calledIt = false;
  //     panel._update = function() {calledIt = true;};

  //     panel.render(1);

  //     expect(calledIt).toBeTruthy();
  //     done();
  //   });
  //   it("should call _render", function(done) {
  //     var calledIt = false;
  //     panel._render = function() {calledIt = true;};

  //     panel.render(1);

  //     expect(calledIt).toBeTruthy();
  //     done();
  //   });
  //   it("should call requestAnimationFrame", function(done) {
  //     panel.render(1);

  //     expect(calledRequestAnimationFrame).toBeTruthy();
  //     done();
  //   });
  //   it("should unpause", function(done) {
  //     var time = 100;
  //     panel.setPaused(true);
  //     panel.setPaused(false);
  //     expect(panel._unpaused).toBeTruthy();

  //     panel.render(time);

  //     expect(panel._unpaused).toBeFalsy();
  //     done();
  //   });
  //   it("should calculate diff based on unpause", function(done) {
  //     var time = 100;
  //     var calledWithDiff = null;
  //     panel._update = function(time,diff) {calledWithDiff = diff;};
  //     panel.setPaused(true);
  //     panel.setPaused(false);

  //     panel.render(time);

  //     expect(calledWithDiff).toBe(1, "should calculated diff properly.");
  //     done();
  //   });
  // });
  // describe("#_handleMouseMoveEvent()", function() {
  //   it("should notify mouse move event", function(done) {
  //     var eventType = null;
  //     panel.notify = function(event) {eventType = event.type;};

  //     panel._handleMouseMoveEvent();

  //     expect(eventType).toBe(EventType.MOUSE_MOVE, "should have notified of before mouse move event.");
  //     done();
  //   });
  //   it("should propagate event", function(done) {
  //     var calledIt = null;
  //     panel.propagateMouseEventThroughLayers = function() {calledIt = true;};

  //     panel._handleMouseMoveEvent();

  //     expect(calledIt).toBeTruthy();
  //     done();
  //   });
  //   it("should reset mouseMoved", function(done) {
  //     panel._mouseMoved = true;

  //     panel._handleMouseMoveEvent();

  //     expect(panel._mouseMoved).toBeFalsy();
  //     done();
  //   });
  //   it("should return coordinate data", function(done) {
  //     var x = 64;
  //     var y = 73;
  //     var result;
  //     panel.notify = function(e) {result = e;};
  //     panel._getCoordinateDataForMouseEvent = function() {return {check:true};};
  //     var expected = {
  //       check : true
  //     };

  //     panel._handleMouseMoveEvent(1);

  //     expect(result.data.check).toBe(expected.check, "should have set event data");
  //     done();
  //   });
  //   it("should not notify if endEventPropagation becomes set", function(done) {
  //     var calledIt = false;
  //     panel.propagateMouseEventThroughLayers = function(e) {e.endEventPropagation = true;};
  //     var eventType = null;
  //     panel.notify = function(event) {calledIt = true;};

  //     panel._handleMouseMoveEvent(1);

  //     expect(calledIt).toBeFalsy();
  //     done();
  //   });
  // });
  describe("#_update()", function() {
    it("should call update on each layer", function(done) {
      panel.createLayer('whatever');

      panel.render(1);

      gfxLayerMock.verify(x => x.update(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.once());
      done();
    });
  });
  describe("#_render()", function() {
    it("should call render on each layer", function(done) {
      panel.createLayer('whatever');

      panel.render(1);

      gfxLayerMock.verify(x => x.render(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.once());
      done();
    });
  });
  // describe("#_getCoordinateDataForMouseEvent", function() {
  //   it("should calculate coordinate data", function(done) {
  //     var x = 47;
  //     var y = 56;
  //     panel._scaleX = 2;
  //     panel._scaleY = 3;
  //     panel._viewOriginX = 15;
  //     panel._viewOriginY = 13;
  //     var expected = {
  //       x : Math.floor(32 / panel._scaleX),  // 32 / 2 = 16
  //       y : Math.floor(43 / panel._scaleY), // 43 / 3 = 14
  //       viewOriginAdjustedX : 47 - panel._viewOriginX, // 47 - 15 = 32
  //       viewOriginAdjustedY : 56 - panel._viewOriginY, // 56 - 13 = 43
  //       rawX : x,
  //       rawY : y
  //     };

  //     var result = panel._getCoordinateDataForMouseEvent(x, y);

  //     expect(result.x).toBe(expected.x, "expected " + expected.x + ", actual " + result.x);
  //     expect(result.y).toBe(expected.y, "expected " + expected.y + ", actual " + result.y);
  //     expect(result.unscaledX).toBe(expected.unscaledX, "expected " + expected.unscaledX + ", actual " + result.unscaledX);
  //     expect(result.unscaledY).toBe(expected.unscaledY, "expected " + expected.unscaledY + ", actual " + result.unscaledY);
  //     expect(result.rawX).toBe(expected.rawX, "expected " + expected.rawX + ", actual " + result.rawX);
  //     expect(result.rawY).toBe(expected.rawY, "expected " + expected.rawY + ", actual " + result.rawY);
  //     done();
  //   });
  // });
  // describe("#handleMouseMoveEvent()", function() {
  //   it("should not update _mouseMoved if paused", function(done) {
  //     var e = {};
  //     panel.setPaused(true);
  //     panel._mouseMoved = false;

  //     panel.handleMouseMoveEvent(e);

  //     expect(panel._mouseMoved).toBeFalsy();
  //     done();
  //   });
  //   it("should set mouse coords if x < 0", function(done) {
  //     var e = {};
  //     panel.getXFromMouseEvent = function() {return -1;};
  //     panel.getYFromMouseEvent = function() {return 1;};

  //     panel.handleMouseMoveEvent(e);

  //     expect(panel._mouseMoved).toBeTruthy();
  //     expect(panel._mouseX).toBe(-1, "should have updated mouseX");
  //     expect(panel._mouseY).toBe(-1, "should have updated mouseY");
  //     done();
  //   });
  //   it("should set mouse coords if y < 0", function(done) {
  //     var e = {};
  //     panel.getXFromMouseEvent = function() {return 1;};
  //     panel.getYFromMouseEvent = function() {return -1;};

  //     panel.handleMouseMoveEvent(e);

  //     expect(panel._mouseMoved).toBeTruthy();
  //     expect(panel._mouseX).toBe(-1, "should have updated mouseX");
  //     expect(panel._mouseY).toBe(-1, "should have updated mouseY");
  //     done();
  //   });
  //   it("should set mouse coords if x >= screenWidth", function(done) {
  //     var e = {};
  //     panel.getXFromMouseEvent = function() {return panel.getWidth();};
  //     panel.getYFromMouseEvent = function() {return 1;};

  //     panel.handleMouseMoveEvent(e);

  //     expect(panel._mouseMoved).toBeTruthy();
  //     expect(panel._mouseX).toBe(-1, "should have updated mouseX");
  //     expect(panel._mouseY).toBe(-1, "should have updated mouseY");
  //     done();
  //   });
  //   it("should set mouse coords if y >= screen height", function(done) {
  //     var e = {};
  //     panel.getXFromMouseEvent = function() {return -1;};
  //     panel.getYFromMouseEvent = function() {return panel.getHeight();};

  //     panel.handleMouseMoveEvent(e);

  //     expect(panel._mouseMoved).toBeTruthy();
  //     expect(panel._mouseX).toBe(-1, "should have updated mouseX");
  //     expect(panel._mouseY).toBe(-1, "should have updated mouseY");
  //     done();
  //   });
  //   it("should set mouse coords", function(done) {
  //     var e = {};
  //     panel.getXFromMouseEvent = function() {return 5;};
  //     panel.getYFromMouseEvent = function() {return 7;};

  //     panel.handleMouseMoveEvent(e);

  //     expect(panel._mouseMoved).toBeTruthy();
  //     expect(panel._mouseX).toBe(5, "should have updated mouseX");
  //     expect(panel._mouseY).toBe(7, "should have updated mouseY");
  //     done();
  //   });
  // });
  // describe("#handleMouseEvent()", function() {
  //   it("should not propagate if paused", function(done) {
  //     var e = {};
  //     var calledPropagate = false;
  //     panel.setPaused(true);
  //     panel.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

  //     panel.handleMouseEvent(e);

  //     expect(calledPropagate).toBeFalsy();
  //     done();
  //   });
  //   it("should return if not in bounds, x < 0", function(done) {
  //     var e = {};
  //     var calledPropagate = false;
  //     panel.getXFromMouseEvent = function() {return -1;};
  //     panel.getYFromMouseEvent = function() {return 1;};
  //     panel.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

  //     panel.handleMouseEvent(e);

  //     expect(calledPropagate).toBeFalsy();
  //     done();
  //   });
  //   it("should return if not in bounds, x = width", function(done) {
  //     var e = {};
  //     var calledPropagate = false;
  //     panel.getXFromMouseEvent = function() {return panel.getWidth();};
  //     panel.getYFromMouseEvent = function() {return 1;};
  //     panel.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

  //     panel.handleMouseEvent(e);

  //     expect(calledPropagate).toBeFalsy();
  //     done();
  //   });
  //   it("should return if not in bounds, y < 0", function(done) {
  //     var e = {};
  //     var calledPropagate = false;
  //     panel.getXFromMouseEvent = function() {return 1;};
  //     panel.getYFromMouseEvent = function() {return -1;};
  //     panel.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

  //     panel.handleMouseEvent(e);

  //     expect(calledPropagate).toBeFalsy();
  //     done();
  //   });
  //   it("should return if not in bounds, y = height", function(done) {
  //     var e = {};
  //     var calledPropagate = false;
  //     panel.getXFromMouseEvent = function() {return 1;};
  //     panel.getYFromMouseEvent = function() {return panel.getHeight();};
  //     panel.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

  //     panel.handleMouseEvent(e);

  //     expect(calledPropagate).toBeFalsy();
  //     done();
  //   });
  //   it("should notify mouseup", function(done) {
  //     var e = {
  //       type:"mouseup",
  //       button:1
  //     };
  //     var calledPropagate = false;
  //     panel.getXFromMouseEvent = function() {return 1;};
  //     panel.getYFromMouseEvent = function() {return 1;};
  //     panel.propagateMouseEventThroughLayers = function() {calledPropagate = true;};
  //     var eventType = null;
  //     panel.notify = function(event) {eventType = event.type;};

  //     panel.handleMouseEvent(e);

  //     expect(eventType).toBe(EventType.MOUSE_UP, "should have notified mouseup event");
  //     done();
  //   });
  //   it("should notify mousedown", function(done) {
  //     var e = {
  //       type:"mousedown",
  //       button:1
  //     };
  //     var calledPropagate = false;
  //     panel.getXFromMouseEvent = function() {return 1;};
  //     panel.getYFromMouseEvent = function() {return 1;};
  //     panel.propagateMouseEventThroughLayers = function() {calledPropagate = true;};
  //     var eventType = null;
  //     panel.notify = function(event) {eventType = event.type;};

  //     panel.handleMouseEvent(e);

  //     expect(eventType).toBe(EventType.MOUSE_DOWN, "should have notified mousedown event");
  //     done();
  //   });
  //   it("should not notify if endEventPropagation becomes set", function(done) {
  //     var e = {
  //       type:"mousedown",
  //       button:1
  //     };
  //     var calledIt = false;
  //     panel.getXFromMouseEvent = function() {return 1;};
  //     panel.getYFromMouseEvent = function() {return 1;};
  //     panel.propagateMouseEventThroughLayers = function(e) {e.endEventPropagation = true;};
  //     var eventType = null;
  //     panel.notify = function(event) {calledIt = true;};

  //     panel.handleMouseEvent(e);

  //     expect(calledIt).toBeFalsy();
  //     done();
  //   });
  //   it("should propagate", function(done) {
  //     var e = {
  //       type:"mousedown",
  //       button:0
  //     };
  //     var calledPropagate = false;
  //     panel.getXFromMouseEvent = function() {return 1;};
  //     panel.getYFromMouseEvent = function() {return 1;};
  //     panel.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

  //     panel.handleMouseEvent(e);

  //     expect(calledPropagate).toBeTruthy();
  //     done();
  //   });
  //   it("should return false if button 1", function(done) {
  //     var e = {
  //       type:"mousedown",
  //       button:1
  //     };
  //     var calledPropagate = false;
  //     panel.getXFromMouseEvent = function() {return 1;};
  //     panel.getYFromMouseEvent = function() {return 1;};
  //     panel.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

  //     var result = panel.handleMouseEvent(e);

  //     expect(result).toBeFalsy();
  //     done();
  //   });
  //   it("should include coordinate data", function(done) {
  //     var x = 64;
  //     var y = 73;
  //     var e = {
  //       type:"mousedown",
  //       button:1,
  //       pageX:x,
  //       pageY:y
  //     };
  //     var result;
  //     panel.notify = function(e) {result = e;};
  //     panel._getCoordinateDataForMouseEvent = function() {return {check:true};};
  //     var expected = {
  //       check : true
  //     };

  //     panel.handleMouseEvent(e);

  //     expect(result.data.check).toBe(expected.check, "should have set event data");
  //     done();
  //   });
  // });
  // describe("#propagateMouseEventThroughLayers()", function() {
  //   it("should call handleMouseEvent on each layer", function(done) {
  //     var calledLayer1 = false;
  //     var layer1 = {
  //       handleMouseEvent : function() {calledLayer1 = true;}
  //     };
  //     var calledLayer2 = false;
  //     var layer2 = {
  //       handleMouseEvent : function() {calledLayer2 = true;}
  //     };
  //     panel.addLayer(layer1);
  //     panel.addLayer(layer2);
  //     e = {};

  //     panel.propagateMouseEventThroughLayers(e);

  //     expect(calledLayer1).toBeTruthy();
  //     expect(calledLayer2).toBeTruthy();
  //     done();
  //   });
  //   it("should call stop propagation if event handled", function(done) {
  //     var calledLayer1 = false;
  //     var layer1 = {
  //       handleMouseEvent : function(e) {calledLayer1 = true;}
  //     };
  //     var calledLayer2 = false;
  //     var layer2 = {
  //       handleMouseEvent : function(e) {
  //         calledLayer2 = true;
  //         e.endEventPropagation = true;
  //       }
  //     };
  //     panel.addLayer(layer1);
  //     panel.addLayer(layer2);
  //     e = {};

  //     panel.propagateMouseEventThroughLayers(e);

  //     expect(calledLayer1).toBeFalsy();
  //     expect(calledLayer2).toBeTruthy();
  //     done();
  //   });
  // });
  describe("#getXFromMouseEvent()", function() {
    it("should return y value", function(done) {
      const x = 12;
      const y = 13;
      const offsetLeft = 3;
      const offsetTop = 4;
      const mouseEventMock: TypeMoq.IMock<MouseEvent> = TypeMoq.Mock.ofType<MouseEvent>();
      mouseEventMock.setup(me => me.pageX).returns(() => x);
      mouseEventMock.setup(me => me.pageY).returns(() => y);
      targetElementMock.setup(te => te.offsetLeft).returns(() => offsetLeft);
      targetElementMock.setup(te => te.offsetTop).returns(() => offsetTop);

      var result = panel.getXFromMouseEvent(mouseEventMock.object);

      var expected = x - (offsetLeft + parseInt(panel.getBorderSize()));
      expect(result).toBe(expected);
      done();
    });
  });
  describe("#getYFromMouseEvent()", function() {
    it("should return y value", function(done) {
      const x = 12;
      const y = 13;
      const offsetLeft = 3;
      const offsetTop = 4;
      const mouseEventMock: TypeMoq.IMock<MouseEvent> = TypeMoq.Mock.ofType<MouseEvent>();
      mouseEventMock.setup(me => me.pageX).returns(() => x);
      mouseEventMock.setup(me => me.pageY).returns(() => y);
      targetElementMock.setup(te => te.offsetLeft).returns(() => offsetLeft);
      targetElementMock.setup(te => te.offsetTop).returns(() => offsetTop);

      var result = panel.getYFromMouseEvent(mouseEventMock.object);

      var expected = y - (offsetTop + parseInt(panel.getBorderSize()));
      expect(result).toBe(expected);
      done();
    });
  });
  describe("#getViewOriginAdjustedX()", function() {
    it("should adjust x according to view origin", function(done) {
      var x = 12;
      var viewOrigin = 10;
      panel.getViewOriginX = function() {return viewOrigin;};
      var expected = x - viewOrigin;

      var result = panel.getViewOriginAdjustedX(x);

      expect(result).toBe(expected);
      done();
    });
  });
  describe("#getViewOriginAdjustedY()", function() {
    it("should adjust y according to view origin", function(done) {
      var y = 12;
      var viewOrigin = 10;
      panel.getViewOriginY = function() {return viewOrigin;};
      var expected = y - viewOrigin;

      var result = panel.getViewOriginAdjustedY(y);

      expect(result).toBe(expected);
      done();
    });
  });
  describe("#getUnScaledX()", function() {
    it("should return x (no scale)", function(done) {
      var x = 12;

      var result = panel.getUnScaledX(x);

      expect(result).toBe(x);
      done();
    });
    it("should return unscaledX", function(done) {
      panel = new GfxPanel({
        targetElement: targetElementMock.object,
        layerFactory: layerFactoryMock.object,
        requestAnimationFrame: requestAnimationFrame,
        document: documentMock.object,
         scaleX: 2
      });
      var x = 12;
      var expected = Math.floor(x / panel.getScaleX());

      var result = panel.getUnScaledX(x);

      expect(result).toBe(expected);
      done();
    });
  });
  describe("#getUnScaledY()", function() {
    it("should return y (no scale)", function(done) {
      var y = 21;

      var result = panel.getUnScaledY(y);

      expect(result).toBe(y);
      done();
    });
    it("should return unscaledY", function(done) {
      panel = new GfxPanel({
        targetElement: targetElementMock.object,
        layerFactory: layerFactoryMock.object,
        requestAnimationFrame: requestAnimationFrame,
        document: documentMock.object,
        scaleY: 3
      });
      var y = 12;
      var expected = Math.floor(y / panel.getScaleY());

      var result = panel.getUnScaledY(y);

      expect(result).toBe(expected);
      done();
    });
  });
});
