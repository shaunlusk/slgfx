var Event = require('slcommon/src/Event');

/**
* MouseEvent - mouseup, mousedown, mousemove
* @constructor
* @param {EventType} type The type of the event. Refer to EventType (in slcommon).
* @param {Object} data Data for the event.  Determined by event emitter.
* @param {time} [time] Optional.  The time the event occurred. If not specified, uses performance.now()
*/
function MouseEvent(type, data, time) {
  Event.call(this, type, data, time);
  this.endEventPropagation = false;
};

MouseEvent.prototype = new Event();
MouseEvent.prototype.constructor = MouseEvent;

module.exports = MouseEvent;
