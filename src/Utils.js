var SL = {};



/**
 * anonymous function - description
 *
 * @param  {type} context          description
 * @param  {type} x                description
 * @param  {type} y                description
 * @param  {type} flipHorizontally description 
 * @param  {type} flipVertically   description
 * @param  {type} rotation         description
 * @param  {type} renderCallback   description
 * @return {type}                  description
 */
SL.renderWithTranslation = function (context, x, y, flipHorizontally, flipVertically, rotation, renderCallback) {
  context.save();
  SL.translateCanvasContext(context, x, y, flipHorizontally, flipVertically, rotation);
  renderCallback();
  context.restore();
};

SL.translateCanvasContext = function (context, x, y, flipHorizontally, flipVertically, rotation) {
  context.translate(x, y);
  if (flipHorizontally || flipVertically) {
    context.scale(flipHorizontally ? -1 : 1, flipVertically ? -1 : 1);
  }
  if (rotation) {
    context.rotate(rotation);
  }
};

SL.clearCanvasContext = function (context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};