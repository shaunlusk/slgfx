
/**
 * CanvasContextWrapper - wraps a CanvasRenderingContext2D to provide viewport capabilities.
 *
 * @class
 * @param  {Object} props
 * @param  {number} props.width The width; should match the width of the canvas element.
 * @param  {number} props.height The height; should match the height of the canvas element.
 * @param  {canvas} props.canvasContext          The canvasContext element.
 * @param  {number} [props.viewOriginX=0] X Coordinate of the viewport
 * @param  {number} [props.viewOriginY=0] y Coordinate of the viewport
 * @param  {bool} [props.imageSmoothingEnabled=false] Whether to use image smoothing.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
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

/** Check whether imageSmoothing is enabled for this canvasContext.
 * @return {bool}
 */
CanvasContextWrapper.prototype.isImageSmoothingEnabled = function() {return this._canvasContext.imageSmoothingEnabled;};

/** Set whether imageSmoothing is enabled for this canvasContext.
 * @param {bool} imageSmoothingEnabled
 */
CanvasContextWrapper.prototype.setImageSmoothingEnabled = function(imageSmoothingEnabled) { this._canvasContext.imageSmoothingEnabled = imageSmoothingEnabled;};

/** Clear a rectangular section of the canvas.
* @param {number} x The x coordinate of the section.
* @param {number} y The y coordinate of the section.
* @param {number} width The width of the section.
* @param {number} height The height of the section.
*/
CanvasContextWrapper.prototype.clearRect = function(x, y, width, height) {
  if (this.isOutOfView(x, y, width, height))  return;
  this._canvasContext.clearRect(x + this._viewOriginX, y + this._viewOriginY, width, height);
};

/** Clear the entire visible portion of the canvas.
*/
CanvasContextWrapper.prototype.clear = function() {
  this._canvasContext.clearRect(0, 0, this._width, this._height);
};

/** Fill a rectangular section of the canvas.
* Call CanvasContextWrapper#fillStyle to change color and style aspects of this operation.
* @param {number} x The x coordinate of the section.
* @param {number} y The y coordinate of the section.
* @param {number} width The width of the section.
* @param {number} height The height of the section.
*/
CanvasContextWrapper.prototype.fillRect = function(x, y, width, height) {
  if (this.isOutOfView(x, y, width, height)) return;
  this._canvasContext.fillRect(x + this._viewOriginX, y + this._viewOriginY, width, height);
};

/** Draw an image to the canvas.
* @param {Image} image The source image to draw from.
* @param {number} sx The x coordinate on the source image to start drawing from.
* @param {number} sy The y coordinate on the source image to start drawing from.
* @param {number} sWidth The width of the section of source image to draw.
* @param {number} sHeight The height of the section of source image to draw.
* @param {number} x The target x coordinate on the canvas to start drawing the image to.
* @param {number} y The target y coordinate on the canvas to start drawing the image to.
* @param {number} width The width of the target section on the canvas to draw to.
* @param {number} height The height of the target section on the canvas to draw to.
*/
CanvasContextWrapper.prototype.drawImage = function(image, sx, sy, sWidth, sHeight, x, y, width, height) {
  if (this.isOutOfView(x, y, width, height)) return;
  this._canvasContext.drawImage(image, sx, sy, sWidth, sHeight, x + this._viewOriginX, y + this._viewOriginY, width, height);
};

/** Draw an image to the canvas, when the canvas has been rotated or flipped.
* @param {Image} image The source image to draw from.
* @param {number} sx The x coordinate on the source image to start drawing from.
* @param {number} sy The y coordinate on the source image to start drawing from.
* @param {number} sWidth The width of the section of source image to draw.
* @param {number} sHeight The height of the section of source image to draw.
* @param {number} x The target x coordinate on the canvas to start drawing the image to.
* @param {number} y The target y coordinate on the canvas to start drawing the image to.
* @param {number} width The width of the target section on the canvas to draw to.
* @param {number} height The height of the target section on the canvas to draw to.
*/
CanvasContextWrapper.prototype.drawImageWithTranslation = function(image, sx, sy, sWidth, sHeight, x, y, width, height) {
  this._canvasContext.drawImage(image, sx, sy, sWidth, sHeight, x, y, width, height);
};

/** Fill a rectangular section of the canvas, when the canvas has been flipped or rotated.
* Call CanvasContextWrapper#fillStyle to change color and style aspects of this operation.
* @param {number} x The x coordinate of the section.
* @param {number} y The y coordinate of the section.
* @param {number} width The width of the section.
* @param {number} height The height of the section.
*/
CanvasContextWrapper.prototype.fillRectWithTranslation = function(x, y, width, height) {
  this._canvasContext.fillRect(x, y, width, height);
};

/** Save the current state of the canvas context.  Restore it with CanvasContextWrapper#restore */
CanvasContextWrapper.prototype.save = function() {
  this._canvasContext.save();
};

/** Restore a saved canvas context state */
CanvasContextWrapper.prototype.restore = function() {
  this._canvasContext.restore();
};

/** Move the canvas context to the specified coordinates.
* @param {number} x The x coordinate.
* @param {number} y The y coordinate.
*/
CanvasContextWrapper.prototype.translate = function(x, y) {
  this._canvasContext.translate(x + this._viewOriginX, y + this._viewOriginY);
};

