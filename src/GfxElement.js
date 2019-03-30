var SL = {};

/**
* <p>Graphics element base class.</p>
* <p>* Current Implementations:
* <ul>
*   <li>{@link SL.ImageElement}</li>
*   <li>{@link SL.Sprite}
*     <ul>
*       <li>{@link SL.ImageSprite}</li>
*     </ul>
*   </li>
* </ul>
* <p>GfxElements support two types of movement: moveTo() instructions and movementRates.
* The former, moveTo() will send an element toward a specified set of coordinates, scheduled to arrive after a
* specified duration.  The latter, movementRates, will start an element moving at a given rate and continue until stopped.
* See moveTo() and setMoveRates() for more details.</p>
* <p>GfxElements emit a number of events:
* <ul>
*   <li>ELEMENT_MOVED : Any time the element moves.</li>
*   <li>ELEMENT_STARTED_MOVING : When the element starts moving.</li>
*   <li>ELEMENT_STOPPED_MOVING : When the element stops moving.</li>
*   <li>ELEMENT_COLLISION : When the element collides with another.</li>
*   <li>MOUSE_ENTER_ELEMENT : When the mouse enters the element's bounding box.</li>
*   <li>MOUSE_EXIT_ELEMENT : When the mouse leaves the element's bouding box.</li>
*   <li>MOUSE_MOVE_OVER_ELEMENT : When the mouse moves and is over the element.</li>
*   <li>MOUSE_DOWN_ON_ELEMENT : When there is a mouse down event on the element.</li>
*   <li>MOUSE_UP_ON_ELEMENT : When there is a mouse up event on the element.</li>
*   <li>ELEMENT_HIT_LEFT_EDGE : When the element hits the left edge of its layer.</li>
*   <li>ELEMENT_HIT_RIGHT_EDGE : When the element hits the right edge of its layer.</li>
*   <li>ELEMENT_HIT_TOP_EDGE : When the element hits the top edge of its layer.</li>
*   <li>ELEMENT_HIT_BOTTOM_EDGE : When the element hits the bottom edge of its layer.</li>
* </ul>
* In most cases, the event data will include an 'element' property that refers to the element.  The only exception is ELEMENT_COLLISION;
* this will have element1 and element2 properties, where element1 is the element on which collidesWith() was called, and element2 was the element passed to the method.</p>
* <p>In addition to the element property, the mouse events will also include x,y, and row, column properties in the data, corresponding to the coordinates of the event. </p>
*
* <p>Event listeners can be attached to individual elements, or at the screen level.  Refer to documentation on the "on" and "notify" methods.</p>
* @constructor
* @param {SL.Screen} screenContext The target screen.
* @param {SL.GfxLayer} parentLayer The parent layer that will draw this element.
* @param {Object} props Properties for this GfxElement.
* @param {integer} props.scaleX Horizontal scale of this element.  Independent of screen scale.
* @param {integer} props.scaleY Vertical scale of this element.  Independent of screen scale.
* @param {boolean} props.hidden Whether to hide this element.
* @param {intnumbereger} props.x The X coordinate for this element.
* @param {number} props.y The Y coordinate for this element.
* @param {number} props.zIndex The z-index; elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).
*/
SL.GfxElement = function(screenContext, parentLayer, props) {
  props = props || {};
  this._id = SL.GfxElement.id++;
  this._screenContext = screenContext;
  this._parentLayer = parentLayer;
  this._canvasContext = parentLayer ? parentLayer.getCanvasContext() : null;
  this._scaleX = props.scaleX || 1;
  this._scaleY = props.scaleY || 1;
  this._currentMove = null;
  this._moveQueue = new SL.Queue();
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
  this._zIndexComparable = new SL.GfxElementZIndexComparable(this);
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

  this.EventNotifierMixinInitializer({
    eventListeners:[
      SL.EventType.ELEMENT_MOVED,
      SL.EventType.ELEMENT_STARTED_MOVING,
      SL.EventType.ELEMENT_STOPPED_MOVING,
      SL.EventType.ELEMENT_COLLISION,
      SL.EventType.MOUSE_ENTER_ELEMENT,
      SL.EventType.MOUSE_EXIT_ELEMENT,
      SL.EventType.MOUSE_MOVE_OVER_ELEMENT,
      SL.EventType.MOUSE_DOWN_ON_ELEMENT,
      SL.EventType.MOUSE_UP_ON_ELEMENT,
      SL.EventType.ELEMENT_HIT_LEFT_EDGE,
      SL.EventType.ELEMENT_HIT_RIGHT_EDGE,
      SL.EventType.ELEMENT_HIT_TOP_EDGE,
      SL.EventType.ELEMENT_HIT_BOTTOM_EDGE
    ]
  });

  this._recalculateRotatedCollisionBox();
};

