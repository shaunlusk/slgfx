var ImageRenderer = require('../src/ImageRenderer');

describe("ImageRenderer", function() {
  describe("#renderImage()", function() {
    it("should call drawImage on context", function(done) {
      var screenScaleX = 2, screenScaleY = 2;
      var renderer = new ImageRenderer(screenScaleX, screenScaleY);
      var context = {
        drawImage : function(image, sx, sy, sWidth, sHeight, tx, ty, tWidth, tHeight) {
          this.sx = sx;
          this.sy = sy;
          this.sWidth = sWidth;
          this.sHeight = sHeight;
          this.tx = tx;
          this.ty = ty;
          this.tWidth = tWidth;
          this.tHeight = tHeight;
        }
      };
      var image = null;
      var sx = 10, sy = 12, sWidth = 8, sHeight = 16;
      var tx = 50, ty = 72, tWidth = 8, tHeight = 16;
      var imageScaleX = 2, imageScaleY = 3;

      renderer.renderImage(context, image, sx, sy, sWidth, sHeight, tx, ty, tWidth, tHeight, imageScaleX, imageScaleY);

      expect(context.sx).toBe(sx);
      expect(context.sy).toBe(sy);
      expect(context.sWidth).toBe(sWidth);
      expect(context.sHeight).toBe(sHeight);
      expect(context.tx).toBe(tx * screenScaleX);
      expect(context.ty).toBe(ty * screenScaleY);
      expect(context.tWidth).toBe(tWidth * screenScaleX * imageScaleX);
      expect(context.tHeight).toBe(tHeight * screenScaleY * imageScaleY);
      done();
    });
  });
});
