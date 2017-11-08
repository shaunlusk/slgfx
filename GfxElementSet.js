var SL = SL || {};

SL.GfxElementSet = function(props) {
  props = props || {};
  SL.GfxElement.call(this, props);
  this._set = props.set;
  this._activeElement = this._set[Object.keys(this._set)[0]];
  // this._activeElementEntry = ;
  Object.keys(this._set).foreach(function(actionSet) {
    Object.keys(actionSet).foreach(function(elementEntry) {
      elementEntry.deactivate();
    });
  });
};

/** Set the currently active element.
* @param {SL.LpcElementId} elementId The id of the element to set active
*/
SL.GfxElementSet.prototype.activateElement = function(elementId) {
  var elementEntry = this._set[elementId];
  this._activateElement(elementEntry);
};

/** @private */
SL.GfxElementSet.prototype._activateElement = function(elementEntry) {
  var activeElementEntry = this._activeElementEntry;
  if (elementEntry.getId() === activeElementEntry.getId()) return;
  elementEntry.moveElementTo(activeElementEntry.getCoordinates());
  elementEntry.activate();
  activeElementEntry.deactivate();
  this._activeElement = elementEntry;
  this._direction = direction;
};
