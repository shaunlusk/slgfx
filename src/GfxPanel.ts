import { Event, EventManager, Utils } from '@shaunlusk/slcommon';
import { CanvasContextWrapper } from './CanvasContextWrapper';
import { EventType } from './EventType';
import { ILayer, Layer } from './Layer';
import { ILayerFactory, LayerFactory } from './LayerFactory';
import { MouseEventData, SLGfxMouseEvent } from './SLGfxMouseEvent';

export interface IGfxPanel {
  setViewOriginX(viewOriginX: number): void;
  setViewOriginY(viewOriginY: number): void;
  getViewOriginX(): void;
  getViewOriginY(): void;
  addEventListenerToDocument(event: EventType, listener: (event: any) => void): void;
  setBackgroundColor(color: string): void;
  getBackgroundColor(): string;
  setBorderColor(color: string): void;
  getBorderColor(): string;
  setBorderSize(size: string | number): void;
  getBorderSize(): string;
  getBorderTopSize(): string;
  getBorderLeftSize(): string;
  getBorderRightSize(): string;
  getBorderBottomSize(): string;
  getWidth(): number;
  getHeight(): number;
  getScaleX(): number;
  getScaleY(): number;
  getMouseX(): number;
  getMouseY(): number;
  isImageSmoothingEnabled(): boolean;
  setImageSmoothingEnabled(imageSmoothingEnabled: boolean): void;
  createLayer(type: string, props: any): void;
  addLayer(layer: any): void;
  getLayers(): ILayer[];
  setPaused(boolean: any): void;
  onNextFrameBegin(callback: () => void): void;
  onNextFrameEnd(callback: () => void): void;
  isPaused(): boolean;
  render(time: number): void;
  getXFromMouseEvent(e: MouseEvent): number;
  getYFromMouseEvent(e: MouseEvent): number;
  getUnScaledX(x: number): number;
  getUnScaledY(y: number): number;
  getViewOriginAdjustedX(x: number): number;
  getViewOriginAdjustedY(y: number): number;
  setBorder(width: any, style: any, color: any): void;
  addEventListener(eventType: string, callback: (ev: Event) => void, id: string): string;
  on(eventType: EventType, callback: (ev: Event) => void, id: string): string;
  removeEventListener(eventListenerId: string): void;
  clearEventListeners(eventType: EventType): void;
  notify(event: Event): void;
  notify(eventType: string, data: any, time: number): void;
  notify(eventOrEventType: Event | string, data: any, time: number): void;
}

export interface IGfxPanelProps {
  targetElement: HTMLElement; 
  layerFactory?: ILayerFactory; 
  scaleX?: number; 
  scaleY?: number; 
  width?: any; 
  height?: any; 
  fpsElement?: HTMLElement; 
  imageSmoothingEnabled?: boolean; 
  useMouseMoveEvents?: boolean;
  backgroundColor?: string; 
  borderColor?: string; 
  borderSize?: number | string; 
  eventManager?: EventManager; 
  requestAnimationFrame?: () => void; 
  document?: Document;
}

