var SL = SL || {};

SL.LpcElementSet = function(props) {
  this._direction = SL.LpcElementDirection.SOUTH;
  this._set = props.set;
  this._activeElementEntry = this._set[SL.LpcElementId.STAND][this._direction];
  this._eventManager = props.eventManager || SL.EventManager;
  Object.keys(this._set).foreach(function(actionSet) {
    Object.keys(actionSet).foreach(function(elementEntry) {
      elementEntry.deactivate();
    });
  });
};

/** Set the currently active element.
* @param {SL.LpcElementId} elementId The id of the element to set active
* @param {SL.LpcElementDirection} direction Optional parameter indicating the direction index to use.  If omitted, will use current direction.
*/
SL.LpcElementSet.prototype.activateElement = function(elementId, direction) {
  direction = direction || this._direction;
  var elementEntry = this._set[elementId][direction];
  this._activateElement(elementEntry, direction);
};

/** @private */
SL.LpcElementSet.prototype._activateElement = function(elementEntry, direction) {
  var activeElementEntry = this._activeElementEntry;
  if (elementEntry.getId() === activeElementEntry.getId() && direction === this._direction) return;
  elementEntry.moveElementTo(activeElementEntry.getCoordinates());
  elementEntry.activate();
  activeElementEntry.deactivate();
  this._activeElement = elementEntry;
  this._direction = direction;
};

SL.LpcElementSet.prototype.setDirection = function(direction) {
  this.activateElement(this._activeElementEntry, direction);
};

SL.LpcElementSetEntry = function(props) {
  this._element = props.element;
  this._offsetX = props.offsetX || 0;
  this._offsetY = props.offsetY || 0;
  this._x = props.x || 0;
  this._y = props.y || 0;
  this._id = props.id;
};

SL.LpcElementSetEntry.prototype.getId = function() {return this._id;};

SL.LpcElementSetEntry.prototype.moveElementTo = function(coordinates) {
  this.setX(coordinates.x);
  this.setY(coordinates.y);
};

SL.LpcElementSetEntry.prototype.setX = function(x) {
  this._x = x;
  this._element.setX(x + this.getOffsetX());
};

SL.LpcElementSetEntry.prototype.setY = function(y) {
  this._y = y;
  this._element.setY(y + this.getOffsetY());
};

SL.LpcElementSetEntry.prototype.getCoordinates = function() {return {x:this.getX(), y:this.getY()};};

SL.LpcElementSetEntry.prototype.activate = function() {
  this._element.show();
};

SL.LpcElementSetEntry.prototype.deactivate = function() {
  this._element.hide();
};

SL.LpcElementSet.createEntityLpcElementSet = function(lpcEntityElementGenerator, img, screenContext, gfxLayer, props) {
  var set = {
    "stand" : {
      north : new SL.LpcElementSetEntry({
        element : lpcEntityElementGenerator.createStandNorthElement(img, screenContext, gfxLayer, props),
        id : "stand"
      }),
      east : new SL.LpcElementSetEntry({
        element : lpcEntityElementGenerator.createStandEastElement(img, screenContext, gfxLayer, props),
        id : "stand"
      }),
      south : new SL.LpcElementSetEntry({
        element : lpcEntityElementGenerator.createStandSouthElement(img, screenContext, gfxLayer, props),
        id : "stand"
      }),
      west : new SL.LpcElementSetEntry({
        element : lpcEntityElementGenerator.createStandWestElement(img, screenContext, gfxLayer, props),
        id : "stand"
      }),
    },
    "castHold" : {
      north : new SL.LpcElementSetEntry({
        element : lpcEntityElementGenerator.createCastHoldNorthElement(img, screenContext, gfxLayer, props),
        id : "castHold"
      }),
      east : new SL.LpcElementSetEntry({
        element : lpcEntityElementGenerator.createCastHoldEastElement(img, screenContext, gfxLayer, props),
        id : "castHold"
      }),
      south : new SL.LpcElementSetEntry({
        element : lpcEntityElementGenerator.createCastHoldSouthElement(img, screenContext, gfxLayer, props),
        id : "castHold"
      }),
      west : new SL.LpcElementSetEntry({
        element : lpcEntityElementGenerator.createCastHoldWestElement(img, screenContext, gfxLayer, props),
        id : "castHold"
      }),
      "castDone" : {
        north : new SL.LpcElementSetEntry({
          element : lpcEntityElementGenerator.createCastDoneNorthElement(img, screenContext, gfxLayer, props),
          id : "castDone"
        }),
        east : new SL.LpcElementSetEntry({
          element : lpcEntityElementGenerator.createCastDoneEastElement(img, screenContext, gfxLayer, props),
          id : "castDone"
        }),
        south : new SL.LpcElementSetEntry({
          element : lpcEntityElementGenerator.createCastDoneSouthElement(img, screenContext, gfxLayer, props),
          id : "castDone"
        }),
        west : new SL.LpcElementSetEntry({
          element : lpcEntityElementGenerator.createCastDoneWestElement(img, screenContext, gfxLayer, props),
          id : "castDone"
        }),
      }
    }
  };


  return new SL.LpcElementSet({
    set : set
  });
};