/** Scale the canvas context by a percentage.
* @param {number} x The percent to horizonatally scale the context. e.g., 2 = double the canvas context width.
* @param {number} y The percent to vertically  scale the context. e.g., 0.5 = half the canvas context height.
*/
CanvasContextWrapper.prototype.scale = function(x, y) {
  this._canvasContext.scale(x, y);
};

/** Rotate the canvas.
* @param {number} rotation The amount to rotate the canvas by, in radians.
*/
CanvasContextWrapper.prototype.rotate = function(rotation) {
  this._canvasContext.rotate(rotation);
};

/** Check if a specified section of the context is outside the visible portion of the canvas.
* @param {number} x The x coordinate of the section.
* @param {number} y The y coordinate of the section.
* @param {number} width The width coordinate of the section.
* @param {number} height The height coordinate of the section.
*/
CanvasContextWrapper.prototype.isOutOfView = function(x, y, width, height) {
  return this._viewOriginX + x + width < 0 ||
    this._viewOriginX + x > this._width ||
    this._viewOriginY + y + height < 0 ||
    this._viewOriginY + y > this._height;
};

/** Set the fill style for the canvas context
* @param {string} style The style to apply for filling.
* For options @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
*/
CanvasContextWrapper.prototype.setFillStyle = function(style) {
  this._canvasContext.fillStyle = style;
};

/** Begin a drawing path.
* @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath
*/
CanvasContextWrapper.prototype.beginPath = function() {
  this._canvasContext.beginPath();
};

/**  Begin a new sub-path at the point specified by the given coordinates
* @param {number} x The x coordinate.
* @param {number} y The y coordinate.
* @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo
*/
CanvasContextWrapper.prototype.moveTo = function(x, y) {
  this._canvasContext.moveTo(this._viewOriginX + x, this._viewOriginY + y);
};

/** Add a line to current path from the current location to the specified location.
* @param {number} x The x coordinate to draw the line to.
* @param {number} y The y coordinate to draw the line to.
* @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo
*/
CanvasContextWrapper.prototype.lineTo = function(x, y) {
  this._canvasContext.lineTo(this._viewOriginX + x, this._viewOriginY + y);
};

/** Close the current path
* @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath
*/
CanvasContextWrapper.prototype.closePath = function() {
  this._canvasContext.closePath();
};

/** Strokes the current path
* @param https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/stroke
*/
CanvasContextWrapper.prototype.stroke = function() {
  this._canvasContext.stroke();
};

/** Add a rectangle to the current path.
* @param {number} x The x coordinate of the rectangle.
* @param {number} y The y coordinate of the rectangle.
* @param {number} width The width of the rectangle.
* @param {number} height The height of the rectangle.
* @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect
*/
CanvasContextWrapper.prototype.rect = function(x, y, width, height) {
  this._canvasContext.rect(x, y, width, height);
};

/** Set the width of lines for path drawing.
* @param {number} width The width
*/
CanvasContextWrapper.prototype.setLineWidth = function(width) {
  this._canvasContext.lineWidth = width;
};

/** Set stroke style for path
* @param {string} strokeStyle
* @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle
*/
CanvasContextWrapper.prototype.setStrokeStyle = function(strokeStyle) {
  this._canvasContext.strokeStyle = strokeStyle;
};

/** Draws a stroked rectangle.
* @param {number} x The x coordinate of the rectangle.
* @param {number} y The y coordinate of the rectangle.
* @param {number} width The width of the rectangle.
* @param {number} height The height of the rectangle.
https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect
*/
CanvasContextWrapper.prototype.strokeRect = function(x, y, width, height) {
  this._canvasContext.strokeRect(x, y, width, height);
};

/** Fills a given text at the given (x,y) position. Optionally with a maximum width to draw.
* @param {string} text
* @param {number} x
* @param {number} y
* @param {number} maxWidth
*/
CanvasContextWrapper.prototype.fillText = function(text, x, y, maxWidth) {
  this._canvasContext.fillText(text, x, y, maxWidth);
};

/** Strokes a given text at the given (x,y) position. Optionally with a maximum width to draw.
* @param {string} text
* @param {number} x
* @param {number} y
* @param {number} maxWidth
*/
CanvasContextWrapper.prototype.strokeText = function(text, x, y, maxWidth) {
  this._canvasContext.strokeText(text, x, y, maxWidth);
};

/** Set the font style for the canvas.
* @param {string} val Style in format of '12px Sans'; the font size and the font families, separated with spaces.
*/
CanvasContextWrapper.prototype.setFontStyle = function(val) {
  this._canvasContext.font = val;
};

/** Text alignment setting. Possible values: start, end, left, right or center. The default value is start.
* @param {string} val
*/
CanvasContextWrapper.prototype.setTextAlign = function(val) {
  this._canvasContext.textAlign = val;
};

/**
* Baseline alignment setting. Possible values: top, hanging, middle, alphabetic, ideographic, bottom. The default value is alphabetic.
* @param {string} val
*/
CanvasContextWrapper.prototype.setTextBaseline = function(val) {
  this._canvasContext.textBaseline = val;
};

/**
* Set directionality for text. Possible values: ltr, rtl, inherit. The default value is inherit.
* @param {string} val
*/
CanvasContextWrapper.prototype.setTextDirection = function(val) {
  this._canvasContext.direction = val;
};

module.exports = CanvasContextWrapper;
