

/**
* @interface
*/
function ILayerFactory() {};

/** @abstract */
ILayerFactory.prototype.getLayer = function(type, layerProps) {
  throw new Error("getLayer() Not Implemented.");
};

module.exports = ILayerFactory;
