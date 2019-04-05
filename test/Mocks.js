var Mocks = {};

Mocks.getMockLayerFactory = function(props) {
  props = props || {};
  var factory = {
    layer : Mocks.getMockLayer(props),
    getLayer : function() {return this.layer;}
  };

  return factory;
};

Mocks.getMockLayer = function(props) {
  props = props || {};
  var layer = {
    getWidth : function() {return 0;},
    getHeight : function() {return 0;},
    getScreenContext : function() {return props.screenContext || null;},
    getCanvasContextWrapper : function() {return Mocks.getMockCanvasContextWrapper();},
    update : function() {},
    render : function() {},
    handleMouseEvent : function() {},
    clearLayer : function() {}
  };

  return layer;
};

Mocks.getMockGfxElement = function(props) {
  props = props || {};
  var element = {};
  element.id = props.id || 1;
  element.getId = function() {return this.id;};
  element.dirty = props.dirty || false;
  element.setDirty = function(boolean) {this.dirty = boolean;};
  element.isDirty = function() {return this.dirty;};
  element.hidden = props.hidden || false;
  element.isHidden = function() {return this.hidden;};
  element.setHidden = function(val) {this.hidden = val;};
  element.getZIndexComparable = function() {
    return {
      getElement : function() {return element;},
      getKey : function() {return 0;}
    };
  };
  element.collidesWith = function() {return false;};
  element.collidesWithX = function() {return false;};
  element.collidesWithY = function() {return false;};
  element.setHasCollision = function(val) {this.collision = val;};
  element.collision = props.collision || false;
  element.hasCollision = function() {return this.collision;};
  element.clear = function() {};
  element.render = function() {};
  element.preRender = function() {};
  element.postRender = function() {};
  element.getRotation = function() {};
  element.x = props.x || 0;
  element.y = props.y || 0;
  element.getX = function() {return this.x;};
  element.getY = function() {return this.y;};
  element.setX = function(x) {this.x = x;};
  element.setY = function(y) {this.y = y;};
  element.zIndex = props.zIndex || -1;
  element.getZIndex = function() {return this.zIndex;};
  element.setZIndex = function(zidx) {this.zIndex = zidx;};
  element.collidesWithCoordinates = function(x,y) {return false;};

  return element;
};

Mocks.getMockScreen = function(props) {
  props = props || {};
  var screen = {};
  screen.scaleX = props.scaleX || 1;
  screen.scaleY = props.scaleY || 1;
  screen.getScaleX = function() {return this.scaleX;};
  screen.getScaleY = function() {return this.scaleY;};
  screen.addEventListener = function() {};
  screen.notify = function(event) {};
  return screen;
};

Mocks.getMockCanvasContextWrapper = function(props) {
  props = props || {};
  var context = {};
  context.clearRect = function(x, y, width, height) {
    this.clearedX = x;
    this.clearedY = y;
    this.clearedWidth = width;
    this.clearedHeight = height;
  };
  context.fillRect = function(x, y, width, height) {
    this.filledX = x;
    this.filledY = y;
    this.filledWidth = width;
    this.filledHeight = height;
  };
  context.getViewOriginX = function() {};
  context.getViewOriginY = function() {};
  context.setViewOriginX = function() {};
  context.setViewOriginY = function() {};
  context.getCanvasContext = function() {};
  context.isImageSmoothingEnabled = function() {};
  context.setImageSmoothingEnabled = function() {};
  context.clear = function() {};
  context.drawImage = function(image, sx, sy, sWidth, sHeight, x, y, width, height) {
    this.drawImage_image = image;
    this.drawImage_sx = sx;
    this.drawImage_sy = sy;
    this.drawImage_sWidth = sWidth;
    this.drawImage_sHeight = sHeight;
    this.drawImage_x = x;
    this.drawImage_y = y;
    this.drawImage_width = width;
    this.drawImage_height = height;
  };
  context.drawImageWithTranslation = function() {};
  context.fillRectWithTranslation = function() {};
  context.save = function() {};
  context.restore = function() {};
  context.translate = function() {};
  context.scale = function() {};
  context.rotate = function() {};
  context.isOutOfView = function() {};
  context.setFillStyle = function() {};
  context.beginPath = function() {};
  context.moveTo = function() {};
  context.lineTo = function() {};
  context.closePath = function() {};
  context.stroke = function() {};
  context.rect = function() {};
  context.setLineWidth = function() {};
  context.setStrokeStyle = function() {};
  context.strokeRect = function() {};
  context.fillText = function() {};
  context.strokeText = function() {};
  context.setFontStyle = function() {};
  context.setTextAlign = function() {};
  context.setTextBaseline = function() {};
  context.setTextDirection = function() {};

  return context;
};

module.exports = Mocks;
