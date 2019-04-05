var UniquePriorityQueue = require("slcommon/src/UniquePriorityQueue");
var Utils = require("slcommon/src/Utils");
var Event = require("slcommon/src/Event");
var EventType = require("../src/EventType");
var Layer = require("./Layer");

/** Graphics layer.
* Generally, the use of Screen.createLayer("GfxLayer") is preferred over creating layer by hand.
* @constructor
* @augments Layer
* @param {Object} props The properties to create this layer with. <br />
* @param {Screen} props.screenContext The parent screen for this layer.
* @param {CanvasContextWrapper} props.canvasContextWrapper The canvasContextWrapper. This layer will draw to the canvas' context, via wrapper's exposed methods.
* @param {number} props.width The width of the layer.  Should match Screen.
* @param {number} props.height The height of the layer.  Should match Screen.
*/
function GfxLayer(props) {
  props = props || {};
  Layer.call(this, props);
  this._elements = [];
  this._dirtyElements = new UniquePriorityQueue();
  this._dirtyElements.setInvertPriority(false);
  this._removedElements = {};
  this._zIndexCounter = 0;
  // If "removeAllElements()" was called, this flag allows cleanup to do so more efficiently.
  this._allElementsRemoved = false;
};

GfxLayer.prototype = new Layer();
GfxLayer.prototype.constructor = GfxLayer;

/** Add a GfxElement to this layer.
* @param {GfxElement} element
*/
GfxLayer.prototype.addElement = function(element) {
  this._elements.push(element);

  // give a natural ordering to elements added with no specific zIndex
  // prevent render order swapping and element "switching" places
  if (element.getZIndex() === -1) {
    element.setZIndex(this._zIndexCounter++);
  }
};

/** Remove an element from the layer.
* @param {int} id The id of the element to remove
* @return {GfxElement} The removed element, if found.
*/
GfxLayer.prototype.removeElementById = function(id) {
  var idx = Utils.linSearch(this._elements, id, function(element,value){return element.getId() === value;});
  if (idx > -1) {
    return this._removeElementByIndex(idx);
  }
  return null;
};

/** Remove an element from the layer.
* @param {GfxElement} element The element to remove
* @return {GfxElement} The removed element, if found.
*/
GfxLayer.prototype.removeElement = function(element) {
  return this.removeElementById(element.getId());
};

/** Does not bounds check.
* @private
*/
GfxLayer.prototype._removeElementByIndex = function(idx) {
  this._removedElements[this._elements[idx].getId()] = this._elements[idx];
  var elem = this._elements[idx];
  // ensure it gets cleared
  elem.setDirty(true);
  elem.setHidden(true);
  this._dirtyElements.push(elem.getZIndexComparable());
  return elem;
};

/** Remove all elements from the layer.
*/
GfxLayer.prototype.removeAllElements = function() {
  for (var i = 0; i < this._elements.length; i++) {
    this._removeElementByIndex(i);
  }
  this._allElementsRemoved = true;
};

/** Update the layer.
* Calls update on each element belonging to this layer.
* Checks for elements colliding with the layer boundary and emits events accordingly (event emitted from the elements themselves):
* The ELEMENT_HIT_<X> events will send the following properties in the data for the events:
* <ul>
* <li>element : The element that hit the border</li>
* <li>layer : This layer</li>
* </ul>
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
* @emits EventType.ELEMENT_HIT_LEFT_EDGE
* @emits EventType.ELEMENT_HIT_RIGHT_EDGE
* @emits EventType.ELEMENT_HIT_TOP_EDGE
* @emits EventType.ELEMENT_HIT_BOTTOM_EDGE
*/
GfxLayer.prototype.update = function(time,diff) {
  var dirtyElement;
  var i;
  for (i = 0; i < this._elements.length; i++) {
      // ensure all elements are redrawn if the layer is dirty
      if (this.isDirty()) this._elements[i].setDirty(true);
      dirtyElement = this._elements[i].update(time,diff);
      if (dirtyElement) {
        this._dirtyElements.push(this._elements[i].getZIndexComparable());
      }
      this._checkBorderCollision(this._elements[i], time);
  }

  this._handleCollisions();
};

