/**
* Animation frame interface used by sprites.
* These are intended to be lightweight, and purpose built for the type of Sprite.
* @interface AnimationFrame
* @see ImageSprite
*/
export interface IAnimationFrame {
  /** Return the duration to display this frame.
  * @returns {number}
  */
  getDuration(): number;
}
