var EventType = {};

EventType.SCREEN_PAUSED = "SCREEN_PAUSED";
EventType.SCREEN_RESUMED = "SCREEN_RESUMED";
EventType.BEFORE_RENDER = "BEFORE_RENDER";
EventType.AFTER_RENDER = "AFTER_RENDER";
EventType.MOUSE_MOVE = "MOUSE_MOVE";
EventType.MOUSE_UP = "MOUSE_UP";
EventType.MOUSE_DOWN = "MOUSE_DOWN";
EventType.ELEMENT_MOVED = "ELEMENT_MOVED";
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
