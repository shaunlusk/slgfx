var GfxElement = require('./GfxElement');

/** Graphics element that renders part or all of an Image.<br />
* It is good practice to have a single or few Images that have many tiles on them
* to make efficient use of memory and screen drawing. Using ImageElement, you
* can treat tiles from the source image as discrete screen elements that can be
* moved and interacted with.
* For animations, see {@link ImageSprite}
* @constructor
* @augments GfxElement
* @param {Object} props The properties for this object.
* @param {Screen} props.screenContext The target screen.
* @param {CanvasContextWrapper} props.canvasContextWrapper The canvasContextWrapper. This layer will draw to the canvas' context, via wrapper's exposed methods.
* @param {int} [props.scaleX=1] Horizontal scale of this element.  Independent of screen scale.
* @param {int} [props.scaleY=1] Vertical scale of this element.  Independent of screen scale.
* @param {boolean} [props.hidden=false] Whether to hide this element.
* @param {number} props.x The X coordinate for this element.
* @param {number} props.y The Y coordinate for this element.
* @param {number} props.zIndex The z-index; elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).
* @param {number} props.rotation The amount of rotation to apply to the element, in radians.  Applied on top of base rotation.
* @param {number} props.baseRotation The amount of base rotation to apply to the element, in radians. Usually used to apply an initial, unchanging rotation to the element.  Useful for correcting orientation of images.
* @param {boolean} props.horizontalFlip Whether to flip the element horizontally.
* @param {boolean} props.verticalFlip Whether to flip the element vertically.

* @param {Image} image The image to use for this element. Can be created via html (&lt;img&gt;) or javascript (new Image()).
* @param {number} sourceX The x starting point of the desired subsection of the image
* @param {number} sourceY The y starting point of the desired subsection of the image
* @param {number} sourceWidth The width of the desired subsection of the image
* @param {number} sourceHeight The height of the desired subsection of the image
* @param {number} width The desired width of the ImageElement; if this differs from the source dimensions, the image will be stretched or shrunk accordingly
* @param {number} height The desired height of the ImageElement; if this differs from the source dimensions, the image will be stretched or shrunk accordingly
* @param {ImageRenderer} imageRenderer The ImageRenderer that will draw on the canvas.
* @see GfxElement
* @see ImageSprite
*/
function ImageElement(props) {
  props = props || {};
  GfxElement.call(this, props);
  this._image = props.image;
  this._sx = props.sourceX;
  this._sy = props.sourceY;
  this._sWidth = props.sourceWidth;
  this._sHeight = props.sourceHeight;

  this._imageRenderer = props.imageRenderer;
};

ImageElement.prototype = new GfxElement();
ImageElement.prototype.constructor = ImageElement;

/** Return the source Image for this element
* @returns {Image}
*/
ImageElement.prototype.getImage = function() {return this._image;};

/** Return the width for this element
* @override
* @returns {number}
*/
ImageElement.prototype.getWidth = function() {return this._width;};

/** Return the height for this element
* @override
* @returns {number}
*/
ImageElement.prototype.getHeight = function() {return this._height;};

/** Return the starting x point on the source Image for this element
* @returns {number}
*/
ImageElement.prototype.getSourceX = function() {return this._sx;};

/** Return the starting y point on the source Image for this element
* @returns {number}
*/
ImageElement.prototype.getSourceY = function() {return this._sy;};

/** Return the width of the subsection of the source Image for this element
* @returns {number}
*/
ImageElement.prototype.getSourceWidth = function() {return this._sWidth;};

/** Return the height of the subsection of the source Image for this element
* @returns {number}
*/
ImageElement.prototype.getSourceHeight = function() {return this._sHeight;};

/** Render the image to the screen.
* Time and diff parameters are not directly used, they are made available for extension purposes.
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
*/
ImageElement.prototype.render = function(time,diff) {
    this._imageRenderer.renderImage(
      this.getCanvasContextWrapper(),
      this.getImage(),
      this.getSourceX(),
      this.getSourceY(),
      this.getSourceWidth(),
      this.getSourceHeight(),
      this.getX(),
      this.getY(),
      this.getWidth(),
      this.getHeight(),
      this.getElementScaleX(),
      this.getElementScaleY(),
      this.isHorizontallyFlipped(),
      this.isVerticallyFlipped(),
      this.getRotation()
    );
};

module.exports = ImageElement;
