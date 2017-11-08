
SL.GfxElementSetEntry = function(props) {
  this._element = props.element;
  this._offsetX = props.offsetX || 0;
  this._offsetY = props.offsetY || 0;
  this._x = props.x || 0;
  this._y = props.y || 0;
  this._id = props.id;
};

SL.GfxElementSetEntry.prototype.getId = function() {return this._id;};

SL.GfxElementSetEntry.prototype.moveElementTo = function(coordinates) {
  this.setX(coordinates.x);
  this.setY(coordinates.y);
};

SL.GfxElementSetEntry.prototype.setX = function(x) {
  this._x = x;
  this._element.setX(x + this.getOffsetX());
};

SL.GfxElementSetEntry.prototype.setY = function(y) {
  this._y = y;
  this._element.setY(y + this.getOffsetY());
};

SL.GfxElementSetEntry.prototype.getCoordinates = function() {return {x:this.getX(), y:this.getY()};};

SL.GfxElementSetEntry.prototype.activate = function() {
  this._element.show();
};

SL.GfxElementSetEntry.prototype.deactivate = function() {
  this._element.hide();
};