SL.EventNotifierMixin.call(SL.GfxElement.prototype);
SL.GfxElement.prototype._baseNotify = SL.GfxElement.prototype.notify;

/*
* Canvas AntiAliasing tends to draw beyond the actual pixel bounds of an image, or
* shape.  This helps slgfx correct for this behavior.
* ALSO IMPORTANT - using fractions here tends to reduce performance (!?!)
* on some basic benchmarks... so avoid them if possible.
* (Benchmark on Firefox 57.0.2)
*/
SL.GfxElement.AntiAliasCorrection = {
  coordinateOffset: -1,
  sizeAdjustment: 2
};

SL.GfxElement.prototype.notify = function(event) {
  this._baseNotify(event);
  this.getScreenContext().notify(event);
};

/** @private */
SL.GfxElement.id = 0;

/** Return the unique id of this element.
* @return {integer} This element's unique id.
*/
SL.GfxElement.prototype.getId = function() {return this._id;};

/** Return whether this element is dirty.
* @return {boolean}
*/
SL.GfxElement.prototype.isDirty = function() {
  return this._dirty || this._hasCollision || this._hadCollisionPreviousFrame;
};

/**
* Set whether element is dirty.  If dirty, the element will be cleared and redrawn during the next render phase.
* @param {boolean} dirty
*/
SL.GfxElement.prototype.setDirty = function(dirty) {this._dirty = dirty;};

/** Return whether this element is hidden.
* @return {boolean}
*/
SL.GfxElement.prototype.isHidden = function() {return this._hidden;};

/**
* Set whether element is hidden.
* @param {boolean} hidden
*/
SL.GfxElement.prototype.setHidden = function(hidden) {this._hidden = hidden;};

/** Return whether this element had a collision during the most recent update phase.
* @return {boolean}
*/
SL.GfxElement.prototype.hasCollision = function() {return this._hasCollision;};

/**
* Set whether the element has a collision. If a collision has occurred the element will be cleared and redrawn during the next render phase.
* @param {boolean} hidden
*/
SL.GfxElement.prototype.setHasCollision = function(hasCollision) {this._hasCollision = hasCollision;};

/**
* Return this element's zIndex.
* @return {number}
*/
SL.GfxElement.prototype.getZIndex = function() {return this._zIndex;};

/**
* Set this element's zIndex. Elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).
* @param {number} zIndex
*/
SL.GfxElement.prototype.setZIndex = function(zIndex) {
  this._zIndex = zIndex;
  this.setDirty(true);
};

/** Return this element's zindeComparable.
* Used by parent layer to determine rendering order.
* @return {SL.GfxElementZIndexComparable}
*/
SL.GfxElement.prototype.getZIndexComparable = function() {
  return this._zIndexComparable;
};

/**
* Return this element's parent layer.
* @return {SL.GfxLayer}
*/
SL.GfxElement.prototype.getParentLayer = function() {return this._parentLayer;};

/**
* Return the canvas context for this element's parent layer.
* @return {CanvasContext}
*/
SL.GfxElement.prototype.getCanvasContext = function() {return this._canvasContext;};

