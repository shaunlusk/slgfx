var SL = SL || {};

/**
* Abstract class for graphical layers on a SL.Screen.<br />
* Existing implementations: {@link SL.TextLayer}, {@link SL.GfxLayer}
* @constructor
* @param {SL.Screen} screenContext The parent screen
* @param {CanvasContextWrapper} canvasContextWrapper The canvasContextWrapper. This layer will draw to the canvas' context, via wrapper's exposed methods.
* @param {Object} props The properties for this layer:
* <ul>
*   <li>width - number - The width of the layer.  Should match Screen.</li>
*   <li>height - number - The height of the layer.  Should match Screen.</li>
* </ul>
* @see SL.TextLayer
* @see SL.GfxLayer
*/
SL.Layer = function(screenContext, canvasContextWrapper, props) {
  props = props || {};
  this._width = props.width || 320;
  this._height = props.height || 200;
  this._screenContext = screenContext;
  this._canvas = canvasContextWrapper ? canvasContextWrapper.getCanvas() : null;
  this._canvasContext = canvasContextWrapper;
  this._dirty = true;
  this._pendingViewOriginX = null;
  this._pendingViewOriginY = null;
};

/** Return whether this layer is dirty.  A dirty layer needs to be completely redrawn.
* @return {boolean}
*/
SL.Layer.prototype.isDirty = function() {return this._dirty;};

/**
* Set whether layer is dirty.  If dirty, the layer will be cleared and redrawn during the next render phase.
* @param {boolean} dirty
*/
SL.Layer.prototype.setDirty = function(dirty) {this._dirty = dirty;};


SL.Layer.prototype.setViewOriginX = function(viewOriginX) {
  this._pendingViewOriginX = viewOriginX;
  if (this._pendingViewOriginX !== null && this._pendingViewOriginX !== this.getViewOriginX()) this.setDirty(true);
};
SL.Layer.prototype.setViewOriginY = function(viewOriginY) {
  this._pendingViewOriginY = viewOriginY;
  if (this._pendingViewOriginY !== null && this._pendingViewOriginY !== this.getViewOriginY()) this.setDirty(true);
};

SL.Layer.prototype.getViewOriginX = function() {return this._canvasContext.getViewOriginX();};
SL.Layer.prototype.getViewOriginY = function() {return this._canvasContext.getViewOriginY();};

SL.Layer.prototype.getPendingViewOriginX = function() {return this._pendingViewOriginX;};
SL.Layer.prototype.getPendingViewOriginY = function() {return this._pendingViewOriginY;};

/** Returns the width of the Layer
* @returns {number}
*/
SL.Layer.prototype.getWidth = function() {return this._width;};

/** Returns the height of the Layer
* @returns {number}
*/
SL.Layer.prototype.getHeight = function() {return this._height;};

/** Returns the parent SL.Screen
* @returns {SL.Screen}
*/
SL.Layer.prototype.getScreenContext = function() {return this._screenContext;};

/** Returns the Canvas for this layer.
* <b>Note</b>: this does not return the drawable CanvasContext, rather it returns the reference to the DOM element.
* @returns {HTMLElement}
*/
SL.Layer.prototype.getCanvas = function() {return this._canvas;};

/** Returns the CanvasContext for this layer.
* @returns {CanvasContext}
*/
SL.Layer.prototype.getCanvasContext = function() {return this._canvasContext;};

SL.Layer.prototype.isImageSmoothingEnabled = function() {return this._canvasContext.isImageSmoothingEnabled();};
SL.Layer.prototype.setImageSmoothingEnabled = function(imageSmoothingEnabled) {
  this._canvasContext.setImageSmoothingEnabled(imageSmoothingEnabled);
  this.setDirty(true);
};

/** Update this Layer. <b>Sub-classes MUST implement this method</b>
* @abstract
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
*/
SL.Layer.prototype.update = function(time,diff) {};

/** Render this Layer. <b>Sub-classes MUST implement this method</b>
* @abstract
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
*/
SL.Layer.prototype.render = function(time,diff) {};
SL.Layer.prototype.prerender = function(time,diff) {
  if (this.isDirty()) this.getCanvasContext().clear();
  if (!SL.isNullOrUndefined(this.getPendingViewOriginX())) {
    this.getCanvasContext().setViewOriginX(this.getPendingViewOriginX());
    this._pendingViewOriginX = null;
  }
  if (!SL.isNullOrUndefined(this.getPendingViewOriginY())) {
    this.getCanvasContext().setViewOriginY(this.getPendingViewOriginY());
    this._pendingViewOriginY = null;
  }
};
SL.Layer.prototype.postrender = function(time,diff) {
  this.setDirty(false);
};

/** Propagate a mouse event to this Layer. <b>Sub-classes MUST implement this method</b>
* @abstract
* @param {SL.Event} event The mouse event
*/
SL.Layer.prototype.handleMouseEvent = function(event) {};

/** Clears all contents of this Layer.
*/
SL.Layer.prototype.clearLayer = function() {
  this._canvasContext.clearRect(0, 0, this.getWidth(), this.getHeight());
};

SL.Layer.prototype.dimLayer = function(amount, steps, interval) {
  var stepAmount = amount / steps;
  setTimeout(this._dimStep.bind(this, stepAmount, stepAmount, steps, interval), interval);

};
SL.Layer.prototype._dimStep = function(amount, stepAmount, steps, interval) {
  var canvasContext = this.getCanvasContext();
  canvasContext.clearRect(0, 0, this.getWidth(), this.getHeight());
  canvasContext.fillStyle = "rgba(0,0,0," + amount + ")";
  canvasContext.fillRect(0, 0, this.getWidth(), this.getHeight());
  if (steps > 0) {
    setTimeout(this._dimStep.bind(this, amount + stepAmount, stepAmount, steps - 1, interval), interval);
  }
};
