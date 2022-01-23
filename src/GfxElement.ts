import { Event, EventManager, Utils } from '@shaunlusk/slcommon';
import { SLGfxMouseEvent } from './SLGfxMouseEvent';
import { ICanvasContextWrapper } from './CanvasContextWrapper';
import { EventType } from './EventType';
import { GfxElementZIndexComparable } from './GfxElementZIndexComparable';
import { MoveOrder } from './MoveOrder';
import { IGfxPanel } from './GfxPanel';

export interface IGfxElement {
  notify(event: Event): void;
  getId(): number;
  isDirty(): boolean;
  setDirty(dirty: boolean): void;
  isHidden(): boolean;
  setHidden(hidden: boolean): void;
  hasCollision(): boolean;
  setHasCollision(hasCollision: boolean): void;
  getZIndex(): number;
  setZIndex(zIndex: number): void;
  getZIndexComparable(): GfxElementZIndexComparable;
  getGfxPanel(): IGfxPanel;
  getPanelScaleX(): number;
  getPanelScaleY(): number;
  getTotalScaleX(): number;
  getTotalScaleY(): number;
  getElementScaleX(): number;
  getElementScaleY(): number;
  setElementScaleX(scaleX: number): void;
  setElementScaleY(scaleY: number): void;
  getX(): number;
  getScaledX(): number;
  getY(): number;
  getScaledY(): number;
  setX(x: number): void;
  setY(y: number): void;
  isMouseOver(): boolean;
  getWidth(): number;
  getScaledWidth(): number;
  getHeight(): number;
  getScaledHeight(): number;
  getUnAdjustedRotation(): number;
  getBaseRotation(): number;
  getRotation(): number;
  setRotation(rotation: number): void;
  setBaseRotation(rotation: number): void;
  hasRotation(): boolean;
  isHorizontallyFlipped(): boolean;
  isVerticallyFlipped(): boolean;
  setHorizontallyFlipped(flipped: boolean): void;
  setVerticallyFlipped(flipped: boolean): void;
  flash(interval: number, duration: number, callback: () => void): void;
  isFlashing(): boolean;
  turnFlashOff(): void;
  nudge(offsetX: number, offsetY: number, decay: number, interval: number, intervalDecay: number, callback: () => void): void;
  shake(intensity: number, intensityDecay: number, interval: number, intervalDecay: number, notToExceedTime: number, callback: () => any): void;
  setMoveRates(xMoveRate: number, yMoveRate: number): void;
  getMoveRateX(): number;
  getMoveRateY(): number;
  moveTo(x: number, y: number, duration: number, callback: (element: GfxElement) => void): void;
  clearMoveQueue(): void;
  turnOff(): void;
  show(): void;
  hide(): void;
  update(time: number, diff: number): IGfxElement | null;
  clear(canvasContext: ICanvasContextWrapper): void;
  preRender(time: number, diff: number): void;
  render(canvasContext: ICanvasContextWrapper, time: number, diff: number): void;
  postRender(time: number, diff: number): void;
  collidesWith(element: IGfxElement): boolean;
  collidesWithCoordinates(x: number, y: number): boolean;
  collidesWithX(x: number): boolean;
  collidesWithY(y: number): boolean;
  getCollisionBoxX(): number;
  getCollisionBoxY(): number;
  getCollisionBoxWidth(): number;
  getCollisionBoxHeight(): number;
  handleMouseEvent(event: SLGfxMouseEvent): void;
}

export interface IGfxElementProps { 
  gfxPanel: IGfxPanel; 
  scaleX?: number; 
  scaleY?: number; 
  hidden?: boolean; 
  x?: number; 
  y?: number; 
  zIndex?: number; 
  width: number; 
  height: number; 
  rotation?: number; 
  baseRotation?: number; 
  horizontalFlip?: boolean; 
  verticalFlip?: boolean; 
  eventManager?: EventManager; 
}

