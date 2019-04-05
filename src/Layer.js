var Utils = require('slcommon/src/Utils');

/**
* Abstract class for graphical layers on a Screen.<br />
* Existing implementations: {@link TextLayer}, {@link GfxLayer}
* @constructor
* @param {Object} props Configuration properties.
* @param {Screen} props.screenContext The parent screen.
* @param {CanvasContextWrapper} props.canvasContextWrapper The canvasContextWrapper. This layer will draw to the canvas' context, via wrapper's exposed methods.
* @see TextLayer
* @see GfxLayer
*/
function Layer(props) {
  props = props || {};
  this._width = props.width || 320;
  this._height = props.height || 200;
  this._canvas = props.canvas;
  this._canvasContextWrapper = props.canvasContextWrapper;
  this._dirty = true;
  this._pendingViewOriginX = null;
  this._pendingViewOriginY = null;
};

/** Return whether this layer is dirty.  A dirty layer needs to be completely redrawn.
* @return {boolean}
*/
Layer.prototype.isDirty = function() {return this._dirty;};

/**
* Set whether layer is dirty.  If dirty, the layer will be cleared and redrawn during the next render phase.
* @param {boolean} dirty
*/
Layer.prototype.setDirty = function(dirty) {this._dirty = dirty;};

/** Move the viewport to the specified X coordinate
* @param {number} viewOriginX The X coordinate.
*/
Layer.prototype.setViewOriginX = function(viewOriginX) {
  this._pendingViewOriginX = viewOriginX;
  if (this._pendingViewOriginX !== null && this._pendingViewOriginX !== this.getViewOriginX()) this.setDirty(true);
};

/** Move the viewport to the specified Y coordinate
* @param {number} viewOriginY The Y coordinate.
*/
Layer.prototype.setViewOriginY = function(viewOriginY) {
  this._pendingViewOriginY = viewOriginY;
  if (this._pendingViewOriginY !== null && this._pendingViewOriginY !== this.getViewOriginY()) this.setDirty(true);
};

/** Return the current x coordinate of the viewport.
* @return {number} The x coordinate.
*/
Layer.prototype.getViewOriginX = function() {return this._canvasContextWrapper.getViewOriginX();};

/** Return the current y coordinate of the viewport.
* @return {number} The y coordinate.
*/
Layer.prototype.getViewOriginY = function() {return this._canvasContextWrapper.getViewOriginY();};

/** @private */
Layer.prototype.getPendingViewOriginX = function() {return this._pendingViewOriginX;};
/** @private */
Layer.prototype.getPendingViewOriginY = function() {return this._pendingViewOriginY;};

/** Returns the width of the Layer
* @returns {number}
*/
Layer.prototype.getWidth = function() {return this._width;};

/** Returns the height of the Layer
* @returns {number}
*/
Layer.prototype.getHeight = function() {return this._height;};

/** Returns the CanvasContextWrapper for this layer.
* @returns {CanvasContextWrapper}
*/
Layer.prototype.getCanvasContextWrapper = function() {return this._canvasContextWrapper;};

/** Check if image smoothing is enabled for this layer.
* @return {bool}
*/
Layer.prototype.isImageSmoothingEnabled = function() {return this._canvasContextWrapper.isImageSmoothingEnabled();};

/** Turn image smoothing on or off for this layer.
* @param {bool} imageSmoothingEnabled
*/
Layer.prototype.setImageSmoothingEnabled = function(imageSmoothingEnabled) {
  this._canvasContextWrapper.setImageSmoothingEnabled(imageSmoothingEnabled);
  this.setDirty(true);
};

/** Update this Layer. <b>Sub-classes MUST implement this method</b>
* @abstract
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
*/
Layer.prototype.update = function(time,diff) {};

/** Render this Layer. <b>Sub-classes MUST implement this method</b>
* @abstract
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
*/
Layer.prototype.render = function(time,diff) {};

/** Execute prerendering activities.  Sub-classes may override this, but should still call the base method.
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
*/
Layer.prototype.prerender = function(time,diff) {
  if (this.isDirty()) this.getCanvasContextWrapper().clear();
  if (!Utils.isNullOrUndefined(this.getPendingViewOriginX())) {
    this.getCanvasContextWrapper().setViewOriginX(this.getPendingViewOriginX());
    this._pendingViewOriginX = null;
  }
  if (!Utils.isNullOrUndefined(this.getPendingViewOriginY())) {
    this.getCanvasContextWrapper().setViewOriginY(this.getPendingViewOriginY());
    this._pendingViewOriginY = null;
  }
};

/** Execute postrendering activities.  Sub-classes may override this, but should still call the base method.
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
*/
Layer.prototype.postrender = function(time,diff) {
  this.setDirty(false);
};

/** Propagate a mouse event to this Layer. <b>Sub-classes MUST implement this method</b>
* @abstract
* @param {Event} event The mouse event
*/
Layer.prototype.handleMouseEvent = function(event) {};

/** Clears all contents of this Layer.
*/
Layer.prototype.clearLayer = function() {
  this._canvasContextWrapper.clearRect(0, 0, this.getWidth(), this.getHeight());
};

/** Progressively fade the layer to black.
* @param {number} amount The percentage to dim the layer; 1 = completely black; 0 = no dim.
* @param {int} steps The number of stesp to take to reach the fade amount.  More steps = finer progression.
* @param {int} interval The number of milliseconds to wait between steps.
*/
Layer.prototype.dimLayer = function(amount, steps, interval) {
  var stepAmount = amount / steps;
  setTimeout(this._dimStep.bind(this, stepAmount, stepAmount, steps, interval), interval);
};

/** @private */
Layer.prototype._dimStep = function(amount, stepAmount, steps, interval) {
  var canvasContext = this.getCanvasContextWrapper();
  canvasContext.clearRect(0, 0, this.getWidth(), this.getHeight());
  canvasContext.fillStyle = "rgba(0,0,0," + amount + ")";
  canvasContext.fillRect(0, 0, this.getWidth(), this.getHeight());
  if (steps > 0) {
    setTimeout(this._dimStep.bind(this, amount + stepAmount, stepAmount, steps - 1, interval), interval);
  }
};

module.exports = Layer;
