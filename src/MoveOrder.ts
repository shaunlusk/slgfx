import { Utils } from '@shaunlusk/slcommon';

/** Directs movement of {@link GfxElements} when moveTo() is called.
* These are created and handled internally in GfxElements.
* @constructor
* @param {GfxElements} element The element this MoveOrder will be bound to.
* @param {number} tx The target x location for the element.
* @param {number} ty The target y location for the element.
* @param {number} duration The length of time (milliseconds) for the movement to the target location.
* @param {function} elementCallback The callback of the parent element; called when movement is done.
* @param {function} [callback] Optional callback to be called when movement is done.
*/
export class MoveOrder {
  private _element: any;
  private _tx: number;
  private _ty: number;
  private _startX: number;
  private _startY: number;
  private _duration: number;
  private _timeElapsed: number;
  private _elementCallback: () => void;
  private _callback?: (element: any) => void;
  private _end: boolean;
  private _started: boolean;

  public constructor(element: any, tx: number, ty: number, duration: number, elementCallback: () => any, callback?: (element: any) => any) {
    this._element = element;
    this._tx = tx;
    this._ty = ty;
    this._startX = 0;
    this._startY = 0;
    this._duration = duration;
    this._timeElapsed = 0;
    this._elementCallback = elementCallback;
    this._callback = callback;
    this._end = false;
    this._started = false;
  }

  /** Initialize movement conditions.
  */
  public start() {
    this._startX = this._element.getX();
    this._startY = this._element.getY();
    this._started = true;
  }

  /** Update the position of the parent element, based on time difference from last render cycle, and the time remaining to hit the target location.
  * @param {number} diff The difference between the last time and the current time  (milliseconds)
  */
  public update(diff: number) {
    if (!this._started) return;
    if (this._end) return;
    this._timeElapsed += diff;

    const timePercent = this._timeElapsed / this._duration;
    if (timePercent >= 1) {
      this.end();
    } else {
      this._element.setX(this._startX + (this._tx - this._startX) * timePercent);
      this._element.setY(this._startY + (this._ty - this._startY) * timePercent);
    }
  }

  /** Finish movement and notify the parent element.
  */
  public end () {
    this._end = true;
    this._element.setX(this._tx);
    this._element.setY(this._ty);
    if (Utils.isFunction(this._elementCallback)) this._elementCallback();
    if (Utils.isFunction(this._callback)) this._callback(this._element);
  }

}
