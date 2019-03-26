var GfxLayer = require("./GfxLayer");

/** Background Graphics layer.<br />
* Intended for backgrounds that don't change much.
* Generally, the use of Screen.createLayer("BackgroundLayer") is preferred over creating layer by hand.
* @constructor
* @augments GfxLayer
* @param {Object} props The properties to create this layer with.
* @param {Screen} props.screenContext The parent screen for this layer.
* @param {CanvasContextWrapper} props.canvasContextWrapper The canvasContextWrapper. This layer will draw to the canvas' context, via wrapper's exposed methods.
* @param {int} props.width The width of the layer.  Should match Screen.
* @param {int} props.height The height of the layer.  Should match Screen.
*/
BackgroundLayer = function(props) {
  props = props || {};
  GfxLayer.call(this, props);
};

BackgroundLayer.prototype = new GfxLayer();
BackgroundLayer.prototype.constructor = BackgroundLayer;

/** Update the layer.
* Calls update on each element.
* DOES NOT PERFORM COLLISION CHECKING - USE ONLY WHEN ELEMENTS WON'T BE MOVING ON THEIR OWN.
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
* @override
*/
BackgroundLayer.prototype.update = function(time,diff) {
  var dirtyElement;
  var i;
  for (i = 0; i < this._elements.length; i++) {
      // ensure all elements are redrawn if the layer is dirty
      if (this.isDirty()) this._elements[i].setDirty(true);
      dirtyElement = this._elements[i].update(time,diff);
      if (dirtyElement) {
        this._dirtyElements.push(this._elements[i].getZIndexComparable());
      }
  }
};

module.exports = BackgroundLayer;
