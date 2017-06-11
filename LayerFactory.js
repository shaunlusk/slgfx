var SL = SL || {};

/**
* @interface
*/
SL.ILayerFactory = function() {};

/** abstract */
SL.ILayerFactory.prototype.getLayer = function(parentScreen, type, canvasContextWrapper, props) {
  throw new Error("getLayer() Not Implemented.");
};


SL.LayerFactory = function() {};

SL.LayerFactory.prototype.getLayer = function(parentScreen, type, canvasContextWrapper, props) {
  var layer = null;
  switch (type) {
    case "GfxLayer":
      layer = new SL.GfxLayer(parentScreen, canvasContextWrapper, props);
      break;
    default:
      throw new Error("Unsupported Layer Type: " + type);
  }
  return layer;
};