/**
* Return the parent Screen for this element.
* @return {SL.Screen}
*/
SL.GfxElement.prototype.getScreenContext = function() {return this._screenContext;};

/**
* Return the horizontal scale of this element's parent screen.
* @return {integer}
*/
SL.GfxElement.prototype.getScreenScaleX = function() {return this.getScreenContext().getScaleX();};

/**
* Return the vertical scale of this element's parent screen.
* @return {integer}
*/
SL.GfxElement.prototype.getScreenScaleY = function() {return this.getScreenContext().getScaleY();};

/**
* Return the total horizontal scale for this element (screen scale * element scale).
* @return {integer}
*/
SL.GfxElement.prototype.getTotalScaleX = function() {return this.getElementScaleX() * this.getScreenContext().getScaleX();};

/**
* Return the total vertical scale for this element (screen scale * element scale).
* @return {integer}
*/
SL.GfxElement.prototype.getTotalScaleY = function() {return this.getElementScaleY() * this.getScreenContext().getScaleY();};

/**
* Return the horizontal scale of this element.
* @return {integer}
*/
SL.GfxElement.prototype.getElementScaleX = function() {return this._scaleX;};

/**
* Return the vertical scale of this element.
* @return {integer}
*/
SL.GfxElement.prototype.getElementScaleY = function() {return this._scaleY;};

/**
* Set the horizontal scale of this element.
* @param {integer} scaleX
*/
SL.GfxElement.prototype.setElementScaleX = function(scaleX) {
  this._scaleX = scaleX;
};

/**
* Set the vertical scale of this element.
* @param {integer} scaleY
*/
SL.GfxElement.prototype.setElementScaleY = function(scaleY) {this._scaleY = scaleY;};

/**
* Get the x coordinate of this element.
* @return {number}
*/
SL.GfxElement.prototype.getX = function() {return this._x;};

/**
* Get the screen x coordinate of this element.
* @return {number}
*/
SL.GfxElement.prototype.getScaledX = function() {
  return this.getX() * this.getScreenScaleX();
};

/**
* Get the y coordinate of this element.
* @return {number}
*/
SL.GfxElement.prototype.getY = function() {return this._y;};

/**
* Get the screen x coordinate of this element.
* @return {number}
*/
SL.GfxElement.prototype.getScaledY = function() {
  return this.getY() * this.getScreenScaleY();
};

/**
* Set the x coordinate of this element.
* @param {number} x
*/
SL.GfxElement.prototype.setX = function(x) {
  if (x !== this._x) this.setDirty(true);
  this._x = x;
};

/**
* Set the y coordinate of this element.
* @param {number} y
*/
SL.GfxElement.prototype.setY = function(y) {
  if (y !== this._y) this.setDirty(true);
  this._y = y;
};

/**
* Get the x coordinate of this element for the previous frame.
* @return {number}
*/
SL.GfxElement.prototype.getLastX = function() {return this._lastX;};

/**
* Get the y coordinate of this element for the previous frame.
* @return {number}
*/
SL.GfxElement.prototype.getLastY = function() {return this._lastY;};

/** Override if dimensions can change */
SL.GfxElement.prototype.getLastWidth = function() {return this.getWidth();};

/** Override if dimensions can change */
SL.GfxElement.prototype.getLastHeight = function() {return this.getHeight();};

/** @private */
SL.GfxElement.prototype.setLastX = function(x) {this._lastX = x;};
/** @private */
SL.GfxElement.prototype.setLastY = function(y) {this._lastY = y;};

/**
* Return whether the mouse is over this element.
* @return {boolean}
*/
SL.GfxElement.prototype.isMouseOver = function() {return this._mouseIsOver;};

/**
* Return this element's width.
* @abstract
* @return {number}
*/
SL.GfxElement.prototype.getWidth = function() {return this._width;};

/**
* Return this element's width, incorporating screen and element-local scaling.
* @return {number}
*/
SL.GfxElement.prototype.getScaledWidth = function() {return this.getWidth() * this.getTotalScaleX();};

