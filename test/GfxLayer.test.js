var EventType = require('../src/EventType');
var GfxLayer = require('../src/GfxLayer');
var Mocks = require('./Mocks');

describe("GfxLayer", function() {
  var gfxLayer, mockElement;
  beforeEach(function() {
    gfxLayer = new GfxLayer();
    mockElement = Mocks.getMockGfxElement({id:"mockElement"});
    gfxLayer.addElement(mockElement);
  });
  describe("#addElement()", function() {
    it("should add an element to _elements array.", function(done) {
      var gfxLayer = new GfxLayer();
      var mockElement = Mocks.getMockGfxElement();

      gfxLayer.addElement(mockElement);

      expect(gfxLayer._elements.length).toBe(1);
      done();
    });
  });
  describe("#removeElementById()", function() {
    it("should return the element if it is in the list", function(done) {
      var removed = gfxLayer.removeElementById("mockElement");

      expect(removed.id).toBe(mockElement.id);
      done();
    });
    it("should not immediately modify the element list", function(done) {
      var removed = gfxLayer.removeElementById("mockElement");

      expect(gfxLayer._elements.length).toBe(1);
      done();
    });
    it("should mark element dirty", function(done) {
      var removed = gfxLayer.removeElementById("mockElement");

      expect(removed.isDirty()).toBeTruthy();
      done();
    });
    it("should mark element hidden", function(done) {
      var removed = gfxLayer.removeElementById("mockElement");

      expect(removed.isHidden()).toBeTruthy();
      done();
    });
    it("should return null if element not present", function(done) {
      var removed = gfxLayer.removeElementById("mockElement2");

      expect(removed).toBeNull();
      done();
    });
  });
  describe("#removeElement()", function() {
    it("should call removeElementById with element id", function(done) {
      gfxLayer.removeElementById = function(id) {this.calledItWith = id;};

      var removed = gfxLayer.removeElement(mockElement);

      expect(gfxLayer.calledItWith).toBe("mockElement");
      done();
    });
  });
  describe("#update()", function() {
    it("should call update on each element", function(done) {
      gfxLayer._handleCollisions = function() {};
      gfxLayer._checkBorderCollision = function() {};
      mockElement.update = function() {this.calledIt = true;};
      var mockElement2 = Mocks.getMockGfxElement({id:"mockElement2"});
      mockElement2.update = function() {this.calledIt = true;};
      gfxLayer.addElement(mockElement2);

      var removed = gfxLayer.update();

      expect(mockElement.calledIt).toBeTruthy();
      expect(mockElement2.calledIt).toBeTruthy();
      done();
    });
    it("should call _checkBorderCollision on each element", function(done) {
      gfxLayer._handleCollisions = function() {};
      var calledItCount = 0;
      gfxLayer._checkBorderCollision = function() {calledItCount++;};
      mockElement.update = function() {};
      var mockElement2 = Mocks.getMockGfxElement({id:"mockElement2"});
      gfxLayer._checkBorderCollision = function() {calledItCount++;};
      mockElement2.update = function() {};
      gfxLayer.addElement(mockElement2);

      var removed = gfxLayer.update();

      expect(calledItCount).toBe(2);
      done();
    });
    it("should add dirty elements to dirty elements list", function(done) {
      gfxLayer._handleCollisions = function() {};
      gfxLayer._checkBorderCollision = function() {};
      mockElement.update = function() {return true;};

      var removed = gfxLayer.update();

      expect(gfxLayer._dirtyElements.size()).toBe(1);
      done();
    });
    it("should not add non-dirty elements to dirty elements list", function(done) {
      gfxLayer._handleCollisions = function() {};
      gfxLayer._checkBorderCollision = function() {};
      mockElement.update = function() {return false;};

      var removed = gfxLayer.update();

      expect(gfxLayer._dirtyElements.size()).toBe(0);
      done();
    });
    it("should call _handleCollisions", function(done) {
      gfxLayer._handleCollisions = function() {this.calledIt = true;};
      gfxLayer._checkBorderCollision = function() {};
      mockElement.update = function() {return false;};

      var removed = gfxLayer.update();

      expect(gfxLayer.calledIt).toBeTruthy();
      expect(gfxLayer.calledIt).toBeTruthy();
      done();
    });
  });
  describe("#_collisionCheckElementsIfNeeded()", function() {
    it("should call collision check if either element is visible or not dirty", function(done) {
      var mockElement1 = Mocks.getMockGfxElement({dirty:true});
      mockElement1.collidesWith = function() {this.calledIt = true;};
      var mockElement2 = Mocks.getMockGfxElement({hidden:true});

      gfxLayer._collisionCheckElementsIfNeeded(mockElement1,mockElement2);

      expect(mockElement1.calledIt).toBeTruthy();
      done();
    });
    it("should not call update on collision if collisionCheck is false", function(done) {
      gfxLayer._updateElementOnCollision = function() {this.calledIt = true;};
      var mockElement1 = Mocks.getMockGfxElement();
      mockElement1.collidesWith = function() {return false;};
      var mockElement2 = Mocks.getMockGfxElement();

      gfxLayer._collisionCheckElementsIfNeeded(mockElement1,mockElement2);

      expect(gfxLayer.calledIt).toBeUndefined();
      done();
    });
    it("should call updateOnCollision for each element if collisionCheck is true", function(done) {
      gfxLayer.calledItCount = 0;
      gfxLayer._updateElementOnCollision = function() {this.calledItCount++;};
      var mockElement1 = Mocks.getMockGfxElement();
      mockElement1.collidesWith = function() {return true;};
      var mockElement2 = Mocks.getMockGfxElement();

      gfxLayer._collisionCheckElementsIfNeeded(mockElement1,mockElement2);

      expect(gfxLayer.calledItCount).toBe(2);
      done();
    });
  });
  describe("#_updateElementOnCollision()", function() {
    it("should set element hasCollision", function(done) {
      var mockElement1 = Mocks.getMockGfxElement();

      gfxLayer._updateElementOnCollision(mockElement1);

      expect(mockElement1.collision).toBeTruthy();
      done();
    });
    it("should set element dirty", function(done) {
      var mockElement1 = Mocks.getMockGfxElement();

      gfxLayer._updateElementOnCollision(mockElement1);

      expect(mockElement1.dirty).toBeTruthy();
      done();
    });
    it("should add element to dirty elements list, if wasn't dirty", function(done) {
      var mockElement1 = Mocks.getMockGfxElement();

      gfxLayer._updateElementOnCollision(mockElement1);

      expect(gfxLayer._dirtyElements.size()).toBe(1);
      done();
    });
    it("should add element to dirty elements list, even if was dirty", function(done) {
      var mockElement1 = Mocks.getMockGfxElement({dirty:true});

      gfxLayer._updateElementOnCollision(mockElement1);

      expect(gfxLayer._dirtyElements.size()).toBe(1);
      done();
    });
  });
  describe("#render()", function() {
    it("should call preRender on dirtyElements", function(done) {
      var mockElement1 = Mocks.getMockGfxElement();
      mockElement1.preRender = function() {this.calledIt = true;};
      gfxLayer._dirtyElements.push(mockElement1.getZIndexComparable());

      gfxLayer.render();

      expect(mockElement1.calledIt).toBeTruthy();
      done();
    });
    it("should call render on dirtyElements", function(done) {
      var mockElement1 = Mocks.getMockGfxElement();
      mockElement1.render = function() {this.calledIt = true;};
      mockElement1.preRender = function() {return true;};
      gfxLayer._dirtyElements.push(mockElement1.getZIndexComparable());

      gfxLayer.render();

      expect(mockElement1.calledIt).toBeTruthy();
      done();
    });
  });
  describe("#_cleanUp()", function() {
    it("should remove elements from elements list.", function(done) {
      gfxLayer._removedElements.mockElement = mockElement;

      gfxLayer._cleanUp();

      expect(gfxLayer._elements.length).toBe(0);
      done();
    });
    it("should clear removed elements.", function(done) {
      gfxLayer._removedElements.mockElement = mockElement;

      gfxLayer._cleanUp();

      expect(gfxLayer._removedElements.mockElement).toBeUndefined();
      done();
    });
    it("should clear dirty elements.", function(done) {
      gfxLayer._dirtyElements.push(mockElement.getZIndexComparable());

      gfxLayer._cleanUp();

      expect(gfxLayer._dirtyElements.size()).toBe(0);
      done();
    });
  });
  describe("#_checkBorderCollision()", function() {
    var notifiedWith = null;
    var time = 1;
    beforeEach(function() {
      gfxLayer.getCanvas = function() {return {width:320, height:200};};
      mockElement.getCollisionBoxWidth = function() {return 10;};
      mockElement.getCollisionBoxHeight = function() {return 10;};
      mockElement.notify = function(event) {notifiedWith = event.type;};
    });
    it("should notify screen when ELEMENT_HIT_LEFT_EDGE", function(done) {
      mockElement.getCollisionBoxX = function() {return 0;};
      mockElement.getCollisionBoxY = function() {return 5;};

      gfxLayer._checkBorderCollision(mockElement,time);

      expect(notifiedWith).toBe(EventType.ELEMENT_HIT_LEFT_EDGE);
      done();
    });
    it("should notify screen when ELEMENT_HIT_RIGHT_EDGE", function(done) {
      mockElement.getCollisionBoxX = function() {return 318;};
      mockElement.getCollisionBoxY = function() {return 5;};

      gfxLayer._checkBorderCollision(mockElement,time);

      expect(notifiedWith).toBe(EventType.ELEMENT_HIT_RIGHT_EDGE);
      done();
    });
    it("should notify screen when ELEMENT_HIT_TOP_EDGE", function(done) {
      mockElement.getCollisionBoxX = function() {return 5;};
      mockElement.getCollisionBoxY = function() {return 0;};

      gfxLayer._checkBorderCollision(mockElement,time);

      expect(notifiedWith).toBe(EventType.ELEMENT_HIT_TOP_EDGE);
      done();
    });
    it("should notify screen when ELEMENT_HIT_BOTTOM_EDGE", function(done) {
      mockElement.getCollisionBoxX = function() {return 0;};
      mockElement.getCollisionBoxY = function() {return 198;};

      gfxLayer._checkBorderCollision(mockElement,time);

      expect(notifiedWith).toBe(EventType.ELEMENT_HIT_BOTTOM_EDGE);
      done();
    });
  });
  describe("#_handleCollisions()", function() {
    var mockElement2;
    beforeEach(function() {
      mockElement2 = Mocks.getMockGfxElement({id:"mockElement2"});
      gfxLayer.addElement(mockElement2);
    });
    it("should call _collisionCheckElementsIfNeeded on element pairs", function(done) {
      var calledIt = false;
      gfxLayer._collisionCheckElementsIfNeeded = function() {calledIt = true;};

      gfxLayer._handleCollisions();

      expect(calledIt).toBeTruthy();
      done();
    });
  });
  describe("#handleMouseEvent()", function() {
    it("should call handleMouseEvent on elements", function(done) {
      mockElement.handleMouseEvent = function() {this.calledIt = true;};

      gfxLayer.handleMouseEvent({});

      expect(mockElement.calledIt).toBeTruthy();
      done();
    });
  });
});
