import { GfxLayer } from '../GfxLayer';
import { ImageRenderer } from "../ImageRenderer";
import { GfxPanel } from "../GfxPanel";
import { ImageLoader } from '../ImageLoader';
import { ImageSpriteFrame } from '../ImageSpriteFrame';
import { IImageSpriteProps, ImageSprite } from '../ImageSprite';

export interface IDemoProps {
  targetDiv: HTMLElement;
  fpsElem?: HTMLElement;
  backgroundColor?: string;
  borderColor?: string;
  borderSize?: string;
  scaleX?: number;
  scaleY?: number;
}

export class SimpleDemo {
  private _panel: GfxPanel;
  private _gfxLayer: GfxLayer;
  private _elementFront: ImageSprite;
  _elementLeft: ImageSprite;
  _elementRight: ImageSprite;
  _elementBack: ImageSprite;

  public constructor(props: IDemoProps) {
    this._panel = new GfxPanel({
      targetElement: props.targetDiv,
      backgroundColor: props.backgroundColor,
      borderColor: props.borderColor,
      borderSize: props.borderSize,
      scaleX : props.scaleX,
      scaleY : props.scaleY,
      fpsElement : props.fpsElem
    });

    this._panel.initialize();
    this._gfxLayer = this._panel.createLayer("GfxLayer") as GfxLayer;
    this._panel.render();

    const imgLoader = new ImageLoader();
    imgLoader.loadImages({blueBall: 'spriteTest.png'}, imagesHash => {
      this.initialize(imagesHash['blueBall']);
    });

  }

  private initialize(image: HTMLImageElement) {
    const imageRenderer =  new ImageRenderer();

    const elementFrontProps: IImageSpriteProps = {
      gfxPanel: this._panel,
      image: image,
      scaleX: 2, scaleY: 2,
      width: 32, height: 32,
      imageRenderer: imageRenderer,
      x: 100, y: 100,
      frames: [
        new ImageSpriteFrame({
          duration:2500,
          sourceX:0, sourceY:0,
          sourceWidth:32, sourceHeight:32
        }),
        new ImageSpriteFrame({
          duration:200,
          sourceX:32, sourceY:0,
          sourceWidth:32, sourceHeight:32
        }),
      ]
    };
  
    this._elementFront = new ImageSprite(elementFrontProps);
    this._gfxLayer.addElement(this._elementFront);

    const elementLeftProps: IImageSpriteProps = {
      gfxPanel: this._panel,
      image: image,
      scaleX: 2, scaleY: 2,
      width: 32, height: 32,
      imageRenderer: imageRenderer,
      x: 500, y: 100,
      hidden: true,
      frames:[
        new ImageSpriteFrame({
          duration:2500,
          sourceX:128, sourceY:0,
          sourceWidth:32, sourceHeight:32
        }),
        new ImageSpriteFrame({
          duration:200,
          sourceX:160, sourceY:0,
          sourceWidth:32, sourceHeight:32
        }),
      ]
    };

    this._elementLeft = new ImageSprite(elementLeftProps);
    this._gfxLayer.addElement(this._elementLeft);

    const elementBackProps: IImageSpriteProps = {
      gfxPanel: this._panel,
      image: image,
      scaleX: 2, scaleY: 2,
      width: 32, height: 32,
      imageRenderer: imageRenderer,
      x:500, y:300,
      hidden: true,
      frames:[
        new ImageSpriteFrame({
          duration:2500,
          sourceX:192, sourceY:0,
          sourceWidth:32, sourceHeight:32
        })
      ]
    };

    this._elementBack = new ImageSprite(elementBackProps);
    this._gfxLayer.addElement(this._elementBack);

    const elementRightProps: IImageSpriteProps = {
      gfxPanel: this._panel,
      image: image,
      scaleX: 2, scaleY: 2,
      width: 32, height: 32,
      imageRenderer: imageRenderer,
      x:100, y:300,
      hidden: true,
      frames:[
        new ImageSpriteFrame({
          duration:2500,
          sourceX:64, sourceY:0,
          sourceWidth:32, sourceHeight:32
        }),
        new ImageSpriteFrame({
          duration:200,
          sourceX:96, sourceY:0,
          sourceWidth:32, sourceHeight:32
        }),
      ]
    };

    this._elementRight = new ImageSprite(elementRightProps);
    this._gfxLayer.addElement(this._elementRight);

    this._elementFront.on("ELEMENT_STOPPED_MOVING", this.moveEast.bind(this));
    this._elementRight.on("ELEMENT_STOPPED_MOVING", this.moveNorth.bind(this));
    this._elementBack.on("ELEMENT_STOPPED_MOVING", this.moveWest.bind(this));
    this._elementLeft.on("ELEMENT_STOPPED_MOVING", this.moveSouth.bind(this));

    this.moveSouth();

  }

  private moveSouth(){
    this._elementLeft.hide();
    this._elementFront.setX(100);
    this._elementFront.setY(100);
    this._elementFront.show();
    this._elementFront.moveTo(100, 300, 4000);
  }

  private moveEast() {
    this._elementFront.hide();
    this._elementRight.setX(100);
    this._elementRight.setY(300);
    this._elementRight.show();
    this._elementRight.moveTo(500, 300, 6000);
  }

  private moveNorth() {
    this._elementRight.hide();
    this._elementBack.setX(500);
    this._elementBack.setY(300);
    this._elementBack.show();
    this._elementBack.moveTo(500, 100, 4000);
  }

  private moveWest() {
    this._elementBack.hide();
    this._elementLeft.setX(500);
    this._elementLeft.setY(100);
    this._elementLeft.show();
    this._elementLeft.moveTo(100, 100, 6000);
  }

  public togglePause() {
    this._panel.setPaused( !this._panel.isPaused() );
  }
}


