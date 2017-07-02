var SL = SL || {};

/** Graphics element that renders text.<br />
* <b>Extends</b> {@link SL.GfxElement}<br />
* @constructor
* @param {SL.Screen} screenContext The parent screenContext
* @param {SL.GfxLayer} parentLayer The parent layer that will draw this element.
* @param {Object} props The properties for this object.
* from SL.GfxElement:
*   <ul>
*     <li>scaleX - integer - Horizontal scale of this element.  Independent of screen scale.</li>
*     <li>scaleY - integer - Vertical scale of this element.  Independent of screen scale.</li>
*     <li>hidden - boolean - Whether to hide this element.</li>
*     <li>x - number - The X coordinate for this element.</li>
*     <li>y - number - The Y coordinate for this element.</li>
*     <li>zIndex - number - The z-index; elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).</li>
*   </ul>
* for SL.TextElement:
* <ul>

* </ul>
* @see SL.GfxElement
*/
SL.TextElement = function(screenContext, parentLayer, props) {
  props = props || {};
  SL.GfxElement.call(this, screenContext, parentLayer, props);
  this._text = props.text || "";
  this._color = props.color || "white";
  this._size = props.size || "12px";
  this._font = props.font || "monospace";
};

SL.TextElement.prototype = new SL.GfxElement();
SL.TextElement.prototype.constructor = SL.TextElement;


SL.GfxElement.prototype.render = function(time, diff) {
  this.getCanvasContext();
};
