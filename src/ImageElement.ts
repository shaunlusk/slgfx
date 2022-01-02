import { ICanvasContextWrapper } from "./CanvasContextWrapper";
import { GfxElement } from "./GfxElement";
import { IImageRenderer } from "./ImageRenderer";

export interface IImageElementProps {
  image: HTMLImageElement;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  imageRenderer: IImageRenderer;
}

/** Graphics element that renders part or all of an Image.<br />
* It is good practice to have a single or few Images that have many tiles on them
* to make efficient use of memory and screen drawing. Using ImageElement, you
* can treat tiles from the source image as discrete screen elements that can be
* moved and interacted with.
* For animations, see {@link ImageSprite}
* @constructor
* @augments GfxElement
* @param {Object} props The properties for this element.
* @param {Screen} props.screenContext The target screen.
* @param {int} [props.scaleX=1] Horizontal scale of this element.  Independent of screen scale.
* @param {int} [props.scaleY=1] Vertical scale of this element.  Independent of screen scale.
* @param {boolean} [props.hidden=false] Whether to hide this element.
* @param {number} [props.x=0] The X coordinate for this element.
* @param {number} [props.y=0] The Y coordinate for this element.
* @param {number} [props.rotation=0] The amount of rotation to apply to the element, in radians.  Applied on top of base rotation.
* @param {number} [props.baseRotation=0] The amount of base rotation to apply to the element, in radians. Usually used to apply an initial, unchanging rotation to the element.  Useful for correcting orientation of images.
* @param {boolean} [props.horizontalFlip=false] Whether to flip the element horizontally.
* @param {boolean} [props.verticalFlip=false] Whether to flip the element vertically.
* @param {number} [props.zIndex=-1] The z-index; elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).
* @param {Image} props.image The image to use for this element. Can be created via html (&lt;img&gt;) or javascript (new Image()).
* @param {number} props.sourceX The x starting point of the desired subsection of the image
* @param {number} props.sourceY The y starting point of the desired subsection of the image
* @param {number} props.sourceWidth The width of the desired subsection of the image
* @param {number} props.sourceHeight The height of the desired subsection of the image
* @param {number} props.width The desired width of the ImageElement; if this differs from the source dimensions, the image will be stretched or shrunk accordingly
* @param {number} props.height The desired height of the ImageElement; if this differs from the source dimensions, the image will be stretched or shrunk accordingly
* @param {ImageRenderer} props.imageRenderer The ImageRenderer that will draw on the canvas.
* @see GfxElement
* @see ImageSprite
*/
export class ImageElement extends GfxElement {
  private _image: HTMLImageElement;
  private _sx: number;
  private _sy: number;
  private _sWidth: number;
  private _sHeight: number;

  private _imageRenderer: IImageRenderer;

  constructur(props: IImageElementProps) {
    this._image = props.image;
    this._sx = props.sourceX;
    this._sy = props.sourceY;
    this._sWidth = props.sourceWidth;
    this._sHeight = props.sourceHeight;

    this._imageRenderer = props.imageRenderer;
  }

  /** Return the source Image for this element
  * @returns {Image}
  */
  public getImage() {return this._image;}

  /** Return the width for this element
  * @override
  * @returns {number}
  */
  public getWidth() {return this._sWidth;}

  /** Return the height for this element
  * @override
  * @returns {number}
  */
  public getHeight() {return this._sHeight;}

  /** Return the starting x point on the source Image for this element
  * @returns {number}
  */
  public getSourceX() {return this._sx;}

  /** Return the starting y point on the source Image for this element
  * @returns {number}
  */
  public getSourceY() {return this._sy;}

  /** Return the width of the subsection of the source Image for this element
  * @returns {number}
  */
  public getSourceWidth() {return this._sWidth;}

  /** Return the height of the subsection of the source Image for this element
  * @returns {number}
  */
  public getSourceHeight() {return this._sHeight;}

  /** Render the image to the screen.
  * Time and diff parameters are not directly used, they are made available for extension purposes.
  * @param {number} time The current time (milliseconds)
  * @param {number} diff The difference between the last time and the current time  (milliseconds)
  */
  public render(canvasContext: ICanvasContextWrapper, time: 0, diff: 0) {
      this._imageRenderer.renderImage(
        canvasContext,
        this.getImage(),
        this.getSourceX(),
        this.getSourceY(),
        this.getSourceWidth(),
        this.getSourceHeight(),
        this.getX(),
        this.getY(),
        this.getWidth(),
        this.getHeight(),
        this.getElementScaleX(),
        this.getElementScaleY(),
        this.isHorizontallyFlipped(),
        this.isVerticallyFlipped(),
        this.getRotation()
      );
  }

}