/** The Panel is the overriding container for Graphics components.
* The panel orchestrates updating and rendering its layers, propagates
* mouse events down to the layers, and notifies event listeners when events occur.
* @constructor
* @param {Object} props Properties
* @param {HTMLElement} props.targetElement The target HTMLElement into which the screen and its layers will be built.
* @param {LayerFactory} [props.layerFactory=LayerFactory] The layer factory to use to create layers.  Defaults to LayerFactory.
* @param {int} [props.scaleX=1] The horizontal scale of the screen.
* @param {int} [props.scaleY=1] The vertical scale of the screen.
* @param {int} [props.width=800] The width of the screen.
* @param {int} [props.height=600] The height of the screen.
* @param {HTMLElement} [props.fpsElement] Optional. An HTMLElement to write Frames-per-second information to.
* @param {boolean} [props.imageSmoothingEnabled=false] Whether to use image smoothing on child canvases.
* @param {boolean} [props.useMouseMoveEvents=true] Whether to listen for mouseevents on this screen.
* @param {string} [props.backgroundColor=black] Background color of the screen. Any valid CSS color string.
* @param {string} [props.borderColor=grey] Border color of the screen. Any valid CSS color string.
* @param {number|string} [props.borderSize=1] The size of the border. If a number
* is provided, this will be interpretted as pixels, and a uniform border width will be set.
* If a string is provided it will be interpretted as a CSS string, e.g. "10px 0px 10px 0px";
* @param {function} [props.requestAnimationFrame=window.requestAnimationFrame] A function that regulates render rate.  Uses window.requestAnimationFrame by default.
*/
export class GfxPanel implements IGfxPanel {
  private _targetElement: HTMLElement;
  private _layerFactory: ILayerFactory;
  private _scaleX: number;
  private _scaleY: number;
  private _width: number;
  private _height: number;
  private _fpsElem?: HTMLElement;
  private _imageSmoothingEnabled: boolean;
  private _last: number;
  private _mouseX: number;
  private _mouseY: number;
  private _mouseMoved: boolean;
  private _paused: boolean;
  private _unpaused: boolean;
  private _useMouseMoveEvents: boolean;

  private _backgroundColor: string;
  private _borderColor: string;
  private _borderSize: string;

  private _fpsMonitorArray: number[];
  private _fpsMonitorIndex: number;

  private _viewOriginX: number;
  private _viewOriginY: number;
  private _pendingViewOriginX?: number;
  private _pendingViewOriginY?: number;
  private _layers: Layer[];

  private _requestAnimationFrame
  private _document: Document;
  private _eventManager: EventManager;

  private _tabNotVisible: boolean;

  constructor(props: IGfxPanelProps) {
    this._targetElement = props.targetElement;
    this._layerFactory = props.layerFactory || new LayerFactory();
    this._scaleX = props.scaleX || 1;
    this._scaleY = props.scaleY || 1;
    this._width = (props.width || 640) * this._scaleX;
    this._height = (props.height || 480) * this._scaleY;
    this._fpsElem = props.fpsElement || null;
    this._imageSmoothingEnabled = props.imageSmoothingEnabled || false;
    this._last = 0;
    this._mouseX = -1;
    this._mouseY = -1;
    this._mouseMoved = false;
    this._paused = false;
    this._unpaused = false;
    this._useMouseMoveEvents = Utils.isNullOrUndefined(props.useMouseMoveEvents) ? true : props.useMouseMoveEvents;

    this._backgroundColor = props.backgroundColor || "black";
    this._borderColor = props.borderColor || "grey";
    this._setBorderSize(props.borderSize || 1);

    this._fpsMonitorArray = [];
    this._fpsMonitorIndex = 0;

    this._viewOriginX = 0;
    this._viewOriginY = 0;
    this._pendingViewOriginX = null;
    this._pendingViewOriginY = null;
    this._layers = [];

    this._eventManager = props.eventManager || new EventManager();
    this._document = props.document || document;
    this._requestAnimationFrame = props.requestAnimationFrame || (window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : () => {});
    this._prepareDiv();
    this._setupEventListeners();
  }

  private _setBorderSize(border: number | string) {
    if (typeof border === "number") {
      this._borderSize = border + "px";
    } else {
      this._borderSize = border;
    }
  }

  /** Offset child layers horizontally by a specified amount.
  * @param {number} viewOriginX The x coordinate for the offset.
  */
  public setViewOriginX(viewOriginX: number) {
    this._pendingViewOriginX = viewOriginX;
    if (this._pendingViewOriginX !== null && this._pendingViewOriginX !== this.getViewOriginX()) {
      this.getLayers().forEach(function(layer: { setViewOriginX: (arg0: any) => void; }) {
        layer.setViewOriginX(viewOriginX);
      });
    }
  }

