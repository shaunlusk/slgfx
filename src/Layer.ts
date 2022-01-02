import { Utils } from '@shaunlusk/slcommon';
import { ICanvasContextWrapper } from './CanvasContextWrapper';
import { SLGfxMouseEvent } from './SLGfxMouseEvent';

export interface ILayer {
  isDirty(): boolean;
  setDirty(dirty: boolean): void;
  setViewOriginX(viewOriginX: number): void;
  setViewOriginY(viewOriginY: number): void;
  getViewOriginX(): void;
  getViewOriginY(): void;
  getWidth(): void;
  getHeight(): void;
  getCanvasContextWrapper(): ICanvasContextWrapper;
  isImageSmoothingEnabled(): boolean;
  setImageSmoothingEnabled(imageSmoothingEnabled: boolean): void;
  update(time: number, diff: number): void;
  render(time: number, diff: number): void;
  preRender(time: number, diff: number): void;
  postRender(time: number, diff: number): void;
  handleMouseEvent(event: SLGfxMouseEvent): void;
  clearLayer(): void;
  dimLayer(amount: number, steps: number, interval: number): void;
}

export interface ILayerProps {
  width?: number;
  height?: number;
  canvasContextWrapper: ICanvasContextWrapper;
}

/**
* Abstract class for graphical layers on a Screen.<br />
* Existing implementations: {@link BackgroundLayer}, {@link GfxLayer}
* @constructor
* @param {Object} props Configuration properties.
* @param {Screen} props.screenContext The parent screen.
* @param {CanvasContextWrapper} props.canvasContextWrapper The canvasContextWrapper. This layer will draw to the canvas' context, via wrapper's exposed methods.
* @param {number} props.width The width of the layer.  Should match Screen.
* @param {number} props.height The height of the layer.  Should match Screen.
* @see BackgroundLayer
* @see GfxLayer
*/
export abstract class Layer implements ILayer {
  private _width: number;
  private _height: number;
  private _canvasContextWrapper: ICanvasContextWrapper;
  private _dirty: boolean;
  private _pendingViewOriginX?: number;
  private _pendingViewOriginY?: number;

  constructor(props: ILayerProps) {
    this._width = props.width || 320;
    this._height = props.height || 200;
    this._canvasContextWrapper = props.canvasContextWrapper;
    this._dirty = true;
    this._pendingViewOriginX = null;
    this._pendingViewOriginY = null;
  }

  /** Return whether this layer is dirty.  A dirty layer needs to be completely redrawn.
  * @return {boolean}
  */
  public isDirty() { {return this._dirty;} }

  /**
  * Set whether layer is dirty.  If dirty, the layer will be cleared and redrawn during the next render phase.
  * @param {boolean} dirty
  */
  public setDirty(dirty: boolean) {this._dirty = dirty;}

  /** Offset the canvasContextWrapper horizontally by a specified amount.
  * @param {number} viewOriginX The X offset.
  */
  public setViewOriginX(viewOriginX: number) {
    this._pendingViewOriginX = viewOriginX;
    if (this._pendingViewOriginX !== null && this._pendingViewOriginX !== this.getViewOriginX()) this.setDirty(true);
  }

  /** Offset the canvasContextWrapper vertically by a specified amount.
  * @param {number} viewOriginY The Y offset.
  */
  public setViewOriginY(viewOriginY: number) {
    this._pendingViewOriginY = viewOriginY;
    if (this._pendingViewOriginY !== null && this._pendingViewOriginY !== this.getViewOriginY()) this.setDirty(true);
  }

  /** Return the current x offset of the canvasContextWrapper.
  * @return {number} The x offset.
  */
  public getViewOriginX() { {return this._canvasContextWrapper.getViewOriginX();} }

  /** Return the current y offset of the viewport.
  * @return {number} The y offset.
  */
  public getViewOriginY() { {return this._canvasContextWrapper.getViewOriginY();} }


  /** Returns the width of the Layer
  * @returns {number}
  */
  public getWidth() { {return this._width;} }

