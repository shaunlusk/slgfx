var SL = SL || {};

/** Background Graphics layer.<br />
* Intended for backgrounds that don't change much.
* Extends {@link SL.Layer}<br />
* Generally, the use of SL.Screen.createLayer("BackgroundLayer") is preferred over creating layer by hand.
* @constructor
* @param {SL.Screen} screenContext The parent screen for this layer.
* @param {CanvasContextWrapper} canvasContextWrapper The canvasContextWrapper. This layer will draw to the canvas' context, via wrapper's exposed methods.
* @param {Object} props The properties to create this layer with. <br />
* (Inherited from {@link SL.Layer Layer}:)
* @param {int} props.width The width of the layer.  Should match Screen. <br />
* @param {int} props.height The height of the layer.  Should match Screen. <br />
*/
SL.BackgroundLayer = function(screenContext, canvasContextWrapper, props) {
  props = props || {};
  SL.GfxLayer.call(this, screenContext, canvasContextWrapper, props);
};

SL.BackgroundLayer.prototype = new SL.GfxLayer();
SL.BackgroundLayer.prototype.constructor = SL.BackgroundLayer;

/** Update the layer.
* Calls update on each element.
* DOES NOT PERFORM COLLISION CHECKING - USE ONLY WHEN ELEMENTS WON'T BE MOVING ON THEIR OWN.
* @param {number} time The current time (milliseconds)
* @param {number} diff The difference between the last time and the current time  (milliseconds)
* @override
*/
SL.BackgroundLayer.prototype.update = function(time,diff) {
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
