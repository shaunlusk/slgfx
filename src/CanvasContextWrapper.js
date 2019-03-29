
/**
 * CanvasContextWrapper - wraps a canvas and its context to provide viewport capabilities.
 *
 * @class
 * @param  {Object} props
 * @param  {number} props.width The width; should match the width of the canvas element.
 * @param  {number} props.height The height; should match the height of the canvas element.
 * @param  {canvas} props.canvasContext          The canvasContext element.
 * @param  {number} [props.viewOriginX=0] X Coordinate of the viewport
 * @param  {number} [props.viewOriginY=0] y Coordinate of the viewport
 * @param  {bool} [props.imageSmoothingEnabled=false] Whether to use image smoothing.
 */
function CanvasContextWrapper(props) {
  this._width = props.width;
  this._height = props.height;
  this._canvasContext = props.canvasContext;
  this._viewOriginX = props.viewOriginX || 0;
  this._viewOriginY = props.viewOriginY || 0;
  this.setImageSmoothingEnabled(props.imageSmoothingEnabled || false);
};

/** Return the viewport X coordinate.
 * @return {number}
 */
CanvasContextWrapper.prototype.getViewOriginX = function() {return this._viewOriginX;};


/** Return the viewport Y coordinate.
 * @return {number}
 */
CanvasContextWrapper.prototype.getViewOriginY = function() {return this._viewOriginY;};

/** Set the X coordinate for the viewport.
 * @param  {number} viewOriginX
 */
CanvasContextWrapper.prototype.setViewOriginX = function(viewOriginX) {this._viewOriginX = viewOriginX;};

/** Set the Y coordinate for the viewport.
 * @param  {number} viewOriginY
 */
CanvasContextWrapper.prototype.setViewOriginY = function(viewOriginY) {this._viewOriginY = viewOriginY;};

/**
 * Get the canvas context for this wrapper.
 *
 * @return {CanvasRenderingContext2D}
 */
CanvasContextWrapper.prototype.getCanvasContext = function() {return this._canvasContext;};

CanvasContextWrapper.prototype.isImageSmoothingEnabled = function() {return this._canvasContext.imageSmoothingEnabled;};
CanvasContextWrapper.prototype.setImageSmoothingEnabled = function(imageSmoothingEnabled) { this._canvasContext.imageSmoothingEnabled = imageSmoothingEnabled;};

CanvasContextWrapper.prototype.clearRect = function(x, y, width, height) {
  if (this.isOutOfView(x, y, width, height))  return;
  this._canvasContext.clearRect(x + this._viewOriginX, y + this._viewOriginY, width, height);
};

CanvasContextWrapper.prototype.clear = function() {
  this._canvasContext.clearRect(0, 0, this._width, this._height);
};

CanvasContextWrapper.prototype.fillRect = function(x, y, width, height) {
  if (this.isOutOfView(x, y, width, height)) return;
  this._canvasContext.fillRect(x + this._viewOriginX, y + this._viewOriginY, width, height);
};

CanvasContextWrapper.prototype.drawImage = function(image, sx, sy, sWidth, sHeight, x, y, width, height) {
  if (this.isOutOfView(x, y, width, height)) return;
  this._canvasContext.drawImage(image, sx, sy, sWidth, sHeight, x + this._viewOriginX, y + this._viewOriginY, width, height);
};

CanvasContextWrapper.prototype.drawImageWithTranslation = function(image, sx, sy, sWidth, sHeight, x, y, width, height) {
  this._canvasContext.drawImage(image, sx, sy, sWidth, sHeight, x, y, width, height);
};

CanvasContextWrapper.prototype.fillRectWithTranslation = function(x, y, width, height) {
  this._canvasContext.fillRect(x, y, width, height);
};

CanvasContextWrapper.prototype.save = function() {
  this._canvasContext.save();
};

CanvasContextWrapper.prototype.restore = function() {
  this._canvasContext.restore();
};

CanvasContextWrapper.prototype.translate = function(x, y) {
  this._canvasContext.translate(x + this._viewOriginX, y + this._viewOriginY);
};

CanvasContextWrapper.prototype.scale = function(x, y) {
  this._canvasContext.scale(x, y);
};

CanvasContextWrapper.prototype.rotate = function(rotation) {
  this._canvasContext.rotate(rotation);
};

CanvasContextWrapper.prototype.isOutOfView = function(x, y, width, height) {
  return this._viewOriginX + x + width < 0 ||
    this._viewOriginX + x > this._width ||
    this._viewOriginY + y + height < 0 ||
    this._viewOriginY + y > this._height;
};

CanvasContextWrapper.prototype.setFillStyle = function(style) {
  this._canvasContext.fillStyle = style;
};

CanvasContextWrapper.prototype.beginPath = function() {
  this._canvasContext.beginPath();
};

CanvasContextWrapper.prototype.moveTo = function(x, y) {
  this._canvasContext.moveTo(this._viewOriginX + x, this._viewOriginY + y);
};

CanvasContextWrapper.prototype.lineTo = function(x, y) {
  this._canvasContext.lineTo(this._viewOriginX + x, this._viewOriginY + y);
};

CanvasContextWrapper.prototype.closePath = function() {
  this._canvasContext.closePath();
};

CanvasContextWrapper.prototype.stroke = function() {
  this._canvasContext.stroke();
};

CanvasContextWrapper.prototype.rect = function(x, y, width, height) {
  this._canvasContext.rect(x, y, width, height);
};

CanvasContextWrapper.prototype.setLineWidth = function(width) {
  this._canvasContext.lineWidth = width;
};

CanvasContextWrapper.prototype.setStrokeStyle = function(strokeStyle) {
  this._canvasContext.strokeStyle = strokeStyle;
};

CanvasContextWrapper.prototype.strokeRect = function(x, y, width, height) {
  this._canvasContext.strokeRect(x, y, width, height);
};

/** Fills a given text at the given (x,y) position. Optionally with a maximum width to draw.
*/
CanvasContextWrapper.prototype.fillText = function(text, x, y, maxWidth) {
  this._canvasContext.fillText(text, x, y, maxWidth);
};

/** Strokes a given text at the given (x,y) position. Optionally with a maximum width to draw.
*/
CanvasContextWrapper.prototype.strokeText = function(text, x, y, maxWidth) {
  this._canvasContext.strokeText(text, x, y, maxWidth);
};

/** Set the font style for the canvas.
* @param val string Style in format of '12px Sans'; the font size and the font families, separated with spaces.
*/
CanvasContextWrapper.prototype.setFontStyle = function(val) {
  this._canvasContext.font = val;
};

/**
* Text alignment setting. Possible values: start, end, left, right or center. The default value is start.
*/
CanvasContextWrapper.prototype.setTextAlign = function(val) {
  this._canvasContext.textAlign = val;
};

/**
* Baseline alignment setting. Possible values: top, hanging, middle, alphabetic, ideographic, bottom. The default value is alphabetic.
*/
CanvasContextWrapper.prototype.setTextBaseline = function(val) {
  this._canvasContext.textBaseline = val;
};

/**
* Directionality. Possible values: ltr, rtl, inherit. The default value is inherit.
*/
CanvasContextWrapper.prototype.setTextDirection = function(val) {
  this._canvasContext.direction = val;
};

module.exports = CanvasContextWrapper;