/** <p>Graphics element base class.</p>
* <p>Current Implementations:
* <ul>
*   <li>{@link ImageElement}</li>
*   <li>{@link Sprite}
*     <ul>
*       <li>{@link ImageSprite}</li>
*     </ul>
*   </li>
* </ul></p>
* <p>GfxElements support two types of movement: moveTo() instructions and movementRates.
* The former, moveTo() will send an element toward a specified set of coordinates, scheduled to arrive after a
* specified duration.  The latter, movementRates, will start an element moving at a given rate and continue until stopped.
* See moveTo() and setMoveRates() for more details.</p>
* <p> GfxElements emit a number of events.
* In most cases, the event data will include an 'element' property that refers to the element.  The only exception is ELEMENT_COLLISION;
* this will have element1 and element2 properties, where element1 is the element on which collidesWith() was called, and element2 was the element passed to the method.</p>
* <p>In addition to the element property, the mouse events will also include x,y properties in the data, corresponding to the coordinates of the event. </p>
*
* <p>Event listeners can be attached to individual elements, or at the panel level.  Refer to documentation on the "on" and "notify" methods.</p>
*
* @constructor
* @param {Object} props Properties for this GfxElement.
* @param {GfxPanel} props.gfxPanel The target panel.
* @param {int} [props.scaleX=1] Horizontal scale of this element.  Independent of panel scale.
* @param {int} [props.scaleY=1] Vertical scale of this element.  Independent of panel scale.
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
*/
export abstract class GfxElement implements IGfxElement {
  private static id = 0;
  private _id = GfxElement.id++;
  private _gfxPanel: IGfxPanel;
  private _scaleX: number;
  private _scaleY: number;
  private _currentMove?: MoveOrder;
  private _moveQueue: MoveOrder[];
  private _xMoveRate: number;
  private _xMoveFractionalAccumulator: number;
  private _yMoveRate: number;
  private _yMoveFractionalAccumulator: number;
  private _dirty: boolean;
  private _hasCollision: boolean;
  private _hadCollisionPreviousFrame: boolean;
  private _hidden: boolean;
  private _x: number;
  private _y: number;
  private _lastX: number;
  private _lastY: number;
  private _mouseIsOver: boolean;
  private _zIndex: number;
  private _zIndexComparable: GfxElementZIndexComparable;
  private _width: number;
  private _height: number;
  private _rotation?: number;
  private _baseRotation?: number;
  private _wasRotated: boolean;
  private _scaledDiagonalSize: number; // only needed for determining collision box when rotated
  private _rotatedScaledX: number;
  private _rotatedScaledY: number;
  private _lastCollisionBoxX: number;
  private _lastCollisionBoxY: number;
  private _lastCollisionBoxWidth: number;
  private _lastCollisionBoxHeight: number;
  private _horizontalFlip: boolean;
  private _verticalFlip: boolean;
  private _flashDoneCallback?: () => void;
  private _isFlashing: boolean;
  private _flashStartTime: number;
  private _flashDuration: number;
  private _flashHidden: boolean;
  private _flashElapsed: number;
  private _flashInterval: number;
  private _nudgeDoneCallback?: () => void;
  private _isProcessingNudge: boolean;
  private _shakeDoneCallback?: () => void;
  private _isProcessingShake: boolean;
  private _eventManager: EventManager;

  constructor(props: IGfxElementProps) {
    this._id = GfxElement.id++;
    this._gfxPanel = props.gfxPanel;
    this._scaleX = props.scaleX || 1;
    this._scaleY = props.scaleY || 1;
    this._currentMove = null;
    this._moveQueue = [];
    this._xMoveRate = 0;
    this._xMoveFractionalAccumulator = 0;
    this._yMoveRate = 0;
    this._yMoveFractionalAccumulator = 0;
    this._dirty = true;
    this._hasCollision = false;
    this._hadCollisionPreviousFrame = false;
    this._hidden = props.hidden || false;
    this._x = props.x || 0;
    this._y = props.y || 0;
    this._lastX = 0;
    this._lastY = 0;
    this._mouseIsOver = false;
    this._zIndex = props.zIndex || -1;
    this._zIndexComparable = new GfxElementZIndexComparable(this);
    this._width = props.width;
    this._height = props.height;

    this._rotation = props.rotation || null;
    this._baseRotation = props.baseRotation || null;
    this._wasRotated = props.rotation ? true: false ;

    this._scaledDiagonalSize = 0; // only needed for determining collision box when rotated
    this._rotatedScaledX = 0;
    this._rotatedScaledY = 0;

    this._lastCollisionBoxX = this._x;
    this._lastCollisionBoxY = this._y;
    this._lastCollisionBoxWidth = 0;
    this._lastCollisionBoxHeight = 0;

    this._horizontalFlip = props.horizontalFlip || false;
    this._verticalFlip = props.verticalFlip || false;

    this._flashDoneCallback = null;
    this._isFlashing = false;
    this._flashStartTime = -1;
    this._flashDuration = 0;
    this._flashHidden = false;
    this._flashElapsed = 0;
    this._flashInterval = 0;

    this._nudgeDoneCallback = null;
    this._isProcessingNudge = false;

    this._shakeDoneCallback = null;
    this._isProcessingShake = false;

    this._eventManager = props.eventManager || new EventManager();

    this._recalculateRotatedCollisionBox();

  }

  /*
  * Canvas AntiAliasing tends to draw beyond the actual pixel bounds of an image, or
  * shape.  This helps slgfx correct for this behavior.
  * ALSO IMPORTANT - using fractions here tends to reduce performance (!?!)
  * on some basic benchmarks... so avoid them if possible.
  * (Benchmark on Firefox 57.0.2)
  */
  public static AntiAliasCorrection = {
    coordinateOffset: -1,
    sizeAdjustment: 2
  }

  public addEventListener(eventType: string, callback: (ev: Event) => any, id?: string): string {
    return this._eventManager.addEventListener(eventType, callback, id);
  }

  public on = this.addEventListener;

  public removeEventListener(eventListenerId: string): void {
    this._eventManager.removeEventListener(eventListenerId);
  }

  public clearEventListeners(eventType: string): void {
    this._eventManager.clearEventListeners(eventType);
  }

  /** Notify event handlers when an event has occured.
  * @param {Event} event The event that occured
  */
  public notify(event: Event): void;
  public notify(eventType: string, data?: any, time?: number): void;
  public notify(eventOrEventType: Event|string, data?: any, time?: number): void {
    let event = null;
    if (eventOrEventType instanceof Event) {
      event = eventOrEventType;
    } else {
      event = new Event(eventOrEventType, data, time);
    }
    this._eventManager.notify(event);
    this.getGfxPanel().notify(event);
  }  