/**
* Return this elements height.
* @abstract
* @return {number}
*/
SL.GfxElement.prototype.getHeight = function() {return this._height;};

/**
* Return this element's height, incorporating screen and element-local scaling.
* @return {number}
*/
SL.GfxElement.prototype.getScaledHeight = function() {return this.getHeight() * this.getTotalScaleY();};

SL.GfxElement.prototype.getUnAdjustedRotation = function() { return this._rotation; };
SL.GfxElement.prototype.getBaseRotation = function() { return this._baseRotation; };
SL.GfxElement.prototype.getRotation = function() {
  if (this._rotation || this._baseRotation)
  return (this._rotation || 0) + (this._baseRotation || 0);
  return null;
};

SL.GfxElement.prototype.setRotation = function(rotation) {
  this._rotation = rotation;
  if (this._rotation === null) {
    if (this.wasRotated()) this.setDirty(true);
    return;
  }
  this._recalculateRotatedCollisionBox();
  this.setDirty(true);
};
SL.GfxElement.prototype.setBaseRotation = function(rotation) {
  this._baseRotation = rotation;
  if (this._baseRotation === null) {
    if (this.wasRotated()) this.setDirty(true);
    return;
  }
  this._recalculateRotatedCollisionBox();
  this.setDirty(true);
};

SL.GfxElement.prototype.wasRotated = function() {return this._wasRotated;};
SL.GfxElement.prototype.setWasRotated = function(wasRotated) {
  this._wasRotated = wasRotated;
};
SL.GfxElement.prototype.hasRotation = function() {return !(SL.Utils.isNullOrUndefined(this.getRotation()) || this.getRotation() === 0);};

SL.GfxElement.prototype.getRotatedScaledX = function() {return this._rotatedScaledX; };
SL.GfxElement.prototype.getRotatedScaledY = function() {return this._rotatedScaledY; };
SL.GfxElement.prototype.getScaledDiagonalSize = function() {
  return this._scaledDiagonalSize;
};

SL.GfxElement.prototype._recalculateRotatedCollisionBox = function() {
  if (this.getRotation() === null) return;
  this._scaledDiagonalSize = Math.ceil(Math.sqrt( Math.pow(this.getScaledWidth(), 2) + Math.pow(this.getScaledHeight(), 2) ));
  this._rotatedScaledX = Math.floor(this.getScaledX() - (this._scaledDiagonalSize - this.getScaledWidth()) / 2);
  this._rotatedScaledY = Math.floor(this.getScaledY() - (this._scaledDiagonalSize - this.getScaledHeight()) / 2);
};

SL.GfxElement.prototype.isHorizontallyFlipped = function() {return this._horizontalFlip;};
SL.GfxElement.prototype.isVerticallyFlipped = function() {return this._verticalFlip;};

SL.GfxElement.prototype.setHorizontallyFlipped = function(flipped) {
  if (this._horizontalFlip !== flipped) this.setDirty(true);
  this._horizontalFlip = flipped;
};
SL.GfxElement.prototype.setVerticallyFlipped = function(flipped) {
  if (this._verticalFlip !== flipped) this.setDirty(true);
  this._verticalFlip = flipped;
};

/*
If duration is -1, will flash until turned off.
*/
SL.GfxElement.prototype.flash = function(interval, duration, callback) {
  this._flashInterval = interval;
  this._flashDuration = duration;
  this._isFlashing = true;
  this._flashStartTime = -1;
  this._flashElapsed = 0;
  this._flashHidden = false;
  this._flashDoneCallback = callback;
};

SL.GfxElement.prototype.isFlashing = function() { return this._isFlashing; };

SL.GfxElement.prototype.turnFlashOff = function() {
  this._endFlash();
};

SL.GfxElement.prototype._endFlash = function() {
  this._isFlashing = false;
  this._flashStartTime = -1;
  this._flashElapsed = 0;
  this._flashHidden = false;
  if (SL.Utils.isFunction(this._flashDoneCallback)) this._flashDoneCallback();
};

