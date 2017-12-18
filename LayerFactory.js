var SL = SL || {};

/**
* @interface
*/
SL.ILayerFactory = function() {};

/** abstract */
SL.ILayerFactory.prototype.getLayer = function(parentScreen, type, canvasContextWrapper, props) {
  throw new Error("getLayer() Not Implemented.");
};

SL.LayerFactory = function(registeredTypes) {
  registeredTypes = registeredTypes || {};
  this._registeredTypes = {};
  Object.keys(SL.LayerFactory.DefaultTypes).forEach(function(key) {
    this._registeredTypes[key] = SL.LayerFactory.DefaultTypes[key];
  }.bind(this));
  Object.keys(registeredTypes).forEach(function(key) {
    this._registeredTypes[key] = registeredTypes[key];
  }.bind(this));
};

SL.LayerFactory.prototype.getLayer = function(parentScreen, type, canvasContextWrapper, props) {
  var layer = null;
  var ctor = this._registeredTypes[type];
  if (ctor && SL.isFunction(ctor)) {
    layer = ctor(parentScreen, canvasContextWrapper, props);
  }
  return layer;
};

SL.LayerFactory.DefaultTypes = {
  "GfxLayer" : function(parentScreen, canvasContextWrapper, props) {
    return new SL.GfxLayer(parentScreen, canvasContextWrapper, props);
  },
  "BackgroundLayer" : function(parentScreen, canvasContextWrapper, props) {
    return new SL.BackgroundLayer(parentScreen, canvasContextWrapper, props);
  }
};
