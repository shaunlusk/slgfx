var SL = SL || {};

SL.GfxElementSet = function(props) {
  props = props || {};
  SL.GfxElement.call(this, props);
  this._set = props.set;
  // this._activeElementEntry = ;
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
SL.GfxElementSet.prototype.activateElement = function(elementId, direction) {
  direction = direction || this._direction;
  var elementEntry = this._set[elementId][direction];
  this._activateElement(elementEntry, direction);
};

/** @private */
SL.GfxElementSet.prototype._activateElement = function(elementEntry, direction) {
  var activeElementEntry = this._activeElementEntry;
  if (elementEntry.getId() === activeElementEntry.getId() && direction === this._direction) return;
  elementEntry.moveElementTo(activeElementEntry.getCoordinates());
  elementEntry.activate();
  activeElementEntry.deactivate();
  this._activeElement = elementEntry;
  this._direction = direction;
};

SL.GfxElementSet.prototype.setDirection = function(direction) {
  this.activateElement(this._activeElementEntry, direction);
};

SL.GfxElementSetEntry = function(props) {
  this._element = props.element;
  this._offsetX = props.offsetX || 0;
  this._offsetY = props.offsetY || 0;
  this._x = props.x || 0;
  this._y = props.y || 0;
  this._id = props.id;
};

SL.GfxElementSetEntry.prototype.getId = function() {return this._id;};

SL.GfxElementSetEntry.prototype.moveElementTo = function(coordinates) {
  this.setX(coordinates.x);
  this.setY(coordinates.y);
};

SL.GfxElementSetEntry.prototype.setX = function(x) {
  this._x = x;
  this._element.setX(x + this.getOffsetX());
};

SL.GfxElementSetEntry.prototype.setY = function(y) {
  this._y = y;
  this._element.setY(y + this.getOffsetY());
};

SL.GfxElementSetEntry.prototype.getCoordinates = function() {return {x:this.getX(), y:this.getY()};};

SL.GfxElementSetEntry.prototype.activate = function() {
  this._element.show();
};

SL.GfxElementSetEntry.prototype.deactivate = function() {
  this._element.hide();
};

SL.GfxElementSet.createEntityGfxElementSet = function(lpcEntityElementGenerator, img, screenContext, gfxLayer, props) {
  var set = {
    "stand" : {
      north : new SL.GfxElementSetEntry({
        element : lpcEntityElementGenerator.createStandNorthElement(img, screenContext, gfxLayer, props),
        id : "stand"
      }),
      east : new SL.GfxElementSetEntry({
        element : lpcEntityElementGenerator.createStandEastElement(img, screenContext, gfxLayer, props),
        id : "stand"
      }),
      south : new SL.GfxElementSetEntry({
        element : lpcEntityElementGenerator.createStandSouthElement(img, screenContext, gfxLayer, props),
        id : "stand"
      }),
      west : new SL.GfxElementSetEntry({
        element : lpcEntityElementGenerator.createStandWestElement(img, screenContext, gfxLayer, props),
        id : "stand"
      }),
    },
    "castHold" : {
      north : new SL.GfxElementSetEntry({
        element : lpcEntityElementGenerator.createCastHoldNorthElement(img, screenContext, gfxLayer, props),
        id : "castHold"
      }),
      east : new SL.GfxElementSetEntry({
        element : lpcEntityElementGenerator.createCastHoldEastElement(img, screenContext, gfxLayer, props),
        id : "castHold"
      }),
      south : new SL.GfxElementSetEntry({
        element : lpcEntityElementGenerator.createCastHoldSouthElement(img, screenContext, gfxLayer, props),
        id : "castHold"
      }),
      west : new SL.GfxElementSetEntry({
        element : lpcEntityElementGenerator.createCastHoldWestElement(img, screenContext, gfxLayer, props),
        id : "castHold"
      }),
      "castDone" : {
        north : new SL.GfxElementSetEntry({
          element : lpcEntityElementGenerator.createCastDoneNorthElement(img, screenContext, gfxLayer, props),
          id : "castDone"
        }),
        east : new SL.GfxElementSetEntry({
          element : lpcEntityElementGenerator.createCastDoneEastElement(img, screenContext, gfxLayer, props),
          id : "castDone"
        }),
        south : new SL.GfxElementSetEntry({
          element : lpcEntityElementGenerator.createCastDoneSouthElement(img, screenContext, gfxLayer, props),
          id : "castDone"
        }),
        west : new SL.GfxElementSetEntry({
          element : lpcEntityElementGenerator.createCastDoneWestElement(img, screenContext, gfxLayer, props),
          id : "castDone"
        }),
      }
    }
  };


  return new SL.GfxElementSet({
    set : set
  });
};