  /** Return the unique id of this element.
  * @return {int} This element's unique id.
  */
  public getId() {return this._id;}

  /** Return whether this element is dirty.
  * @return {boolean}
  */
  public isDirty() {
    return this._dirty || this._hasCollision || this._hadCollisionPreviousFrame;
  }

  /**
  * Set whether element is dirty.  If dirty, the element will be cleared and redrawn during the next render phase.
  * @param {boolean} dirty
  */
  public setDirty(dirty: boolean) {this._dirty = dirty;}

  /** Return whether this element is hidden.
  * @return {boolean}
  */
  public isHidden() {return this._hidden;}

  /**
  * Set whether element is hidden.
  * @param {boolean} hidden
  */
  public setHidden(hidden: boolean) {
    this._hidden = hidden;
    this._dirty = true;
  }

  /** Return whether this element had a collision during the most recent update phase.
  * @return {boolean}
  */
  public hasCollision() {return this._hasCollision;}

  /**
  * Set whether the element has a collision. If a collision has occurred the element will be cleared and redrawn during the next render phase.
  * @param {boolean} hidden
  */
  public setHasCollision(hasCollision: boolean) {this._hasCollision = hasCollision;}

  /**
  * Return this element's zIndex.
  * @return {number}
  */
  public getZIndex() {return this._zIndex;}

  /**
  * Set this element's zIndex. Elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).
  * @param {number} zIndex
  */
  public setZIndex(zIndex: number) {
    this._zIndex = zIndex;
    this.setDirty(true);
  }

  /** Return this element's zindeComparable.
  * Used by parent layer to determine rendering order.
  * @return {GfxElementZIndexComparable}
  */
  public getZIndexComparable() {
    return this._zIndexComparable;
  }

  /**
  * Return the parent GfxPanel for this element.
  * @return {GfxPanel}
  */
  public getGfxPanel() {return this._gfxPanel;}

  /**
  * Return the horizontal scale of this element's parent panel.
  * @return {int}
  */
  public getPanelScaleX() { return this.getGfxPanel().getScaleX(); }

  /**
  * Return the vertical scale of this element's parent panel.
  * @return {int}
  */
  public getPanelScaleY() { return this.getGfxPanel().getScaleY(); }

  /**
  * Return the total horizontal scale for this element (panel scale * element scale).
  * @return {int}
  */
  public getTotalScaleX() { return this.getElementScaleX() * this.getGfxPanel().getScaleX(); }

  /**
  * Return the total vertical scale for this element (panel scale * element scale).
  * @return {int}
  */
  public getTotalScaleY() { return this.getElementScaleY() * this.getGfxPanel().getScaleY(); }

  /**
  * Return the horizontal scale of this element.
  * @return {int}
  */
  public getElementScaleX() { return this._scaleX; }

  /**
  * Return the vertical scale of this element.
  * @return {int}
  */
  public getElementScaleY() { return this._scaleY; }

  /**
  * Set the horizontal scale of this element.
  * @param {int} scaleX
  */
  public setElementScaleX(scaleX: number) {
    this._scaleX = scaleX;
  }

  /**
  * Set the vertical scale of this element.
  * @param {int} scaleY
  */
  public setElementScaleY(scaleY: number) {this._scaleY = scaleY;}

  /**
  * Get the x coordinate of this element.
  * @return {number}
  */
  public getX() { return this._x; }

  /**
  * Get the panel x coordinate of this element.
  * @return {number}
  */
  public getScaledX() {
    return this.getX() * this.getPanelScaleX();
  }

  /**
  * Get the y coordinate of this element.
  * @return {number}
  */
  public getY() { return this._y; }

  /**
  * Get the panel x coordinate of this element.
  * @return {number}
  */
  public getScaledY() {
    return this.getY() * this.getPanelScaleY();
  }

  /**
  * Set the x coordinate of this element.
  * @param {number} x
  */
  public setX(x: number) {
    if (x !== this._x) this.setDirty(true);
    this._x = x;
  }

  /**
  * Set the y coordinate of this element.
  * @param {number} y
  */
  public setY(y: number) {
    if (y !== this._y) this.setDirty(true);
    this._y = y;
  }

  /** @private */
  private getLastX() { return this._lastX; }
  /** @private */
  private getLastY() { return this._lastY; }
  /** @private */
  private getLastWidth() { return this.getWidth(); }
  /** @private */
  private getLastHeight() { return this.getHeight(); }
  /** @private */
  private setLastX(x: number) {this._lastX = x;}
  /** @private */
  private setLastY(y: number) {this._lastY = y;}

  /**
  * Return whether the mouse is over this element.
  * @return {boolean}
  */
  public isMouseOver() { return this._mouseIsOver; }

  /**
  * Return this element's width.
  * @abstract
  * @return {number}
  */
  public getWidth() { return this._width; }

  /**
  * Return this element's width, incorporating parent panel and element-local scaling.
  * @return {number}
  */
  public getScaledWidth() { return this.getWidth() * this.getTotalScaleX(); }

  /**
  * Return this elements height.
  * @abstract
  * @return {number}
  */
  public getHeight() { return this._height; }

  /**
  * Return this element's height, incorporating parent panel and element-local scaling.
  * @return {number}
  */
  public getScaledHeight() { return this.getHeight() * this.getTotalScaleY(); }