/** @private */
GfxLayer.prototype._checkBorderCollision = function(element,time) {
  if (element.getCollisionBoxX() <= 0) {
    element.notify(new Event(EventType.ELEMENT_HIT_LEFT_EDGE, {layer:this, element:element}, time));
  }
  if (element.getCollisionBoxX() + element.getCollisionBoxWidth() > this.getWidth()) {
    element.notify(new Event(EventType.ELEMENT_HIT_RIGHT_EDGE, {layer:this, element:element}, time));
  }
  if (element.getCollisionBoxY() <= 0) {
    element.notify(new Event(EventType.ELEMENT_HIT_TOP_EDGE, {layer:this, element:element}, time));
  }
  if (element.getCollisionBoxY() + element.getCollisionBoxHeight() > this.getHeight()) {
    element.notify(new Event(EventType.ELEMENT_HIT_BOTTOM_EDGE, {layer:this, element:element}, time));
  }
};

/** @private */
GfxLayer.prototype._handleCollisions = function() {
  var element1, element2, j;
  for (var i = 0; i < this._elements.length - 1; i++) {
    element1 = this._elements[i];
    for (var j = i+1; j < this._elements.length; j++) {
      element2 = this._elements[j];

      this._collisionCheckElementsIfNeeded(element1, element2);
    }
  }
};

/** @private */
GfxLayer.prototype._collisionCheckElementsIfNeeded = function(element1, element2) {
  if (element1.collidesWith(element2)) {
    this._updateElementOnCollision(element1);
    this._updateElementOnCollision(element2);
  }
};

/** @private */
GfxLayer.prototype._updateElementOnCollision = function(element) {
  element.setHasCollision(true);
  element.setDirty(true);
  this._dirtyElements.push(element.getZIndexComparable());
};

/** Execute prerendering activities.
* @override
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
*/
GfxLayer.prototype.prerender = function(time,diff) {
  var i;
  Layer.prototype.prerender.call(this,time,diff);
  // layer will have been completely cleared if dirty, so no need to clear individual elements
  if (!this.isDirty()) {
    for (i = 0; i < this._dirtyElements.size(); i++) {
      this._dirtyElements.getByIndex(i).getElement().clear(time,diff);
    }
  }
};

/** Render the dirty elements on this layer.
* Calls clear for all dirty elements first, then calls render on each.
* Time and diff parameters are not directly used, they are made available for extension purposes, and passed on to clear and render for the same.
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
*/
GfxLayer.prototype.render = function(time,diff) {
  while (this._dirtyElements.peek()) {
    var element = this._dirtyElements.pop().getElement();
    var doRender = element.preRender(time,diff);
    if (doRender) element.render(time,diff);
    element.postRender(time,diff);
  }

  this._cleanUp();
};

/** @private */
GfxLayer.prototype._cleanUp = function() {
  if (this._allElementsRemoved) {
    this._elements = [];
    this._allElementsRemoved = false;
  } else {
    Object.keys(this._removedElements).forEach(function(elementId) {
      elementId = parseInt(elementId);
      var idx = Utils.linSearch(this._elements, elementId, function(element,value){return element.getId() === value;});
      this._elements.splice(idx,1);
    }.bind(this));
  }

  this._removedElements = {};
  this._dirtyElements.clear();
};

/** Propagate a mouse event to each of this layers elements.
* @param {Event} event
*/
GfxLayer.prototype.handleMouseEvent = function(event) {
  for (var i = 0; i < this._elements.length; i++) {
    this._elements[i].handleMouseEvent(event);
  }
};

module.exports = GfxLayer;
