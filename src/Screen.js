var LayerFactory = require('./LayerFactory');
var Utils = require('./Utils');
var EventType = require('./EventType');
var EventNotifierMixin = require('slcommon/src/EventNotifierMixin');
var CanvasContextWrapper = require('./CanvasContextWrapper');
var Event = require('slcommon/src/Event');
var MouseEvent = require('./MouseEvent');


/** The Screen is the overriding container for Graphics components.
* The Screen orchestrates updating and rendering its layers, propagates
* mouse events down to the layers, and notifies event listeners when events occur.
* @constructor
* @param {HTMLElement} targetDiv The target HTMLElement into which the screen and its layers will be built.
* @param {Object} config Supported configuration properties:
* <ul>
*   <li>scaleX - integer - the horizontal scale of the screen.  Default: 1</li>
*   <li>scaleY - integer - the horizontal scale of the screen.  Default: 1</li>
*   <li>width - integer - Width for the screen (in px). Default: 800
*   <li>height - integer - Height for the screen (in px). Default: 600
*   <li>fpsElem - HTMLElement - Element to write Frames-per-second information to. </li>
*   <li>backgroundColor - Color - The color to set the screen background to.</li>
*   <li>borderColor - Color - The color to set the screen border to.</li>
*   <li>borderSize - integer - The borderSize of the screen, in pixels. Default: 1</li>
* </ul>
*/
function Screen(props) {
  props = props || {};
  this._targetDiv = props.targetDiv;
  this._layerFactory = props.layerFactory || new LayerFactory();
  this._scaleX = props.scaleX || 1;
  this._scaleY = props.scaleY || 1;
  this._width = (props.width || 640) * this._scaleX;
  this._height = (props.height || 480) * this._scaleY;
  this._fpsElem = props.fpsElem || null;
  this._imageSmoothingEnabled = props.imageSmoothingEnabled || false;
  this._avgTime = 0;
  this._last = 0;
  this._mouseX = -1;
  this._mouseY = -1;
  this._mouseMoved = false;
  this._paused = false;
  this._unpaused = false;
  this._useMouseMoveEvents = Utils.isNullOrUndefined(props.useMouseMoveEvents) ? true : props.useMouseMoveEvents;

  this._backgroundColor = props.backgroundColor || "black";
  this._borderColor = props.borderColor || "grey";
  this._borderSize = props.borderSize || 1;

  this._fpsMonitorArray = [];
  this._fpsMonitorIndex = 0;

  this._viewOriginX = 0;
  this._viewOriginY = 0;
  this._pendingViewOriginX = null;
  this._pendingViewOriginY = null;
  this._layers = [];

  this._requestAnimationFrame = props.requestAnimationFrame;
};

EventNotifierMixin.call(Screen.prototype);

Screen.document = window.document;

/** Setup the screen on the page. Must be called prior to rendering.
*/
Screen.prototype.initialize = function() {
  this._prepareDiv();
  this._setupEventListeners();
};

Screen.prototype.setViewOriginX = function(viewOriginX) {
  this._pendingViewOriginX = viewOriginX;
  if (this._pendingViewOriginX !== null && this._pendingViewOriginX !== this.getViewOriginX()) {
    this.getLayers().forEach(function(layer) {
      layer.setViewOriginX(viewOriginX);
    });
  }
};
Screen.prototype.setViewOriginY = function(viewOriginY) {
  this._pendingViewOriginY = viewOriginY;
  if (this._pendingViewOriginY !== null && this._pendingViewOriginY !== this.getViewOriginY()) {
    this.getLayers().forEach(function(layer) {
      layer.setViewOriginY(viewOriginY);
    });
  }
};

Screen.prototype.getViewOriginX = function() {return this._viewOriginX;};
Screen.prototype.getViewOriginY = function() {return this._viewOriginY;};

Screen.prototype.getPendingViewOriginX = function() {return this._pendingViewOriginX;};
Screen.prototype.getPendingViewOriginY = function() {return this._pendingViewOriginY;};


/** @private */
Screen.prototype._prepareDiv = function() {
  this._targetDiv.style.width = this._width;
  this._targetDiv.style.height = this._height;
  this._targetDiv.style.backgroundColor = this._backgroundColor;
  this._targetDiv.style.border = this._borderSize + "px solid " + this._borderColor;
};

/** @private */
Screen.prototype._setupEventListeners = function() {
  this._targetDiv.addEventListener("mouseup",this.handleMouseEvent.bind(this), true);
  this._targetDiv.addEventListener("mousedown",this.handleMouseEvent.bind(this), true);
  if (this._useMouseMoveEvents) this._targetDiv.addEventListener("mousemove",this.handleMouseMoveEvent.bind(this), true);
  Screen.document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this), false);
};

