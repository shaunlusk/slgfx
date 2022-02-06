/*newcode start*/import { GfxLayer, GfxPanel, ILayerProps } from "..";

export function initialize(targetElement: HTMLElement) {
  var gfxPanel = new GfxPanel({
    targetElement: targetElement,
    width: 128,
    height: 96
  });

  var gfxLayer = gfxPanel.createLayer<GfxLayer, ILayerProps>("GfxLayer");
  gfxPanel.render();
}
/*newcode end*/