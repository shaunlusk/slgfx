var Utils = require('slcommon/src/Utils');

/** Performs some translation on the canvas context before applying some rendering function.
 * @param  {CanvasContextWrapper} context The canvas context wrapper
 * @param  {number} x                The horizontal position to translate the canvas to.
 * @param  {number} y                The vertical position to translate the canvas to.
 * @param  {boolean} flipHorizontally Whether to horizontally flip the canvas.
 * @param  {boolean} flipVertically   Whether to vertically flip the canvas.
 * @param  {number} rotation         The amount to rotate the canvas, in radians.
 * @param  {function} renderCallback   The function to call to perform rendering.
 */
Utils.renderWithTranslation = function (context, x, y, flipHorizontally, flipVertically, rotation, renderCallback) {
  context.save();
  Utils.translateCanvasContext(context, x, y, flipHorizontally, flipVertically, rotation);
  renderCallback();
  context.restore();
};

/** Translate a canvas context.
 * @param  {CanvasContextWrapper} context The canvas context wrapper
 * @param  {number} x                The horizontal position to translate the canvas to.
 * @param  {number} y                The vertical position to translate the canvas to.
 * @param  {boolean} flipHorizontally Whether to horizontally flip the canvas.
 * @param  {boolean} flipVertically   Whether to vertically flip the canvas.
 * @param  {number} rotation         The amount to rotate the canvas, in radians.
 */
Utils.translateCanvasContext = function (context, x, y, flipHorizontally, flipVertically, rotation) {
  context.translate(x, y);
  if (flipHorizontally || flipVertically) {
    context.scale(flipHorizontally ? -1 : 1, flipVertically ? -1 : 1);
  }
  if (rotation) {
    context.rotate(rotation);
  }
};

/** Clear the visible portion of a canvas context.
* @param {CanvasContextWrapper} context
*/
Utils.clearCanvasContext = function (context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

module.exports = Utils;