  /** Returns the height of the Layer
  * @returns {number}
  */
  public getHeight() { {return this._height;} }

  /** Returns the CanvasContextWrapper for this layer.
  * @returns {CanvasContextWrapper}
  */
  public getCanvasContextWrapper() { {return this._canvasContextWrapper;} }

  /** Check if image smoothing is enabled for this layer.
  * @return {bool}
  */
  public isImageSmoothingEnabled() { {return this._canvasContextWrapper.isImageSmoothingEnabled();} }

  /** Turn image smoothing on or off for this layer.
  * @param {bool} imageSmoothingEnabled
  */
  public setImageSmoothingEnabled(imageSmoothingEnabled: boolean) {
    this._canvasContextWrapper.setImageSmoothingEnabled(imageSmoothingEnabled);
    this.setDirty(true);
  }

  /** Update this Layer. <b>Sub-classes MUST implement this method</b>
  * @abstract
 * @param {number} time The current time (milliseconds)
  * @param {number} diff The difference between the last time and the current time  (milliseconds)
  */
  public abstract update(time: number, diff: number): void;

  /** Render this Layer. <b>Sub-classes MUST implement this method</b>
  * @abstract
  * @param {number} time The current time (milliseconds)
  * @param {number} diff The difference between the last time and the current time  (milliseconds)
  */
  public abstract render(time: number, diff: number): void;

  /** Execute prerendering activities.  Sub-classes may override this, but should still call the base method.
  * @param {number} time The current time (milliseconds)
  * @param {number} diff The difference between the last time and the current time  (milliseconds)
  */
  public preRender(time: number, diff: number) {
    if (this.isDirty()) this.getCanvasContextWrapper().clear();
    if (!Utils.isNullOrUndefined(this._pendingViewOriginX)) {
      this.getCanvasContextWrapper().setViewOriginX(this._pendingViewOriginX);
      this._pendingViewOriginX = null;
    }
    if (!Utils.isNullOrUndefined(this._pendingViewOriginY)) {
      this.getCanvasContextWrapper().setViewOriginY(this._pendingViewOriginY);
      this._pendingViewOriginY = null;
    }
  }

  /** Execute postrendering activities.  Sub-classes may override this, but should still call the base method.
  * @param {number} time The current time (milliseconds)
  * @param {number} diff The difference between the last time and the current time  (milliseconds)
  */
  public postRender(time: number, diff: number) {
    this.setDirty(false);
  }

  /** Propagate a mouse event to this Layer. <b>Sub-classes MUST implement this method</b>
  * @abstract
  * @param {SLGfxMouseEvent} event The mouse event
  */
  public abstract handleMouseEvent(event: SLGfxMouseEvent): void;

  /** Clears all contents of this Layer.
  */
  public clearLayer() {
    this._canvasContextWrapper.clearRect(0, 0, this.getWidth(), this.getHeight());
  }

  /** Progressively fade the layer to black.
  * @param {number} amount The percentage to dim the layer; 1 = completely black; 0 = no dim.
  * @param {int} steps The number of stesp to take to reach the fade amount.  More steps = finer progression.
  * @param {int} interval The number of milliseconds to wait between steps.
  */
  public dimLayer(amount: number, steps: number, interval: number) {
    const stepAmount = amount / steps;
    setTimeout(this._dimStep.bind(this, stepAmount, stepAmount, steps, interval), interval);
  }

  /** @private */
  private _dimStep(amount: string, stepAmount: number, steps: number, interval: number) {
    const canvasContext = this.getCanvasContextWrapper();
    canvasContext.clearRect(0, 0, this.getWidth(), this.getHeight());
    canvasContext.setFillStyle(`rgba(0,0,0,${amount})`);
    canvasContext.fillRect(0, 0, this.getWidth(), this.getHeight());
    if (steps > 0) {
      setTimeout(this._dimStep.bind(this, amount + stepAmount, stepAmount, steps - 1, interval), interval);
    }
  }

}