SL.GfxElement.prototype._updateFlash = function(time,diff) {
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
};

SL.GfxElement.prototype.nudge = function(offsetX, offsetY, decay, interval, intervalDecay, callback) {
  if (interval < 0) throw new Error ("interval cannot be less than 0");
  this._nudgeDoneCallback = callback;
  var tx,ty;
  var xdir = offsetX >= 0 ? 1 : -1;
  var ydir = offsetY >= 0 ? 1 : -1;
  var count = 0;

  while((Math.abs(offsetX) > decay || Math.abs(offsetY) > decay) && interval >= 0) {
    tx = this.getX() + offsetX;
    ty = this.getY() + offsetY;
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
};

SL.GfxElement.prototype.shake = function(intensity, intensityDecay, interval, intervalDecay, notToExceedTime, callback) {
  if (interval < 0) throw new Error ("interval cannot be less than 0");
  if (intervalDecay === 0 && !notToExceedTime) throw new Error("must specify either intervalDecay or notToExceedTime");
  this._shakeDoneCallback = callback;
  var tx,ty;
  var count = 0;
  var elapsed = 0;
  var offsetX = intensity - Math.floor(Math.random() * intensity * 2);
  var offsetY = intensity - Math.floor(Math.random() * intensity * 2);

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
};

/**
* Set the horizontal and vertical movement rates for this element.
* Rates will be treated as approximately pixels per second.
* Negative values will move the element left for xMoveRate or up for yMoveRate.
* Zero values will halt movement on a given axis.
* Positive values will move the element right for xMoveRate or down for yMoveRate.
* Note that moveTo instructions will supercede movement rates in determining the element's position.
* @param {number} xMoveRate Horizontal movement rate
* @param {number} yMoveRate Vertical movement rate
*/
SL.GfxElement.prototype.setMoveRates = function(xMoveRate, yMoveRate) {
  if (xMoveRate === 0 && yMoveRate === 0 && this._currentMove === null && (this._xMoveRate !== 0 || this._yMoveRate !== 0)) {
    this.notify(
      new SL.Event(SL.EventType.ELEMENT_STOPPED_MOVING, {element:this})
    );
  } else if ((xMoveRate !== 0 || yMoveRate !== 0) && this._currentMove === null && this._xMoveRate === 0 && this._yMoveRate === 0) {
    this.notify(
      new SL.Event(SL.EventType.ELEMENT_STARTED_MOVING, {element:this})
    );
  }

  this._xMoveRate = xMoveRate;
  this._yMoveRate = yMoveRate;
};

/**
* Return the current x movement rate.
* @return {number}
*/
SL.GfxElement.prototype.getMoveRateX = function() {return this._xMoveRate;};

/**
* Return the current y movement rate.
* @return {number}
*/
SL.GfxElement.prototype.getMoveRateY = function() {return this._yMoveRate;};

/**
* Move the element to the specified coordinate over the course of specified duration.
* Calls to this method are queued and executed one after the other.
* Note that movement effect created by this method will supercede any movement rates for the given duration.
* @param {number} x The target x coordinate
* @param {number} y The target y coordinate
* @param {number} duration Optional. How long it should take the element to move from its current position to the target position, in milliseconds. Defaults to 16ms.
* @param {function} callback Optional.  The function to call when the move is complete.
*/
SL.GfxElement.prototype.moveTo = function(x,y,duration, callback) {
  duration = duration || 16;
  var moveOrder = new SL.MoveOrder(this, x, y, duration, this.moveOrderCallback.bind(this), callback);
  this._moveQueue.push(moveOrder);
  if (this._currentMove === null) {
    this._runMove();
    // If not already moving, fire start move event
    if (this.getMoveRateX() === 0 && this.getMoveRateY() === 0) {
      this.notify(
        new SL.Event(SL.EventType.ELEMENT_STARTED_MOVING, {element:this})
      );
    }
  }
};

/** @private */
SL.GfxElement.prototype._runMove = function() {
  if (this._moveQueue.size() > 0) {
    this._currentMove = this._moveQueue.pop();
    this._currentMove.start();
    return true;
  }
  // If no additional movement, fire end move event
  if (this.getMoveRateX() === 0 && this.getMoveRateY() === 0) {
    this.notify(
      new SL.Event(SL.EventType.ELEMENT_STOPPED_MOVING, {element:this})
    );
  }
  this._currentMove = null;
  return false;
};

/** @private */
SL.GfxElement.prototype.moveOrderCallback = function() {
  this._currentMove = null;
  if (! this._runMove()){
    if (this._isProcessingNudge) {
      if (SL.Utils.isFunction(this._nudgeDoneCallback)) this._nudgeDoneCallback();
      this._isProcessingNudge = false;
    }
    if (this._isProcessingShake) {
      if (SL.Utils.isFunction(this._shakeDoneCallback)) this._shakeDoneCallback();
      this._isProcessingShake = false;
    }
  }
};

/**
* Clear any queued moveTo instructions.
* Does not effect a currently running moveTo, or any movement rates.
*/
SL.GfxElement.prototype.clearMoveQueue = function() {
  this._moveQueue.clear();
};

/**
* Turn the element "off".
* All movement will cease and element will be hidden.
*/
SL.GfxElement.prototype.turnOff = function() {
  this._moveQueue.clear();
  this._currentMove = null;
  this._xMoveRate = 0;
  this._xMoveFractionalAccumulator = 0;
  this._yMoveRate = 0;
  this._yMoveFractionalAccumulator = 0;
  this.hide();
};

/** Show the element. */
SL.GfxElement.prototype.show = function() {
  this._hidden = false;
  this.setDirty(true);
};

/** Hide the element */
SL.GfxElement.prototype.hide = function() {
  this._hidden = true;
  this.setDirty(true);
};

/** Update the element.  Will update location based on current time/diff.
* @param {number} time The current time.  Not specifically used, but provided for extension.
* @param {number} diff The difference between the previous time and the current time. Use to calculate element's position if it is moving.
* @return {SL.GfxElement} Returns this element if it needs to be redrawn, null otherwise.
*/
SL.GfxElement.prototype.update = function(time,diff) {
  this._updateLocationFromMoveRates(time,diff);
  // Will take precedence over move rate
  this._updateMoveOrder(time,diff);

  if (this._isFlashing) this._updateFlash(time,diff);

  if (this.getX() !== this.getLastX() || this.getY() !== this.getLastY()) {
    this.setDirty(true);
    this.notify(
      new SL.Event(
        SL.EventType.ELEMENT_MOVED,
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
};

/** Updates the elements position using movement rates and the time diff.
* @private
* @param {number} time
* @param {number} diff
*/
SL.GfxElement.prototype._updateLocationFromMoveRates = function(time, diff) {
  var amount,sign,intAmount;

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
};

/** Updates the elements position based on the current moveTo instruction.
* @private
* @param {number} time
* @param {number} diff
*/
SL.GfxElement.prototype._updateMoveOrder = function(time,diff) {
  if (this._currentMove !== null) {
    this._currentMove.update(time,diff);
    this.setDirty(true);
  }
};

/** Clears this element's bounding box. Time parameters are not used, just made available here for extension.
* @param {number} time
* @param {number} diff
*/
SL.GfxElement.prototype.clear = function(time, diff) {
  this.getCanvasContext().clearRect(
    this._lastCollisionBoxX,
    this._lastCollisionBoxY,
    this._lastCollisionBoxWidth,
    this._lastCollisionBoxHeight
  );
};

/** Perform any preRendering steps, return whether the element needs to be rendered.
*/
SL.GfxElement.prototype.preRender = function(time, diff) {
  if (!this.isHidden() && !this._flashHidden && this.isDirty()) return true;
  return false;
};

/**
* The render method should be implemented in subclasses.
* Time parameters provided for extension.
*/
SL.GfxElement.prototype.render = function(time, diff) {
  throw new Error("Not Implemented.");
};


/**
* Provides post-render clean up.
* Time parameters provided for extension.
* @param {number} time
* @param {number} diff
*/
SL.GfxElement.prototype.postRender = function(time, diff) {
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
};

SL.GfxElement.prototype._saveLastCollisionBox = function() {
  this._lastCollisionBoxX = this.getCollisionBoxX();
  this._lastCollisionBoxY = this.getCollisionBoxY();
  this._lastCollisionBoxWidth = this.getCollisionBoxWidth();
  this._lastCollisionBoxHeight = this.getCollisionBoxHeight();
};

/** Check whether this element collidesWith another element.
* Compares the boundaries of this element and the other to check for overlap; if so return true, else return false.
* @param {SL.GfxElement} element
* @return {boolean}
*/
SL.GfxElement.prototype.collidesWith = function(element) {
  var thisX = this.getCollisionBoxX();
  var thatX = element.getCollisionBoxX();
  var thisWidth = this.getCollisionBoxWidth();
  var thatWidth = element.getCollisionBoxWidth();
  var thisY = this.getCollisionBoxY();
  var thatY = element.getCollisionBoxY();
  var thisHeight = this.getCollisionBoxHeight();
  var thatHeight = element.getCollisionBoxHeight();
  var result = thisX < thatX + thatWidth &&
    thisX + thisWidth > thatX &&
    thisY < thatY + thatHeight &&
    thisY + thisHeight > thatY;
  /* Internally, we may need to redraw if one of the elements was recently hidden.
  * However, don't trigger the event if either element is hidden.
  */
  if (result && !this.isHidden() && !element.isHidden()) {
    this.notify(
      new SL.Event(SL.EventType.ELEMENT_COLLISION, {
        element1 : this,
        element2 : element
      })
    );
    // notify the other element of the collision
    element.notify(
      new SL.Event(SL.EventType.ELEMENT_COLLISION, {
        element1 : element,
        element2 : this
      })
    );
  }
  return result;
};

/** Check whether this element intersects a specific point on the screen.
* @param {number} x
* @param {number} y
* @return {boolean}
*/
SL.GfxElement.prototype.collidesWithCoordinates = function(x, y) {
  var result = x >= this.getCollisionBoxX() &&
    x <= this.getCollisionBoxX() + this.getCollisionBoxWidth() &&
    y >= this.getCollisionBoxY() &&
      y <= this.getCollisionBoxY() + this.getCollisionBoxHeight();
  return result;
};

/** Check whether this element intersects an x coordinate.
* @param {number} x
* @return {boolean}
*/
SL.GfxElement.prototype.collidesWithX = function(x) {
  var result = x >= this.getCollisionBoxX() &&
    x <= this.getCollisionBoxX() + this.getCollisionBoxWidth();
  return result;
};

/** Check whether this element intersects an y coordinate.
* @param {number} x
* @return {boolean}
*/
SL.GfxElement.prototype.collidesWithY = function(y) {
  var result = y >= this.getCollisionBoxY() &&
      y <= this.getCollisionBoxY() + this.getCollisionBoxHeight();
  return result;
};

/** Returns the x value of the collision box.  Incorporates screen scale.
* @return {number}
*/
SL.GfxElement.prototype.getCollisionBoxX = function() {
  if (this.hasRotation()) return this.getRotatedScaledX() + SL.GfxElement.AntiAliasCorrection.coordinateOffset;
  return this.getScaledX() + SL.GfxElement.AntiAliasCorrection.coordinateOffset;
};

/** Returns the y value of the collision box.  Incorporates screen scale.
* @return {number}
*/
SL.GfxElement.prototype.getCollisionBoxY = function() {
  if (this.hasRotation()) return this.getRotatedScaledY() + SL.GfxElement.AntiAliasCorrection.coordinateOffset;
  return this.getScaledY() + SL.GfxElement.AntiAliasCorrection.coordinateOffset;
};

/** Returns the width value of the collision box.  Incorporates total scale.
* @return {number}
*/
SL.GfxElement.prototype.getCollisionBoxWidth = function() {
  if (this.hasRotation()) return this.getScaledDiagonalSize() + SL.GfxElement.AntiAliasCorrection.sizeAdjustment;
  return this.getScaledWidth() + SL.GfxElement.AntiAliasCorrection.sizeAdjustment;
};

/** Returns the height value of the collision box.  Incorporates total scale.
* @return {number}
*/
SL.GfxElement.prototype.getCollisionBoxHeight = function() {
  if (this.hasRotation()) return this.getScaledDiagonalSize() + SL.GfxElement.AntiAliasCorrection.sizeAdjustment;
  return this.getScaledHeight() + SL.GfxElement.AntiAliasCorrection.sizeAdjustment;
};

/** Fires events if the mouse event is on this element.<br />
* Events emitted:
* <ul>
*   <li>{@link SL.EventType.MOUSE_ENTER_ELEMENT}</li>
*   <li>{@link SL.EventType.MOUSE_EXIT_ELEMENT}</li>
*   <li>{@link SL.EventType.MOUSE_MOVE_OVER_ELEMENT}</li>
*   <li>{@link SL.EventType.MOUSE_DOWN_ON_ELEMENT}</li>
*   <li>{@link SL.EventType.MOUSE_UP_ON_ELEMENT}</li>
* </ul>
* For these events, data is as follows:
*   <ul>
*     <li>x : mouse event x value</li>
*     <li>y : mouse event y value</li>
*     <li>row : mouse event row value</li>
*     <li>col : mouse event col value</li>
*     <li>element : this element</li>
*   </ul>
* @param {SL.Event}
*/
SL.GfxElement.prototype.handleMouseEvent = function(event) {
  var eventData = this._setupSecondaryEventData(event);
  var secondaryEvents = [];
  // GfxElement will use screen scaled coordinates for comparison;
  // so, don't use final x & y from event, but rather use scaled values
  // TODO: name things better to make them less confusing?
  if (this.collidesWithCoordinates(event.data.viewOriginAdjustedX, event.data.viewOriginAdjustedY)) {
    if (!this.isMouseOver()) {
      secondaryEvents.push(new SL.MouseEvent(
        SL.EventType.MOUSE_ENTER_ELEMENT,
        eventData,
        event.data.time
      ));
    }

    this._mouseIsOver = true;
    var type = null;
    switch(event.type) {
      case SL.EventType.MOUSE_MOVE:
        type = SL.EventType.MOUSE_MOVE_OVER_ELEMENT;
        break;
      case SL.EventType.MOUSE_DOWN:
        type = SL.EventType.MOUSE_DOWN_ON_ELEMENT;
        break;
      case SL.EventType.MOUSE_UP:
        type = SL.EventType.MOUSE_UP_ON_ELEMENT;
        break;
    }
    secondaryEvents.push(new SL.MouseEvent(
      type,
      eventData,
      event.data.time
    ));
  } else {
    if (this.isMouseOver()) {
      secondaryEvents.push(new SL.MouseEvent(
        SL.EventType.MOUSE_EXIT_ELEMENT,
        eventData,
        event.data.time
      ));
      this._mouseIsOver = false;
    }
  }
  for (var i = 0; i < secondaryEvents.length; i++) {
    var secondaryEvent = secondaryEvents[i];
    this.notify(secondaryEvent);
    if (secondaryEvent.endEventPropagation)
      event.endEventPropagation = true;
  }
};

SL.GfxElement.prototype._setupSecondaryEventData = function(event) {
  var eventData = {
      x : event.data.x,
      y : event.data.y,
      viewOriginAdjustedX : event.data.viewOriginAdjustedX,
      viewOriginAdjustedY : event.data.viewOriginAdjustedY,
      rawX : event.data.rawX,
      rawY : event.data.rawY,
      element : this
  };
  return eventData;
};