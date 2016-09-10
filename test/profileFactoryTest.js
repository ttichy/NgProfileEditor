
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


    var seg5=segments[5];
    expect(seg5.initialTime).toBe(3.5);
    expect(seg5.finalTime).toBe(4);
    expect(seg5.EvaluatePositionAt(4)).toBe(20);


  });


 it('should correctly place an accel segment within another accel segment, slicing the existing segment correctly', function() {

    var profile=motionProfileFactory.CreateMotionProfile("rotary");

    var accelSegment=accelSegmentFactory.MakeFromVelocity(0,2,0,0,10,0.5);

    profile.PutSegment(accelSegment);
    
    var segments=profile.GetAllBasicSegments();

    
    accelSegment=accelSegmentFactory.MakeFromVelocity(0,1,0,0,7.5,0.5);
    
    profile.PutSegment(accelSegment);
    expect(profile.GetAllBasicSegments().length).toBe(6);

    segments=profile.GetAllBasicSegments();

    var seg1=segments[0];
    expect(seg1.initialTime).toBe(0);
    expect(seg1.finalTime).toBe(0.25);
    expect(seg1.EvaluatePositionAt(0)).toBe(0);
    expect(seg1.EvaluatePositionAt(0.25)).toBeCloseTo(0.104166666,5);
    expect(seg1.EvaluateVelocityAt(0.25)).toBeCloseTo(1.25,3);
    expect(seg1.EvaluateAccelerationAt(0.25)).toBe(10);


    var seg2=segments[1];
    
    //at initial time
    expect(seg2.initialTime).toBe(0.25);
    expect(seg2.finalTime).toBe(0.75);
    expect(seg2.EvaluatePositionAt(0.25)).toBeCloseTo(0.104166666,5);
    expect(seg2.EvaluateVelocityAt(0.25)).toBeCloseTo(1.25,3);
    expect(seg2.EvaluateAccelerationAt(0.25)).toBe(10);

    //at final time
    expect(seg2.EvaluatePositionAt(0.75)).toBeCloseTo(1.9791666666,5);
    expect(seg2.EvaluateVelocityAt(0.75)).toBeCloseTo(6.25,3);
    expect(seg2.EvaluateAccelerationAt(0.75)).toBe(10);


    var seg3=segments[2];
    //at initial time
    expect(seg3.initialTime).toBe(0.75);
    expect(seg3.finalTime).toBe(1.0);
    expect(seg3.EvaluatePositionAt(0.75)).toBeCloseTo(1.9791666666,5);
    expect(seg3.EvaluateVelocityAt(0.75)).toBeCloseTo(6.25,3);
    expect(seg3.EvaluateAccelerationAt(0.75)).toBe(10);

    //at final time
    expect(seg3.EvaluatePositionAt(1.0)).toBeCloseTo(3.75,5);
    expect(seg3.EvaluateVelocityAt(1.0)).toBeCloseTo(7.5,3);
    expect(seg3.EvaluateAccelerationAt(1.0)).toBe(0);    



    var seg4=segments[3];
    //at initial time
    expect(seg4.initialTime).toBe(1.0);
    expect(seg4.finalTime).toBe(1.25);
    expect(seg4.EvaluatePositionAt(1.0)).toBeCloseTo(3.75,5);
    expect(seg4.EvaluateVelocityAt(1.0)).toBeCloseTo(7.5,3);
    expect(seg4.EvaluateAccelerationAt(1.0)).toBe(0);

    //at final time
    expect(seg4.EvaluatePositionAt(1.25)).toBeCloseTo(5.65972222,5);
    expect(seg4.EvaluateVelocityAt(1.25)).toBeCloseTo(7.9166666666,3);
    expect(seg4.EvaluateAccelerationAt(1.25)).toBeCloseTo(3.33333,3);    



    var seg5=segments[4];
    //at initial time
    expect(seg5.initialTime).toBe(1.25);
    expect(seg5.finalTime).toBe(1.75);
    expect(seg5.EvaluatePositionAt(1.25)).toBeCloseTo(5.65972222,5);
    expect(seg5.EvaluateVelocityAt(1.25)).toBeCloseTo(7.9166666666,3);
    expect(seg5.EvaluateAccelerationAt(1.25)).toBeCloseTo(3.33333,3);

    //at final time
    expect(seg5.EvaluatePositionAt(1.75)).toBeCloseTo(10.03472222222,5);
    expect(seg5.EvaluateVelocityAt(1.75)).toBeCloseTo(9.58333333333,3);
    expect(seg5.EvaluateAccelerationAt(1.75)).toBeCloseTo(3.33333,3);    


    var seg6=segments[5];
    //at initial time
    expect(seg6.initialTime).toBe(1.75);
    expect(seg6.finalTime).toBe(2.0);
    expect(seg6.EvaluatePositionAt(1.75)).toBeCloseTo(10.03472222222,5);
    expect(seg6.EvaluateVelocityAt(1.75)).toBeCloseTo(9.58333333333,3);
    expect(seg6.EvaluateAccelerationAt(1.75)).toBeCloseTo(3.33333,3);

    //at final time
    expect(seg6.EvaluatePositionAt(2.0)).toBeCloseTo(12.5,5);
    expect(seg6.EvaluateVelocityAt(2.0)).toBeCloseTo(10,3);
    expect(seg6.EvaluateAccelerationAt(2.0)).toBeCloseTo(0,3);

    expect(profile.SegmentKeys.length).toBe(2);

    expect(profile.SegmentKeys[0]).toBe(0);
    expect(profile.SegmentKeys[1]).toBe(1.0);

  });

  it('should correctly delete an accel segment that is not the last segment', function() {

    var profile = motionProfileFactory.CreateMotionProfile("rotary");

    var accelSegment = accelSegmentFactory.MakeFromVelocity(0, 2, 0, 0, 10, 0.5);

    profile.PutSegment(accelSegment);



    accelSegment = accelSegmentFactory.MakeFromVelocity(0, 1, 0, 0, 7.5, 0.5);

    profile.PutSegment(accelSegment);

    profile.DeleteSegment(accelSegment);

    var segments = profile.GetAllBasicSegments();

    expect(segments.length).toBe(3);


    var seg0 = segments[0];
    expect(seg0.initialTime).toBe(0);
    expect(seg0.finalTime).toBe(0.5);
    expect(seg0.EvaluatePositionAt(0.5)).toBeCloseTo(0.277777, 4);

    var seg1 = segments[1];
    expect(seg1.initialTime).toBe(0.5);
    expect(seg1.finalTime).toBe(1.5);
    expect(seg1.EvaluatePositionAt(1.5)).toBeCloseTo(5.277777, 4);

    var seg2 = segments[2];
    expect(seg2.initialTime).toBe(1.5);
    expect(seg2.finalTime).toBe(2);
    expect(seg2.EvaluatePositionAt(2)).toBe(10);
    expect(seg2.EvaluateVelocityAt(2)).toBe(10);

  });


  it('should correctly delete an accel segment that IS the last segment', function() {

    var profile = motionProfileFactory.CreateMotionProfile("rotary");

    var accelSegment2 = accelSegmentFactory.MakeFromVelocity(0, 2, 0, 0, 10, 0.5);

    profile.PutSegment(accelSegment2);

    var accelSegment = accelSegmentFactory.MakeFromVelocity(2, 4, 10, 10, 0, 0.5);

    profile.PutSegment(accelSegment);


    debugger;

    profile.DeleteSegment(accelSegment);

    var segments = profile.GetAllBasicSegments();

    expect(segments.length).toBe(3);


    var seg0 = segments[0];
    expect(seg0.initialTime).toBe(0);
    expect(seg0.finalTime).toBe(0.5);
    expect(seg0.EvaluatePositionAt(0.5)).toBeCloseTo(0.277777, 4);

    var seg1 = segments[1];
    expect(seg1.initialTime).toBe(0.5);
    expect(seg1.finalTime).toBe(1.5);
    expect(seg1.EvaluatePositionAt(1.5)).toBeCloseTo(5.277777, 4);

    var seg2 = segments[2];
    expect(seg2.initialTime).toBe(1.5);
    expect(seg2.finalTime).toBe(2);
    expect(seg2.EvaluatePositionAt(2)).toBe(10);
    expect(seg2.EvaluateVelocityAt(2)).toBe(10);

  });

});

