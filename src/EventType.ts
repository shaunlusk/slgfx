/** Event types enumeration.
* @enum {string}
* @namespace
*/
export enum EventType {

  /** Fired when the screen is paused. */
  SCREEN_PAUSED = "SCREEN_PAUSED",
  /** Fired when the screen is unpaused. */
  SCREEN_RESUMED = "SCREEN_RESUMED",
  /** Fired before the next frame is rendered. */
  BEFORE_RENDER = "BEFORE_RENDER",
  /** Fired after the last frame render completes */
  AFTER_RENDER = "AFTER_RENDER",
  /** Fired when the mouse moves inside the bounds of the Screen. */
  MOUSE_MOVE = "MOUSE_MOVE",
  /** Fired when the mouse button is released inside the bounds of the Screen. */
  MOUSE_UP = "MOUSE_UP",
  /** Fired when the mouse button is pressed inside the bounds of the Screen. */
  MOUSE_DOWN = "MOUSE_DOWN",

  /** A GfxElement moved.
  * @see ElementEvent
  */
  ELEMENT_MOVED = "ELEMENT_MOVED",

  /** A GfxElement started moving.
  * @see ElementEvent
  */
  ELEMENT_STARTED_MOVING = "ELEMENT_STARTED_MOVING",

  /** A GfxElement stopped moving.
  * @see ElementEvent
  */
  ELEMENT_STOPPED_MOVING = "ELEMENT_STOPPED_MOVING",

  /** A GfxElement stopped moving.
  * @see ElementCollidesWithElementEvent
  */
  ELEMENT_COLLISION = "ELEMENT_COLLISION",

  /** The mouse entered an element's collison box.
  * @see ElementMouseEvent
  */
  MOUSE_ENTER_ELEMENT = "MOUSE_ENTER_ELEMENT",

  /** The mouse left an element's collison box.
  * @see ElementMouseEvent
  */
  MOUSE_EXIT_ELEMENT = "MOUSE_EXIT_ELEMENT",

  /** The mouse moved within an element's collison box.
  * @see ElementMouseEvent
  */
  MOUSE_MOVE_OVER_ELEMENT = "MOUSE_MOVE_OVER_ELEMENT",

  /** The mouse button was pressed within an element's collison box.
  * @see ElementMouseEvent
  */
  MOUSE_DOWN_ON_ELEMENT = "MOUSE_DOWN_ON_ELEMENT",

  /** The mouse button was released within an element's collison box.
  * @see ElementMouseEvent
  */
  MOUSE_UP_ON_ELEMENT = "MOUSE_UP_ON_ELEMENT",

  /** An Element hit the left edge of a layer.
  * @see ElementCollidesWithEdgeEvent
  */
  ELEMENT_HIT_LEFT_EDGE = "ELEMENT_HIT_LEFT_EDGE",

  /** An Element hit the right edge of a layer.
  * @see ElementCollidesWithEdgeEvent
  */
  ELEMENT_HIT_RIGHT_EDGE = "ELEMENT_HIT_RIGHT_EDGE",

  /** An Element hit the top edge of a layer.
  * @see ElementCollidesWithEdgeEvent
  */
  ELEMENT_HIT_TOP_EDGE = "ELEMENT_HIT_TOP_EDGE",

  /** An Element hit the bottom edge of a layer.
  * @see ElementCollidesWithEdgeEvent
  */
  ELEMENT_HIT_BOTTOM_EDGE = "ELEMENT_HIT_BOTTOM_EDGE",

  /** A sprite completed its animation */
  SPRITE_ANIMATION_DONE = "SPRITE_ANIMATION_DONE",
  /** Intended for use as one-time events, handlers will be cleared by the screen after each frame. */
  NEXT_FRAME_BEGIN = "NEXT_FRAME_BEGIN",
  /** Intended for use as one-time events, handlers will be cleared by the screen after each frame. */
  NEXT_FRAME_END = "NEXT_FRAME_END",

}

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

/**
* GfxElement hit the edge of a layer.
* @typedef {Object} ElementCollidesWithEdgeEvent
* @property {string} type EventType, indicates which edge was hit.
* @property {Object} data The data provided by the event emitter.
* @property {GfxLayer} data.layer The layer where the event occured.
* @property {GfxElement} data.element The element that hit the edge.
* @property {number} time The time the event was fired.
*/

/**
 * A Mouse Event on the screen.
 * @typedef {Object} ScreenMouseEvent
 * @property {string} type EventType
 * @property {Object} data The data provided by the event emitter.
 * @property {number} data.x The functional x coordinate of the mouse, incorporating the scale of canvas context wrapper view origin.
 * @property {number} data.y The functional y coordinate of the mouse, incorporating the scale of canvas context wrapper view origin.
 * @property {number} data.viewOriginAdjustedX The x coordinate of the mouse, relative to the view origin of the canvas context wrapper.
 * @property {number} data.viewOriginAdjustedY The y coordinate of the mouse, relative to the view origin of the canvas context wrapper.
 * @property {number} data.rawX The raw, unscaled x coordinate of the mouse, relative to the canvas.
 * @property {number} data.rawY The raw, unscaled y coordinate of the mouse, relative to the canvas.
 * @property {event} data.baseEvent The original mouse event in the browser.  Only provided on mouse up/down events.
 * @property {number} time The time the event was fired.
 */

/**
* Event that is triggered immediately before or after the screen's render cycle.
* @typedef {Object} ScreenRenderEvent
* @property {string} type EventType
* @property {Object} data The data provided by the event emitter.
* @property {number} data.diff The amount of time passed between this and the last render cycle.
* @property {number} time The time the event was fired.
*/
