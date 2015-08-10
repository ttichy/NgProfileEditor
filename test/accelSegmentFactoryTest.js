
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
    debugger;
    var seg = accelSegmentFactory.MakeFromVelocity(0,2,0,0,10,0.5);
    
    expect(seg.AllSegments().length).toBe(3);

    var seg1=seg.AllSegments()[0];
    var seg2=seg.AllSegments()[1];
    var seg3=seg.AllSegments()[2];

    expect(seg1.initialTime).toBe(0);
    expect(seg1.finalTime).toBe(0.5);


    expect(seg2.initialTime).toBe(0.5);
    expect(seg2.finalTime).toBe(1.5);


    expect(seg3.initialTime).toBe(1.5);
    expect(seg3.finalTime).toBe(2);

  });


});

