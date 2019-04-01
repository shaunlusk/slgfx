var ImageLoader = require('../src/ImageLoader');

describe('ImageLoader', () => {
  describe('#loadImages', () => {
    it('should call back when done.', (done) => {
      var imagesHash = {
        image1:{path:"bogusPath"},
        image2:{path:"bogusPath"}
      };

      var loader = new ImageLoader(imagesHash);

      loader.loadImages((hashWithImageData) => {
        expect(hashWithImageData.image1.image).toBeTruthy();
        expect(hashWithImageData.image2.image).toBeTruthy();
        done();
      });

      for (const imageId in imagesHash) {
          loader.loadImagesCallback();
      }

    });
  });
});