  /** Offset child layers vertically by a specified amount.
  * @param {number} viewOriginY The y coordinate for the offset.
  */
  public setViewOriginY(viewOriginY: number) {
    this._pendingViewOriginY = viewOriginY;
    if (this._pendingViewOriginY !== null && this._pendingViewOriginY !== this.getViewOriginY()) {
      this.getLayers().forEach(function(layer: { setViewOriginY: (arg0: any) => void; }) {
        layer.setViewOriginY(viewOriginY);
      });
    }
  }

  /** Get the current horizontal layer offset
  * @return {number}
  */
  public getViewOriginX() {return this._viewOriginX;}

  /** Get the current vertical layer offset
  * @return {number}
  */
  public getViewOriginY() {return this._viewOriginY;}

  /** @private */
  private getPendingViewOriginX() {return this._pendingViewOriginX;}
  /** @private */
  private getPendingViewOriginY() {return this._pendingViewOriginY;}


  /** @private */
  private _prepareDiv() {
    this._targetElement.style.width = this._width.toString();
    this._targetElement.style.height = this._height.toString();
    this._targetElement.style.backgroundColor = this._backgroundColor;
    this._targetElement.style.border = this._borderSize + " solid " + this._borderColor;
  }

  /** @private */
  private _setupEventListeners() {
    this._targetElement.addEventListener("mouseup",this._handleMouseEvent.bind(this), true);
    this._targetElement.addEventListener("mousedown",this._handleMouseEvent.bind(this), true);
    if (this._useMouseMoveEvents) this._targetElement.addEventListener("mousemove",this.handleMouseMoveEvent.bind(this), true);
    this._document.addEventListener("visibilitychange", this._handleVisibilityChange.bind(this), false);
  }

  /** @private */
  private _handleVisibilityChange() {
    this._tabNotVisible = this._document.hidden;
    if (!this._tabNotVisible && !this._paused) {
      this._unpaused = true;
      this._requestAnimationFrame(this.render.bind(this));
    }
  }

  /** Add an event listener to the document.
  * @param {string} event The type of event.
  * @param {Function} listener The function to call when the event occurs.
  */
  public addEventListenerToDocument(event: EventType, listener: (event: any) => void) {
    this._document.addEventListener(event, listener);
  }

  /** Set the background color.
  * @param {string} color Any valid CSS color string.
  */
  public setBackgroundColor(color: string) {
    this._backgroundColor = color;
    this._targetElement.style.backgroundColor = color;
  }

  /** Return the current backgroundColor.
  * @returns {string}
  */
  public getBackgroundColor() {
    return this._backgroundColor;
  }

  /** Set the border color.
  * @param {string} color Any valid CSS color string.
  */
  public setBorderColor(color: string) {
    this._borderColor = color;
    this._targetElement.style.borderColor = color;
  }

  /** Return the current border color.
  * @returns {string}
  */
  public getBorderColor() {
    return this._borderColor;
  }

  /** Set the border size.
  * @param {int|string} size The size for the border.  If a number
  * is provided, this will be interpretted as pixels, and a uniform border width will be set.
  * If a string is provided it will be interpretted as a CSS string, e.g. "10px 0px 10px 0px";
  */
  public setBorderSize(size: number | string) {
    this._setBorderSize(size)
    this._targetElement.style.borderWidth = this._borderSize;
  }

  /** Return the current border size.
  * @returns {int}
  */
  public getBorderSize() {
    return this._targetElement.style.borderWidth;
  }

  /** Return the current top border size.
  * @returns {int}
  */
  public getBorderTopSize() {
    return this._targetElement.style.borderTopWidth;
  }

  /** Return the current left border size.
  * @returns {int}
  */
  public getBorderLeftSize() {
    return this._targetElement.style.borderLeftWidth;
  }

  /** Return the current right border size.
  * @returns {int}
  */
  public getBorderRightSize() {
    return this._targetElement.style.borderRightWidth;
  }

  /** Return the current bottom border size.
  * @returns {int}
  */
  public getBorderBottomSize() {
    return this._targetElement.style.borderBottomWidth;
  }

