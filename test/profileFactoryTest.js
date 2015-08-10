
describe('Unit: motionProfileFactory testing', function() {
  "use strict";

  var motionProfileFactory;
  var accelSegmentFactory;

  beforeEach(function() {
    module('profileEditor');

    inject(function(_motionProfileFactory_, _accelSegmentFactory_) {
      motionProfileFactory = _motionProfileFactory_;
      accelSegmentFactory = _accelSegmentFactory_;
    });
  });

  it('should create an empty rotary profile', function(){
    
    var profile=motionProfileFactory.CreateMotionProfile("rotary");
    
    expect(profile.ProfileType).toBe('rotary');
    expect(profile.GetAllBasicSegments.length).toBe(0);
  });


  it('should create an empty linear profile', function(){
    
    var profile=motionProfileFactory.CreateMotionProfile("linear");
    
    expect(profile.ProfileType).toBe('linear');
    expect(profile.GetAllBasicSegments.length).toBe(0);
  });


  it('should add some accel segments to the profile', function() {

    var profile=motionProfileFactory.CreateMotionProfile("rotary");

    var accelSegment=accelSegmentFactory.MakeFromVelocity(0,2,0,0,10,0.5);

    profile.AddAccelSegment(accelSegment);

    expect(profile.GetAllBasicSegments().length).toBe(3);



  });

});

