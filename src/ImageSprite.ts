import { ICanvasContextWrapper } from "./CanvasContextWrapper";
import { IImageRenderer } from "./ImageRenderer";
import { ImageSpriteFrame } from "./ImageSpriteFrame";
import { ISpriteProps, Sprite } from "./Sprite";

export interface IImageSpriteProps extends ISpriteProps {
  image: HTMLImageElement;
  width: number;
  height: number;
  imageRenderer: IImageRenderer;
}

/** Animated element that displays images frames in succession.<br />
* Uses {@link ImageSpriteFrame} for its frames.
* @constructor
* @augments Sprite
* @param {Object} props Properties for this GfxElement.
* @param {Screen} props.screenContext The target screen.
* @param {int} [props.scaleX=1] Horizontal scale of this element.  Independent of screen scale.
* @param {int} [props.scaleY=1] Vertical scale of this element.  Independent of screen scale.
* @param {boolean} [props.hidden=false] Whether to hide this element.
* @param {number} [props.x=0] The X coordinate for this element.
* @param {number} [props.y=0] The Y coordinate for this element.
* @param {number} props.width The width of this element.
* @param {number} props.height The height this element.
* @param {number} [props.rotation=0] The amount of rotation to apply to the element, in radians.  Applied on top of base rotation.
* @param {number} [props.baseRotation=0] The amount of base rotation to apply to the element, in radians. Usually used to apply an initial, unchanging rotation to the element.  Useful for correcting orientation of images.
* @param {boolean} [props.horizontalFlip=false] Whether to flip the element horizontally.
* @param {boolean} [props.verticalFlip=false] Whether to flip the element vertically.
* @param {number} [props.zIndex=-1] The z-index; elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).
* @param {Array.<ImageSpriteFrame>} [props.frames=[]] Optional. An array of AnimationFrame's. Default: empty array.
* @param {number} [props.ttl=-1] Time-to-live.  The time (milliseconds) to continue the Sprites animation.  Default: -1 (unlimited time)
* @param {boolean} [props.loop=true] Whether to loop the animation or not.
* @param {int} [props.loopsToLive=-1] If loop is true, the number of loops to execute.  Default: -1 (unlimited loops)
* @param {int} [props.freezeFrameIdx=-1] When animation completes, switch to the frame indicated by the freeze frame index (referring to the index of the frame in the frames array). Default: -1 (don't change frames when animation stops, stay with the final frame)
* @param {Image} props.image The image to use for this element. Can be created via html (&lt;img&gt;) or javascript (new Image()).
* @param {ImageRenderer} props.imageRenderer The ImageRenderer that will draw on the canvas.
* @see GfxElement
* @see Sprite
* @see AnimationFrame
* @see ImageSpriteFrame
*/
export class ImageSprite extends Sprite {
  private _image: HTMLImageElement;
  private _imageRenderer: IImageRenderer;

  constructor(props: IImageSpriteProps) {
    super(props);
    this._image = props.image;

    this._imageRenderer = props.imageRenderer;
  }

  /** Return the source image.
  * @returns {Image}
  */
  public getImage() {return this._image;}

  /** Render the specified frame.
  * @override
  * @param {number} time The current time (milliseconds).
  * @param {number} diff The difference between the previous render cycle and the current cycle (milliseconds).
  * @param {AnimationFrame} frame The ImageSpriteFrame to be rendered.
  */
  public renderFrame(canvasContext: ICanvasContextWrapper, time: number, diff: number, frame: ImageSpriteFrame) {
    this._imageRenderer.renderImage(
      canvasContext,
      this.getImage(),
      frame.getSourceX(),
      frame.getSourceY(),
      frame.getSourceWidth(),
      frame.getSourceHeight(),
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