  /** Return the width.
  * @returns {int}
  */
  public getWidth() {return this._width;}

  /** Return the height.
  * @returns {int}
  */
  public getHeight() {return this._height;}

  /** Return the x-scale.
  * @returns {int}
  */
  public getScaleX() {return this._scaleX;}

  /** Return the y-scale.
  * @returns {int}
  */
  public getScaleY() {return this._scaleY;}

  /** Return the current x coordinate of the mouse.
  * @returns {int}
  */
  public getMouseX() {return this._mouseX;}

  /** Return the current y coordinate of the mouse.
  * @returns {int}
  */
  public getMouseY() {return this._mouseY;}

  /** Return whether image smoothing is enabled on this screent.
  * @return {boolean}
  */
  public isImageSmoothingEnabled() {return this._imageSmoothingEnabled;}

  /** Turn image smoothing on or off for this layer.
  * @param {bool} imageSmoothingEnabled
  */
  public setImageSmoothingEnabled(imageSmoothingEnabled: boolean) {this._imageSmoothingEnabled = imageSmoothingEnabled;}

  /** Create a new {@link Layer} and add it to this screen.  Layers will be rendered in FIFO order,
  * so layers added later will be drawn on top of layers added earlier.
  * @param {string} type The type of layer to add - either "BackgroundLayer" or "GfxLayer"
  * @see Layer
  */
  public createLayer(type: string, props?: any) {
    props = props || {};
    var canvas = this.createCanvasForLayer();
    var canvasContextWrapper = this.createCanvasContextWrapper(canvas);
    var layerProps = {...props};
    layerProps.width = layerProps.width || this.getWidth();
    layerProps.height = layerProps.height || this.getHeight();
    layerProps.canvasContextWrapper = canvasContextWrapper;

    var layer = this._layerFactory.createLayer(type, layerProps);

    this.addLayer(layer);
    return layer;
  }

  /** @private */
  private createCanvasForLayer(): HTMLCanvasElement {
    var canvas = this._document.createElement("CANVAS") as HTMLCanvasElement;
    this._targetElement.appendChild(canvas);
    canvas.width = this._width;
    canvas.height = this._height;
    canvas.style.position = "absolute";
    return canvas;
  }

  /** @private */
  private createCanvasContextWrapper(canvas: HTMLCanvasElement) {
    return new CanvasContextWrapper({
      canvasContext: canvas.getContext("2d"),
      imageSmoothingEnabled: this._imageSmoothingEnabled,
      width: this._width,
      height: this._height
    });
  }

  /** Add a new  {@link Layer} to this screen.  The preferred method of adding layers
  * is via the createLayer() method, but this will also work.
  * Layers will be rendered in FIFO order,
  * so layers added later will be drawn on top of layers added earlier.
  * @param {Layer} layer The layer to add to the screen.
  * @see Layer
  */
  public addLayer(layer: any) {
    this._layers.push(layer);
  }

  /** Return the array of layers.
  * @returns {Array}
  */
  public getLayers() {
    return this._layers;
  }

  /** Pause or unpause the screen.
  * @param {boolean} value true = pause the screen; false = unpause the screen.
  * @fires Screen#SCREEN_PAUSED
  * @fires Screen#SCREEN_RESUMED
  */
  public setPaused(value: boolean) {
    if (this._paused && !value) this._unpaused = true;
    this._paused = value;
    this._eventManager.notify(
      new Event(
        this._paused ? EventType.SCREEN_PAUSED : EventType.SCREEN_RESUMED, 
        {}
      )
    );
    if (!this._paused) this._requestAnimationFrame(this.render.bind(this));
  }

  /** Add a one-time event handler for the start of the next frame.
  * @param {Function} callback The handler function.
  * @returns {String} The Id assigned to the handler function.
  */
  public onNextFrameBegin(callback: () => void): void {
    this._eventManager.on(EventType.NEXT_FRAME_BEGIN, callback);
  }

