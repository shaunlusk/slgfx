var SL = SL || {};

/**
* Animation frame interface used by sprites.
* These are intended to be lightweight, and purpose built for the type of Sprite.
* @interface AnimationFrame
* @see SL.ImageSprite
* @see SL.PixSprite
*/
SL.AnimationFrame = function() {};

/** Return the duration to display this frame.
* @returns {number}
*/
SL.AnimationFrame.prototype.getDuration = function() {throw new Error("getDuration Not Implemented on this AnimationFrame");};
