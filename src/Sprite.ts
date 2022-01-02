import { IAnimationFrame } from "./IAnimationFrame";
import { ICanvasContextWrapper } from "./CanvasContextWrapper";
import { EventType } from "./EventType";
import { GfxElement, IGfxElementProps } from "./GfxElement";
import { Event } from '@shaunlusk/slcommon';

export interface ISpriteProps extends IGfxElementProps {
  frames?: IAnimationFrame[];
  ttl? : number;
  loop?: boolean;
  loopsToLive?: number;
  freezeFrameIdx?: number;
}

/** Base element for displaying animations.<br />
* <p>Animation is provided through an array of frames.  Each frame will be shown for a specified duration; after that duration, the next frame is shown.
* Animation can be looped, or terminated.</p>
* <p>Animation lifetime of a Sprite can be controlled through the parameters, ttl (Time-to-live), loop (boolean, loop or not), and Loops-to-Live.
* If any of these parameters causes the Sprite's animation to stop, an event, EventType.SPRITE_ANIMATION_DONE, will be emitted. </p>
* <p>Note that if the animation stops, the sprite itself will remain on screen; if no longer needed, it must be explicitly hidden or removed.</p>
* <p>This is an abstract class; you must provide an implementation that overrides renderFrame(), and AnimationFrames that describe what should be rendered.</p>
* Current Implementations: {@link ImageSprite}
* @constructor
* @augments GfxElement
* @param {Object} props Properties for this GfxElement.
* @param {Screen} props.screenContext The target screen.
* @param {int} [props.scaleX=1] Horizontal scale of this element.  Independent of screen scale.
* @param {int} [props.scaleY=1] Vertical scale of this element.  Independent of screen scale.
* @param {boolean} [props.hidden=false] Whether to hide this element.
* @param {number} [props.x=0] The X coordinate for this element.
* @param {number} [props.y=0] The Y coordinate for this element.
* @param {number} props.width The width of this element.
* @param {number} props.height The height this element.
* @param {number} [props.rotation=0] The amount of rotation to apply to the element, in radians.  Applied on top of base rotation.
* @param {number} [props.baseRotation=0] The amount of base rotation to apply to the element, in radians. Usually used to apply an initial, unchanging rotation to the element.  Useful for correcting orientation of images.
* @param {boolean} [props.horizontalFlip=false] Whether to flip the element horizontally.
* @param {boolean} [props.verticalFlip=false] Whether to flip the element vertically.
* @param {number} [props.zIndex=-1] The z-index; elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).
* @param {Array} [props.frames=[]] Optional. An array of AnimationFrame's. Default: empty array.
* @param {number} [props.ttl=-1] Time-to-live.  The time (milliseconds) to continue the Sprites animation.  Default: -1 (unlimited time)
* @param {boolean} [props.loop=true] Whether to loop the animation or not.
* @param {int} [props.loopsToLive=-1] If loop is true, the number of loops to execute.  Default: -1 (unlimited loops)
* @param {int} [props.freezeFrameIdx=-1] When animation completes, switch to the frame indicated by the freeze frame index (referring to the index of the frame in the frames array). Default: -1 (don't change frames when animation stops, stay with the final frame)
* @see GfxElement
* @see AnimationFrame
* @see ImageSprite
*/
export abstract class Sprite extends GfxElement {
  private _frames: IAnimationFrame[];
  private _ttl: number;
  private _loop: boolean;
  private _loopsToLive: number;
  private _freezeFrameIdx: number;

  private _fidx: number;
  private _currentFrameElapsed: number;
  private _done: boolean;
  private _loopCount: number;
  private _elapsed: number;

  constructor(props: ISpriteProps) {
    super(props);

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
  }

  /** Returns the frames for this Sprite.
  * @returns {Array}
  */
  public getFrames() {return this._frames;}

  /** Sets the frames for this Sprite.
  * @param {Array} frames
  */
  public setFrames(frames: IAnimationFrame[]) {this._frames = frames;}

  /** Adds a frame to this Sprite's frame array.
  * @param {AnimationFrame} frame
  */
  public addFrame(frame: IAnimationFrame) {this._frames.push(frame);}

  /** Returns this Sprite's Time-to-Live (milliseconds) for animation.
  * @returns {number}
  */
  public getTtl() {return this._ttl;}

  /** Sets this Sprite's Time-to-Live (milliseconds) for animation.
  * @param {number} ttl
  */
  public setTtl(ttl: number) {this._ttl = ttl;}

