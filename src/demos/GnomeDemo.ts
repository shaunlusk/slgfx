import { Utils } from '@shaunlusk/slcommon';
import { GfxLayer } from '../GfxLayer';
import { ImageRenderer } from "../ImageRenderer";
import { GfxPanel } from "../GfxPanel";
import { ImageLoader } from '../ImageLoader';
import { ImageSpriteFrame } from '../ImageSpriteFrame';
import { ImageSprite } from '../ImageSprite';
import { ILayerProps } from '..';

export interface IDemoProps {
  targetElement: HTMLElement;
  fpsElement?: HTMLElement;
  backgroundColor?: string;
  borderColor?: string;
  borderSize?: string;
  scaleX?: number;
  scaleY?: number;
}

export class GnomeDemo {
  private _panel: GfxPanel;
  private _gfxLayer: GfxLayer;
  private _increment: number;

  public constructor(props: IDemoProps) {
    this._increment = 1;
    this._panel = new GfxPanel({
      targetElement: props.targetElement,
      backgroundColor: props.backgroundColor,
      borderColor: props.borderColor,
      borderSize: props.borderSize,
      scaleX : props.scaleX,
      scaleY : props.scaleY,
      fpsElement : props.fpsElement
    });

    this._gfxLayer = this._panel.createLayer<GfxLayer, ILayerProps>("GfxLayer");
    this._panel.render();

    const imgLoader = new ImageLoader();
    imgLoader.loadImages({gnome: 'all_gnomes.png'}, imagesHash => {
      this.initialize(imagesHash['gnome']);
    });

  }

  private initialize(image: HTMLImageElement) {
    const imageRenderer =  new ImageRenderer();

    const frame1 = new ImageSpriteFrame({
      duration : 200,
      sourceX : 4,
      sourceY : 0,
      sourceWidth : 24,
      sourceHeight : 32
    });
    const frame2 = new ImageSpriteFrame({
      duration : 200,
      sourceX : 70,
      sourceY : 0,
      sourceWidth : 24,
      sourceHeight : 32
    });

    const element = new ImageSprite({
      gfxPanel: this._panel,
      image: image,
      x: 200,
      y: 100,
      width: 24,
      height: 32,
      scaleX: 2,
      scaleY: 2,
      verticalFlip: Math.random() > 0.5 ? true : false,
      horizontalFlip: Math.random() > 0.5 ? true : false,
      rotation: Utils.degreesToRadians(Math.floor(Math.random() * 180)),
      imageRenderer
    });
    element.addFrame(frame1);
    element.addFrame(frame2);
    this._gfxLayer.addElement(element);

    for (var i = 0; i < 40; i++) {
      const el = new ImageSprite({
        gfxPanel: this._panel,
        image: image,
        x: Math.floor(Math.random() * 640),
        y: Math.floor(Math.random() * 480),
        width: 24,
        height: 32,
        scaleX: Math.random() > 0.5 ? 2 : 1,
        scaleY: Math.random() > 0.5 ? 2 : 1,
        verticalFlip: Math.random() > 0.5 ? true : false,
        horizontalFlip: Math.random() > 0.5 ? true : false,
        rotation: Utils.degreesToRadians(Math.floor(Math.random() * 180)),
        imageRenderer
      });
      el.addFrame(frame1);
      el.addFrame(frame2);
      this._gfxLayer.addElement(el);
      setInterval(
        () => { el.setRotation( el.getRotation() + 0.02); }, 
        20
      );
    }

    const element2 = new ImageSprite({
      gfxPanel: this._panel,
      image: image,
      x: 100,
      y: 100,
      width: 24,
      height: 32,
      scaleX: 2,
      scaleY: 2,
      imageRenderer
    });
    element2.addFrame(frame1);
    element2.addFrame(frame2);
    this._gfxLayer.addElement(element2);

    setInterval(() => this.updateLayer(), 32);
  }

  public togglePause() {
    this._panel.setPaused( !this._panel.isPaused() );
  }

  public updateLayer() {
    this._gfxLayer.setViewOriginX(this._gfxLayer.getViewOriginX() + this._increment);
    if (this._gfxLayer.getViewOriginX() < -640) {
      this._increment = 1;
    }

    if (this._gfxLayer.getViewOriginX() > 640){
     this._increment = -1;
    }
  }
}
