var Screen = require('../src/Screen');
var EventType = require('../src/EventType');
var Event = require('slcommon/src/Event');
var Mocks = require('./Mocks');

describe("Screen", function() {
  var scrn, targetDiv, layerFactory, fpsElem, config, calledRequestAnimationFrame,
    calledLayer1, calledLayer2, e,
    windowEventListeners = {};

  var requestAnimationFrame = function() {calledRequestAnimationFrame = true;};
  beforeEach(function() {
    // blanket.js weirdness means we have to reset document link each time
    Screen.document = {
      addEventListener : function(event, listener) {
        if (!windowEventListeners[event]) windowEventListeners[event] = [];
        windowEventListeners[event].push(listener);
      },
      createElement : function() {return {
        style:{},
        getContext:function() {return Mocks.getMockCanvasContextWrapper()}
      }},
      hidden:false
    };
    windowEventListeners = {};
    calledRequestAnimationFrame = false;
    targetDiv = {
      style : {},
      eventListeners : {},
      addEventListener : function(type, callback, bool) {
        this.eventListeners[type] = callback;
      },
      appendChild : function() {},
      offsetLeft : 16,
      offsetTop : 16
    };
    fpsElem = {};
    layerFactory = Mocks.getMockLayerFactory();
    scrn = new Screen({
      targetDiv:targetDiv,
      layerFactory:layerFactory,
      "fpsElem" : fpsElem,
      requestAnimationFrame:requestAnimationFrame
    });
  });

  describe("#initialize()", function() {
    it("should call _prepareDiv and _setupEventListeners", function(done) {
      var calledPrepareDiv, calledSetupEventListeners;
      scrn._prepareDiv = function() {calledPrepareDiv = true;};
      scrn._setupEventListeners = function() {calledSetupEventListeners = true;};

      scrn.initialize();

      expect(calledPrepareDiv).toBeTruthy();
      expect(calledSetupEventListeners).toBeTruthy();
      done();
    });
  });
  describe("#_prepareDiv()", function() {
    it("should set div styles", function(done) {
      scrn._prepareDiv();

      expect(targetDiv.style.width).toBe(scrn._width, "should have set width");
      expect(targetDiv.style.height).toBe(scrn._height, "should have set heights");
      expect(targetDiv.style.backgroundColor).toBe(scrn._backgroundColor, "should have set backgroundColor");
      expect(targetDiv.style.border).toBe(scrn._borderSize + "px solid " + scrn._borderColor, "should have set border");
      done();
    });
  });
  describe("#_setupEventListeners()", function() {
    it("should setup event listeners", function(done) {
      scrn._setupEventListeners();

      expect(targetDiv.eventListeners.mouseup).toBeTruthy();
      expect(targetDiv.eventListeners.mousedown).toBeTruthy();
      expect(targetDiv.eventListeners.mousemove).toBeTruthy();
      expect(windowEventListeners.visibilitychange !== undefined).toBeTruthy();
      done();
    });
  });
  describe("#handleVisibilityChange()", function() {
    it("should unpause", function(done) {
      Screen.document.hidden = false;
      scrn.handleVisibilityChange();

      expect(scrn.isPaused()).toBeFalsy();
      done();
    });
    it("should not unpause if explicitly paused", function(done) {
      Screen.document.hidden = false;
      scrn.setPaused(true);
      scrn.handleVisibilityChange();

      expect(scrn._unpaused).toBeFalsy();
      done();
    });
  });
  describe("#addEventListenerToDocument()", function() {
    it("should add event listener to document", function(done) {
      scrn.addEventListenerToDocument("dummyEvent", function() {});

      expect(windowEventListeners.dummyEvent !== undefined).toBeTruthy();
      done();
    });
  });
  describe("#setBackgroundColor()", function() {
    it("should set background color", function(done) {
      var color = "yellow";

      scrn.setBackgroundColor(color);

      expect(scrn.getBackgroundColor()).toBe(color, "should have set background color");
      expect(targetDiv.style.backgroundColor).toBe(color, "should have set background color on target div");
      done();
    });
  });
  describe("#setBorderColor()", function() {
    it("should set border color", function(done) {
      var color = "lightgreen";

      scrn.setBorderColor(color);

      expect(scrn.getBorderColor()).toBe(color, "should have set border color");
      expect(targetDiv.style.border).toBe(scrn._borderSize + "px solid " + color, "should have set border color on target div");
      done();
    });
  });
  describe("#setBorderSize()", function() {
    it("should set border size", function(done) {
      var amount = 50;

      scrn.setBorderSize(amount);

      expect(scrn.getBorderSize()).toBe(amount, "should have set border size");
      expect(targetDiv.style.border).toBe(amount + "px solid " + scrn._borderColor, "should have set border size on target div");
      done();
    });
  });
  describe("#createLayer()", function() {
    it("should add layer", function(done) {
      scrn.createLayer();

      expect(scrn.getLayers().length).toBeTruthy();
      done();
    });
  });
  describe("#setPaused()", function() {
    it("should pause", function(done) {
      var eventType = null;
      scrn.notify = function(event) {eventType = event.type;};
      scrn.setPaused(true);

      expect(scrn.isPaused()).toBeTruthy();
      expect(scrn._unpaused).toBeFalsy();
      expect(eventType).toBe(EventType.SCREEN_PAUSED, "should have notified of pause event");
      expect(calledRequestAnimationFrame).toBeFalsy();
      done();
    });
    it("should unpause", function(done) {
      var eventType = null;
      scrn.notify = function(event) {eventType = event.type;};
      scrn.setPaused(true);
      scrn.setPaused(false);

      expect(scrn.isPaused()).toBeFalsy();
      expect(scrn._unpaused).toBeTruthy();
      expect(eventType).toBe(EventType.SCREEN_RESUMED, "should have notified of resume event");
      expect(calledRequestAnimationFrame).toBeTruthy();
      done();
    });
  });
  describe("#on()", function(){
    it("should add callback to list", function(done) {
      var eventType = "newType";
      scrn.on(eventType, function() {
        done();
      }, "testHandler");
      scrn._eventListeners[eventType].testHandler();
    });
  });
  describe("#clearEventHandlers()", function(){
    it("should clear callbacks from list", function(done) {
      var eventType = "newType";
      scrn.on(eventType, function() {}, "testHandler");

      scrn.clearEventHandlers(eventType);

      expect(scrn._eventListeners[eventType].testHandler).toBe(undefined, "should have cleared handler list");
      done();
    });
  });
  describe("#notify()", function() {
    it("should notify listeners", function(done) {
      var event = new Event("blerg");
      scrn.getScreenContext = function() {
        return {notify:function(){}};
      };
      var result = false;
      scrn.on("blerg", function() {
        result = true;
      });

      scrn.notify(event);
      expect(result).toBeTruthy();
      done();
    });
  });
  describe("#render()", function() {
    it("should return if paused or tab not visible", function(done) {
      scrn.setPaused(true);
      var calledInternalRender = false;
      scrn._render = function() {calledInternalRender = true;};

      scrn.render(1);

      expect(calledInternalRender).toBeFalsy();
      done();
    });
    it("should call handleMouseMoveEvent if mouse moved", function(done) {
      scrn._mouseMoved = true;
      var calledIt = false;
      scrn._handleMouseMoveEvent = function() {calledIt = true;};

      scrn.render(1);

      expect(calledIt).toBeTruthy();
      done();
    });
    it("should notify before and after render event", function(done) {
      var eventTypes = [];
      var calledBeforeRender = false;
      var calledAfterRender = false;
      scrn.on(EventType.BEFORE_RENDER, function(event) {
        calledBeforeRender = true;
      });
      scrn.on(EventType.AFTER_RENDER, function(event) {
        calledAfterRender = true;
      });

      scrn.render(1);

      expect(calledBeforeRender).toBeTruthy();
      expect(calledAfterRender).toBeTruthy();
      done();
    });
    it("should call updateFps", function(done) {
      var calledIt = false;
      scrn._updateFps = function() {calledIt = true;};

      scrn.render(1);

      expect(calledIt).toBeTruthy();
      done();
    });
    it("should call _update", function(done) {
      var calledIt = false;
      scrn._update = function() {calledIt = true;};

      scrn.render(1);

      expect(calledIt).toBeTruthy();
      done();
    });
    it("should call _render", function(done) {
      var calledIt = false;
      scrn._render = function() {calledIt = true;};

      scrn.render(1);

      expect(calledIt).toBeTruthy();
      done();
    });
    it("should call requestAnimationFrame", function(done) {
      scrn.render(1);

      expect(calledRequestAnimationFrame).toBeTruthy();
      done();
    });
    it("should unpause", function(done) {
      var time = 100;
      scrn.setPaused(true);
      scrn.setPaused(false);
      expect(scrn._unpaused).toBeTruthy();

      scrn.render(time);

      expect(scrn._unpaused).toBeFalsy();
      done();
    });
    it("should calculate diff based on unpause", function(done) {
      var time = 100;
      var calledWithDiff = null;
      scrn._update = function(time,diff) {calledWithDiff = diff;};
      scrn.setPaused(true);
      scrn.setPaused(false);

      scrn.render(time);

      expect(calledWithDiff).toBe(1, "should calculated diff properly.");
      done();
    });
  });
  describe("#_handleMouseMoveEvent()", function() {
    it("should notify mouse move event", function(done) {
      var eventType = null;
      scrn.notify = function(event) {eventType = event.type;};

      scrn._handleMouseMoveEvent();

      expect(eventType).toBe(EventType.MOUSE_MOVE, "should have notified of before mouse move event.");
      done();
    });
    it("should propagate event", function(done) {
      var calledIt = null;
      scrn.propagateMouseEventThroughLayers = function() {calledIt = true;};

      scrn._handleMouseMoveEvent();

      expect(calledIt).toBeTruthy();
      done();
    });
    it("should reset mouseMoved", function(done) {
      scrn._mouseMoved = true;

      scrn._handleMouseMoveEvent();

      expect(scrn._mouseMoved).toBeFalsy();
      done();
    });
    it("should return coordinate data", function(done) {
      var x = 64;
      var y = 73;
      var result;
      scrn.notify = function(e) {result = e;};
      scrn._getCoordinateDataForMouseEvent = function() {return {check:true};};
      var expected = {
        check : true
      };

      scrn._handleMouseMoveEvent(1);

      expect(result.data.check).toBe(expected.check, "should have set event data");
      done();
    });
    it("should not notify if endEventPropagation becomes set", function(done) {
      var calledIt = false;
      scrn.propagateMouseEventThroughLayers = function(e) {e.endEventPropagation = true;};
      var eventType = null;
      scrn.notify = function(event) {calledIt = true;};

      scrn._handleMouseMoveEvent(1);

      expect(calledIt).toBeFalsy();
      done();
    });
  });
  describe("#_updateFps()", function() {
    it("should add fps to _fpsMonitorArray", function(done) {
      scrn._showFps = true;

      scrn._updateFps(100);

      expect(scrn._fpsMonitorArray.length).toBe(1, "Should have pushed fps to _fps");
      expect(scrn._fpsMonitorArray[0]).toBe(10, "Should have pushed fps to _fps");
      done();
    });
    it("should add fps to _fpsMonitorArray", function(done) {
      scrn._showFps = true;
      for(var i = 0; i < 30; i++) scrn._fpsMonitorArray.push(10);
      scrn._fpsMonitorIndex = 30;

      scrn._updateFps(100);

      expect(scrn._fpsMonitorArray.length).toBe(31, "Should have pushed fps to _fps");
      done();
    });
    it("should reset _fpsMonitorIndex", function(done) {
      scrn._showFps = true;
      for(var i = 0; i < 29; i++) scrn._fpsMonitorArray.push(10);
      scrn._fpsMonitorIndex = 29;

      scrn._updateFps(100);

      expect(scrn._fpsMonitorIndex).toBe(0, "Should have reset _fpsMonitorIndex");
      done();
    });
  });
  describe("#_update()", function() {
    it("should call update on each layer", function(done) {
      var calledUpdate1 = false;
      var layer1 = {
        update : function() {calledUpdate1 = true;}
      };
      var calledUpdate2 = false;
      var layer2 = {
        update : function() {calledUpdate2 = true;}
      };
      scrn.addLayer(layer1);
      scrn.addLayer(layer2);

      scrn._update(1,1);

      expect(calledUpdate1).toBeTruthy();
      expect(calledUpdate2).toBeTruthy();
      done();
    });
  });
  describe("#_render()", function() {
    it("should call render on each layer", function(done) {
      var calledRender1 = false;
      var layer1 = {
        render : function() {calledRender1 = true;},
        preRender : function() {},
        postRender : function() {}
      };
      var calledRender2 = false;
      var layer2 = {
        render : function() {calledRender2 = true;},
        preRender : function() {},
        postRender : function() {}
      };
      scrn.addLayer(layer1);
      scrn.addLayer(layer2);

      scrn._render(1,1);

      expect(calledRender1).toBeTruthy();
      expect(calledRender2).toBeTruthy();
      done();
    });
  });
  describe("#_getCoordinateDataForMouseEvent", function() {
    it("should calculate coordinate data", function(done) {
      var x = 47;
      var y = 56;
      scrn._scaleX = 2;
      scrn._scaleY = 3;
      scrn._viewOriginX = 15;
      scrn._viewOriginY = 13;
      var expected = {
        x : Math.floor(32 / scrn._scaleX),  // 32 / 2 = 16
        y : Math.floor(43 / scrn._scaleY), // 43 / 3 = 14
        viewOriginAdjustedX : 47 - scrn._viewOriginX, // 47 - 15 = 32
        viewOriginAdjustedY : 56 - scrn._viewOriginY, // 56 - 13 = 43
        rawX : x,
        rawY : y
      };

      var result = scrn._getCoordinateDataForMouseEvent(x, y);

      expect(result.x).toBe(expected.x, "expected " + expected.x + ", actual " + result.x);
      expect(result.y).toBe(expected.y, "expected " + expected.y + ", actual " + result.y);
      expect(result.unscaledX).toBe(expected.unscaledX, "expected " + expected.unscaledX + ", actual " + result.unscaledX);
      expect(result.unscaledY).toBe(expected.unscaledY, "expected " + expected.unscaledY + ", actual " + result.unscaledY);
      expect(result.rawX).toBe(expected.rawX, "expected " + expected.rawX + ", actual " + result.rawX);
      expect(result.rawY).toBe(expected.rawY, "expected " + expected.rawY + ", actual " + result.rawY);
      done();
    });
  });
  describe("#handleMouseMoveEvent()", function() {
    it("should not update _mouseMoved if paused", function(done) {
      var e = {};
      scrn.setPaused(true);
      scrn._mouseMoved = false;

      scrn.handleMouseMoveEvent(e);

      expect(scrn._mouseMoved).toBeFalsy();
      done();
    });
    it("should set mouse coords if x < 0", function(done) {
      var e = {};
      scrn.getXFromMouseEvent = function() {return -1;};
      scrn.getYFromMouseEvent = function() {return 1;};

      scrn.handleMouseMoveEvent(e);

      expect(scrn._mouseMoved).toBeTruthy();
      expect(scrn._mouseX).toBe(-1, "should have updated mouseX");
      expect(scrn._mouseY).toBe(-1, "should have updated mouseY");
      done();
    });
    it("should set mouse coords if y < 0", function(done) {
      var e = {};
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return -1;};

      scrn.handleMouseMoveEvent(e);

      expect(scrn._mouseMoved).toBeTruthy();
      expect(scrn._mouseX).toBe(-1, "should have updated mouseX");
      expect(scrn._mouseY).toBe(-1, "should have updated mouseY");
      done();
    });
    it("should set mouse coords if x >= screenWidth", function(done) {
      var e = {};
      scrn.getXFromMouseEvent = function() {return scrn.getWidth();};
      scrn.getYFromMouseEvent = function() {return 1;};

      scrn.handleMouseMoveEvent(e);

      expect(scrn._mouseMoved).toBeTruthy();
      expect(scrn._mouseX).toBe(-1, "should have updated mouseX");
      expect(scrn._mouseY).toBe(-1, "should have updated mouseY");
      done();
    });
    it("should set mouse coords if y >= screen height", function(done) {
      var e = {};
      scrn.getXFromMouseEvent = function() {return -1;};
      scrn.getYFromMouseEvent = function() {return scrn.getHeight();};

      scrn.handleMouseMoveEvent(e);

      expect(scrn._mouseMoved).toBeTruthy();
      expect(scrn._mouseX).toBe(-1, "should have updated mouseX");
      expect(scrn._mouseY).toBe(-1, "should have updated mouseY");
      done();
    });
    it("should set mouse coords", function(done) {
      var e = {};
      scrn.getXFromMouseEvent = function() {return 5;};
      scrn.getYFromMouseEvent = function() {return 7;};

      scrn.handleMouseMoveEvent(e);

      expect(scrn._mouseMoved).toBeTruthy();
      expect(scrn._mouseX).toBe(5, "should have updated mouseX");
      expect(scrn._mouseY).toBe(7, "should have updated mouseY");
      done();
    });
  });
  describe("#handleMouseEvent()", function() {
    it("should not propagate if paused", function(done) {
      var e = {};
      var calledPropagate = false;
      scrn.setPaused(true);
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      scrn.handleMouseEvent(e);

      expect(calledPropagate).toBeFalsy();
      done();
    });
    it("should return if not in bounds, x < 0", function(done) {
      var e = {};
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return -1;};
      scrn.getYFromMouseEvent = function() {return 1;};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      scrn.handleMouseEvent(e);

      expect(calledPropagate).toBeFalsy();
      done();
    });
    it("should return if not in bounds, x = width", function(done) {
      var e = {};
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return scrn.getWidth();};
      scrn.getYFromMouseEvent = function() {return 1;};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      scrn.handleMouseEvent(e);

      expect(calledPropagate).toBeFalsy();
      done();
    });
    it("should return if not in bounds, y < 0", function(done) {
      var e = {};
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return -1;};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      scrn.handleMouseEvent(e);

      expect(calledPropagate).toBeFalsy();
      done();
    });
    it("should return if not in bounds, y = height", function(done) {
      var e = {};
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return scrn.getHeight();};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      scrn.handleMouseEvent(e);

      expect(calledPropagate).toBeFalsy();
      done();
    });
    it("should notify mouseup", function(done) {
      var e = {
        type:"mouseup",
        button:1
      };
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return 1;};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};
      var eventType = null;
      scrn.notify = function(event) {eventType = event.type;};

      scrn.handleMouseEvent(e);

      expect(eventType).toBe(EventType.MOUSE_UP, "should have notified mouseup event");
      done();
    });
    it("should notify mousedown", function(done) {
      var e = {
        type:"mousedown",
        button:1
      };
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return 1;};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};
      var eventType = null;
      scrn.notify = function(event) {eventType = event.type;};

      scrn.handleMouseEvent(e);

      expect(eventType).toBe(EventType.MOUSE_DOWN, "should have notified mousedown event");
      done();
    });
    it("should not notify if endEventPropagation becomes set", function(done) {
      var e = {
        type:"mousedown",
        button:1
      };
      var calledIt = false;
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return 1;};
      scrn.propagateMouseEventThroughLayers = function(e) {e.endEventPropagation = true;};
      var eventType = null;
      scrn.notify = function(event) {calledIt = true;};

      scrn.handleMouseEvent(e);

      expect(calledIt).toBeFalsy();
      done();
    });
    it("should propagate", function(done) {
      var e = {
        type:"mousedown",
        button:0
      };
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return 1;};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      scrn.handleMouseEvent(e);

      expect(calledPropagate).toBeTruthy();
      done();
    });
    it("should return false if button 1", function(done) {
      var e = {
        type:"mousedown",
        button:1
      };
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return 1;};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      var result = scrn.handleMouseEvent(e);

      expect(result).toBeFalsy();
      done();
    });
    it("should include coordinate data", function(done) {
      var x = 64;
      var y = 73;
      var e = {
        type:"mousedown",
        button:1,
        pageX:x,
        pageY:y
      };
      var result;
      scrn.notify = function(e) {result = e;};
      scrn._getCoordinateDataForMouseEvent = function() {return {check:true};};
      var expected = {
        check : true
      };

      scrn.handleMouseEvent(e);

      expect(result.data.check).toBe(expected.check, "should have set event data");
      done();
    });
  });
  describe("#propagateMouseEventThroughLayers()", function() {
    it("should call handleMouseEvent on each layer", function(done) {
      var calledLayer1 = false;
      var layer1 = {
        handleMouseEvent : function() {calledLayer1 = true;}
      };
      var calledLayer2 = false;
      var layer2 = {
        handleMouseEvent : function() {calledLayer2 = true;}
      };
      scrn.addLayer(layer1);
      scrn.addLayer(layer2);
      e = {};

      scrn.propagateMouseEventThroughLayers(e);

      expect(calledLayer1).toBeTruthy();
      expect(calledLayer2).toBeTruthy();
      done();
    });
    it("should call stop propagation if event handled", function(done) {
      var calledLayer1 = false;
      var layer1 = {
        handleMouseEvent : function(e) {calledLayer1 = true;}
      };
      var calledLayer2 = false;
      var layer2 = {
        handleMouseEvent : function(e) {
          calledLayer2 = true;
          e.endEventPropagation = true;
        }
      };
      scrn.addLayer(layer1);
      scrn.addLayer(layer2);
      e = {};

      scrn.propagateMouseEventThroughLayers(e);

      expect(calledLayer1).toBeFalsy();
      expect(calledLayer2).toBeTruthy();
      done();
    });
  });
  describe("#getXFromMouseEvent()", function() {
    it("should return y value", function(done) {
      var e = {pageX: 60};

      var result = scrn.getXFromMouseEvent(e);

      var expected = e.pageX - (scrn._targetDiv.offsetLeft + scrn.getBorderSize());
      expect(result).toBe(expected, "should have returned correct x value (expected: " + expected + ", actual: " + result + ")");
      done();
    });
  });
  describe("#getYFromMouseEvent()", function() {
    it("should return y value", function(done) {
      var e = {pageY: 43};

      var result = scrn.getYFromMouseEvent(e);

      var expected = e.pageY - (scrn._targetDiv.offsetTop + scrn.getBorderSize());
      expect(result).toBe(expected, "should have returned correct y value (expected: " + expected + ", actual: " + result + ")");
      done();
    });
  });
  describe("#setViewOriginX()", function() {
    it("should set _pendingViewOriginX", function(done) {
      var expected = 10;

      scrn.setViewOriginX(expected);

      expect(expected).toBe(scrn.getPendingViewOriginX(), "should have set _pendingViewOriginX");
      done();
    });
    it("should not set viewOriginX", function(done) {
      var expected = 10;

      scrn.setViewOriginX(expected);

      expect(expected !== scrn.getViewOriginX()).toBeTruthy();
      done();
    });
    it("should call setViewOriginX for each layer", function(done) {
      var expected = 10;
      calledLayer1 = false;
      calledLayer2 = false;
      scrn.getLayers = function() {
        var layers = [
          {setViewOriginX:function(val) {if (val === expected) calledLayer1 = true;}},
          {setViewOriginX:function(val) {if (val === expected) calledLayer2 = true;}}
        ];
        return layers;
      };

      scrn.setViewOriginX(expected);

      expect(calledLayer1).toBeTruthy();
      expect(calledLayer2).toBeTruthy();
      done();
    });
  });
  describe("#setViewOriginY()", function() {
    it("should set _pendingViewOriginY", function(done) {
      var expected = 10;

      scrn.setViewOriginY(expected);

      expect(expected).toBe(scrn.getPendingViewOriginY(), "should have set _pendingViewOriginY");
      done();
    });
    it("should not set viewOriginY", function(done) {
      var expected = 10;

      scrn.setViewOriginY(expected);

      expect(expected !== scrn.getViewOriginY()).toBeTruthy();
      done();
    });
    it("should call setViewOriginY for each layer", function(done) {
      var expected = 10;
      calledLayer1 = false;
      calledLayer2 = false;
      scrn.getLayers = function() {
        var layers = [
          {setViewOriginY:function(val) {if (val === expected) calledLayer1 = true;}},
          {setViewOriginY:function(val) {if (val === expected) calledLayer2 = true;}}
        ];
        return layers;
      };

      scrn.setViewOriginY(expected);

      expect(calledLayer1).toBeTruthy();
      expect(calledLayer2).toBeTruthy();
      done();
    });
  });
  describe("#_updateViewOrigins()", function() {
    it("should update viewOriginX if there is a _pendingViewOriginX", function(done) {
      var expected = 10;
      scrn.setViewOriginX(expected);

      scrn._updateViewOrigins();

      expect(scrn.getViewOriginX()).toBe(expected, "should have updated viewOriginX");
      done();
    });
    it("should not update viewOriginX if there is not a _pendingViewOriginX", function(done) {
      scrn._updateViewOrigins();

      expect(scrn.getViewOriginX()).toBe(0, "should have updated viewOriginX");
      done();
    });
    it("should update viewOriginY if there is a _pendingViewOriginY", function(done) {
      var expected = 10;
      scrn.setViewOriginY(expected);

      scrn._updateViewOrigins();

      expect(scrn.getViewOriginY()).toBe(expected, "should have updated viewOriginY");
      done();
    });
    it("should not update viewOriginY if there is not a _pendingViewOriginY", function(done) {
      scrn._updateViewOrigins();

      expect(scrn.getViewOriginY()).toBe(0, "should have updated viewOriginY");
      done();
    });
    it("should set _pendingViewOriginX to null if there is a _pendingViewOriginX", function(done) {
      scrn.setViewOriginX(10);

      scrn._updateViewOrigins();

      expect(scrn.getPendingViewOriginX()).toBe(null, "should have set _pendingViewOriginX to null");
      done();
    });
    it("should set _pendingViewOriginY to null if there is a _pendingViewOriginY", function(done) {
      scrn.setViewOriginY(10);

      scrn._updateViewOrigins();

      expect(scrn.getPendingViewOriginY()).toBe(null, "should have set _pendingViewOriginY to null");
      done();
    });
  });
  describe("#getViewOriginAdjustedX()", function() {
    it("should adjust x according to view origin", function(done) {
      var x = 12;
      var viewOrigin = 10;
      scrn.getViewOriginX = function() {return viewOrigin;};
      var expected = x - viewOrigin;

      var result = scrn.getViewOriginAdjustedX(x);

      expect(result).toBe(expected, "expected " + expected + ", actual " + result);
      done();
    });
  });
  describe("#getViewOriginAdjustedY()", function() {
    it("should adjust y according to view origin", function(done) {
      var y = 12;
      var viewOrigin = 10;
      scrn.getViewOriginY = function() {return viewOrigin;};
      var expected = y - viewOrigin;

      var result = scrn.getViewOriginAdjustedY(y);

      expect(result).toBe(expected, "expected " + expected + ", actual " + result);
      done();
    });
  });
  describe("#getUnScaledX()", function() {
    it("should return x (no scale)", function(done) {
      var x = 12;
      scrn._scaleX = 1;
      var expected = Math.floor(x / scrn._scaleX);

      var result = scrn.getUnScaledX(x);

      expect(result).toBe(expected, "expected " + expected + ", actual " + result);
      done();
    });
    it("should return unscaledX", function(done) {
      var x = 12;
      scrn._scaleX = 2;
      var expected = Math.floor(x / scrn._scaleX);

      var result = scrn.getUnScaledX(x);

      expect(result).toBe(expected, "expected " + expected + ", actual " + result);
      done();
    });
  });
  describe("#getUnScaledY()", function() {
    it("should return y (no scale)", function(done) {
      var y = 12;
      scrn._scaleY = 1;
      var expected = Math.floor(y / scrn._scaleY);

      var result = scrn.getUnScaledY(y);

      expect(result).toBe(expected, "expected " + expected + ", actual " + result);
      done();
    });
    it("should return unscaledY", function(done) {
      var y = 12;
      scrn._scaleY = 2;
      var expected = Math.floor(y / scrn._scaleY);

      var result = scrn.getUnScaledY(y);

      expect(result).toBe(expected, "expected " + expected + ", actual " + result);
      done();
    });
  });
});
