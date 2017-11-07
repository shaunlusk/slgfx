var SL = SL || {};

/** @class
*/
SL.LpcEntityElementGenerator = function() {};

SL.LpcEntityElementGenerator.prototype.createStandSouthElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "stand", "south", props);
};
SL.LpcEntityElementGenerator.prototype.createStandNorthElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "stand", "north", props);
};
SL.LpcEntityElementGenerator.prototype.createStandEastElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "stand", "east", props);
};
SL.LpcEntityElementGenerator.prototype.createStandWestElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "stand", "west", props);
};

SL.LpcEntityElementGenerator.prototype.createCastHoldSouthElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "castHold", "south", props);
};
SL.LpcEntityElementGenerator.prototype.createCastHoldNorthElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "castHold", "north", props);
};
SL.LpcEntityElementGenerator.prototype.createCastHoldEastElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "castHold", "east", props);
};
SL.LpcEntityElementGenerator.prototype.createCastHoldWestElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "castHold", "west", props);
};

SL.LpcEntityElementGenerator.prototype.createCastDoneSouthElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "castDone", "south", props);
};
SL.LpcEntityElementGenerator.prototype.createCastDoneNorthElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "castDone", "north", props);
};
SL.LpcEntityElementGenerator.prototype.createCastDoneEastElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "castDone", "east", props);
};
SL.LpcEntityElementGenerator.prototype.createCastDoneWestElement = function(img, screenContext, gfxLayer, props) {
  return this.createElement(img, screenContext, gfxLayer, "castDone", "west", props);
};

SL.LpcEntityElementGenerator.prototype.createElement = function(img, screenContext, gfxLayer, action, direction, props) {
  props = {
    image:img,
    sourceX : SL.LpcConstants[action][direction].sx,
    sourceY : SL.LpcConstants[action][direction].sy,
    sourceWidth: SL.LpcConstants[action].width || SL.LpcConstants.width,
    sourceHeight: SL.LpcConstants[action].height || SL.LpcConstants.height,
    width : SL.LpcConstants[action].width || SL.LpcConstants.width,
    height : SL.LpcConstants[action].height || SL.LpcConstants.height,
  };
  var element = new SL.ImageElement(screenContext, gfxLayer, props);
  gfxLayer.addElement(element);
  return element;
};

SL.LpcEntityElementGenerator.prototype.createWalkWestSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "walk", "west", props);
};
SL.LpcEntityElementGenerator.prototype.createWalkNorthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "walk", "north", props);
};
SL.LpcEntityElementGenerator.prototype.createWalkEastSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "walk", "east", props);
};
SL.LpcEntityElementGenerator.prototype.createWalkSouthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "walk", "south", props);
};

SL.LpcEntityElementGenerator.prototype.createSpellCasSLestSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "spellCast", "west", props);
};
SL.LpcEntityElementGenerator.prototype.createSpellCastNorthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "spellCast", "north", props);
};
SL.LpcEntityElementGenerator.prototype.createSpellCastEastSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "spellCast", "east", props);
};
SL.LpcEntityElementGenerator.prototype.createSpellCastSouthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "spellCast", "south", props);
};

SL.LpcEntityElementGenerator.prototype.createThrusSLestSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "thrust", "west", props);
};
SL.LpcEntityElementGenerator.prototype.createThrustNorthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "thrust", "north", props);
};
SL.LpcEntityElementGenerator.prototype.createThrustEastSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "thrust", "east", props);
};
SL.LpcEntityElementGenerator.prototype.createThrustSouthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "thrust", "south", props);
};

SL.LpcEntityElementGenerator.prototype.createSlashWestSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "slash", "west", props);
};
SL.LpcEntityElementGenerator.prototype.createSlashNorthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "slash", "north", props);
};
SL.LpcEntityElementGenerator.prototype.createSlashEastSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "slash", "east", props);
};
SL.LpcEntityElementGenerator.prototype.createSlashSouthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "slash", "south", props);
};

SL.LpcEntityElementGenerator.prototype.createShooSLestSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "shoot", "west", props);
};
SL.LpcEntityElementGenerator.prototype.createShootNorthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "shoot", "north", props);
};
SL.LpcEntityElementGenerator.prototype.createShootEastSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "shoot", "east", props);
};
SL.LpcEntityElementGenerator.prototype.createShootSouthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "shoot", "south", props);
};

SL.LpcEntityElementGenerator.prototype.createBigAttackWestSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "bigAttack", "west", props);
};
SL.LpcEntityElementGenerator.prototype.createBigAttackNorthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "bigAttack", "north", props);
};
SL.LpcEntityElementGenerator.prototype.createBigAttackEastSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "bigAttack", "east", props);
};
SL.LpcEntityElementGenerator.prototype.createBigAttackSouthSprite = function(img, screenContext, gfxLayer, props) {
  return this.createSprite(img, screenContext, gfxLayer, "bigAttack", "south", props);
};

SL.LpcEntityElementGenerator.prototype.createSprite = function(img, screenContext, gfxLayer, action, direction, props) {
  // props = props || {};
  // TODO: merge props
  var frames = SL.LpcConstants[action][direction].map(function(frameProps) {
    return new SL.ImageSpriteFrame({
      duration: frameProps.duration || SL.LpcConstants[action].duration,
      sourceX:frameProps.sx,
      sourceY:frameProps.sy,
      sourceWidth: SL.LpcConstants[action].width || SL.LpcConstants.width,
      sourceHeight: SL.LpcConstants[action].height || SL.LpcConstants.height
    });
  });

  props = {
    image:img,
    width : SL.LpcConstants[action].width || SL.LpcConstants.width,
    height : SL.LpcConstants[action].height || SL.LpcConstants.height,
    frames : frames
  };
  var element = new SL.ImageSprite(screenContext, gfxLayer, props);
  gfxLayer.addElement(element);
  return element;
};