/** @private */
Screen.prototype.handleVisibilityChange = function() {
  this._tabNotVisible = Screen.document.hidden;
  if (!this._tabNotVisible && !this._paused) {
    this._unpaused = true;
    this._requestAnimationFrame(this.render.bind(this));
  }
};

/** Add an event listener to the document.
* @param {string} event The type of event.
* @param {Function} listener The function to call when the event occurs.
*/
Screen.prototype.addEventListenerToDocument = function(event, listener) {
  Screen.document.addEventListener(event,listener);
};

/** Set the background color.
* @param {string} color Any valid CSS color string.
*/
Screen.prototype.setBackgroundColor = function(color) {
  this._backgroundColor = color;
  this._targetDiv.style.backgroundColor = color;
};

/** Return the current backgroundColor.
* @returns {string}
*/
Screen.prototype.getBackgroundColor = function(color) {
  return this._backgroundColor;
};

/** Set the border color.
* @param {string} color Any valid CSS color string.
*/
Screen.prototype.setBorderColor = function(color) {
  this._borderColor = color;
  this._targetDiv.style.border = this._borderSize + "px solid " + color;
};

/** Return the current border color.
* @returns {string}
*/
Screen.prototype.getBorderColor = function() {
  return this._borderColor;
};

/** Set the border size.
* @param {integer} size The size for the border; will be interpretted as pixels.
*/
Screen.prototype.setBorderSize = function(size) {
  this._borderSize = size;
  this._targetDiv.style.border = size + "px solid " + this._borderColor;
};

/** Return the current border size, in pixels.
* @returns {integer}
*/
Screen.prototype.getBorderSize = function() {
  return this._borderSize;
};

/** Return the width.
* @returns {integer}
*/
Screen.prototype.getWidth = function() {return this._width;};

/** Return the height.
* @returns {integer}
*/
Screen.prototype.getHeight = function() {return this._height;};

/** Return the x-scale.
* @returns {integer}
*/
Screen.prototype.getScaleX = function() {return this._scaleX;};

/** Return the y-scale.
* @returns {integer}
*/
Screen.prototype.getScaleY = function() {return this._scaleY;};

/** Return the current x coordinate of the mouse.
* @returns {integer}
*/
Screen.prototype.getMouseX = function() {return this._mouseX;};

/** Return the current y coordinate of the mouse.
* @returns {integer}
*/
Screen.prototype.getMouseY = function() {return this._mouseY;};

Screen.prototype.isImageSmoothingEnabled = function() {return this._imageSmoothingEnabled;};
Screen.prototype.setImageSmoothingEnabled = function(imageSmoothingEnabled) {this._imageSmoothingEnabled = imageSmoothingEnabled;};


/** Create a new {@link Layer} and add it to this screen.  Layers will be rendered in FIFO order,
* so layers added later will be drawn on top of layers added earlier.
* @param {string} type The type of layer to add - either "TextLayer" or "GfxLayer"
* @see Layer
*/
Screen.prototype.createLayer = function(type, props) {
  var canvas = this.createCanvasForLayer();
  var canvasContextWrapper = this.createCanvasContextWrapper(canvas);

  var layer = this._layerFactory.getLayer(type, {
    canvasContextWrapper:canvasContextWrapper,
    width:this.getWidth(),
    height:this.getHeight()
  });

  this.addLayer(layer);
  return layer;
};

Screen.prototype.createCanvasForLayer = function() {
  var canvas = Screen.document.createElement("CANVAS");
  this._targetDiv.appendChild(canvas);
  canvas.width = this._width;
  canvas.height = this._height;
  canvas.style.position = "absolute";
  return canvas;
};

Screen.prototype.createCanvasContextWrapper = function(canvas) {
  return new CanvasContextWrapper({
    canvasContext:canvas.getContext("2d"),
    imageSmoothingEnabled:this._imageSmoothingEnabled,
    width:this._width,
    height:this._height
  });
};

/** Add a new  {@link Layer} to this screen.  The preferred method of adding layers
* is via the createLayer() method, but this will also work.
* Layers will be rendered in FIFO order,
* so layers added later will be drawn on top of layers added earlier.
* @param {Layer} layer The layer to add to the screen.
* @see Layer
*/
Screen.prototype.addLayer = function(layer) {
  this._layers.push(layer);
};

/** Return the array of layers.
* @returns {Array}
*/
Screen.prototype.getLayers = function() {
  return this._layers;
};

