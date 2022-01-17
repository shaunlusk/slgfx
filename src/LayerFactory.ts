import { Utils } from "@shaunlusk/slcommon";
import { BackgroundLayer } from "./BackgroundLayer";
import { GfxLayer } from "./GfxLayer";
import { ILayer, ILayerProps, Layer } from "./Layer";

export interface ILayerFactory {
  createLayer<T extends ILayer, P extends ILayerProps>(type: string, layerProps: P): T;
}

/** Creates Layers.
* By default, registers functions to create GfxLayer and BackgroundLayer.
* Additional types can be registered by passing in the registeredTypes parameter.
* @constructor
* @param {Object.<string, function>} [registeredTypes={}] An object containing key-value pairs of type name and a function to create the layer type.
*/
export class LayerFactory implements ILayerFactory {
  private _registeredTypes: {[key: string]: (layerProps: ILayerProps) => ILayer};

  constructor (registeredTypes?: {[key: string]: (layerProps: any) => ILayer}) {
    registeredTypes = registeredTypes || {};
    this._registeredTypes = {};
    Object.keys(LayerFactory.DefaultTypes).forEach(key => {
      this._registeredTypes[key] = LayerFactory.DefaultTypes[key];
    });
    Object.keys(registeredTypes).forEach(key => {
      this._registeredTypes[key] = registeredTypes[key];
    });
  }

  /** Creates a layer of a specified type with specified properties.
  * @param {string} type The type of layer to create.
  * @param {Object} layerProps The properties to pass to the layer constructor
  */
  public createLayer<T extends ILayer, P extends ILayerProps>(type: string, layerProps: P): T {
    var layer = null;
    var ctor = this._registeredTypes[type];
    if (ctor && Utils.isFunction(ctor)) {
      layer = ctor(layerProps);
    }
    return layer as T;
  }

  public static DefaultTypes: {[key: string]: (layerProps: ILayerProps) => Layer} = {
    "GfxLayer" : function(props: ILayerProps) {
      return new GfxLayer(props);
    },
    "BackgroundLayer" : function(props: ILayerProps) {
      return new BackgroundLayer(props);
    }
  };

}

