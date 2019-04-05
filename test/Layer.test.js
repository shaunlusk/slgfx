var Layer = require('../src/Layer');

describe('Layer', function() {
  var canvasContextWrapper = {
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

      expect(layer.isDirty()).toBeTruthy();
    });
    it('should not be dirty', function() {
      layer.setDirty(false);

      expect(layer.isDirty()).toBeFalsy();
    });
  });
  describe('ImageSmoothing', function() {
    var layer = new Layer({canvasContextWrapper:canvasContextWrapper});
    it('should set dirty', function() {
      layer.setDirty(false);

      layer.setImageSmoothingEnabled(true);

      expect(layer.isDirty()).toBeTruthy();
    });
    it('should set image smoothing', function() {
      layer.setDirty(false);

      layer.setImageSmoothingEnabled(true);

      expect(layer.isImageSmoothingEnabled()).toBeTruthy();
    });
  });
  describe('#prerender', function() {
    var layer = new Layer({canvasContextWrapper:canvasContextWrapper});
    it('should clear canvas if dirty', function() {
      layer.setDirty(true);

      layer.prerender(0,0);

      expect(canvasContextWrapper.cleared).toBeTruthy();
    });
    it('should set view origin x on canvas context', function() {
      var xval = 10;
      layer.setViewOriginX(xval);

      layer.prerender(0,0);

      expect(canvasContextWrapper.viewOriginX).toBe(xval);
    });
    it('should set view origin y on canvas context', function() {
      var yval = 10;
      layer.setViewOriginY(yval);

      layer.prerender(0,0);

      expect(canvasContextWrapper.viewOriginY).toBe(yval);
    });
  });
});
