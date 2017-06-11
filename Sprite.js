var SL = SL || {};

/** Base element for displaying animations.<br />
* <b>Extends</b> {@link SL.GfxElement} <br />
* <p>Animation is provided through an array of frames.  Each frame will be shown for a specified duration; after that duration, the next frame is shown.
* Animation can be looped, or terminated.</p>
* <p>Animation lifetime of a Sprite can be controlled through the parameters, ttl (Time-to-live), loop (boolean, loop or not), and Loops-to-Live.
* If any of these parameters causes the Sprite's animation to stop, an event, SL.EventType.SPRITE_ANIMATION_DONE, will be emitted. </p>
* <p>Note that if the animation stops, the sprite itself will remain on screen; if no longer needed, it must be explicitly hidden or removed.</p>
* <p>This is an abstract class; you must provide an implementation that overrides renderFrame(), and AnimationFrames that describe what should be rendered.</p>
* Current Implementations: {@link SL.ImageSprite}
* @constructor
* @param {SL.Screen} screenContext The parent screen
* @param {SL.GfxLayer} parentLayer The parent layer.
* @param {Object} props The properties for this ImageSprite.<br />
*   from GfxElement:
*   <ul>
*     <li>scaleX - integer - Horizontal scale of this element.  Independent of screen scale.</li>
*     <li>scaleY - integer - Vertical scale of this element.  Independent of screen scale.</li>
*     <li>hidden - boolean - Whether to hide this element.</li>
*     <li>x - number - The X coordinate for this element.</li>
*     <li>y - number - The Y coordinate for this element.</li>
*     <li>zIndex - number - The z-index; elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).</li>
*   </ul>
*   for Sprite:
*   <ul>
*     <li>frames - Array - Optional. An array of SL.AnimationFrame's. Default: empty array
*     <li>ttl - number - Optional. Time-to-live.  The time (milliseconds) to continue the Sprites animation.  Default: -1 (unlimited time)
*     <li>loop - boolean - Optional.  Whether to loop the animation or not. Default: true.
*     <li>loopsToLive - integer - Optional. If loop is true, the number of loops to execute.  Default: -1 (unlimited loops)
*     <li>freezeFrameIdx - integer - Optional.
*        When animation completes, switch to the frame indicated by the freeze frame index
*        (referring to the index of the frame in the frames array). Default: -1 (don't change frames when animation stops, stay with the final frame)
*   </ul>
* @see SL.GfxElement
* @see SL.AnimationFrame
* @see SL.ImageSprite
*/
SL.Sprite = function(screenContext, parentLayer, props) {
  props = props || {};
  SL.GfxElement.call(this, screenContext, parentLayer, props);

  this._frames = props.frames || [];
  this._ttl = props.ttl || -1;
  this._loop = props.loop === false ? false : true;
  this._loopsToLive = props.loopsToLive || -1;
  this._freezeFrameIdx = props.freezeFrameIdx || -1;

  this._fidx = 0;
  this._currentFrameElapsed = 0;
  this._done = false;
  this._loopCount = 0;
  this._elapsed = 0;

  this._eventListeners[SL.EventType.SPRITE_ANIMATION_DONE] = [];
};

SL.Sprite.prototype = new SL.GfxElement();
SL.Sprite.prototype.constructor = SL.Sprite;

/** Returns the frames for this Sprite.
* @returns {Array}
*/
SL.Sprite.prototype.getFrames = function() {return this._frames;};

/** Sets the frames for this Sprite.
* @param {Array} frames
*/
SL.Sprite.prototype.setFrames = function(frames) {this._frames = frames;};

/** Adds a frame to this Sprite's frame array.
* @param {AnimationFrame} frame
*/
SL.Sprite.prototype.addFrame = function(frame) {this._frames.push(frame);};

/** Returns this Sprite's Time-to-Live (milliseconds) for animation.
* @returns {number}
*/
SL.Sprite.prototype.getTtl = function() {return this._ttl;};

/** Sets this Sprite's Time-to-Live (milliseconds) for animation.
* @param {number} ttl
*/
SL.Sprite.prototype.setTtl = function(ttl) {this._ttl = ttl;};

/** Returns whether this Sprite is set to loop.
* @returns {boolean}
*/
SL.Sprite.prototype.doesLoop = function() {return this._loop;};

/** Set whether this Sprite should loop.
* @param {boolean} loop
*/
SL.Sprite.prototype.setDoLoop = function(loop) {this._loop = loop;};

