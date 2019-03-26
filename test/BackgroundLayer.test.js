var testUtil = require('slcommon/test/testUtil');
var BackgroundLayer = require('../src/BackgroundLayer');
var Mocks = require('./Mocks');

describe('BackgroundLayer', function() {
  describe('#constructor', function() {
    it('should construct', function() {
      var bglayer = new BackgroundLayer();
    });
  });
  describe('#update', function() {
    var bglayer = new BackgroundLayer();
    var mockElement = {
      setDirty:function(val) {this.isDirty=val;},
      update:function() {this.wasUpdated = true;},
      getZIndexComparable:function() {return this;},
      getZIndex:function() {return 0;}
    };
    it('should set elements dirty', function() {
      bglayer.addElement(mockElement);
      bglayer.setDirty(true);

      bglayer.update();

      testUtil.assert(mockElement.isDirty);
    });
    it('should update element', function() {
      bglayer.addElement(mockElement);

      bglayer.update();

      testUtil.assert(mockElement.wasUpdated);
    });
  });
});