  /** Add a one-time event handler for the end of the next frame.
  * @param {Function} callback The handler function.
  * @returns {String} The Id assigned to the handler function.
  */
  public onNextFrameEnd(callback: () => void): void {
    this._eventManager.on(EventType.NEXT_FRAME_END, callback);
  }

  /** @private */
  private _doBeforeRenderEvents(time: any, diff: any) {
    this._eventManager.notify(
      new Event(EventType.NEXT_FRAME_BEGIN, {diff:diff}, time)
    );
    this._eventManager.clearEventListeners(EventType.NEXT_FRAME_BEGIN);
    this._eventManager.notify(
      new Event(EventType.BEFORE_RENDER, {diff:diff}, time)
    );
  }

  /** @private */
  private _doAfterRenderEvents(time: any, diff: any) {
    this._eventManager.notify(
      new Event(EventType.NEXT_FRAME_END, {diff:diff}, time)
    );
    this._eventManager.clearEventListeners(EventType.NEXT_FRAME_END);
    this._eventManager.notify(
      new Event(EventType.AFTER_RENDER, {diff:diff}, time)
    );
  }

  /** Return whether the screen is paused
  * @returns {boolean}
  */
  public isPaused() {return this._paused;}

  /** Render the screen and all layers.
  * @param {number} time The current time in milliseconds.
  * @fires Screen#NEXT_FRAME_BEGIN
  * @fires Screen#NEXT_FRAME_END
  * @fires Screen#BEFORE_RENDER
  * @fires Screen#AFTER_RENDER
  * @fires Screen#MOUSE_MOVE
  */
  public render(time?: number) {
    time = time || 1;
    if (this._paused || this._tabNotVisible) return;
    if (this._unpaused) {
      this._unpaused = false;
      this._last = Math.floor(time) - 1;
    }
    time = Math.floor(time);
    var elapsed = Date.now();
    var diff = time - this._last;
    this._last = time;

    if (this._mouseMoved) {
      this._handleMouseMoveEvent(time);
    }

    this._doBeforeRenderEvents(time, diff);

    this._updateFps(diff);

    this._update(time,diff);
    this._render(time,diff);

    this._updateViewOrigins();
    this._doAfterRenderEvents(time, diff);

    elapsed = Date.now() - elapsed;
    if (this._fpsElem && this._fpsMonitorIndex === 0)
      this._fpsElem.innerHTML += "<br />Avg MS per frame: " + elapsed;

    this._requestAnimationFrame(this.render.bind(this));
  }

  /** @private */
  private _updateViewOrigins() {
    if (!Utils.isNullOrUndefined(this.getPendingViewOriginX())) {
      this._viewOriginX = this.getPendingViewOriginX();
      this._pendingViewOriginX = null;
    }
    if (!Utils.isNullOrUndefined(this.getPendingViewOriginY())) {
      this._viewOriginY = this.getPendingViewOriginY();
      this._pendingViewOriginY = null;
    }
  }

  /** @private */
  private _handleMouseMoveEvent(time: number) {
    var coordinateData = this._getDataForMouseEvent(this._mouseX, this._mouseY);

    var event = new SLGfxMouseEvent(
      EventType.MOUSE_MOVE,
      coordinateData,
      time
    );
    this._propagateMouseEventThroughLayers(event);
    if (!event.endEventPropagation) this._eventManager.notify(event);
    this._mouseMoved = false;
  }

  /** @private */
  private _updateFps(diff: number) {
    if (this._fpsElem) {
      var fps = Math.floor(1000 / diff);
      if (this._fpsMonitorArray.length < 30){
        this._fpsMonitorArray.push(fps);
      } else {
        this._fpsMonitorArray[this._fpsMonitorIndex] = fps;
      }
      this._fpsMonitorIndex++;
      if (this._fpsMonitorIndex >= 30) this._fpsMonitorIndex = 0;

      var fpsa = 1;
      for (var i = 0; i < this._fpsMonitorArray.length; i++){
        fpsa += this._fpsMonitorArray[i] / 30;
      }
      if (this._fpsElem && this._fpsMonitorIndex === 0)
        this._fpsElem.innerHTML = "fps: " + Math.floor(fpsa);
    }
  }