  /** Get the amount of rotation, ignoring any base rotation.
  * @return {number} The rotation in radians.
  * @see GfxElement#setBaseRotation
  */
  public getUnAdjustedRotation() {  return this._rotation;  }

  /** Get the base rotation.
  * @return {number} The rotation in radians.
  * @see GfxElement#setBaseRotation
  */
  public getBaseRotation() {  return this._baseRotation;  }

  /** Get the total effective rotation of the element, including base rotation.
  * @return {number} The rotation in radians.
  * @see GfxElement#setBaseRotation
  */
  public getRotation() {
    if (this._rotation || this._baseRotation)
    return (this._rotation || 0) + (this._baseRotation || 0);
    return null;
  }

  /** Rotate the element by a specified number of radians.
  * @param {number} rotation The rotation in radians.
  */
  public setRotation(rotation: number) {
    this._rotation = rotation;
    if (this._rotation === null) {
      if (this.wasRotated()) this.setDirty(true);
      return;
    }
    this._recalculateRotatedCollisionBox();
    this.setDirty(true);
  }

  /** Set a base rotation for this element.  Calling setRotation
  * will apply the rotation on top of any base rotation.
  * @param {number} rotation The rotation in radians.
  */
  public setBaseRotation(rotation: number) {
    this._baseRotation = rotation;
    if (this._baseRotation === null) {
      if (this.wasRotated()) this.setDirty(true);
      return;
    }
    this._recalculateRotatedCollisionBox();
    this.setDirty(true);
  }

  /** @private */
  private wasRotated() { return this._wasRotated; }

  /** @private */
  private setWasRotated(wasRotated: boolean) {
    this._wasRotated = wasRotated;
  }

  /** Return whether this element is rotated.  Ignores base rotation.
  * @return {number} The rotation in radians.
  */
  public hasRotation() { return !(Utils.isNullOrUndefined(this.getRotation()) || this.getRotation() === 0); }

  /** @private */
  private getRotatedScaledX() { return this._rotatedScaledX;  }
  /** @private */
  private getRotatedScaledY() { return this._rotatedScaledY;  }
  /** @private */
  private getScaledDiagonalSize() {
    return this._scaledDiagonalSize;
  }

  /** @private */
  private _recalculateRotatedCollisionBox() {
    if (this.getRotation() === null) return;
    this._scaledDiagonalSize = Math.ceil(Math.sqrt( Math.pow(this.getScaledWidth(), 2) + Math.pow(this.getScaledHeight(), 2) ));
    this._rotatedScaledX = Math.floor(this.getScaledX() - (this._scaledDiagonalSize - this.getScaledWidth()) / 2);
    this._rotatedScaledY = Math.floor(this.getScaledY() - (this._scaledDiagonalSize - this.getScaledHeight()) / 2);
  }

  /** Return whether the element is flipped horizontally.
  * @return {bool}
  */
  public isHorizontallyFlipped() { return this._horizontalFlip; }

  /** Return whether the element is flipped vertically.
  * @return {bool}
  */
  public isVerticallyFlipped() { return this._verticalFlip; }

  /** Set whether to horizontally flip this element.
  * @param {bool} flipped If true, flip the element; false, do not.
  */
  public setHorizontallyFlipped(flipped: boolean) {
    if (this._horizontalFlip !== flipped) this.setDirty(true);
    this._horizontalFlip = flipped;
  }

  /** Set whether to vertically flip this element.
  * @param {bool} flipped If true, flip the element; false, do not.
  */
  public setVerticallyFlipped(flipped: boolean) {
    if (this._verticalFlip !== flipped) this.setDirty(true);
    this._verticalFlip = flipped;
  }

  /** Make the element flash.
  * @param {number} interval How frequently, in milliseconds to flash the element.
  * @param {number} duration How long to keep flashing. If duration is -1, will flash until turned off.
  * @param {function} callback A function to call when flashing ends.
  */
  public flash(interval: number, duration: number, callback?: () => void) {
    this._flashInterval = interval;
    this._flashDuration = duration;
    this._isFlashing = true;
    this._flashStartTime = -1;
    this._flashElapsed = 0;
    this._flashHidden = false;
    this._flashDoneCallback = callback;
  }

  /** Return whether the element is currenlyt flashing.
  * @return {bool}
  */
  public isFlashing() {  return this._isFlashing;  }

  /** Turn flashing off.  If a callback was provided when flash was turned on, it will be turned off.
  */
  public turnFlashOff() {
    this._endFlash();
  }

  /** @private */
  private _endFlash() {
    this._isFlashing = false;
    this._flashStartTime = -1;
    this._flashElapsed = 0;
    this._flashHidden = false;
    if (Utils.isFunction(this._flashDoneCallback)) this._flashDoneCallback();
  }

  /** @private */
  private _updateFlash(time: number, diff: number) {
    if (this._flashStartTime === -1) this._flashStartTime = time;
    if (time - this._flashStartTime >= this._flashDuration && this._flashDuration > -1) {
      this._endFlash();
      return;
    }

    this._flashElapsed += diff;
    if (this._flashElapsed >= this._flashInterval) {
      this._flashElapsed -= this._flashInterval;
      this._flashHidden = !this._flashHidden;
      this.setDirty(true);
    }
  }

