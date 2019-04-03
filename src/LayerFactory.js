var Utils = require('./Utils');
var GfxLayer = require('./GfxLayer');
var BackgroundLayer = require('./BackgroundLayer');

function LayerFactory(registeredTypes) {
  registeredTypes = registeredTypes || {};
  this._registeredTypes = {};
  Object.keys(LayerFactory.DefaultTypes).forEach(function(key) {
    this._registeredTypes[key] = LayerFactory.DefaultTypes[key];
  }.bind(this));
  Object.keys(registeredTypes).forEach(function(key) {
    this._registeredTypes[key] = registeredTypes[key];
  }.bind(this));
};

LayerFactory.prototype.getLayer = function(type, layerProps) {
  var layer = null;
  var ctor = this._registeredTypes[type];
  if (ctor && Utils.isFunction(ctor)) {
    layer = ctor(layerProps);
  }
  return layer;
};

LayerFactory.DefaultTypes = {
  "GfxLayer" : function(props) {
    return new GfxLayer(props);
  },
  "BackgroundLayer" : function(props) {
    return new BackgroundLayer(props);
  }
};

module.exports = LayerFactory;
