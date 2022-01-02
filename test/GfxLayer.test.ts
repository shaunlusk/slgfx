import * as TypeMoq from 'typemoq';
import { Event } from '@shaunlusk/slcommon';
import { ICanvasContextWrapper } from '../src/CanvasContextWrapper';
import { EventType } from '../src/EventType';
import { IGfxElement } from '../src/GfxElement';
import { GfxElementZIndexComparable } from '../src/GfxElementZIndexComparable';
import { GfxLayer } from '../src/GfxLayer';
import { SLGfxMouseEvent } from '../src/SlGfxMouseEvent';

describe("GfxLayer", function() {
  let gfxLayer: GfxLayer;
  const canvasContextWrapperMock: TypeMoq.IMock<ICanvasContextWrapper> = TypeMoq.Mock.ofType<ICanvasContextWrapper>();
  const gfxElementMock: TypeMoq.IMock<IGfxElement> = TypeMoq.Mock.ofType<IGfxElement>();
  const gfxElementMock2: TypeMoq.IMock<IGfxElement> = TypeMoq.Mock.ofType<IGfxElement>();

  beforeEach(function() {
    canvasContextWrapperMock.reset();
    gfxElementMock.reset();
    
    gfxElementMock.setup(x => x.getId()).returns(() => 99);
    gfxElementMock.setup(x => x.getZIndexComparable()).returns(() => new GfxElementZIndexComparable(gfxElementMock.object));

    gfxElementMock2.setup(x => x.getId()).returns(() => 90);
    gfxElementMock2.setup(x => x.getZIndexComparable()).returns(() => new GfxElementZIndexComparable(gfxElementMock2.object));

    gfxLayer = new GfxLayer({canvasContextWrapper: canvasContextWrapperMock.object});
    gfxLayer.addElement(gfxElementMock.object);
  });
  describe("#addElement()", function() {
    it("should add an element to _elements array.", function(done) {
      var gfxLayer = new GfxLayer({canvasContextWrapper: canvasContextWrapperMock.object});

      gfxLayer.addElement(gfxElementMock.object);

      expect(gfxLayer.elements.length).toBe(1);
      done();
    });
  });
  describe("#removeElementById()", function() {
    it("should return the element if it is in the list", function(done) {
      var removed = gfxLayer.removeElementById(99);

      expect(removed).toBeTruthy();
      expect(removed).toBe(gfxElementMock.object);
      done();
    });
    it("should not immediately modify the element list", function(done) {
      var removed = gfxLayer.removeElementById(99);

      expect(gfxLayer.elements.length).toBe(1);
      done();
    });
    it("should mark element dirty", function(done) {
      var removed = gfxLayer.removeElementById(99);

      gfxElementMock.verify(x => x.setDirty(TypeMoq.It.isValue(true)), TypeMoq.Times.once());
      done();
    });
    it("should mark element hidden", function(done) {
      var removed = gfxLayer.removeElementById(99);

      gfxElementMock.verify(x => x.setHidden(TypeMoq.It.isValue(true)), TypeMoq.Times.once());
      done();
    });
    it("should return null if element not present", function(done) {
      var removed = gfxLayer.removeElementById(1);

      expect(removed).toBeNull();
      done();
    });
  });
  describe("#removeElement()", function() {
    it("should call removeElementById with element id", function(done) {
      var removed = gfxLayer.removeElement(gfxElementMock.object);

      expect(removed).toBeTruthy();
      expect(removed).toBe(gfxElementMock.object);
      done();
    });
  });
  describe("#update()", function() {
    it("should call update on each element", function(done) {
      gfxLayer.update(0, 0);

      gfxElementMock.verify(x => x.update(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.once());
      done();
    });
    it("should add dirty elements to dirty elements list", function(done) {
      gfxElementMock.setup(x => x.update(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber())).returns(() => gfxElementMock.object);
      gfxLayer.update(0, 0);

      gfxElementMock.verify(x => x.getZIndexComparable(), TypeMoq.Times.once());
      done();
    });
    it("should not add non-dirty elements to dirty elements list", function(done) {
      gfxLayer.addElement(gfxElementMock2.object);

      gfxLayer.update(0, 0);

      gfxElementMock2.verify(x => x.getZIndexComparable(), TypeMoq.Times.never());
      done();
    });
    it("should call _handleCollisions", function(done) {
      gfxElementMock.setup(x => x.collidesWith(TypeMoq.It.isAny())).returns((() => true));
      gfxLayer.addElement(gfxElementMock2.object);

      gfxLayer.update(0, 0);

      gfxElementMock.verify(x => x.setHasCollision(TypeMoq.It.isValue(true)), TypeMoq.Times.once());
      gfxElementMock2.verify(x => x.setHasCollision(TypeMoq.It.isValue(true)), TypeMoq.Times.once());
      done();
    });
  });
  describe("#render()", function() {
    it("should call preRender on dirtyElements", function(done) {
      gfxElementMock.setup(x => x.isDirty()).returns(() => true);
      gfxElementMock.setup(x => x.update(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber())).returns(() => gfxElementMock.object);
      gfxLayer.update(0, 0);

      gfxLayer.render(0, 0);

      gfxElementMock.verify(x => x.preRender(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.once());
      done();
    });
    it("should call render on dirtyElements", function(done) {
      gfxElementMock.setup(x => x.isDirty()).returns(() => true);
      gfxElementMock.setup(x => x.update(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber())).returns(() => gfxElementMock.object);
      gfxElementMock.setup(x => x.preRender(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber())).returns(() => gfxElementMock.object);
      gfxLayer.update(0, 0);

      gfxLayer.render(0, 0);

      gfxElementMock.verify(x => x.render(TypeMoq.It.isAny(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber()), TypeMoq.Times.once());
      done();
    });
    it("should call postrender on dirtyElements", function(done) {
      gfxElementMock.setup(x => x.isDirty()).returns(() => true);
      gfxElementMock.setup(x => x.update(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyNumber())).returns(() => gfxElementMock.object);
      gfxLayer.update(0, 0);

      gfxLayer.render(0, 0);

      gfxElementMock.verify(x => x.postRender(0, 0), TypeMoq.Times.once());
      done();
    });
  });
  describe("#_cleanUp()", function() {
    it("should remove elements from elements list.", function(done) {
      gfxLayer.removeElement(gfxElementMock.object);
      gfxLayer.update(0, 0);

      gfxLayer.render(0, 0);

      expect(gfxLayer.elements.length).toBe(0);
      done();
    });
  });
  describe("#_checkBorderCollision()", function() {
    it("should notify screen when ELEMENT_HIT_LEFT_EDGE", function(done) {
      let type: EventType;
      gfxElementMock.setup(x => x.notify(TypeMoq.It.isAny())).callback(x => type = x.type);

      gfxElementMock.setup(x => x.getCollisionBoxX()).returns(() => 0);
      gfxElementMock.setup(x => x.getCollisionBoxY()).returns(() => 5);
      
      gfxLayer.update(0, 0);
      
      expect(type).toBe(EventType.ELEMENT_HIT_LEFT_EDGE);
      done();
    });
    it("should notify screen when ELEMENT_HIT_RIGHT_EDGE", function(done) {
      let type: EventType;
      gfxElementMock.setup(x => x.notify(TypeMoq.It.isAny())).callback(x => type = x.type);

      gfxElementMock.setup(x => x.getCollisionBoxX()).returns(() => 318);
      gfxElementMock.setup(x => x.getCollisionBoxWidth()).returns(() => 3);
      gfxElementMock.setup(x => x.getCollisionBoxY()).returns(() => 5);
      
      gfxLayer.update(0, 0);
      
      expect(type).toBe(EventType.ELEMENT_HIT_RIGHT_EDGE);
      done();
    });
    it("should notify screen when ELEMENT_HIT_TOP_EDGE", function(done) {
      let type: EventType;
      gfxElementMock.setup(x => x.notify(TypeMoq.It.isAny())).callback(x => type = x.type);
      gfxElementMock.setup(x => x.getCollisionBoxY()).returns(() => 0);
      
      gfxLayer.update(0, 0);
      
      expect(type).toBe(EventType.ELEMENT_HIT_TOP_EDGE);
      done();
    });
    it("should notify screen when ELEMENT_HIT_BOTTOM_EDGE", function(done) {
      let type: EventType;
      gfxElementMock.setup(x => x.notify(TypeMoq.It.isAny())).callback(x => type = x.type);

      gfxElementMock.setup(x => x.getCollisionBoxY()).returns(() => gfxLayer.getHeight() - 2);
      gfxElementMock.setup(x => x.getCollisionBoxHeight()).returns(() => 3);
      
      gfxLayer.update(0, 0);
      
      expect(type).toBe(EventType.ELEMENT_HIT_BOTTOM_EDGE);
      done();
    });
  // });
  });
  describe("#handleMouseEvent()", function() {
    it("should call handleMouseEvent on elements", function(done) {
      let calledIt = false;
      gfxElementMock.setup(x => x.handleMouseEvent(TypeMoq.It.isAny())).callback(x => calledIt = true);

      gfxLayer.handleMouseEvent(new SLGfxMouseEvent(EventType.MOUSE_DOWN, {}));

      expect(calledIt).toBeTruthy();
      done();
    });
  });
});