  /** Nudge the element, make it move back and forth rapidly.  Provides options for decays of movement range
  * (will make movement less extreme over time), and of time interval (movement becomes more rapid over time).
  * Automatically returns to its starting position upon completion.
  * If the offsets or the interval time reaches zero due to the decay parameters, the nudge will finish.
  * Will throw an error if the parameters will cause the nudge to repeat for >= 1000 intervals.
  * @param {number} offsetX The maximum (positive and negative) horizontal offset to move the element.
  * @param {number} offsetY The maximum (positive and negative) vertical offset to move the element.
  * @param {number} decay After hitting the current offset and reversing direction, reduce the offsets by this amount.
  * @param {number} interval How rapidly (milliseconds) the element should move to the offset, before reversing direction.
  * @param {number} intervalDecay Reduces the interval time after each iteration.
  * @param {function} callback A function to call when the nudge has completed.
  * @fires GfxElement#ELEMENT_STARTED_MOVING
  * @fires GfxElement#ELEMENT_STOPPED_MOVING
  */
  public nudge(offsetX: number, offsetY: number, decay: number, interval: number, intervalDecay: number, callback?: () => void) {
    if (interval < 0) throw new Error ("interval cannot be less than 0");
    this._nudgeDoneCallback = callback;
    let tx: number, ty: number;
    let xdir = offsetX >= 0 ? 1 : -1;
    let ydir = offsetY >= 0 ? 1 : -1;
    let count = 0;

    while((Math.abs(offsetX) > decay || Math.abs(offsetY) > decay) && interval >= 0) {
      tx = this.getX() + offsetX;
      ty = this.getY() + offsetY;
      // Add movement to the queue.
      this.moveTo(tx, ty, interval);
      this._isProcessingNudge = true;

      interval -= intervalDecay;
      xdir = xdir * -1;
      ydir = ydir * -1;
      offsetX = offsetX !== 0 ? xdir * (Math.abs(offsetX) - decay) : 0;
      offsetY = offsetY !== 0 ? ydir * (Math.abs(offsetY) - decay) : 0;

      count++;
      if (count > 1000) throw new Error("GfxElement.nudge() looped too many times.");
    }
    this.moveTo(this.getX(), this.getY(), interval < 0 ? 0 : interval);
  }

  /** Shake the element in random directions, up to a maximum range.  Provides options for decays of movement range
  * (will make movement less extreme over time), and of time interval (movement becomes more rapid over time).
  * If the intensity or the interval time reaches zero due to the decay parameters, the shake will finish.
  * Automatically returns to its starting position upon completion.
  * Will throw an error if the parameters will cause the nudge to repeat for >= 1000 intervals.
  * @param {number} intensity The maximum (positive and negative) range the element will move in any direction.
  * @param {number} intensityDecay After each movement interval, reduce the intensity by this amount.
  * @param {number} interval How rapidly (milliseconds) the element should move to the offset, before starting a new iteration.
  * @param {number} intervalDecay Reduces the interval time after each iteration.
  * @param {number} notToExceedTime An upper limit in milliseconds to allow the shake to process.
  * @param {function} [callback] A function to call when the shake has completed.
  * @fires GfxElement#ELEMENT_STARTED_MOVING
  * @fires GfxElement#ELEMENT_STOPPED_MOVING
  */
  public shake(intensity: number, intensityDecay: number, interval: number, intervalDecay?: number, notToExceedTime?: number, callback?: () => void) {
    if (interval < 0) throw new Error ("interval cannot be less than 0");
    if (intervalDecay === 0 && !notToExceedTime) throw new Error("must specify either intervalDecay or notToExceedTime");
    this._shakeDoneCallback = callback;
    let tx: number,ty: number;
    let count = 0;
    let elapsed = 0;
    let offsetX = intensity - Math.floor(Math.random() * intensity * 2);
    let offsetY = intensity - Math.floor(Math.random() * intensity * 2);

    while(intensity > 0 && interval > 0 && elapsed < (notToExceedTime||Number.POSITIVE_INFINITY)) {
      tx = this.getX() + offsetX;
      ty = this.getY() + offsetY;
      this.moveTo(tx, ty, interval);
      this._isProcessingShake = true;

      elapsed += interval;
      interval -= intervalDecay;
      intensity -= intensityDecay;
      offsetX = intensity - Math.floor(Math.random() * intensity * 2);
      offsetY = intensity - Math.floor(Math.random() * intensity * 2);

      count++;
      if (count > 1000) throw new Error("GfxElement.shake() looped too many times.");
    }
    this.moveTo(this.getX(), this.getY(), interval < 0 ? 0 : interval);
  }

  /** Set the horizontal and vertical movement rates for this element.
  * Rates will be treated as approximately pixels per second.
  * Negative values will move the element left for xMoveRate or up for yMoveRate.
  * Zero values will halt movement on a given axis.
  * Positive values will move the element right for xMoveRate or down for yMoveRate.
  * Note that moveTo instructions will supercede movement rates in determining the element's position.
  * @param {number} xMoveRate Horizontal movement rate
  * @param {number} yMoveRate Vertical movement rate
  * @fires GfxElement#ELEMENT_STOPPED_MOVING
  * @fires GfxElement#ELEMENT_STARTED_MOVING
  */
  public setMoveRates(xMoveRate: number, yMoveRate: number) {
    if (xMoveRate === 0 && yMoveRate === 0 && this._currentMove === null && (this._xMoveRate !== 0 || this._yMoveRate !== 0)) {
      this.notify(
        new Event(EventType.ELEMENT_STOPPED_MOVING, {element:this})
      );
    } else if ((xMoveRate !== 0 || yMoveRate !== 0) && this._currentMove === null && this._xMoveRate === 0 && this._yMoveRate === 0) {
      this.notify(
        new Event(EventType.ELEMENT_STARTED_MOVING, {element:this})
      );
    }

    this._xMoveRate = xMoveRate;
    this._yMoveRate = yMoveRate;
  }

