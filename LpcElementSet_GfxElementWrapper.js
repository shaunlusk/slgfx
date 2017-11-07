var SL = SL || {};

/** Return whether this element is dirty.
* @return {boolean}
*/
SL.GfxElementSet.prototype.isDirty = function() {
  return this._dirty || this._hasCollision || this._hadCollisionPreviousFrame;
};

/**
* Set whether element is dirty.  If dirty, the element will be cleared and redrawn during the next render phase.
* @param {boolean} dirty
*/
SL.GfxElementSet.prototype.setDirty = function(dirty) {this._dirty = dirty;};

/** Return whether this element is hidden.
* @return {boolean}
*/
SL.GfxElementSet.prototype.isHidden = function() {return this._hidden;};

/**
* Set whether element is hidden.
* @param {boolean} hidden
*/
SL.GfxElementSet.prototype.setHidden = function(hidden) {this._hidden = hidden;};

/** Return whether this element had a collision during the most recent update phase.
* @return {boolean}
*/
SL.GfxElementSet.prototype.hasCollision = function() {return this._hasCollision;};

/**
* Set whether the element has a collision. If a collision has occurred the element will be cleared and redrawn during the next render phase.
* @param {boolean} hidden
*/
SL.GfxElementSet.prototype.setHasCollision = function(hasCollision) {this._hasCollision = hasCollision;};

/**
* Return this element's zIndex.
* @return {number}
*/
SL.GfxElementSet.prototype.getZIndex = function() {return this._zIndex;};

/**
* Set this element's zIndex. Elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).
* @param {number} zIndex
*/
SL.GfxElementSet.prototype.setZIndex = function(zIndex) {
  this._zIndex = zIndex;
  this.setDirty(true);
};

/** Return this element's zindeComparable.
* Used by parent layer to determine rendering order.
* @return {SL.GfxElementSetZIndexComparable}
*/
SL.GfxElementSet.prototype.getZIndexComparable = function() {
  return this._zIndexComparable;
};

/**
* Return this element's parent layer.
* @return {SL.GfxLayer}
*/
SL.GfxElementSet.prototype.getParentLayer = function() {return this._parentLayer;};

/**
* Return the canvas context for this element's parent layer.
* @return {CanvasContext}
*/
SL.GfxElementSet.prototype.getCanvasContext = function() {return this._canvasContext;};

/**
* Return the parent Screen for this element.
* @return {SL.Screen}
*/
SL.GfxElementSet.prototype.getScreenContext = function() {return this._screenContext;};

/**
* Return the horizontal scale of this element's parent screen.
* @return {integer}
*/
SL.GfxElementSet.prototype.getScreenScaleX = function() {return this.getScreenContext().getScaleX();};

/**
* Return the vertical scale of this element's parent screen.
* @return {integer}
*/
SL.GfxElementSet.prototype.getScreenScaleY = function() {return this.getScreenContext().getScaleY();};

/**
* Return the total horizontal scale for this element (screen scale * element scale).
* @return {integer}
*/
SL.GfxElementSet.prototype.getTotalScaleX = function() {return this.getElementScaleX() * this.getScreenContext().getScaleX();};

/**
* Return the total vertical scale for this element (screen scale * element scale).
* @return {integer}
*/
SL.GfxElementSet.prototype.getTotalScaleY = function() {return this.getElementScaleY() * this.getScreenContext().getScaleY();};

/**
* Return the horizontal scale of this element.
* @return {integer}
*/
SL.GfxElementSet.prototype.getElementScaleX = function() {return this._scaleX;};

/**
* Return the vertical scale of this element.
* @return {integer}
*/
SL.GfxElementSet.prototype.getElementScaleY = function() {return this._scaleY;};

/**
* Set the horizontal scale of this element.
* @param {integer} scaleX
*/
SL.GfxElementSet.prototype.setElementScaleX = function(scaleX) {
  this._scaleX = scaleX;
};

/**
* Set the vertical scale of this element.
* @param {integer} scaleY
*/
SL.GfxElementSet.prototype.setElementScaleY = function(scaleY) {this._scaleY = scaleY;};

