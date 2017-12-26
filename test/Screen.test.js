describe("Screen", function() {
  var scrn, targetDiv, layerFactory, fpsElem, config, calledRequestAnimationFrame,
    windowEventListeners = {};

  requestAnimationFrame = function() {calledRequestAnimationFrame = true;};
  beforeEach(function() {
    // blanket.js weirdness means we have to reset document link each time
    SL.Screen.document = {
      addEventListener : function(event, listener) {
        if (!windowEventListeners[event]) windowEventListeners[event] = [];
        windowEventListeners[event].push(listener);
      }
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
    layerFactory = SL.Mocks.getMockLayerFactory();
    config = {"fpsElem" : fpsElem};
    scrn = new SL.Screen(targetDiv, layerFactory, config);
  });

  describe("#initialize()", function() {
    it("should call _prepareDiv and _setupEventListeners", function(done) {
      var calledPrepareDiv, calledSetupEventListeners;
      scrn._prepareDiv = function() {calledPrepareDiv = true;};
      scrn._setupEventListeners = function() {calledSetupEventListeners = true;};

      scrn.initialize();

      assert(calledPrepareDiv === true, "should have called _prepareDiv");
      assert(calledSetupEventListeners === true, "should have called _setupEventListeners");
      done();
    });
  });
  describe("#_prepareDiv()", function() {
    it("should set div styles", function(done) {
      scrn._prepareDiv();

      assert(targetDiv.style.width === scrn._width, "should have set width");
      assert(targetDiv.style.height === scrn._height, "should have set heights");
      assert(targetDiv.style.backgroundColor === scrn._backgroundColor, "should have set backgroundColor");
      assert(targetDiv.style.border === scrn._borderSize + "px solid " + scrn._borderColor, "should have set border");
      done();
    });
  });
  describe("#_setupEventListeners()", function() {
    it("should setup event listeners", function(done) {
      scrn._setupEventListeners();

      assert(targetDiv.eventListeners.mouseup, "should have set mouseup handler");
      assert(targetDiv.eventListeners.mousedown, "should have set mousedown handler");
      assert(targetDiv.eventListeners.mousemove, "should have set mousemove handler");
      assert(windowEventListeners.visibilitychange !== undefined, "should have set visibilitychange handler");
      done();
    });
  });
  describe("#handleVisibilityChange()", function() {
    it("should unpause", function(done) {
      document.hidden = false;
      scrn.handleVisibilityChange();

      assert(scrn.isPaused() === false, "should have unpaused");
      done();
    });
    it("should not unpause if explicitly paused", function(done) {
      document.hidden = false;
      scrn.setPaused(true);
      scrn.handleVisibilityChange();

      assert(scrn._unpaused === false, "should not have unpaused");
      done();
    });
  });
  describe("#addEventListenerToDocument()", function() {
    it("should add event listener to document", function(done) {
      scrn.addEventListenerToDocument("dummyEvent", function() {});

      assert(windowEventListeners.dummyEvent !== undefined, "should have added dummy event");
      done();
    });
  });
  describe("#setBackgroundColor()", function() {
    it("should set background color", function(done) {
      var color = "yellow";

      scrn.setBackgroundColor(color);

      assert(scrn.getBackgroundColor() === color, "should have set background color");
      assert(targetDiv.style.backgroundColor === color, "should have set background color on target div");
      done();
    });
  });
  describe("#setBorderColor()", function() {
    it("should set border color", function(done) {
      var color = "lightgreen";

      scrn.setBorderColor(color);

      assert(scrn.getBorderColor() === color, "should have set border color");
      assert(targetDiv.style.border === scrn._borderSize + "px solid " + color, "should have set border color on target div");
      done();
    });
  });
  describe("#setBorderSize()", function() {
    it("should set border size", function(done) {
      var amount = 50;

      scrn.setBorderSize(amount);

      assert(scrn.getBorderSize() === amount, "should have set border size");
      assert(targetDiv.style.border === amount + "px solid " + scrn._borderColor, "should have set border size on target div");
      done();
    });
  });
  describe("#createLayer()", function() {
    it("should add layer", function(done) {
      scrn.createLayer();

      assert(scrn.getLayers().length, "should have added a layer");
      done();
    });
  });
  describe("#setPaused()", function() {
    it("should pause", function(done) {
      var eventType = null;
      scrn.notify = function(event) {eventType = event.type;};
      scrn.setPaused(true);

      assert(scrn.isPaused() === true, "should have set paused");
      assert(scrn._unpaused === false, "should not have set unpaused true");
      assert(eventType === SL.EventType.SCREEN_PAUSED, "should have notified of pause event");
      assert(calledRequestAnimationFrame === false, "should not have called requestAnimationFrame");
      done();
    });
    it("should unpause", function(done) {
      var eventType = null;
      scrn.notify = function(event) {eventType = event.type;};
      scrn.setPaused(true);
      scrn.setPaused(false);

      assert(scrn.isPaused() === false, "should have set paused false");
      assert(scrn._unpaused === true, "should have set unpaused true");
      assert(eventType === SL.EventType.SCREEN_RESUMED, "should have notified of resume event");
      assert(calledRequestAnimationFrame === true, "should have called requestAnimationFrame");
      done();
    });
  });
  describe("#on()", function(){
    it("should add callback to list", function(done) {
      var eventType = "newType";
      scrn.on(eventType, function() {
        assert(true);
        done();
      }, "testHandler");
      scrn._eventListeners[eventType].testHandler();
    });
  });
  describe("#clearEventHandlers()", function(){
    it("should add callback to list", function(done) {
      var eventType = "newType";
      scrn.on(eventType, function() {}, "testHandler");

      scrn.clearEventHandlers(eventType);

      assert(scrn._eventListeners[eventType].testHandler === undefined, "should have cleared handler list");
      done();
    });
    it("should throw error", function(done) {
      var eventType = "newType";

      var result = throwsError(scrn.clearEventHandlers.bind(scrn, eventType));

      assert(result === true, "should have thrown error");
      done();
    });
  });
  describe("#notify()", function() {
    it("should notify listeners", function(done) {
      var event = {type:"blerg"};
      scrn.getScreenContext = function() {
        return {notify:function(){}};
      };
      var result = false;
      scrn.on("blerg", function() {
        result = true;
      });

      scrn.notify(event);
      assert(result, "should have notified listeners");
      done();
    });
  });
  describe("#render()", function() {
    it("should return if paused or tab not visible", function(done) {
      scrn.setPaused(true);
      var calledInternalRender = false;
      scrn._render = function() {calledInternalRender = true;};

      scrn.render(1);

      assert(calledInternalRender === false, "should have returned.");
      done();
    });
    it("should call handleMouseMoveEvent if mouse moved", function(done) {
      scrn._mouseMoved = true;
      var calledIt = false;
      scrn._handleMouseMoveEvent = function() {calledIt = true;};

      scrn.render(1);

      assert(calledIt === true, "should have called handleMouseMoveEvent.");
      done();
    });
    it("should notify before and after render event", function(done) {
      var eventTypes = [];
      var calledBeforeRender = false;
      var calledAfterRender = false;
      scrn.on(SL.EventType.BEFORE_RENDER, function(event) {
        calledBeforeRender = true;
      });
      scrn.on(SL.EventType.AFTER_RENDER, function(event) {
        calledAfterRender = true;
      });

      scrn.render(1);

      assert(calledBeforeRender === true, "should have notified of before render event.");
      assert(calledAfterRender === true, "should have notified of after render event.");
      done();
    });
    it("should call updateFps", function(done) {
      var calledIt = false;
      scrn._updateFps = function() {calledIt = true;};

      scrn.render(1);

      assert(calledIt === true, "should have called updateFps.");
      done();
    });
    it("should call _update", function(done) {
      var calledIt = false;
      scrn._update = function() {calledIt = true;};

      scrn.render(1);

      assert(calledIt === true, "should have called _update.");
      done();
    });
    it("should call _render", function(done) {
      var calledIt = false;
      scrn._render = function() {calledIt = true;};

      scrn.render(1);

      assert(calledIt === true, "should have called _render.");
      done();
    });
    it("should call requestAnimationFrame", function(done) {
      scrn.render(1);

      assert(calledRequestAnimationFrame === true, "should have called requestAnimationFrame.");
      done();
    });
    it("should unpause", function(done) {
      var time = 100;
      scrn.setPaused(true);
      scrn.setPaused(false);
      assert(scrn._unpaused === true, "unpaused should be true here");

      scrn.render(time);

      assert(scrn._unpaused === false, "should have reset unpaused flag.");
      done();
    });
    it("should calculate diff based on unpause", function(done) {
      var time = 100;
      var calledWithDiff = null;
      scrn._update = function(time,diff) {calledWithDiff = diff;};
      scrn.setPaused(true);
      scrn.setPaused(false);

      scrn.render(time);

      assert(calledWithDiff === 1, "should calculated diff properly.");
      done();
    });
  });
  describe("#_handleMouseMoveEvent()", function() {
    it("should notify mouse move event", function(done) {
      var eventType = null;
      scrn.notify = function(event) {eventType = event.type;};

      scrn._handleMouseMoveEvent();

      assert(eventType === SL.EventType.MOUSE_MOVE, "should have notified of before mouse move event.");
      done();
    });
    it("should propagate event", function(done) {
      var calledIt = null;
      scrn.propagateMouseEventThroughLayers = function() {calledIt = true;};

      scrn._handleMouseMoveEvent();

      assert(calledIt === true, "should have propagated event.");
      done();
    });
    it("should reset mouseMoved", function(done) {
      scrn._mouseMoved = true;

      scrn._handleMouseMoveEvent();

      assert(scrn._mouseMoved === false, "should have reset mouseMoved.");
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

      assert(result.data.check === expected.check, "should have set event data");
      done();
    });
    it("should not notify if endEventPropagation becomes set", function(done) {
      var calledIt = false;
      scrn.propagateMouseEventThroughLayers = function(e) {e.endEventPropagation = true;};
      var eventType = null;
      scrn.notify = function(event) {calledIt = true;};

      scrn._handleMouseMoveEvent(1);

      assert(calledIt === false, "should not have notified");
      done();
    });
  });
  describe("#_updateFps()", function() {
    it("should add fps to _fpsMonitorArray", function(done) {
      scrn._showFps = true;

      scrn._updateFps(100);

      assert(scrn._fpsMonitorArray.length === 1, "Should have pushed fps to _fps");
      assert(scrn._fpsMonitorArray[0] === 10, "Should have pushed fps to _fps");
      done();
    });
    it("should add fps to _fpsMonitorArray", function(done) {
      scrn._showFps = true;
      for(var i = 0; i < 30; i++) scrn._fpsMonitorArray.push(10);
      scrn._fpsMonitorIndex = 30;

      scrn._updateFps(100);

      assert(scrn._fpsMonitorArray.length === 31, "Should have pushed fps to _fps");
      done();
    });
    it("should reset _fpsMonitorIndex", function(done) {
      scrn._showFps = true;
      for(var i = 0; i < 29; i++) scrn._fpsMonitorArray.push(10);
      scrn._fpsMonitorIndex = 29;

      scrn._updateFps(100);

      assert(scrn._fpsMonitorIndex === 0, "Should have reset _fpsMonitorIndex");
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

      assert(calledUpdate1 === true, "should have called update on layer1");
      assert(calledUpdate2 === true, "should have called update on layer2");
      done();
    });
  });
  describe("#_render()", function() {
    it("should call update on each layer", function(done) {
      var calledRender1 = false;
      var layer1 = {
        render : function() {calledRender1 = true;},
        prerender : function() {},
        postrender : function() {}
      };
      var calledRender2 = false;
      var layer2 = {
        render : function() {calledRender2 = true;},
        prerender : function() {},
        postrender : function() {}
      };
      scrn.addLayer(layer1);
      scrn.addLayer(layer2);

      scrn._render(1,1);

      assert(calledRender1 === true, "should have called render on layer1");
      assert(calledRender2 === true, "should have called render on layer2");
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

      assert(result.x === expected.x, "expected " + expected.x + ", actual " + result.x);
      assert(result.y === expected.y, "expected " + expected.y + ", actual " + result.y);
      assert(result.unscaledX === expected.unscaledX, "expected " + expected.unscaledX + ", actual " + result.unscaledX);
      assert(result.unscaledY === expected.unscaledY, "expected " + expected.unscaledY + ", actual " + result.unscaledY);
      assert(result.rawX === expected.rawX, "expected " + expected.rawX + ", actual " + result.rawX);
      assert(result.rawY === expected.rawY, "expected " + expected.rawY + ", actual " + result.rawY);
      done();
    });
  });
  describe("#handleMouseMoveEvent()", function() {
    it("should not update _mouseMoved if paused", function(done) {
      var e = {};
      scrn.setPaused(true);
      scrn._mouseMoved = false;

      scrn.handleMouseMoveEvent(e);

      assert(scrn._mouseMoved === false, "should not have updated _mouseMoved");
      done();
    });
    it("should set mouse coords if x < 0", function(done) {
      var e = {};
      scrn.getXFromMouseEvent = function() {return -1;};
      scrn.getYFromMouseEvent = function() {return 1;};

      scrn.handleMouseMoveEvent(e);

      assert(scrn._mouseMoved === true, "should have updated _mouseMoved");
      assert(scrn._mouseX === -1, "should have updated mouseX");
      assert(scrn._mouseY === -1, "should have updated mouseY");
      done();
    });
    it("should set mouse coords if y < 0", function(done) {
      var e = {};
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return -1;};

      scrn.handleMouseMoveEvent(e);

      assert(scrn._mouseMoved === true, "should have updated _mouseMoved");
      assert(scrn._mouseX === -1, "should have updated mouseX");
      assert(scrn._mouseY === -1, "should have updated mouseY");
      done();
    });
    it("should set mouse coords if x >= screenWidth", function(done) {
      var e = {};
      scrn.getXFromMouseEvent = function() {return scrn.getWidth();};
      scrn.getYFromMouseEvent = function() {return 1;};

      scrn.handleMouseMoveEvent(e);

      assert(scrn._mouseMoved === true, "should have updated _mouseMoved");
      assert(scrn._mouseX === -1, "should have updated mouseX");
      assert(scrn._mouseY === -1, "should have updated mouseY");
      done();
    });
    it("should set mouse coords if y >= screen height", function(done) {
      var e = {};
      scrn.getXFromMouseEvent = function() {return -1;};
      scrn.getYFromMouseEvent = function() {return scrn.getHeight();};

      scrn.handleMouseMoveEvent(e);

      assert(scrn._mouseMoved === true, "should have updated _mouseMoved");
      assert(scrn._mouseX === -1, "should have updated mouseX");
      assert(scrn._mouseY === -1, "should have updated mouseY");
      done();
    });
    it("should set mouse coords", function(done) {
      var e = {};
      scrn.getXFromMouseEvent = function() {return 5;};
      scrn.getYFromMouseEvent = function() {return 7;};

      scrn.handleMouseMoveEvent(e);

      assert(scrn._mouseMoved === true, "should have updated _mouseMoved");
      assert(scrn._mouseX === 5, "should have updated mouseX");
      assert(scrn._mouseY === 7, "should have updated mouseY");
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

      assert(calledPropagate === false, "should not have propagated");
      done();
    });
    it("should return if not in bounds, x < 0", function(done) {
      var e = {};
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return -1;};
      scrn.getYFromMouseEvent = function() {return 1;};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      scrn.handleMouseEvent(e);

      assert(calledPropagate === false, "should not have propagated");
      done();
    });
    it("should return if not in bounds, x = width", function(done) {
      var e = {};
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return scrn.getWidth();};
      scrn.getYFromMouseEvent = function() {return 1;};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      scrn.handleMouseEvent(e);

      assert(calledPropagate === false, "should not have propagated");
      done();
    });
    it("should return if not in bounds, y < 0", function(done) {
      var e = {};
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return -1;};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      scrn.handleMouseEvent(e);

      assert(calledPropagate === false, "should not have propagated");
      done();
    });
    it("should return if not in bounds, y = height", function(done) {
      var e = {};
      var calledPropagate = false;
      scrn.getXFromMouseEvent = function() {return 1;};
      scrn.getYFromMouseEvent = function() {return scrn.getHeight();};
      scrn.propagateMouseEventThroughLayers = function() {calledPropagate = true;};

      scrn.handleMouseEvent(e);

      assert(calledPropagate === false, "should not have propagated");
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

      assert(eventType === SL.EventType.MOUSE_UP, "should have notified mouseup event");
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

      assert(eventType === SL.EventType.MOUSE_DOWN, "should have notified mousedown event");
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

      assert(calledIt === false, "should not have notified");
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

      assert(calledPropagate === true, "should have propagated");
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

      assert(result === false, "should have returned false");
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

      assert(result.data.check === expected.check, "should have set event data");
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

      assert(calledLayer1 === true, "should have propagated to layer1");
      assert(calledLayer2 === true, "should have propagated to layer2");
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

      assert(calledLayer1 === false, "should not have propagated to layer1");
      assert(calledLayer2 === true, "should have propagated to layer2");
      done();
    });
  });
  describe("#getXFromMouseEvent()", function() {
    it("should return y value", function(done) {
      var e = {pageX: 60};

      var result = scrn.getXFromMouseEvent(e);

      var expected = e.pageX - (scrn._targetDiv.offsetLeft + scrn.getBorderSize());
      assert(result === expected, "should have returned correct x value (expected: " + expected + ", actual: " + result + ")");
      done();
    });
  });
  describe("#getYFromMouseEvent()", function() {
    it("should return y value", function(done) {
      var e = {pageY: 43};

      var result = scrn.getYFromMouseEvent(e);

      var expected = e.pageY - (scrn._targetDiv.offsetTop + scrn.getBorderSize());
      assert(result === expected, "should have returned correct y value (expected: " + expected + ", actual: " + result + ")");
      done();
    });
  });
  describe("#setViewOriginX()", function() {
    it("should set _pendingViewOriginX", function(done) {
      var expected = 10;

      scrn.setViewOriginX(expected);

      assert(expected === scrn.getPendingViewOriginX(), "should have set _pendingViewOriginX");
      done();
    });
    it("should not set viewOriginX", function(done) {
      var expected = 10;

      scrn.setViewOriginX(expected);

      assert(expected !== scrn.getViewOriginX(), "should not have set ViewOriginX");
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

      assert(calledLayer1 === true, "should have called setViewOriginX on layer 1");
      assert(calledLayer2 === true, "should have called setViewOriginX on layer 2");
      done();
    });
  });
  describe("#setViewOriginY()", function() {
    it("should set _pendingViewOriginY", function(done) {
      var expected = 10;

      scrn.setViewOriginY(expected);

      assert(expected === scrn.getPendingViewOriginY(), "should have set _pendingViewOriginY");
      done();
    });
    it("should not set viewOriginY", function(done) {
      var expected = 10;

      scrn.setViewOriginY(expected);

      assert(expected !== scrn.getViewOriginY(), "should not have set ViewOriginY");
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

      assert(calledLayer1 === true, "should have called setViewOriginY on layer 1");
      assert(calledLayer2 === true, "should have called setViewOriginY on layer 2");
      done();
    });
  });
  describe("#_updateViewOrigins()", function() {
    it("should update viewOriginX if there is a _pendingViewOriginX", function(done) {
      var expected = 10;
      scrn.setViewOriginX(expected);

      scrn._updateViewOrigins();

      assert(scrn.getViewOriginX() === expected, "should have updated viewOriginX");
      done();
    });
    it("should not update viewOriginX if there is not a _pendingViewOriginX", function(done) {
      scrn._updateViewOrigins();

      assert(scrn.getViewOriginX() === 0, "should have updated viewOriginX");
      done();
    });
    it("should update viewOriginY if there is a _pendingViewOriginY", function(done) {
      var expected = 10;
      scrn.setViewOriginY(expected);

      scrn._updateViewOrigins();

      assert(scrn.getViewOriginY() === expected, "should have updated viewOriginY");
      done();
    });
    it("should not update viewOriginY if there is not a _pendingViewOriginY", function(done) {
      scrn._updateViewOrigins();

      assert(scrn.getViewOriginY() === 0, "should have updated viewOriginY");
      done();
    });
    it("should set _pendingViewOriginX to null if there is a _pendingViewOriginX", function(done) {
      scrn.setViewOriginX(10);

      scrn._updateViewOrigins();

      assert(scrn.getPendingViewOriginX() === null, "should have set _pendingViewOriginX to null");
      done();
    });
    it("should set _pendingViewOriginY to null if there is a _pendingViewOriginY", function(done) {
      scrn.setViewOriginY(10);

      scrn._updateViewOrigins();

      assert(scrn.getPendingViewOriginY() === null, "should have set _pendingViewOriginY to null");
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

      assert(result === expected, "expected " + expected + ", actual " + result);
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

      assert(result === expected, "expected " + expected + ", actual " + result);
      done();
    });
  });
  describe("#getUnScaledX()", function() {
    it("should return x (no scale)", function(done) {
      var x = 12;
      scrn._scaleX = 1;
      var expected = Math.floor(x / scrn._scaleX);

      var result = scrn.getUnScaledX(x);

      assert(result === expected, "expected " + expected + ", actual " + result);
      done();
    });
    it("should return unscaledX", function(done) {
      var x = 12;
      scrn._scaleX = 2;
      var expected = Math.floor(x / scrn._scaleX);

      var result = scrn.getUnScaledX(x);

      assert(result === expected, "expected " + expected + ", actual " + result);
      done();
    });
  });
  describe("#getUnScaledY()", function() {
    it("should return y (no scale)", function(done) {
      var y = 12;
      scrn._scaleY = 1;
      var expected = Math.floor(y / scrn._scaleY);

      var result = scrn.getUnScaledY(y);

      assert(result === expected, "expected " + expected + ", actual " + result);
      done();
    });
    it("should return unscaledY", function(done) {
      var y = 12;
      scrn._scaleY = 2;
      var expected = Math.floor(y / scrn._scaleY);

      var result = scrn.getUnScaledY(y);

      assert(result === expected, "expected " + expected + ", actual " + result);
      done();
    });
  });
});
