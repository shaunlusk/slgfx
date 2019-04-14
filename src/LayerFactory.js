var Utils = require('./Utils');
var GfxLayer = require('./GfxLayer');
var BackgroundLayer = require('./BackgroundLayer');

/** Creates Layers.
* By default, registers functions to create GfxLayer and BackgroundLayer.
* Additional types can be registered by passing in the registeredTypes parameter.
* @constructor
* @param {Object.<string, function>} [registeredTypes={}] An object containing key-value pairs of type name and a function to create the layer type.
*/
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

/** Creates a layer of a specified type with specified properties.
* @param {string} type The type of layer to create.
* @param {Object} layerProps The properties to pass to the l
*/
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