/**
* Get the x coordinate of this element.
* @return {number}
*/
SL.GfxElementSet.prototype.getX = function() {return this._x;};

/**
* Get the screen x coordinate of this element.
* @return {number}
*/
SL.GfxElementSet.prototype.getScaledX = function() {
  return this.getX() * this.getScreenScaleX();
};

/**
* Get the y coordinate of this element.
* @return {number}
*/
SL.GfxElementSet.prototype.getY = function() {return this._y;};

/**
* Get the screen x coordinate of this element.
* @return {number}
*/
SL.GfxElementSet.prototype.getScaledY = function() {
  return this.getY() * this.getScreenScaleY();
};

/**
* Set the x coordinate of this element.
* @param {number} x
*/
SL.GfxElementSet.prototype.setX = function(x) {
  if (x !== this._x) this.setDirty(true);
  this._x = x;
};

/**
* Set the y coordinate of this element.
* @param {number} y
*/
SL.GfxElementSet.prototype.setY = function(y) {
  if (y !== this._y) this.setDirty(true);
  this._y = y;
};

/**
* Get the x coordinate of this element for the previous frame.
* @return {number}
*/
SL.GfxElementSet.prototype.getLastX = function() {return this._lastX;};

/**
* Get the y coordinate of this element for the previous frame.
* @return {number}
*/
SL.GfxElementSet.prototype.getLastY = function() {return this._lastY;};

/** Override if dimensions can change */
SL.GfxElementSet.prototype.getLastWidth = function() {return this.getWidth();};

/** Override if dimensions can change */
SL.GfxElementSet.prototype.getLastHeight = function() {return this.getHeight();};

/** @private */
SL.GfxElementSet.prototype.setLastX = function(x) {this._lastX = x;};
/** @private */
SL.GfxElementSet.prototype.setLastY = function(y) {this._lastY = y;};

/**
* Return whether the mouse is over this element.
* @return {boolean}
*/
SL.GfxElementSet.prototype.isMouseOver = function() {return this._mouseIsOver;};

/**
* Return this element's width.
* @abstract
* @return {number}
*/
SL.GfxElementSet.prototype.getWidth = function() {return this._width;};

/**
* Return this element's width, incorporating screen and element-local scaling.
* @return {number}
*/
SL.GfxElementSet.prototype.getScaledWidth = function() {return this.getWidth() * this.getTotalScaleX();};

/**
* Return this elements height.
* @abstract
* @return {number}
*/
SL.GfxElementSet.prototype.getHeight = function() {return this._height;};

/**
* Return this element's height, incorporating screen and element-local scaling.
* @return {number}
*/
SL.GfxElementSet.prototype.getScaledHeight = function() {return this.getHeight() * this.getTotalScaleY();};

SL.GfxElementSet.prototype.getUnAdjustedRotation = function() { return this._rotation; };
SL.GfxElementSet.prototype.getBaseRotation = function() { return this._baseRotation; };
SL.GfxElementSet.prototype.getRotation = function() {
  if (this._rotation || this._baseRotation)
  return (this._rotation || 0) + (this._baseRotation || 0);
  return null;
};
SL.GfxElementSet.prototype.getDiagonalSize = function() { return this._diagonalSize; };

SL.GfxElementSet.prototype.setRotation = function(rotation) {
  this._rotation = rotation;
  if (this._rotation === null) {
    if (this.wasRotated()) this.setDirty(true);
    return;
  }
  this._recalculateDiagonalSize();
  this._recalculateRotatedCollisionBox();
  this.setDirty(true);
};
SL.GfxElementSet.prototype.setBaseRotation = function(rotation) {
  this._baseRotation = rotation;
  if (this._baseRotation === null) {
    if (this.wasRotated()) this.setDirty(true);
    return;
  }
  this._recalculateDiagonalSize();
  this._recalculateRotatedCollisionBox();
  this.setDirty(true);
};

SL.GfxElementSet.prototype.wasRotated = function() {return this._wasRotated;};
SL.GfxElementSet.prototype.setWasRotated = function(wasRotated) {
  this._wasRotated = wasRotated;
};
SL.GfxElementSet.prototype.hasRotation = function() {return !(SL.isNullOrUndefined(this.getRotation()) || this.getRotation() === 0);};