  /**
  * Return the current x movement rate.
  * @return {number}
  */
  public getMoveRateX() { return this._xMoveRate; }

  /**
  * Return the current y movement rate.
  * @return {number}
  */
  public getMoveRateY() { return this._yMoveRate; }

  /**
  * Move the element to the specified coordinate over the course of specified duration.
  * Calls to this method are queued and executed one after the other.
  * Note that movement effect created by this method will supercede any movement rates for the given duration.
  * @param {number} x The target x coordinate
  * @param {number} y The target y coordinate
  * @param {number} duration Optional. How long it should take the element to move from its current position to the target position, in milliseconds. Defaults to 16ms.
  * @param {function} callback Optional.  The function to call when the move is complete.
  * @fires GfxElement#ELEMENT_STARTED_MOVING
  * @fires GfxElement#ELEMENT_STOPPED_MOVING
  */
  public moveTo(x: number,y: number,duration: number, callback?: (element: GfxElement) => void) {
    duration = duration || 16;
    const moveOrder = new MoveOrder(this, x, y, duration, this._moveOrderCallback.bind(this), callback);
    this._moveQueue.push(moveOrder);
    if (this._currentMove === null) {
      this._runMove();
      // If not already moving, fire start move event
      if (this.getMoveRateX() === 0 && this.getMoveRateY() === 0) {
        this.notify(
          new Event(EventType.ELEMENT_STARTED_MOVING, {element:this})
        );
      }
    }
  }

  /** @private */
  private _runMove() {
    if (this._moveQueue.length > 0) {
      this._currentMove = this._moveQueue.shift();
      this._currentMove.start();
      return true;
    }
    // If no additional movement, fire end move event
    if (this.getMoveRateX() === 0 && this.getMoveRateY() === 0) {
      this.notify(
        new Event(EventType.ELEMENT_STOPPED_MOVING, {element:this})
      );
    }
    this._currentMove = null;
    return false;
  }

  /** @private */
  private _moveOrderCallback() {
    this._currentMove = null;
    if (! this._runMove()){
      if (this._isProcessingNudge) {
        if (Utils.isFunction(this._nudgeDoneCallback)) this._nudgeDoneCallback();
        this._isProcessingNudge = false;
      }
      if (this._isProcessingShake) {
        if (Utils.isFunction(this._shakeDoneCallback)) this._shakeDoneCallback();
        this._isProcessingShake = false;
      }
    }
  }

  /**
  * Clear any queued moveTo instructions.
  * Does not effect a currently running moveTo, or any movement rates.
  */
  public clearMoveQueue() {
    this._moveQueue = [];
  }

  /**
  * Turn the element "off".
  * All movement will cease and element will be hidden.
  */
  public turnOff() {
    this.clearMoveQueue();
    this._currentMove = null;
    this._xMoveRate = 0;
    this._xMoveFractionalAccumulator = 0;
    this._yMoveRate = 0;
    this._yMoveFractionalAccumulator = 0;
    this.hide();
  }

  /** Show the element. */
  public show() {
    this._hidden = false;
    this.setDirty(true);
  }

  /** Hide the element */
  public hide() {
    this._hidden = true;
    this.setDirty(true);
  }

  /** Called by the parent layer. Update the element.  Will update location based on current time/diff.
  * @param {number} time The current time.  Not specifically used, but provided for extension.
  * @param {number} diff The difference between the previous time and the current time. Use to calculate element's position if it is moving.
  * @return {GfxElement} Returns this element if it needs to be redrawn, null otherwise.
  * @fires GfxElement#ELEMENT_MOVED
  */
  public update(time: number, diff: number): GfxElement | null {
    this._updateLocationFromMoveRates(diff);
    // Will take precedence over move rate
    this._updateMoveOrder(time, diff);

    if (this._isFlashing) this._updateFlash(time, diff);

    if (this.getX() !== this.getLastX() || this.getY() !== this.getLastY()) {
      this.setDirty(true);
      this.notify(
        new Event(
          EventType.ELEMENT_MOVED,
          {element:this},
          time
        )
      );
    }

    if (this.isDirty()) {
      this._recalculateRotatedCollisionBox();
      return this;
    }
    return null;
  }

