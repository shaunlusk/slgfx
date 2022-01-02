import { IAnimationFrame } from './IAnimationFrame';

export interface IImageSpriteFrameProps {
  duration: number;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
}

/** ImageSprite implementation of SpriteAnimationFrame.
* @extends {SpriteAnimationFrame}
* @constructor
* @param {Object} props Properties
* @param {number} props.duration How long (milliseconds) to display this frame.
* @param {number} props.sourceX The starting x of the sub-section of the image for this frame.
* @param {number} props.sourceY The starting y of the sub-section of the image for this frame.
* @param {number} props.sourceWidth The width of the sub-section of the image for this frame.
* @param {number} props.sourceHeight The height of the sub-section of the image for this frame.
*/
export class ImageSpriteFrame implements IAnimationFrame {
  private _duration: number;
  private _sx: number;
  private _sy: number;
  private _sWidth: number;
  private _sHeight: number;

  constructor(props: IImageSpriteFrameProps) {
    this._duration = props.duration;
    this._sx = props.sourceX;
    this._sy = props.sourceY;
    this._sWidth = props.sourceWidth;
    this._sHeight = props.sourceHeight;
  }

  /** Return the duration of this frame.
  * @override
  * @returns {number}
  */
  public getDuration() {return this._duration;}

  /** Return the starting x point on the source Image for this frame
  * @returns {number}
  */
  public getSourceX() {return this._sx;}

  /** Return the starting y point on the source Image for this frame
  * @returns {number}
  */
  public getSourceY() {return this._sy;}

  /** Return the width of the subsection of the source Image for this frame
  * @returns {number}
  */
  public getSourceWidth() {return this._sWidth;}

  /** Return the height of the subsection of the source Image for this frame
  * @returns {number}
  */
  public getSourceHeight() {return this._sHeight;}

}