SL.GfxElementSet.prototype.getRotatedX = function() {return this._rotatedX;};
SL.GfxElementSet.prototype.getRotatedY = function() {return this._rotatedY;};
SL.GfxElementSet.prototype.getRotatedLastX = function() {return this._rotatedLastX;};
SL.GfxElementSet.prototype.getRotatedLastY = function() {return this._rotatedLastY;};
SL.GfxElementSet.prototype.getLastDiagonalSize = function() {return this._lastDiagonalSize;};
SL.GfxElementSet.prototype.getRotatedScaledX = function() {return this.getRotatedX() * this.getScreenScaleX();};
SL.GfxElementSet.prototype.getRotatedScaledY = function() {return this.getRotatedY() * this.getScreenScaleY();};
SL.GfxElementSet.prototype.getScaledDiagonalSize = function() {
  return this.getDiagonalSize() * (this.getTotalScaleX() + this.getTotalScaleY()) / 2;
};

/** @private */
SL.GfxElementSet.prototype.setRotatedLastX = function(x) {this._rotatedLastX = x;};
/** @private */
SL.GfxElementSet.prototype.setRotatedLastY = function(y) {this._rotatedLastY = y;};
/** @private */
SL.GfxElementSet.prototype.setLastDiagonalSize = function(size) {this._lastDiagonalSize = size;};

SL.GfxElementSet.prototype._recalculateDiagonalSize = function() {
  if (this.getRotation() === null) return;
  // calculate diagonal
  // Note that for any amount of rotation, an expanded bounding box is used
  this._diagonalSize = Math.ceil(Math.sqrt( Math.pow(this.getWidth(), 2) + Math.pow(this.getHeight(), 2)));
};

SL.GfxElementSet.prototype._recalculateRotatedCollisionBox = function() {
  if (this.getRotation() === null) return;
  this._rotatedX = Math.floor(this.getX() - (this.getScaledDiagonalSize() - this.getScaledWidth()) / 2);
  this._rotatedY = Math.floor(this.getY() - (this.getScaledDiagonalSize() - this.getScaledHeight()) / 2);
};

SL.GfxElementSet.prototype.isHorizontallyFlipped = function() {return this._horizontalFlip;};
SL.GfxElementSet.prototype.isVerticallyFlipped = function() {return this._verticalFlip;};

SL.GfxElementSet.prototype.setHorizontallyFlipped = function(flipped) {
  if (this._horizontalFlip !== flipped) this.setDirty(true);
  this._horizontalFlip = flipped;
};
SL.GfxElementSet.prototype.setVerticallyFlipped = function(flipped) {
  if (this._verticalFlip !== flipped) this.setDirty(true);
  this._verticalFlip = flipped;
};

/*
If duration is -1, will flash until turned off.
*/
SL.GfxElementSet.prototype.flash = function(interval, duration, callback) {
  this._flashInterval = interval;
  this._flashDuration = duration;
  this._isFlashing = true;
  this._flashStartTime = -1;
  this._flashElapsed = 0;
  this._flashHidden = false;
  this._flashDoneCallback = callback;
};

SL.GfxElementSet.prototype.isFlashing = function() { return this._isFlashing; };

SL.GfxElementSet.prototype.turnFlashOff = function() {
  this._endFlash();
};

SL.GfxElementSet.prototype._endFlash = function() {
  this._isFlashing = false;
  this._flashStartTime = -1;
  this._flashElapsed = 0;
  this._flashHidden = false;
  if (SL.isFunction(this._flashDoneCallback)) this._flashDoneCallback();
};

SL.GfxElementSet.prototype._updateFlash = function(time,diff) {
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

SL.GfxElementSet.prototype.nudge = function(offsetX, offsetY, decay, interval, intervalDecay, callback) {
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
    if (count > 1000) throw new Error("GfxElementSet.nudge() looped too many times.");
  }
  this.moveTo(this.getX(), this.getY(), interval < 0 ? 0 : interval);
};

