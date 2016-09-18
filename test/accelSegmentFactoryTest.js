
xdescribe('Unit: accelSegmentFactory testing', function() {
  "use strict";

  var accelSegmentFactory;

  beforeEach(function() {
    module('profileEditor');

    inject(function(_AccelSegment_) {
      accelSegmentFactory = _AccelSegment_;
    });
  });

  it('should create an accel segment (t0=0,tf=2,p0=0,v0=0,vf=10,j=0.5) and correctly evalute position and velocities', function(){
    
    var seg = accelSegmentFactory.MakeFromVelocity(0,2,0,0,10,0.5);
    
    expect(seg.GetAllSegments().length).toBe(3);

    var seg1=seg.GetAllSegments()[0];
    var seg2=seg.GetAllSegments()[1];
    var seg3=seg.GetAllSegments()[2];



    expect(seg1.initialTime).toBe(0);
    expect(seg1.finalTime).toBe(0.5);
    expect(seg1.EvaluatePositionAt(0)).toBe(0);
    expect(seg1.EvaluatePositionAt(0.5)).toBeCloseTo(0.2777777,4);

    expect(seg2.initialTime).toBe(0.5);
    expect(seg2.finalTime).toBe(1.5);
    expect(seg2.EvaluatePositionAt(0.5)).toBeCloseTo(0.2777777,4);
    expect(seg2.EvaluatePositionAt(1.5)).toBeCloseTo(5.2777777777777,4);


    expect(seg3.initialTime).toBe(1.5);
    expect(seg3.finalTime).toBe(2);
    expect(seg3.EvaluatePositionAt(1.5)).toBeCloseTo(5.2777777777777,4);
    expect(seg3.EvaluatePositionAt(2)).toBe(10);

  });

  it('should create an accel segment (t0=2,tf=4,p0=10,v0=10,vf=0,j=0.5) and correctly evalute position and velocities', function(){

    var seg = accelSegmentFactory.MakeFromVelocity(2,4,10,10,0,0.5);
    
    expect(seg.GetAllSegments().length).toBe(3);

    var seg1=seg.GetAllSegments()[0];
    var seg2=seg.GetAllSegments()[1];
    var seg3=seg.GetAllSegments()[2];

    expect(seg1.initialTime).toBe(2);
    expect(seg1.finalTime).toBe(2.5);

    expect(seg1.EvaluatePositionAt(2)).toBe(10);


    expect(seg2.initialTime).toBe(2.5);
    expect(seg2.finalTime).toBe(3.5);


    expect(seg3.initialTime).toBe(3.5);
    expect(seg3.finalTime).toBe(4);
    expect(seg3.EvaluatePositionAt(4)).toBe(20);
    expect(seg3.EvaluateVelocityAt(4)).toBeCloseTo(0,5);

  });


});

