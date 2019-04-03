/**
* Animation frame interface used by sprites.
* These are intended to be lightweight, and purpose built for the type of Sprite.
* @interface AnimationFrame
* @see ImageSprite
*/
function AnimationFrame() {};

/** Return the duration to display this frame.
* @returns {number}
*/
AnimationFrame.prototype.getDuration = function() {throw new Error("getDuration Not Implemented on this AnimationFrame");};

module.exports = AnimationFrame;
