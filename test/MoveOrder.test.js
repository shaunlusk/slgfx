var MoveOrder = require('../src/MoveOrder');
var Mocks = require('./Mocks');
var Utils = require('../src/Utils');

describe("MoveOrder", function(){
  describe("#update()", function(){
    it("should return if not started", function(done){
      var time = 0;
      var diff = 16;
      var move = new MoveOrder(Mocks.getMockGfxElement(),5, 5, 100);

      move.update(time,diff);

      expect(move._startTime).toBe(-1);
      done();
    });
    it("should return if ended", function(done){
      var time = 0;
      var diff = 16;
      var move = new MoveOrder(Mocks.getMockGfxElement(),5, 5, 100);
      move._end = true;

      move.update(time,diff);

      expect(move._startTime).toBe(-1);
      done();
    });
    it("should set start time if start time is -1", function(done){
      var time = 0;
      var diff = 16;
      var move = new MoveOrder(Mocks.getMockGfxElement(),5, 5, 100);
      move.start();

      move.update(time,diff);

      expect(move._startTime).toBe(0);
      done();
    });
    it("should not set start time if start time is not -1", function(done){
      var time = 0;
      var diff = 16;
      var move = new MoveOrder(Mocks.getMockGfxElement(),5, 5, 100);
      move.start();
      move.update(time,diff);
      time = 8;

      move.update(time,diff);

      expect(move._startTime).toBe(0);
      done();
    });
    it("should end if time percent is >=1", function(done){
      var time = 0;
      var diff = 16;
      var move = new MoveOrder(Mocks.getMockGfxElement(),5, 5, 100);
      move.start();
      move.update(time,diff);
      time = 100;

      move.update(time,diff);

      expect(move._end).toBeTruthy();
      done();
    });
    it("should update element coords if time percent is < 1", function(done){
      var time = 0;
      var diff = 16;
      var element = Mocks.getMockGfxElement();
      var move = new MoveOrder(element,5, 5, 100);

      move.start();
      move.update(time,diff);
      time = 50;
      move.update(time,diff);

      expect(element.getX()).toBeGreaterThan(2);
      expect(element.getY()).toBeGreaterThan(2);
      done();
    });
  });
  describe("#_end()", function(){
    it("should set end true", function(done){
      var move = new MoveOrder(Mocks.getMockGfxElement(),5, 5, 100);

      move.end();

      expect(move._end).toBeTruthy();
      done();
    });
    it("should set element coords to move target coords", function(done){
      var move = new MoveOrder(Mocks.getMockGfxElement(),5, 5, 100);

      move.end();

      expect(move._element.x).toBe(5);
      expect(move._element.y).toBe(5);
      done();
    });
    it("should call elementCallback", function(done){
      var a = {};
      var move = new MoveOrder(Mocks.getMockGfxElement(),5, 5, 100, function() {
        a.calledIt = true;
      });

      move.end();
      expect(a.calledIt).toBeTruthy();
      done();
    });
  });
  describe("#_timePercent()", function() {
    it("it should return proper time percent", function(done){
      var move = new MoveOrder(Mocks.getMockGfxElement(), null, null, 100);
      move._startTime = 0;
      var result, time;
      time = 0;
      result = move._timePercent(time);
      expect(result).toBe(0);
      time = 45;
      result = move._timePercent(time);
      expect(result).toBe(0.45);
      time = 99;
      result = move._timePercent(time);
      expect(result).toBe(0.99);
      time = 100;
      result = move._timePercent(time);
      expect(result).toBe(1);
      done();
    });
  });
});