/** Pause or unpause the screen.
* @param {boolean} boolean true = pause the screen; false = unpause the screen.
*/
Screen.prototype.setPaused = function(boolean) {
  if (this._paused && !boolean) this._unpaused = true;
  this._paused = boolean;
  this.notify(
    new Event(
      this._paused ? EventType.SCREEN_PAUSED : EventType.SCREEN_RESUMED
    )
  );
  if (!this._paused) this._requestAnimationFrame(this.render.bind(this));
};

/** Add a one-time event handler for the start of the next frame.
* @param {Function} callback The handler function.
* @returns {String} The Id assigned to the handler function.
*/
Screen.prototype.onNextFrameBegin = function(callback) {
  return this.on(EventType.NEXT_FRAME_BEGIN, callback);
};

/** Add a one-time event handler for the end of the next frame.
* @param {Function} callback The handler function.
* @returns {String} The Id assigned to the handler function.
*/
Screen.prototype.onNextFrameEnd = function(callback) {
  return this.on(EventType.NEXT_FRAME_END, callback);
};

Screen.prototype._doBeforeRenderEvents = function(time, diff) {
  this.notify(
    new Event(EventType.NEXT_FRAME_BEGIN, {diff:diff}, time)
  );
  this.clearEventHandlers(EventType.NEXT_FRAME_BEGIN);
  this.notify(
    new Event(EventType.BEFORE_RENDER, {diff:diff}, time)
  );
};

Screen.prototype._doAfterRenderEvents = function(time, diff) {
  this.notify(
    new Event(EventType.NEXT_FRAME_END, {diff:diff}, time)
  );
  this.clearEventHandlers(EventType.NEXT_FRAME_END);
  this.notify(
    new Event(EventType.AFTER_RENDER, {diff:diff}, time)
  );
};

/** Return whether the screen is paused
* @returns {boolean}
*/
Screen.prototype.isPaused = function() {return this._paused;};

/** Render the screen and all layers.
* @param {number} time The current time in milliseconds.
*/
Screen.prototype.render = function(time) {
  time = time || 1;
  if (this._paused || this._tabNotVisible) return;
  if (this._unpaused) {
    this._unpaused = false;
    this._last = Math.floor(time) - 1;
  }
  time = Math.floor(time);
  var elapsed = Date.now();
  var diff = time - this._last;
  this._last = time;

  if (this._mouseMoved) {
    this._handleMouseMoveEvent(time);
  }

  this._doBeforeRenderEvents(time, diff);

  this._updateFps(diff);

  this._update(time,diff);
  this._render(time,diff);

  this._updateViewOrigins();
  this._doAfterRenderEvents(time, diff);

  elapsed = Date.now() - elapsed;
  if (this._fpsElem && this._fpsMonitorIndex === 0)
    this._fpsElem.innerHTML += "<br />Avg MS per frame: " + elapsed;

  this._requestAnimationFrame(this.render.bind(this));
};

Screen.prototype._updateViewOrigins = function() {
  if (!Utils.isNullOrUndefined(this.getPendingViewOriginX())) {
    this._viewOriginX = this.getPendingViewOriginX();
    this._pendingViewOriginX = null;
  }
  if (!Utils.isNullOrUndefined(this.getPendingViewOriginY())) {
    this._viewOriginY = this.getPendingViewOriginY();
    this._pendingViewOriginY = null;
  }
};

/** @private */
Screen.prototype._handleMouseMoveEvent = function(time) {
  var coordinateData = this._getCoordinateDataForMouseEvent(this._mouseX, this._mouseY);

  var event = new MouseEvent(
    EventType.MOUSE_MOVE,
    coordinateData,
    time
  );
  this.propagateMouseEventThroughLayers(event);
  if (!event.endEventPropagation) this.notify(event);
  this._mouseMoved = false;
};

/** @private */
Screen.prototype._updateFps = function(diff) {
  if (this._fpsElem) {
    var fps = Math.floor(1000 / diff);
    if (this._fpsMonitorArray.length < 30){
      this._fpsMonitorArray.push(fps);
    } else {
      this._fpsMonitorArray[this._fpsMonitorIndex] = fps;
    }
    this._fpsMonitorIndex++;
    if (this._fpsMonitorIndex >= 30) this._fpsMonitorIndex = 0;

    var fpsa = 1;
    for (var i = 0; i < this._fpsMonitorArray.length; i++){
      fpsa += this._fpsMonitorArray[i] / 30;
    }
    if (this._fpsElem && this._fpsMonitorIndex === 0)
      this._fpsElem.innerHTML = "fps: " + Math.floor(fpsa);
  }
};

/** @private */
Screen.prototype._update = function (time,diff) {
  for (var i = 0; i < this._layers.length; i++) {
    this._layers[i].update(time,diff);
  }
};