  /** Updates the elements position using movement rates and the time diff.
  * @private
  * @param {number} diff
  */
  private _updateLocationFromMoveRates(diff: number) {
    let amount: number, sign: number, intAmount: number;

    if (this._xMoveRate !== 0) {
      amount = this._xMoveFractionalAccumulator + diff * this._xMoveRate / 1000;
      sign = Math.sign(amount);
      intAmount = Math.trunc(amount);
      this._xMoveFractionalAccumulator = sign * (Math.abs(amount) - Math.abs(intAmount));
      this._x += intAmount;
      if (this._x !== this._lastX) this.setDirty(true);
    } else {
      this._xMoveFractionalAccumulator = 0;
    }
    if (this._yMoveRate !== 0) {
      amount = this._yMoveFractionalAccumulator + diff * this._yMoveRate / 1000;
      sign = Math.sign(amount);
      intAmount = Math.trunc(amount);
      this._yMoveFractionalAccumulator = sign * (Math.abs(amount) - Math.abs(intAmount));
      this._y += intAmount;
      if (this._y !== this._lastY) this.setDirty(true);
    } else {
      this._yMoveFractionalAccumulator = 0;
    }
  }

  /** Updates the elements position based on the current moveTo instruction.
  * @private
  * @param {number} time
  * @param {number} diff
  */
  private _updateMoveOrder(time: number, diff: number) {
    if (this._currentMove !== null) {
      this._currentMove.update(diff);
      this.setDirty(true);
    }
  }

  /** Intended for immediately clearing this element's bounding box. 
   * Called by the parent layer. 
   * @param {CanvasContext} canvasContext 
  */
  public clear(canvasContext: ICanvasContextWrapper) {
    canvasContext.clearRect(
      this._lastCollisionBoxX,
      this._lastCollisionBoxY,
      this._lastCollisionBoxWidth,
      this._lastCollisionBoxHeight
    );
  }

  /** Called by the parent layer. Perform any preRendering steps, return whether the element needs to be rendered.
  */
  public preRender(time: number, diff: number) {
    if (!this.isHidden() && !this._flashHidden && this.isDirty()) return true;
    return false;
  }

  /** Called by the parent layer.
  * The render method should be implemented in subclasses.
  * Time parameters provided for extension.
  */
  public abstract render(canvasContext: ICanvasContextWrapper, time: number, diff: number): void;


  /** Called by the parent layer.
  * Provides post-render clean up.
  * Time parameters provided for extension.
  * @param {number} time
  * @param {number} diff
  */
  public postRender(time: number, diff: number) {
    this.setLastX( this.getX() );
    this.setLastY( this.getY() );

    if (this.hasRotation()) {
      this.setWasRotated(true);
    }
    else this.setWasRotated(false);

    this._saveLastCollisionBox();
    this._hadCollisionPreviousFrame = this.hasCollision();
    this.setHasCollision(false);
    this.setDirty(false);
  }

  /** @private */
  private _saveLastCollisionBox() {
    this._lastCollisionBoxX = this.getCollisionBoxX();
    this._lastCollisionBoxY = this.getCollisionBoxY();
    this._lastCollisionBoxWidth = this.getCollisionBoxWidth();
    this._lastCollisionBoxHeight = this.getCollisionBoxHeight();
  }

  /** Check whether this element collidesWith another element.
  * Compares the boundaries of this element and the other to check for overlap; if so return true, else return false.
  * @param {GfxElement} element
  * @return {boolean}
  * @fires GfxElement#ELEMENT_COLLISION
  */
  public collidesWith(element: GfxElement) {
    const thisX = this.getCollisionBoxX();
    const thatX = element.getCollisionBoxX();
    const thisWidth = this.getCollisionBoxWidth();
    const thatWidth = element.getCollisionBoxWidth();
    const thisY = this.getCollisionBoxY();
    const thatY = element.getCollisionBoxY();
    const thisHeight = this.getCollisionBoxHeight();
    const thatHeight = element.getCollisionBoxHeight();
    const result = thisX < thatX + thatWidth &&
      thisX + thisWidth > thatX &&
      thisY < thatY + thatHeight &&
      thisY + thisHeight > thatY;
    /* Internally, we may need to redraw if one of the elements was recently hidden.
    * However, don't trigger the event if either element is hidden.
    */
    if (result && !this.isHidden() && !element.isHidden()) {
      this.notify(
        new Event(EventType.ELEMENT_COLLISION, {
          element1 : this,
          element2 : element
        })
      );
      // notify the other element of the collision
      element.notify(
        new Event(EventType.ELEMENT_COLLISION, {
          element1 : element,
          element2 : this
        })
      );
    }
    return result;
  }

  /** Check whether this element intersects a specific point on the panel.
  * @param {number} x
  * @param {number} y
  * @return {boolean}
  */
  public collidesWithCoordinates(x: number, y: number) {
    const result = x >= this.getCollisionBoxX() &&
      x <= this.getCollisionBoxX() + this.getCollisionBoxWidth() &&
      y >= this.getCollisionBoxY() &&
        y <= this.getCollisionBoxY() + this.getCollisionBoxHeight();
    return result;
  }

  /** Check whether this element intersects an x coordinate.
  * @param {number} x
  * @return {boolean}
  */
  public collidesWithX(x: number) {
    const result = x >= this.getCollisionBoxX() &&
      x <= this.getCollisionBoxX() + this.getCollisionBoxWidth();
    return result;
  }

  /** Check whether this element intersects an y coordinate.
  * @param {number} x
  * @return {boolean}
  */
  public collidesWithY(y: number) {
    const result = y >= this.getCollisionBoxY() &&
        y <= this.getCollisionBoxY() + this.getCollisionBoxHeight();
    return result;
  }

