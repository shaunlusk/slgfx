/** Event types enumeration.
* @enum {string}
* @namespace
*/
var EventType = {};

EventType.SCREEN_PAUSED = "SCREEN_PAUSED";
EventType.SCREEN_RESUMED = "SCREEN_RESUMED";
EventType.BEFORE_RENDER = "BEFORE_RENDER";
EventType.AFTER_RENDER = "AFTER_RENDER";
EventType.MOUSE_MOVE = "MOUSE_MOVE";
EventType.MOUSE_UP = "MOUSE_UP";
EventType.MOUSE_DOWN = "MOUSE_DOWN";
EventType.ELEMENT_MOVED = "ELEMENT_MOVED";
/** A GfxElement started moving.
* @see ElementEvent
*/
EventType.ELEMENT_STARTED_MOVING = "ELEMENT_STARTED_MOVING";
EventType.ELEMENT_STOPPED_MOVING = "ELEMENT_STOPPED_MOVING";
EventType.ELEMENT_COLLISION = "ELEMENT_COLLISION";

EventType.MOUSE_ENTER_ELEMENT = "MOUSE_ENTER_ELEMENT";
EventType.MOUSE_EXIT_ELEMENT = "MOUSE_EXIT_ELEMENT";
EventType.MOUSE_MOVE_OVER_ELEMENT = "MOUSE_MOVE_OVER_ELEMENT";
EventType.MOUSE_DOWN_ON_ELEMENT = "MOUSE_DOWN_ON_ELEMENT";
EventType.MOUSE_UP_ON_ELEMENT = "MOUSE_UP_ON_ELEMENT";
EventType.ELEMENT_HIT_LEFT_EDGE = "ELEMENT_HIT_LEFT_EDGE";
EventType.ELEMENT_HIT_RIGHT_EDGE = "ELEMENT_HIT_RIGHT_EDGE";
EventType.ELEMENT_HIT_TOP_EDGE = "ELEMENT_HIT_TOP_EDGE";
EventType.ELEMENT_HIT_BOTTOM_EDGE = "ELEMENT_HIT_BOTTOM_EDGE";
EventType.SPRITE_ANIMATION_DONE = "SPRITE_ANIMATION_DONE";
/** Intended for use as one-time events; handlers will be cleared by the screen after each frame. */
EventType.NEXT_FRAME_BEGIN = "NEXT_FRAME_BEGIN";
/** Intended for use as one-time events; handlers will be cleared by the screen after each frame. */
EventType.NEXT_FRAME_END = "NEXT_FRAME_END";

module.exports = EventType;

/**
 * A Mouse Event on a GfxElement.
 * @typedef {Object} ElementMouseEvent
 * @property {string} type EventType
 * @property {Object} data The data provided by the event emitter.
 * @property {number} data.x The functional x coordinate of the mouse, incorporating the scale of canvas context wrapper view origin.
 * @property {number} data.y The functional y coordinate of the mouse, incorporating the scale of canvas context wrapper view origin.
 * @property {number} data.viewOriginAdjustedX The x coordinate of the mouse, relative to the view origin of the canvas context wrapper.
 * @property {number} data.viewOriginAdjustedY The y coordinate of the mouse, relative to the view origin of the canvas context wrapper.
 * @property {number} data.rawX The raw, unscaled x coordinate of the mouse, relative to the canvas.
 * @property {number} data.rawY The raw, unscaled y coordinate of the mouse, relative to the canvas.
 * @property {GfxElement} data.element The element that the mouse interacted with.
 * @property {number} time The time the event was fired.
 */

 /**
  * GfxElement Event.
  * @typedef {Object} ElementEvent
  * @property {string} type EventType
  * @property {Object} data The data provided by the event emitter.
  * @property {GfxElement} data.element The element where the event occurred.
  * @property {number} time The time the event was fired.
  */

  /**
   * GfxElement collides with another.
   * @typedef {Object} ElementCollidesWithElementEvent
   * @property {string} type EventType
   * @property {Object} data The data provided by the event emitter.
   * @property {GfxElement} data.element1 The first element in the collision.
   * @property {GfxElement} data.element2 The first element in the collision.
   * @property {number} time The time the event was fired.
   */