/** Returns the number of times this Sprite will loop.
* @returns {integer}
*/
SL.Sprite.prototype.getLoopsToLive = function() {return this._loopsToLive;};

/** Sets the number of times this Sprite will loop.
* @param {integer} loopsToLive
*/
SL.Sprite.prototype.setLoopsToLive = function(loopsToLive) {this._loopsToLive = loopsToLive;};

/** Returns whether this Sprite has completed all animation loops.
* @returns {boolean}
*/
SL.Sprite.prototype.isDone = function() {return this._done;};

/** Set whether this Sprite is done.  If done, will immediately emit event: SL.EventType.SPRITE_ANIMATION_DONE
* @param {boolean} done
*/
SL.Sprite.prototype.setDone = function(done) {
  this._done = done;
  if (done) this.doEndOfAnimation();
};

/** Returns the freeze frame index for this Sprite
* @returns {integer}
*/
SL.Sprite.prototype.getFreezeFrameIndex = function() {return this._freezeFrameIdx;};

/** Sets the freeze frame index for this Sprite.
* @param {integer} idx
*/
SL.Sprite.prototype.setFreezeFrameIndex = function(idx) {this._freezeFrameIdx = idx;};

/** Returns the current number of times the Sprite has looped.
* @returns {integer}
*/
SL.Sprite.prototype.getLoopCount = function() {return this._loopCount;};

/** Returns the current frame index.
* @returns {integer}
*/
SL.Sprite.prototype.getCurrentFrameIndex = function() {return this._fidx;};

/** Manually sets the current frame index.
* @param {integer} idx
*/
SL.Sprite.prototype.setCurrentFrameIndex = function(idx) {
  this._fidx = idx;
  this.setDirty(true);
};

/** Resets the Sprite state - This will restart the Sprite animation if it stopped.
*/
SL.Sprite.prototype.reset = function() {
  this.setCurrentFrameIndex(0);
  this._currentFrameElapsed = 0;
  this._done = false;
  this._loopCount = 0;
  this._elapsed = 0;
  this.setDirty(true);
};

/** Updates the state of the Sprite, if necessary.
* @param {number} time The current time (milliseconds).
* @param {number} diff The difference between the previous render cycle and the current cycle (milliseconds).
*/
SL.Sprite.prototype.update = function (time,diff) {
  SL.GfxElement.prototype.update.call(this, time, diff);

  if (this._frames.length === 0 || this._done) return null;

  this._updateTtl(diff);
  this._updateFrame(diff);

  if (this._done) {
    this.doEndOfAnimation();
  }
  if (this.isDirty()) return this;

  return null;
};

SL.Sprite.prototype._updateFrame = function(diff) {
  this._currentFrameElapsed += diff;
  if (this._currentFrameElapsed >= this._frames[this._fidx].getDuration()) {
    while (this._currentFrameElapsed >= this._frames[this._fidx].getDuration()) {
      this._currentFrameElapsed -= this._frames[this._fidx].getDuration();
      this._fidx++;
      if (this._fidx === this._frames.length) {
        this._fidx = 0;
        this._loopCount++;
        if (!this._loop) {
          this._done = true;
          if (this._freezeFrameIdx > -1) this._fidx = this._freezeFrameIdx;
        } else if (this._loopsToLive > -1 && this._loopCount >= this._loopsToLive) {
          this._done = true;
        }
      }
    }
    this.setDirty(true);
  }
};

SL.Sprite.prototype._updateTtl = function(diff) {
  if (this._ttl > -1) {
    this._elapsed += diff;
    if (this._elapsed >= this._ttl){
      this._done = true;
    }
  }
};

/** Render the current frame of the sprite, if the Sprite is dirty.
* @param {number} time The current time (milliseconds).
* @param {number} diff The difference between the previous render cycle and the current cycle (milliseconds).
*/
SL.Sprite.prototype.render = function(time,diff) {
    this.renderFrame(time, diff, this._frames[this._fidx]);
};

/** Render the specified AnimationFrame.  <br />
* <b>Sub-classes MUST implement this method. </b>
* @abstract
* @param {number} time The current time (milliseconds).
* @param {number} diff The difference between the previous render cycle and the current cycle (milliseconds).
* @param {SL.AnimationFrame} frame The frame to be rendered.
*/
SL.Sprite.prototype.renderFrame = function(time, diff, frame) {};

/** @private */
SL.Sprite.prototype.doEndOfAnimation = function() {
  var event = new SL.Event(
    SL.EventType.SPRITE_ANIMATION_DONE,
    {
      element:this
    }
  );
  this.notify(event);
};
