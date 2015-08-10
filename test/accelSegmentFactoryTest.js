
describe('Unit: accelSegmentFactory testing', function() {
  "use strict";

  var accelSegmentFactory;

  beforeEach(function() {
    module('profileEditor');

    inject(function(_accelSegmentFactory_) {
      accelSegmentFactory = _accelSegmentFactory_;
    });
  });

  it('should create an accel segment and correctly evalute position and velocities', function(){
    
    // https://www.desmos.com/calculator/kihyp1kjux

    var seg = accelSegmentFactory.MakeFromVelocity(0,2,0,0,10,0.5);
    
    expect(seg.AllSegments().length).toBe(3);

  });


});