  /** @private */
  private _update(time: number, diff: number) {
    for (var i = 0; i < this._layers.length; i++) {
      this._layers[i].update(time,diff);
    }
  }

  /** @private */
  private _render(time: number, diff: number) {
    for (var i = 0; i < this._layers.length; i++) {
      this._layers[i].preRender(time,diff);
      this._layers[i].render(time,diff);
      this._layers[i].postRender(time,diff);
    }
  }

  /** Handle a mouse move event.  This does not directly propagate the event to
  * layers and elements; rather it will flag that a mouse movement has occured, and records its current location.
  * The event will be propagated during the next render cycle.
  * @param {Event} e The mouse event
  */
  private handleMouseMoveEvent(e: MouseEvent) {
    if (this._paused) return false;
    this._mouseMoved = true;
    var x = this.getXFromMouseEvent(e);
    var y = this.getYFromMouseEvent(e);

    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
      this._mouseX = -1;
      this._mouseY = -1;
      return false;
    }
    this._mouseX = x;
    this._mouseY = y;
  }

  /** @private */
  private _getDataForMouseEvent(canvasX: number, canvasY: number): MouseEventData {
    var viewOriginAdjustedX = this.getViewOriginAdjustedX(canvasX);
    var viewOriginAdjustedY = this.getViewOriginAdjustedY(canvasY);

    var x = this.getUnScaledX(viewOriginAdjustedX);
    var y = this.getUnScaledY(viewOriginAdjustedY);
    var data: MouseEventData = {
      x : x,
      y : y,
      viewOriginAdjustedX : viewOriginAdjustedX,
      viewOriginAdjustedY : viewOriginAdjustedY,
      rawX : canvasX,
      rawY : canvasY
    }
    return data;
  }

  /** Handles mouse up and mouse down events; notifies any local handlers and propagates the event to all layers.
  * @param {Event} e The mouse event
  * @fires Screen#MOUSE_UP
  * @fires Screen#MOUSE_DOWN
  */
  private _handleMouseEvent(e: MouseEvent) {
    if (this._paused) return false;
    var canvasX = this.getXFromMouseEvent(e);
    var canvasY = this.getYFromMouseEvent(e);

    if (canvasX < 0 || canvasX >= this._width || canvasY < 0 || canvasY >= this._height) {
      return false;
    }

    var data = this._getDataForMouseEvent(canvasX, canvasY);

    var type = e.type === "mouseup" ? EventType.MOUSE_UP : EventType.MOUSE_DOWN;
    var event = new SLGfxMouseEvent(type, data);

    // propagate through layers
    this._propagateMouseEventThroughLayers(event);
    if (!event.endEventPropagation) this._eventManager.notify(event);

    if (e.button === 1) return false;
  }

  /** @private */
  private _propagateMouseEventThroughLayers(event: SLGfxMouseEvent) {
    for (var i = this._layers.length - 1; i >= 0; i--) {
      if (event.endEventPropagation) return;
      this._layers[i].handleMouseEvent(event);
    }
  }

  /** Return the x coordinate from a mouse event.  Accounts for screen position.
  * @param {Event} e Mouse Event
  */
  public getXFromMouseEvent(e: MouseEvent) {
    return (e.pageX - (this._targetElement.offsetLeft + parseInt(this.getBorderLeftSize())));
  }

  /** Return the y coordinate from a mouse event.  Accounts for screen position.
  * @param {Event} e Mouse Event
  */
  public getYFromMouseEvent(e: MouseEvent) {
    return (e.pageY - (this._targetElement.offsetTop + parseInt(this.getBorderTopSize())));
  }

  /** Return an x value with scale removed.
  * @param {int} x The x coordinate.
  * @return {int} The unscaled x.
  */
  public getUnScaledX(x: number) {
    return Math.floor(x / this.getScaleX());
  }

  /** Return a y value with scale removed.
  * @param {int} y The y coordinate.
  * @return {int} The unscaled y.
  */
  public getUnScaledY(y: number) {
    return Math.floor(y / this.getScaleY());
  }

  /** Return an x value adjusted for view origin.
  * @param {int} x The x coordinate.
  * @return {int} The view origin adjusted x.
  */
  public getViewOriginAdjustedX(x: number) {
    return x - this.getViewOriginX();
  }

  /** Return a y value adjusted for view origin.
  * @param {int} y The y coordinate.
  * @return {int} The view origin adjusted y.
  */
  public getViewOriginAdjustedY(y: number) {
    return y - this.getViewOriginY();
  }

  /** Directly set the border style.
  * NOTE: subsequent changes using the setBorderColor or setBorderSize methods will overwrite any changes made in this method.
  * @param {string} width Any valid CSS Border width string.
  * @param {string} style Any valid CSS Border style string.
  * @param {string} color Any valid CSS Border color string.
  */
  public setBorder(width: any, style: any, color: any) {
    this._targetElement.style.borderWidth = width;
    this._targetElement.style.borderStyle = style;
    this._targetElement.style.borderColor = color;
  }

  public addEventListener(eventType: string, callback: (ev: Event) => any, id?: string): string {
    return this._eventManager.addEventListener(eventType, callback, id);
  }

  /** Alias for 'add'. Add an event listener to the listener list.
  * @param {EventType} eventType The type of the event.
  * @param {Function} callback The listener to call when the specified event type occurs
  * @param {string} id Optional. An Id to reference the listener by.
  */
  public on(eventType: EventType, callback: (ev: Event) => any, id?: string): string {
    return this.addEventListener(eventType, callback, id);
  }

  /** Remove an event listener.
  * @param {string} eventListenerId The id of the listener to remove.
  */
  public removeEventListener(eventListenerId: string): void {
    this._eventManager.removeEventListener(eventListenerId);
  }

  /** Clear all event listeners for a given event type.
  * @param {EventType} eventType The type of the event.
  */
  public clearEventListeners(eventType: EventType): void {
    this._eventManager.clearEventListeners(eventType);
  }

  notify(event: Event): void;
  notify(eventType: string, data?: any, time?: number): void;
  notify(eventOrEventType: Event | string, data?: any, time?: number): void {
    if (eventOrEventType instanceof Event) {
      this._eventManager.notify(eventOrEventType);
    } else {
      this._eventManager.notify(eventOrEventType, data, time);
    }
  }
}


/** The screen was paused.
* @event Screen#SCREEN_PAUSED
* @property {string} type EventType
* @property {number} time The time the event was fired.
*/

/** The screen was unpaused.
* @event Screen#SCREEN_RESUMED
* @property {string} type EventType
* @property {number} time The time the event was fired.
*/

/** Mouse button down on the screen.
* @event Screen#MOUSE_DOWN
* @type {ScreenMouseEvent}
*/

/** Mouse button up on the screen.
* @event Screen#MOUSE_UP
* @type {ScreenMouseEvent}
*/

/** Mouse moves inside the screen area.
* @event Screen#MOUSE_MOVE
* @type {ScreenMouseEvent}
*/

/** The screen is about to render.
* @event Screen#BEFORE_RENDER
* @type {ScreenRenderEvent}
*/

/** The screen just finished rendering.
* @event Screen#AFTER_RENDER
* @type {ScreenRenderEvent}
*/

/** The screen is about to render. (One time occurance.)
* @event Screen#NEXT_FRAME_BEGIN
* @type {ScreenRenderEvent}
*/

/** The screen just finished rendering. (One time occurance.)
* @event Screen#NEXT_FRAME_END
* @type {ScreenRenderEvent}
*/
