var SL = SL || {};

/**
* MouseEvent - mouseup, mousedown, mousemove
* @constructor
* @param {SL.EventType} type The type of the event. Refer to SL.EventType (in slcommon).
* @param {Object} data Data for the event.  Determined by event emitter.
* @param {time} time Optional.  The time the event occurred. If not specified, uses performance.now()
*/
SL.MouseEvent = function(type, data, time) {
  SL.Event.call(this, type, data, time);
  this.endEventPropagation = false;
};

SL.MouseEvent.prototype = new SL.Event();
SL.MouseEvent.prototype.constructor = SL.MouseEvent;
