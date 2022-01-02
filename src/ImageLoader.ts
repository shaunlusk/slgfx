
export interface IImageLoadUpdates {
  totalImageCount: number;
  loadedCount: number;
  loadedImageKeys: string[];
  lastLoadedImageKey: string;
}

/** Loads a set of images and notifies progress and completion.
* @class
*/
export class ImageLoader {

  /** Load the images and callback when done.
  * Given a hash containing of key:value pairs of image keys and paths, will load images and store them in a new hash.
  * @param {Object} imagesHash Hash of image patsh. Format {imageId1:path, imageId2:path}
  * e.g.,: {warriorSpriteImage1:"images/warrior1Sprite.png"}
  * @param {function} callback Will call this function when all images have been loaded.
  * @param [function] updatesCallback Will call this every time any image finishes loading.
  */
  public loadImages(
    inputHash: {[key: string]: string}, 
    callback: (imageHash: {[key: string]: HTMLImageElement}) => void, 
    updatesCallback?: (updates: IImageLoadUpdates) => void
  ) {
    
    const imageCount = Object.keys(inputHash).length;
    var outputHash: {[key: string]: HTMLImageElement} = {};
    for (const key in inputHash) {
      outputHash[key] = new Image();
      outputHash[key].src = inputHash[key];
      outputHash[key].onload = () => this.loadImagesCallback(key, outputHash, callback, updatesCallback);
    }
  }

  /** @private */
  private loadImagesCallback(
    lastLoadedKey: string,
    outputHash: {[key: string]: HTMLImageElement}, 
    finalCallback: (imageHash: {[key: string]: HTMLImageElement}) => void,
    updatesCallback?: (updates: IImageLoadUpdates) => void
  ) {
    const completeEntries = Object.entries(outputHash).filter(x => x[1].complete).map(x => x[0]);
    const loadedCount = completeEntries.length;
    const totalCount = Object.keys(outputHash).length;
    if (updatesCallback) {
      updatesCallback({
        lastLoadedImageKey: lastLoadedKey,
        loadedCount: loadedCount,
        totalImageCount: totalCount,
        loadedImageKeys: completeEntries
      });
    }
    if (loadedCount === totalCount) {
      finalCallback(outputHash);
    }
  }

}
