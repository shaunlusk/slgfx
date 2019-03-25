var testUtil = require('slcommon/test/testUtil');
var Layer = require('../src/Layer');

describe('Layer', function() {
  var canvasContextWrapper = {
    getCanvas : function() {},
    setImageSmoothingEnabled : function(value) {this.bool = value;},
    isImageSmoothingEnabled : function() {return this.bool;},
    setViewOriginX : function(viewOriginX) {this.viewOriginX = viewOriginX;},
    setViewOriginY : function(viewOriginY) {this.viewOriginY = viewOriginY;},
    getViewOriginX : function() {return 0;},
    getViewOriginY : function() {return 0;},
    clear : function() {this.cleared = true;}
  }
  describe('dirty', function() {
    var layer = new Layer();
    it('should be dirty', function() {
      layer.setDirty(true);

      testUtil.assert(layer.isDirty());
    });
    it('should not be dirty', function() {
      layer.setDirty(false);

      testUtil.assert(!layer.isDirty());
    });
  });
  describe('ImageSmoothing', function() {
    var layer = new Layer({canvasContextWrapper:canvasContextWrapper});
    it('should set dirty', function() {
      layer.setDirty(false);

      layer.setImageSmoothingEnabled(true);

      testUtil.assert(layer.isDirty());
    });
    it('should set image smoothing', function() {
      layer.setDirty(false);

      layer.setImageSmoothingEnabled(true);

      testUtil.assert(layer.isImageSmoothingEnabled());
    });
  });
  describe('#prerender', function() {
    var layer = new Layer({canvasContextWrapper:canvasContextWrapper});
    it('should clear canvas if dirty', function() {
      layer.setDirty(true);

      layer.prerender(0,0);

      testUtil.assert(canvasContextWrapper.cleared);
    });
    it('should set view origin x on canvas context', function() {
      var xval = 10;
      layer.setViewOriginX(xval);

      layer.prerender(0,0);

      testUtil.assert(canvasContextWrapper.viewOriginX === xval);
    });
    it('should set view origin y on canvas context', function() {
      var yval = 10;
      layer.setViewOriginY(yval);

      layer.prerender(0,0);

      testUtil.assert(canvasContextWrapper.viewOriginY === yval);
    });
  });
});
