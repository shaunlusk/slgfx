var UniquePriorityQueue = require("slcommon/src/UniquePriorityQueue");
var Utils = require("slcommon/src/Utils");
var Event = require("slcommon/src/Event");
var EventType = require("./src/EventType");
var Layer = require("./src/Layer");

if (typeof window !== 'undefined' && window) {
  window.SL = window.SL || {};
  window.SL.Event = Event;
  window.SL.Utils = Utils;
  window.document.addEventListener("mouseup", function(e) {
    console.log(e);
  })
  var a = new Event("fake", {check:"check"});
  console.log(a);
}