SL.GfxElementSet.prototype.shake = function(intensity, intensityDecay, interval, intervalDecay, notToExceedTime, callback) {
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
    if (count > 1000) throw new Error("GfxElementSet.shake() looped too many times.");
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
SL.GfxElementSet.prototype.setMoveRates = function(xMoveRate, yMoveRate) {
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
SL.GfxElementSet.prototype.getMoveRateX = function() {return this._xMoveRate;};

/**
* Return the current y movement rate.
* @return {number}
*/
SL.GfxElementSet.prototype.getMoveRateY = function() {return this._yMoveRate;};

/**
* Move the element to the specified coordinate over the course of specified duration.
* Calls to this method are queued and executed one after the other.
* Note that movement effect created by this method will supercede any movement rates for the given duration.
* @param {number} x The target x coordinate
* @param {number} y The target y coordinate
* @param {number} duration Optional. How long it should take the element to move from its current position to the target position, in milliseconds. Defaults to 16ms.
* @param {function} callback Optional.  The function to call when the move is complete.
*/
SL.GfxElementSet.prototype.moveTo = function(x,y,duration, callback) {
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
SL.GfxElementSet.prototype._runMove = function() {
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
SL.GfxElementSet.prototype.moveOrderCallback = function() {
  this._currentMove = null;
  if (! this._runMove()){
    if (this._isProcessingNudge) {
      if (SL.isFunction(this._nudgeDoneCallback)) this._nudgeDoneCallback();
      this._isProcessingNudge = false;
    }
    if (this._isProcessingShake) {
      if (SL.isFunction(this._shakeDoneCallback)) this._shakeDoneCallback();
      this._isProcessingShake = false;
    }
  }
};

/**
* Clear any queued moveTo instructions.
* Does not effect a currently running moveTo, or any movement rates.
*/
SL.GfxElementSet.prototype.clearMoveQueue = function() {
  this._moveQueue.clear();
};

/**
* Turn the element "off".
* All movement will cease and element will be hidden.
*/
SL.GfxElementSet.prototype.turnOff = function() {
  this._moveQueue.clear();
  this._currentMove = null;
  this._xMoveRate = 0;
  this._xMoveFractionalAccumulator = 0;
  this._yMoveRate = 0;
  this._yMoveFractionalAccumulator = 0;
  this.hide();
};

/** Show the element. */
SL.GfxElementSet.prototype.show = function() {
  this._hidden = false;
  this.setDirty(true);
};

/** Hide the element */
SL.GfxElementSet.prototype.hide = function() {
  this._hidden = true;
  this.setDirty(true);
};

/** Update the element.  Will update location based on current time/diff.
* @param {number} time The current time.  Not specifically used, but provided for extension.
* @param {number} diff The difference between the previous time and the current time. Use to calculate element's position if it is moving.
* @return {SL.GfxElementSet} Returns this element if it needs to be redrawn, null otherwise.
*/
SL.GfxElementSet.prototype.update = function(time,diff) {
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
SL.GfxElementSet.prototype._updateLocationFromMoveRates = function(time, diff) {
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
SL.GfxElementSet.prototype._updateMoveOrder = function(time,diff) {
  if (this._currentMove !== null) {
    this._currentMove.update(time,diff);
    this.setDirty(true);
  }
};

/** Clears this element's bounding box. Time parameters are not used, just made available here for extension.
* @param {number} time
* @param {number} diff
*/
SL.GfxElementSet.prototype.clear = function(time, diff) {
  if (this.wasRotated()) {
    this.getCanvasContext().clearRect(
      this.getRotatedLastX() * this.getScreenScaleX() - 1,
      this.getRotatedLastY() * this.getScreenScaleY() - 1,
      this.getLastDiagonalSize() * this.getTotalScaleX() + 2,
      this.getLastDiagonalSize() * this.getTotalScaleY() + 2 );
  } else {
    this.getCanvasContext().clearRect(
      this.getLastX() * this.getScreenScaleX() - 1,
      this.getLastY() * this.getScreenScaleY() - 1,
      this.getLastWidth() * this.getTotalScaleX() + 2,
      this.getLastHeight() * this.getTotalScaleY() + 2 );
  }
};

/** Perform any preRendering steps, return whether the element needs to be rendered.
*/
SL.GfxElementSet.prototype.preRender = function(time, diff) {
  if (!this.isHidden() && !this._flashHidden && this.isDirty()) return true;
  return false;
};

/**
* The render method should be implemented in subclasses.
* Time parameters provided for extension.
*/
SL.GfxElementSet.prototype.render = function(time, diff) {
  throw new Error("Not Implemented.");
};


/**
* Provides post-render clean up.
* Time parameters provided for extension.
* @param {number} time
* @param {number} diff
*/
SL.GfxElementSet.prototype.postRender = function(time, diff) {
  this.setLastX( this.getX() );
  this.setLastY( this.getY() );

  if (this.hasRotation()) {
    this.setWasRotated(true);
    this.setRotatedLastX( this.getRotatedX() );
    this.setRotatedLastY( this.getRotatedY() );
    this.setLastDiagonalSize( this.getDiagonalSize() );
  }
  else this.setWasRotated(false);

  this.setDirty(false);
  this._hadCollisionPreviousFrame = this.hasCollision();
  this.setHasCollision(false);
};

/** Check whether this element collidesWith another element.
* Compares the boundaries of this element and the other to check for overlap; if so return true, else return false.
* @param {SL.GfxElementSet} element
* @return {boolean}
*/
SL.GfxElementSet.prototype.collidesWith = function(element) {
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
SL.GfxElementSet.prototype.collidesWithCoordinates = function(x, y) {
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
SL.GfxElementSet.prototype.collidesWithX = function(x) {
  var result = x >= this.getCollisionBoxX() &&
    x <= this.getCollisionBoxX() + this.getCollisionBoxWidth();
  return result;
};

/** Check whether this element intersects an y coordinate.
* @param {number} x
* @return {boolean}
*/
SL.GfxElementSet.prototype.collidesWithY = function(y) {
  var result = y >= this.getCollisionBoxY() &&
      y <= this.getCollisionBoxY() + this.getCollisionBoxHeight();
  return result;
};

/** Returns the x value of the collision box.  Incorporates screen scale.
* @return {number}
*/
SL.GfxElementSet.prototype.getCollisionBoxX = function() {
  if (this.hasRotation()) return this.getRotatedScaledX() - 1;
  return this.getScaledX() - 1;
};

/** Returns the y value of the collision box.  Incorporates screen scale.
* @return {number}
*/
SL.GfxElementSet.prototype.getCollisionBoxY = function() {
  if (this.hasRotation()) return this.getRotatedScaledY() - 1;
  return this.getScaledY() - 1;
};

/** Returns the width value of the collision box.  Incorporates total scale.
* @return {number}
*/
SL.GfxElementSet.prototype.getCollisionBoxWidth = function() {
  if (this.hasRotation()) return this.getScaledDiagonalSize() + 2;
  return this.getScaledWidth() + 2;
};

/** Returns the height value of the collision box.  Incorporates total scale.
* @return {number}
*/
SL.GfxElementSet.prototype.getCollisionBoxHeight = function() {
  if (this.hasRotation()) return this.getScaledDiagonalSize() + 2;
  return this.getScaledHeight() + 2;
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
SL.GfxElementSet.prototype.handleMouseEvent = function(event) {
  var eventData = {
      x : event.data.x,
      y : event.data.y,
      row : event.data.row,
      col : event.data.col,
      scaledX : event.data.scaledX,
      scaledY : event.data.scaledY,
      element : this
  };
  if (this.collidesWithCoordinates(event.data.scaledX, event.data.scaledY)) {
    if (!this.isMouseOver()) {
      this.notify(new SL.Event(
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
    var thisevent = new SL.Event(
      type,
      eventData,
      event.data.time
    );
    this.notify(thisevent);
  } else {
    if (this.isMouseOver()) {
      this.notify(new SL.Event(
        SL.EventType.MOUSE_EXIT_ELEMENT,
        eventData,
        event.data.time
      ));
      this._mouseIsOver = false;
    }
  }
};
