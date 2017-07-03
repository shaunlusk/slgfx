var SL = SL || {};

SL.renderWithTranslation = function (context, x, y, flipHorizontally, flipVertically, rotation, scaleX, scaleY, renderCallback) {
  context.save();
  SL.translateCanvasContext(context, x, y, flipHorizontally, flipVertically, rotation, scaleX, scaleY);
  renderCallback();
  context.restore();
};

SL.translateCanvasContext = function (context, x, y, flipHorizontally, flipVertically, rotation, scaleX, scaleY) {
  context.translate(x, y);
  if (flipHorizontally || flipVertically) {
    context.scale(flipHorizontally ? 0-scaleX : scaleX, flipVertically ? 0-scaleY : scaleY);
  } else {
    context.scale(scaleX, scaleY);
  }
  if (rotation) {
    context.rotate(rotation);
  }
};

SL.clearCanvasContext = function (context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};
