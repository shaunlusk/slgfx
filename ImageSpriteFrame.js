var SL = SL || {};

/** ImageSprite implementation of AnimationFrame.
* @extends {SL.AnimationFrame}
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
SL.ImageSpriteFrame = function(props) {
  props = props || {};
  SL.AnimationFrame.call(this);
  this._duration = props.duration;
  this._sx = props.sourceX;
  this._sy = props.sourceY;
  this._sWidth = props.sourceWidth;
  this._sHeight = props.sourceHeight;
};
SL.ImageSpriteFrame.prototype = new SL.AnimationFrame();
SL.ImageSpriteFrame.prototype.callback = SL.ImageSpriteFrame;

/** Return the duration of this frame.
* @override
* @returns {number}
*/
SL.ImageSpriteFrame.prototype.getDuration = function() {return this._duration;};

/** Return the starting x point on the source Image for this frame
* @returns {number}
*/
SL.ImageSpriteFrame.prototype.getSourceX = function() {return this._sx;};

/** Return the starting y point on the source Image for this frame
* @returns {number}
*/
SL.ImageSpriteFrame.prototype.getSourceY = function() {return this._sy;};

/** Return the width of the subsection of the source Image for this frame
* @returns {number}
*/
SL.ImageSpriteFrame.prototype.getSourceWidth = function() {return this._sWidth;};

/** Return the height of the subsection of the source Image for this frame
* @returns {number}
*/
SL.ImageSpriteFrame.prototype.getSourceHeight = function() {return this._sHeight;};
