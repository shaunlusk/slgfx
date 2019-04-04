// Mock for node testing.
var Image = window.Image || function() {};

/**
* @class
* Given an object containing of image paths, will load images and store them back in the object.
* @param {Object} imagesHash Has of image information. Format {imageId1:{path:path}, imageId1:{path:path}}
* e.g.,: (warriorSpriteImage1:{path:"images/warrior1Sprite.png"}}
*/
function ImageLoader(imagesHash) {
  this.imagesHash = imagesHash;
  this.imageCount = 0;
  this.imageLoadedCounter = 0;
};

/** Load the images and callback when done.
* @param {function} callback Will call this function when all images have been loaded.
*/
ImageLoader.prototype.loadImages = function(callback) {
  this.imagesDoneLoadingCallback = callback;
  var keys = Object.keys(this.imagesHash);
  this.imageCount = keys.length;
  var key = null;
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    this.imagesHash[key].image = new Image();
    this.imagesHash[key].image.src = this.imagesHash[key].path;
    this.imagesHash[key].image.onload = this.loadImagesCallback.bind(this);
  }
};

/** @private */
ImageLoader.prototype.loadImagesCallback = function() {
  this.imageLoadedCounter++;
  if (this.imageLoadedCounter === this.imageCount) {
    this.imagesDoneLoadingCallback(this.imagesHash);
  }
};

module.exports = ImageLoader;