  /** Returns whether this Sprite is set to loop.
  * @returns {boolean}
  */
  public doesLoop() {return this._loop;}

  /** Set whether this Sprite should loop.
  * @param {boolean} loop
  */
  public setDoLoop(loop: boolean) {this._loop = loop;}

  /** Returns the number of times this Sprite will loop.
  * @returns {int}
  */
  public getLoopsToLive() {return this._loopsToLive;}

  /** Sets the number of times this Sprite will loop.
  * @param {int} loopsToLive
  */
  public setLoopsToLive(loopsToLive: number) {this._loopsToLive = loopsToLive;}

  /** Returns whether this Sprite has completed all animation loops.
  * @returns {boolean}
  */
  public isDone() {return this._done;}

  /** Set whether this Sprite is done.  If done, will immediately emit event: EventType.SPRITE_ANIMATION_DONE
  * @param {boolean} done
  */
  public setDone(done: boolean) {
    this._done = done;
    if (done) this.doEndOfAnimation();
  }

  /** Returns the freeze frame index for this Sprite
  * @returns {int}
  */
  public getFreezeFrameIndex() {return this._freezeFrameIdx;}

  /** Sets the freeze frame index for this Sprite.
  * @param {int} idx
  */
  public setFreezeFrameIndex(idx: number) {this._freezeFrameIdx = idx;}

  /** Returns the current number of times the Sprite has looped.
  * @returns {int}
  */
  public getLoopCount() {return this._loopCount;}

  /** Returns the current frame index.
  * @returns {int}
  */
  public getCurrentFrameIndex() {return this._fidx;}

  /** Manually sets the current frame index.
  * @param {int} idx
  */
  public setCurrentFrameIndex(idx: number) {
    this._fidx = idx;
    this.setDirty(true);
  }

  /** Resets the Sprite state - This will restart the Sprite animation if it stopped.
  */
  public reset() {
    this.setCurrentFrameIndex(0);
    this._currentFrameElapsed = 0;
    this._done = false;
    this._loopCount = 0;
    this._elapsed = 0;
    this.setDirty(true);
  }

  /** Updates the state of the Sprite, if necessary.
  * @param {number} time The current time (milliseconds).
  * @param {number} diff The difference between the previous render cycle and the current cycle (milliseconds).
  * @return {Sprite} Returns this element if it needs to be redrawn, null otherwise.
  * @fires Sprite#SPRITE_ANIMATION_DONE Fired if this Sprite stopped animating.
  */
  public update(time: number, diff: number) {
    GfxElement.prototype.update.call(this, time, diff);

    if (this._frames.length === 0 || this._done) return null;

    this._updateTtl(diff);
    this._updateFrame(diff);

    if (this._done) {
      this.doEndOfAnimation();
    }
    if (this.isDirty()) return this;

    return null;
  }

  /** @private */
  private _updateFrame(diff: number) {
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
  }

  /** @private */
  private _updateTtl(diff: number) {
    if (this._ttl > -1) {
      this._elapsed += diff;
      if (this._elapsed >= this._ttl){
        this._done = true;
      }
    }
  }

  /** Render the current frame of the sprite, if the Sprite is dirty.
  * @param {number} time The current time (milliseconds).
  * @param {number} diff The difference between the previous render cycle and the current cycle (milliseconds).
  */
  public render(canvasContext: ICanvasContextWrapper, time: number, diff: number) {
      this.renderFrame(canvasContext, time, diff, this._frames[this._fidx]);
  }

  /** Render the specified AnimationFrame.  <br />
  * <b>Sub-classes MUST implement this method. </b>
  * @abstract
  * @param {number} time The current time (milliseconds).
  * @param {number} diff The difference between the previous render cycle and the current cycle (milliseconds).
  * @param {AnimationFrame} frame The frame to be rendered.
  */
  public abstract renderFrame(canvasContext: ICanvasContextWrapper, time: number, diff: number, frame: IAnimationFrame): void;

  /** @private */
  private doEndOfAnimation() {
    const event = new Event(
      EventType.SPRITE_ANIMATION_DONE,
      {
        element: this
      }
    );
    this.notify(event);
  }

}

/** When a sprite completes its animation.
* @event Sprite#SPRITE_ANIMATION_DONE
* @property {string} type EventType
* @property {Object} data The data provided by the event emitter.
* @property {Sprite} data.element The sprite that stopped animating.
* @property {number} time The time the event was fired.
*/
