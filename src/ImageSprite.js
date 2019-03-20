var SL = SL || {};

/** Animated element that displays images frames in succession.<br />
* <b>Extends</b> {@link SL.Sprite}, extends {@link SL.GfxElement}<br />
* Uses {@link SL.ImageSpriteFrame} for its frames.
* @constructor
* @param {SL.Screen} screenContext The parent screen
* @param {SL.GfxLayer} parentLayer The parent layer.
* @param {Object} props The properties for this ImageSprite.
*   from GfxElement:
*   <ul>
*     <li>scaleX - integer - Horizontal scale of this element.  Independent of screen scale.</li>
*     <li>scaleY - integer - Vertical scale of this element.  Independent of screen scale.</li>
*     <li>hidden - boolean - Whether to hide this element.</li>
*     <li>x - number - The X coordinate for this element.</li>
*     <li>y - number - The Y coordinate for this element.</li>
*     <li>zIndex - number - The z-index; elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).</li>
*   </ul>
*   from Sprite:
*   <ul>
*     <li>frames - Array - Optional. An array of SL.AnimationFrame's. Default: empty array
*     <li>ttl - number - Optional. Time-to-live.  The time (milliseconds) to continue the Sprites animation.  Default: -1 (unlimited time)
*     <li>loop - boolean - Optional.  Whether to loop the animation or not. Default: true.
*     <li>loopsToLive - integer - Optional. If loop is true, the number of loops to execute.  Default: -1 (unlimited loops)
*     <li>freezeFrameIdx - integer - Optional.
*        When animation completes, switch to the frame indicated by the freeze frame index
*        (referring to the index of the frame in the frames array). Default: -1 (don't change frames when animation stops, stay with the final frame)
*   </ul>
*   for ImageSprite:
*   <ul>
*     <li>image - Image - the image to pull animation frames from.</li>
*     <li>width - number - the width of the Sprite</li>
*     <li>height - number - the height of the Sprite</li>
*     <li>imageRenderer - {@link SL.ImageRenderer} - Optional.  The ImageRenderer that will draw on the canvas.
*       If not provided, this element will create one.
*       If using multiple ImageElement's or ImageSprite's it is good practice to create a single ImageRenderer and pass the reference to each element via this property.</li>
*   </ul>
* @see SL.GfxElement
* @see SL.Sprite
* @see SL.AnimationFrame
* @see SL.ImageSpriteFrame
*/
SL.ImageSprite = function(screenContext, parentLayer, props) {
  props = props || {};
  SL.Sprite.call(this, screenContext, parentLayer, props);

  this._image = props.image;
  this._width = props.width;
  this._height = props.height;

  this._imageRenderer = props.imageRenderer || new SL.ImageRenderer(screenContext.getScaleX(), screenContext.getScaleY());
};

SL.ImageSprite.prototype = new SL.Sprite();
SL.ImageSprite.prototype.constructor = SL.ImageSprite;

/** Return the source image.
* @returns {Image}
*/
SL.ImageSprite.prototype.getImage = function() {return this._image;};

/** Render the specified frame.
* @override
* @param {number} time The current time (milliseconds).
* @param {number} diff The difference between the previous render cycle and the current cycle (milliseconds).
* @param {SL.AnimationFrame} frame The SL.ImageSpriteFrame to be rendered.
*/
SL.ImageSprite.prototype.renderFrame = function(time, diff, frame) {
  this._imageRenderer.renderImage(
    this.getCanvasContext(),
    this.getImage(),
    frame.getSourceX(),
    frame.getSourceY(),
    frame.getSourceWidth(),
    frame.getSourceHeight(),
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