  /** Returns the x value of the collision box.  Incorporates panel scale.
  * @return {number}
  */
  public getCollisionBoxX() {
    if (this.hasRotation()) return this.getRotatedScaledX() + GfxElement.AntiAliasCorrection.coordinateOffset;
    return this.getScaledX() + GfxElement.AntiAliasCorrection.coordinateOffset;
  }

  /** Returns the y value of the collision box.  Incorporates panel scale.
  * @return {number}
  */
  public getCollisionBoxY() {
    if (this.hasRotation()) return this.getRotatedScaledY() + GfxElement.AntiAliasCorrection.coordinateOffset;
    return this.getScaledY() + GfxElement.AntiAliasCorrection.coordinateOffset;
  }

  /** Returns the width value of the collision box.  Incorporates total scale.
  * @return {number}
  */
  public getCollisionBoxWidth() {
    if (this.hasRotation()) return this.getScaledDiagonalSize() + GfxElement.AntiAliasCorrection.sizeAdjustment;
    return this.getScaledWidth() + GfxElement.AntiAliasCorrection.sizeAdjustment;
  }

  /** Returns the height value of the collision box.  Incorporates total scale.
  * @return {number}
  */
  public getCollisionBoxHeight() {
    if (this.hasRotation()) return this.getScaledDiagonalSize() + GfxElement.AntiAliasCorrection.sizeAdjustment;
    return this.getScaledHeight() + GfxElement.AntiAliasCorrection.sizeAdjustment;
  }

  /** Fires events if the mouse event is on this element.<br />
  * @fires GfxElement#MOUSE_ENTER_ELEMENT
  * @fires GfxElement#MOUSE_EXIT_ELEMENT
  * @fires GfxElement#MOUSE_MOVE_OVER_ELEMENT
  * @fires GfxElement#MOUSE_DOWN_ON_ELEMENT
  * @fires GfxElement#MOUSE_UP_ON_ELEMENT
  * @param {Event}
  */
  public handleMouseEvent(event: SLGfxMouseEvent) {
    const eventData = this._setupSecondaryEventData(event);
    const secondaryEvents = [];
    // GfxElement will use panel scaled coordinates for comparison;
    // so, don't use final x & y from event, but rather use scaled values
    // TODO: name things better to make them less confusing?
    if (this.collidesWithCoordinates(event.data.viewOriginAdjustedX, event.data.viewOriginAdjustedY)) {
      if (!this.isMouseOver()) {
        secondaryEvents.push(new SLGfxMouseEvent(
          EventType.MOUSE_ENTER_ELEMENT,
          eventData,
          event.data.time
        ));
      }

      this._mouseIsOver = true;
      let type: EventType;
      switch(event.type) {
        case EventType.MOUSE_MOVE:
          type = EventType.MOUSE_MOVE_OVER_ELEMENT;
          break;
        case EventType.MOUSE_DOWN:
          type = EventType.MOUSE_DOWN_ON_ELEMENT;
          break;
        case EventType.MOUSE_UP:
          type = EventType.MOUSE_UP_ON_ELEMENT;
          break;
      }
      secondaryEvents.push(new SLGfxMouseEvent(
        type,
        eventData,
        event.data.time
      ));
    } else {
      if (this.isMouseOver()) {
        secondaryEvents.push(new SLGfxMouseEvent(
          EventType.MOUSE_EXIT_ELEMENT,
          eventData,
          event.data.time
        ));
        this._mouseIsOver = false;
      }
    }
    for (let i = 0; i < secondaryEvents.length; i++) {
      const secondaryEvent = secondaryEvents[i];
      this.notify(secondaryEvent);
      if (secondaryEvent.endEventPropagation)
        event.endEventPropagation = true;
    }
  }

  /** @private */
  private _setupSecondaryEventData(event: SLGfxMouseEvent) {
    const eventData = {
        x : event.data.x,
        y : event.data.y,
        viewOriginAdjustedX : event.data.viewOriginAdjustedX,
        viewOriginAdjustedY : event.data.viewOriginAdjustedY,
        rawX : event.data.rawX,
        rawY : event.data.rawY,
        element : this
    };
    return eventData;
  }

}

/** Element stopped moving.
* @event GfxElement#ELEMENT_STOPPED_MOVING
* @type {ElementEvent}
*/

/** Element started moving.
* @event GfxElement#ELEMENT_STARTED_MOVING
* @type {ElementEvent}
*/

/** Element Moved.
* @event GfxElement#ELEMENT_MOVED
* @type {ElementEvent}
*/

/** An element collided with another element.
* @event GfxElement#ELEMENT_COLLISION
* @type {ElementCollidesWithElementEvent}
*/

/** Mouse moves into the element's coolision box.
* @event GfxElement#MOUSE_ENTER_ELEMENT
* @type {ElementMouseEvent}
*/

/** Mouse moves inside the element's coolision box.
* @event GfxElement#MOUSE_MOVE_OVER_ELEMENT
* @type {ElementMouseEvent}
*/

/** Mouse button down on an element.
* @event GfxElement#MOUSE_DOWN_ON_ELEMENT
* @type {ElementMouseEvent}
*/

/** Mouse button up on element.
* @event GfxElement#MOUSE_UP_ON_ELEMENT
* @type {ElementMouseEvent}
*/

/** Mouse leaves the element's coolision box.
* @event GfxElement#MOUSE_EXIT_ELEMENT
* @type {ElementMouseEvent}
*/
