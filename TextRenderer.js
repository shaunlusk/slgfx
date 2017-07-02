var SL = SL || {};

/** Draws text to a canvas.<br />
* @constructor
* @param {integer} screenScaleX Horizontal scale of the SL.Screen
* @param {integer} screenScaleY Vertical scale of the SL.Screen
* @see SL.TextElement
*/
SL.TextRenderer = function(screenScaleX, screenScaleY) {
  this._screenScaleX = screenScaleX;
  this._screenScaleY = screenScaleY;
};

/** Draws an image or portion of an image to the canvas.
* @param {CanvasContext} context The canvas to draw to.
* @param {Image} text Text to draw
* @param {number} x The target x position of the canvas to draw the text to.
* @param {number} y The target y position of the canvas to draw the text to.
* @param {number} height The target height of the drawn image. If different than the dimensions of the image subsection, the image subsection will be stretched or shrunk.
* @param {integer} imageScaleX The amount to scale the drawn image horizontally.
* @param {integer} imageScaleY The amount to scale the drawn image vertically.
*/
SL.TextRenderer.prototype.renderText = function(context, text, fill, fontFamily, fontSize, x, y, width, height, elementScaleX, elementScaleY, flipHorizontally, flipVertically, rotation) {
  var drawFunction = context.strokeText.bind(context);
  context.setFontStyle(fontSize + " " + fontFamily);

  if (flipHorizontally || flipVertically || rotation || elementScaleX !== 1 || elementScaleY !== 1) {
    drawFunction = fill ? context.fillTextWithTranslation.bind(context) : context.strokeTextWithTranslation.bind(context);
    this.renderTextWithTranslation(context, text, x, y, width, height, elementScaleX, elementScaleY, flipHorizontally, flipVertically, rotation, drawFunction);
  } else {
    if (fill) drawFunction = context.fillText.bind(context);
    drawFunction(text, x, y);
  }

};

SL.TextRenderer.prototype.renderTextWithTranslation = function(context, text, x, y, width, height, elementScaleX, elementScaleY, flipHorizontally, flipVertically, rotation, drawFunction) {
  var totalScaleX = this.getTotalScaleX(elementScaleX);
  var totalScaleY = this.getTotalScaleY(elementScaleY);
  var translatedWidth = (width * totalScaleX)/2;
  var translatedHeight = (height * totalScaleY)/2;
  var translationX = x * this.getScreenScaleX() + translatedWidth;
  var translationY = y * this.getScreenScaleY() + translatedHeight;
  SL.renderWithTranslation(context, translationX, translationY, flipHorizontally, flipVertically, rotation, totalScaleX, totalScaleY,
    function() {
      drawFunction(text, 0 - translatedWidth, 0 - translatedHeight);
    }.bind(this)
  );

};

/**
* Return the horizontal scale of the renderer.
* @return {integer}
*/
SL.TextRenderer.prototype.getScreenScaleX = function() {return this._screenScaleX;};

/**
* Return the vertical scale of the renderer.
* @return {integer}
*/
SL.TextRenderer.prototype.getScreenScaleY = function() {return this._screenScaleY;};

/**
* Return the total horizontal scale (screen scale * image scale).
* @param {integer} imageScaleX The x amount to scale the portion of the image drawn to the canvas.
* @return {integer}
*/
SL.TextRenderer.prototype.getTotalScaleX = function(imageScaleX) {return this._screenScaleX * imageScaleX;};

/**
* Return the total vertical scale (screen scale * image scale).
* @param {integer} imageScaleY The y amount to scale the portion of the image drawn to the canvas.
* @return {integer}
*/
SL.TextRenderer.prototype.getTotalScaleY = function(imageScaleY) {return this._screenScaleY * imageScaleY;};
