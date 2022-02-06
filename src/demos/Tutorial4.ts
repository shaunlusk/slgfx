import { GfxLayer, GfxPanel, ILayerProps, ImageLoader, ImageRenderer, ImageSprite, ImageSpriteFrame } from "..";
import * as GnomeImage from '../../assets/all_gnomes.png';

export function initialize(targetElement: HTMLElement) {
  var gfxPanel = new GfxPanel({
    targetElement: targetElement,
    width:128,
    height:96
  });

  gfxPanel.render();

  const imgLoader = new ImageLoader();
  imgLoader.loadImages({gnome: GnomeImage}, imagesHash => {
    render(gfxPanel, imagesHash);
  });
}

function render(gfxPanel: GfxPanel, imagesHash: {[key: string]: HTMLImageElement}) {
  var gfxLayer = gfxPanel.createLayer<GfxLayer, ILayerProps>("GfxLayer");
  var imageRenderer = new ImageRenderer();

  /*newcode start*/var element = new ImageSprite({
    gfxPanel: gfxPanel,
    image: imagesHash['gnome'],
    width:32,
    height:32,
    scaleX:2,
    scaleY:2,
    imageRenderer:imageRenderer,
    frames: [
      new ImageSpriteFrame({duration:350, sourceX:0, sourceY:0, sourceWidth:32, sourceHeight:32}),
      new ImageSpriteFrame({duration:350, sourceX:64, sourceY:0, sourceWidth:32, sourceHeight:32})
    ]
  });/*newcode end*/
  gfxLayer.addElement(element);
}

