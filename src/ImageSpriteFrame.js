var SpriteAnimationFrame = require('../src/SpriteAnimationFrame');

/** ImageSprite implementation of SpriteAnimationFrame.
* @extends {SpriteAnimationFrame}
* @constructor
* @param {Object} props Properties
* @param {number} duration How long (milliseconds) to display this frame.
* @param {number} sourceX The starting x of the sub-section of the image for this frame.
* @param {number} sourceY The starting y of the sub-section of the image for this frame.
* @param {number} sourceWidth The width of the sub-section of the image for this frame.
* @param {number} sourceHeight The height of the sub-section of the image for this frame.
*/
function ImageSpriteFrame(props) {
  props = props || {};
  SpriteAnimationFrame.call(this);
  this._duration = props.duration;
  this._sx = props.sourceX;
  this._sy = props.sourceY;
  this._sWidth = props.sourceWidth;
  this._sHeight = props.sourceHeight;
};
ImageSpriteFrame.prototype = new SpriteAnimationFrame();
ImageSpriteFrame.prototype.constructor = ImageSpriteFrame;

/** Return the duration of this frame.
* @override
* @returns {number}
*/
ImageSpriteFrame.prototype.getDuration = function() {return this._duration;};

/** Return the starting x point on the source Image for this frame
* @returns {number}
*/
ImageSpriteFrame.prototype.getSourceX = function() {return this._sx;};

/** Return the starting y point on the source Image for this frame
* @returns {number}
*/
ImageSpriteFrame.prototype.getSourceY = function() {return this._sy;};

/** Return the width of the subsection of the source Image for this frame
* @returns {number}
*/
ImageSpriteFrame.prototype.getSourceWidth = function() {return this._sWidth;};

/** Return the height of the subsection of the source Image for this frame
* @returns {number}
*/
ImageSpriteFrame.prototype.getSourceHeight = function() {return this._sHeight;};

module.exports = ImageSpriteFrame;
