
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


  it('should add 2 accel segments to the profile and have 6 basic segments total', function() {

    var profile=motionProfileFactory.CreateMotionProfile("rotary");

    var accelSegment=accelSegmentFactory.MakeFromVelocity(0,2,0,0,10,0.5);

    profile.PutSegment(accelSegment);

    accelSegment=accelSegmentFactory.MakeFromVelocity(2,4,10,10,0,0.5);
    
    profile.PutSegment(accelSegment);
    expect(profile.GetAllBasicSegments().length).toBe(6);


    var segments=profile.GetAllBasicSegments();
    var seg0=segments[0];
    expect(seg0.initialTime).toBe(0);
    expect(seg0.finalTime).toBe(0.5);
    expect(seg0.EvaluatePositionAt(0.5)).toBeCloseTo(0.277777,4);

    var seg1=segments[1];
    expect(seg1.initialTime).toBe(0.5);
    expect(seg1.finalTime).toBe(1.5);
    expect(seg1.EvaluatePositionAt(1.5)).toBeCloseTo(5.277777,4);

    var seg2=segments[2];
    expect(seg2.initialTime).toBe(1.5);
    expect(seg2.finalTime).toBe(2);
    expect(seg2.EvaluatePositionAt(2)).toBe(10);


  });


 it('should correctly place a segment within another segment, slicing the existing segment correctly', function() {

    var profile=motionProfileFactory.CreateMotionProfile("rotary");

    var accelSegment=accelSegmentFactory.MakeFromVelocity(0,2,0,0,10,0.5);

    profile.PutSegment(accelSegment);
    
    debugger;
    var segments=profile.GetAllBasicSegments();

    
    accelSegment=accelSegmentFactory.MakeFromVelocity(0,1,0,0,7.5,0.5);
    
    profile.PutSegment(accelSegment);
    expect(profile.GetAllBasicSegments().length).toBe(6);

    segments=profile.GetAllBasicSegments();


  });




});

