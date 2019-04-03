var AnimationFrame = require('../src/AnimationFrame');

/** ImageSprite implementation of AnimationFrame.
* @extends {AnimationFrame}
* @constructor
* @params {Object} props Properties supported:
* <ul>
*   <li>duration - number - How long (milliseconds) to display this frame.
*   <li>sourceX - number - The starting x of the sub-section of the image for this frame.
*   <li>sourceY - number - The starting x of the sub-section of the image for this frame.
*   <li>sourceWidth - number - The width of the sub-section of the image for this frame.
*   <li>sourceHeight - number - The height of the sub-section of the image for this frame.
* </ul>
*/
function ImageSpriteFrame(props) {
  props = props || {};
  AnimationFrame.call(this);
  this._duration = props.duration;
  this._sx = props.sourceX;
  this._sy = props.sourceY;
  this._sWidth = props.sourceWidth;
  this._sHeight = props.sourceHeight;
};
ImageSpriteFrame.prototype = new AnimationFrame();
ImageSpriteFrame.prototype.callback = ImageSpriteFrame;

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
