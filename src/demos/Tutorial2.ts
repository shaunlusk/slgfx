import { GfxLayer, GfxPanel, ILayerProps, ImageElement, ImageLoader, ImageRenderer } from "..";
import * as GnomeImage from '../../assets/all_gnomes.png';

export function initialize(targetElement: HTMLElement) {
  var gfxPanel = new GfxPanel({
    targetElement: targetElement,
    width:128,
    height:96
  });

  gfxPanel.render();

  /*newcode start*/const imgLoader = new ImageLoader();
  imgLoader.loadImages({gnome: GnomeImage}, imagesHash => {
    render(gfxPanel, imagesHash);
  });/*newcode end*/
}

/*newcode start*/function render(gfxPanel: GfxPanel, imagesHash: {[key: string]: HTMLImageElement}) {
  var gfxLayer = gfxPanel.createLayer<GfxLayer, ILayerProps>("GfxLayer");
  var imageRenderer = new ImageRenderer();

  var element = new ImageElement({
    gfxPanel: gfxPanel,
    image: imagesHash['gnome'],
    sourceX:0,
    sourceY:0,
    sourceWidth:32,
    sourceHeight:32,
    width:32,
    height:32,
    scaleX:2,
    scaleY:2,
    imageRenderer:imageRenderer
  });
  gfxLayer.addElement(element);
}
/*newcode end*/