/** @private */
Screen.prototype._render = function(time,diff) {
  for (var i = 0; i < this._layers.length; i++) {
    this._layers[i].prerender(time,diff);
    this._layers[i].render(time,diff);
    this._layers[i].postrender(time,diff);
  }
};

/** Handle a mouse move event.  This does not directly propagate the event to
* layers and elements; rather it will flag that a mouse movement has occured, and records its current location.
* The event will be propagated during the next render cycle.
* @param {Event} e The mouse event
*/
Screen.prototype.handleMouseMoveEvent = function(e) {
  if (this._paused) return false;
  this._mouseMoved = true;
  var x = this.getXFromMouseEvent(e);
  var y = this.getYFromMouseEvent(e);

  if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
    this._mouseX = -1;
    this._mouseY = -1;
    return false;
  }
  this._mouseX = x;
  this._mouseY = y;
};

/** @private */
Screen.prototype._getCoordinateDataForMouseEvent = function(canvasX, canvasY) {
  var viewOriginAdjustedX = this.getViewOriginAdjustedX(canvasX);
  var viewOriginAdjustedY = this.getViewOriginAdjustedY(canvasY);

  var x = this.getUnScaledX(viewOriginAdjustedX);
  var y = this.getUnScaledY(viewOriginAdjustedY);
  var data = {
    x : x,
    y : y,
    viewOriginAdjustedX : viewOriginAdjustedX,
    viewOriginAdjustedY : viewOriginAdjustedY,
    rawX : canvasX,
    rawY : canvasY
  };
  return data;
};

/** Handles mouse up and mouse down events; notifies any local handlers and propagates the event to all layers.
* @param {Event} e The mouse event
*/
Screen.prototype.handleMouseEvent = function(e) {
  if (this._paused) return false;
  var canvasX = this.getXFromMouseEvent(e);
  var canvasY = this.getYFromMouseEvent(e);

  if (canvasX < 0 || canvasX >= this._width || canvasY < 0 || canvasY >= this._height) {
    return false;
  }

  var data = this._getCoordinateDataForMouseEvent(canvasX, canvasY);
  data.baseEvent = e;
  var type = e.type === "mouseup" ? EventType.MOUSE_UP : EventType.MOUSE_DOWN;
  var event = new MouseEvent(type, data);

  // propagate through layers
  this.propagateMouseEventThroughLayers(event);
  if (!event.endEventPropagation) this.notify(event);

  if (e.button === 1) return false;
};

/** @private */
Screen.prototype.propagateMouseEventThroughLayers = function(event) {
  for (var i = this._layers.length - 1; i >= 0; i--) {
    if (event.endEventPropagation) return;
    this._layers[i].handleMouseEvent(event);
  }
};

/** Return the x coordinate from a mouse event.  Accounts for screen position.
* @param {Event} e Mouse Event
*/
Screen.prototype.getXFromMouseEvent = function(e) {
  return (e.pageX - (this._targetDiv.offsetLeft + this._borderSize));
};

/** Return the y coordinate from a mouse event.  Accounts for screen position.
* @param {Event} e Mouse Event
*/
Screen.prototype.getYFromMouseEvent = function(e) {
  return (e.pageY - (this._targetDiv.offsetTop + this._borderSize));
};

/** Return an x value with scale removed.
* @param {int} x The x coordinate.
* @return {int} The unscaled x.
*/
Screen.prototype.getUnScaledX = function(x) {
  return Math.floor(x / this.getScaleX());
};

/** Return a y value with scale removed.
* @param {int} y The y coordinate.
* @return {int} The unscaled y.
*/
Screen.prototype.getUnScaledY = function(y) {
  return Math.floor(y / this.getScaleY());
};

/** Return an x value adjusted for view origin.
* @param {int} x The x coordinate.
* @return {int} The view origin adjusted x.
*/
Screen.prototype.getViewOriginAdjustedX = function(x) {
  return x - this.getViewOriginX();
};

/** Return a y value adjusted for view origin.
* @param {int} y The y coordinate.
* @return {int} The view origin adjusted y.
*/
Screen.prototype.getViewOriginAdjustedY = function(y) {
  return y - this.getViewOriginY();
};

/** Directly set the border style.
* NOTE: subsequent changes using the setBorderColor or setBorderSize methods will overwrite any changes made in this method.
* @param {string} width Any valid CSS Border width string.
* @param {string} style Any valid CSS Border style string.
* @param {string} color Any valid CSS Border color string.
*/
Screen.prototype.setBorder = function(width, style, color) {
  this._targetDiv.style.borderWidth = width;
  this._targetDiv.style.borderStyle = style;
  this._targetDiv.style.borderColor = color;
};

module.exports = Screen;
