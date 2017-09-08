var SL = SL || {};
SL.CELLWIDTH = 8;
SL.CELLHEIGHT = 8;

/**
* Draws Characters on a layer.
* @constructor
* @param {integer} scaleX Horizontal scale.  Should be taken from screen's scale.
* @param {integer} scaleY Vertical scale.  Should be taken from screen's scale.
*/
SL.CharacterRenderer = function(scaleX, scaleY) {
  this._scaleX = scaleX;
  this._scaleY = scaleY;
  this._cx = -1;
  this._cy = -1;
  this._color = null;
  this._backgroundColor = null;
  this._scaledCellWidth = SL.CELLWIDTH * scaleX;
  this._scaledCellHeight = SL.CELLHEIGHT * scaleY;
};

/**
* Return scaleX value.
*/
SL.CharacterRenderer.prototype.getScaleX = function() {return this._scaleX;};
/**
* Return scaleY value.
*/
SL.CharacterRenderer.prototype.getScaleY = function() {return this._scaleY;};

/**
* Clears a length of the screen in preparation for writing characters.
*
* @param {CanvasContext} context The canvas context to work on.
* @param {integer} x The x location to start clearing.
* @param {integer} y The y location to start clearing.
* @param {integer} length The length of characters to clear.
*/
SL.CharacterRenderer.prototype.clearRect = function(context, x, y, length)  {
  this.setCursorLocation(x, y);
  context.clearRect(this._cx, this._cy, length * this._scaledCellWidth, this._scaledCellHeight);
};

/**
* Draws a symbol on the canvas.
* @param {CanvasContext} context The canvas context to work on.
* @param {string} char The name of the character to draw.  Refer to {@link SL.CharacterMap}
* @param {integer} x The x location to draw the symbol to.
* @param {integer} y The y location to draw the symbol to.
* @param {Color} color The color to draw the symbol.
* @param {Color} backgroundColor Optional. The background color for the symbol.
*/
SL.CharacterRenderer.prototype.renderSymbol = function(context, char, x, y, color, backgroundColor) {
  this.setCursorLocation(x, y);
  this.setColor(color);
  this.setBackgroundColor(backgroundColor);

  this._renderCharacter(context, char);
};

/**
* Draws a string on the canvas.
* @param {CanvasContext} context The canvas context to work on.
* @param {string} text The text to draw to the canvas.
* @param {integer} x The x location to draw the symbol to.
* @param {integer} y The y location to draw the symbol to.
* @param {Color} color The color to draw the string.
* @param {Color} backgroundColor Optional. The background color for the string.
*/
SL.CharacterRenderer.prototype.renderString = function(context, text, x, y, color, backgroundColor) {
  this.setCursorLocation(x, y);
  this.setColor(color);
  this.setBackgroundColor(backgroundColor);

  for (var i = 0; i < text.length; i++) {
    var char = text.charAt(i);
    this._renderCharacter(context, char);
    this.advanceCursor();
  }
};

/**
* @private
*/
SL.CharacterRenderer.prototype._renderCharacter = function(context, char) {
  if (this._backgroundColor) {
    context.setFillStyle(this._backgroundColor);
    context.fillRect(this._cx, this._cy, this._scaledCellWidth, this._scaledCellHeight);
  }

  if (char === " ") return;
  var pixPathArray = SL.CharacterMap[char];

  if (!pixPathArray) {
    SL.log("No pix path found for character:" + char);
    return;
  }
  for (var i = 0; i < pixPathArray.length; i++) {
    this._renderPixPath(context, pixPathArray[i]);
  }
};

/**
* @private
*/
SL.CharacterRenderer.prototype._renderPixPath = function(context, pixPath) {
  context.setFillStyle(pixPath.color && pixPath.color instanceof SL.ColorPointer ? pixPath.color.getColor() : pixPath.color || this._color);
  var tx = (pixPath.x * this.getScaleX()) + this._cx;
  var ty = (pixPath.y * this.getScaleY()) + this._cy;
  switch (pixPath.type) {
    case SL.PixPathTypes.PIXEL :
      context.fillRect(tx, ty, this.getScaleX(), this.getScaleY());
      break;
    case SL.PixPathTypes.RECTANGLE :
      context.fillRect(tx, ty, pixPath.width * this.getScaleX(), pixPath.height * this.getScaleY());
      break;
    default:
      throw new Error("Unknown Pix Path Type");
  }
};

/**
* @private
*/
SL.CharacterRenderer.prototype.setCursorLocation = function(x, y) {
  this._cx = x;
  this._cy = y;
};

/**
* @private
*/
SL.CharacterRenderer.prototype.advanceCursor = function() {
  this._cx = this._cx + this._scaledCellWidth;
};

/**
* @private
*/
SL.CharacterRenderer.prototype.setColor = function(color) {
  this._color = color;
};

/**
* @private
*/
SL.CharacterRenderer.prototype.setBackgroundColor = function(backgroundColor) {
  this._backgroundColor = backgroundColor;
};
