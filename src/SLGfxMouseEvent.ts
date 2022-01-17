import { Event } from '@shaunlusk/slcommon';

/**
* MouseEvent - mouseup, mousedown, mousemove
* @constructor
* @param {EventType} type The type of the event. Refer to EventType (in slcommon).
* @param {Object} data Data for the event.  Determined by event emitter.
* @param {time} [time] Optional.  The time the event occurred. If not specified, uses performance.now()
*/
export class SLGfxMouseEvent extends Event {
  constructor(type: string, data: MouseEventData, time?: number) {
    super(type, data, time);
    this.endEventPropagation = false; 
  }

  public endEventPropagation: boolean;
}

export interface MouseEventData {
  x: number;
  y: number;
  viewOriginAdjustedX: number;
  viewOriginAdjustedY: number;
  rawX: number;
  rawY: number;
}