
xdescribe('Unit: basicSegmentFactory testing', function() {
  "use strict";

  var basicSegmentFactory;

  beforeEach(function() {
    module('profileEditor');

    inject(function(_basicSegmentFactory_) {
      basicSegmentFactory = _basicSegmentFactory_;
    });
  });

  it('should create a basic segment [0,0], [1,1] and correctly evalute position and velocities', function(){
    
    // https://www.desmos.com/calculator/kihyp1kjux

    var seg = basicSegmentFactory.CreateBasicSegment(0,1,[-0.5,1.5,0,0]);
    
    expect(seg.EvaluatePositionAt(0)).toBe(0);
    expect(seg.EvaluatePositionAt(1)).toBe(1.0);
    expect(seg.EvaluatePositionAt(0.5)).toBeCloseTo(0.3125,3);


    expect(seg.EvaluateVelocityAt(0)).toBe(0);
    expect(seg.EvaluateVelocityAt(1)).toBe(1.5);
    expect(seg.EvaluateVelocityAt(0.5)).toBe(1.125);


    expect(seg.EvaluateAccelerationAt(0)).toBe(3);
    expect(seg.EvaluateAccelerationAt(1)).toBe(0);
    expect(seg.EvaluateAccelerationAt(0.5)).toBe(1.5);


    expect(seg.EvaluateJerkAt(0)).toBe(-3);  
    expect(seg.EvaluateJerkAt(1)).toBe(-3);
    expect(seg.EvaluateJerkAt(0.5)).toBe(-3);


  });


  it('should create a basic segment [1,1], [2,2] and correctly evalute position and velocities', function(){
    var seg = basicSegmentFactory.CreateBasicSegment(1,2,[-0.5,0,1.5,1]);
    
    expect(seg.EvaluatePositionAt(1)).toBe(1.0);
    expect(seg.EvaluatePositionAt(1.5)).toBeCloseTo(1.688,3);
    expect(seg.EvaluatePositionAt(2)).toBe(2);


    expect(seg.EvaluateVelocityAt(1)).toBe(1.5);
    expect(seg.EvaluateVelocityAt(1.5)).toBe(1.125);
    expect(seg.EvaluateVelocityAt(2)).toBe(0);


    expect(seg.EvaluateAccelerationAt(1)).toBe(0);
    expect(seg.EvaluateAccelerationAt(1.5)).toBe(-1.5);
    expect(seg.EvaluateAccelerationAt(2)).toBe(-3);


    expect(seg.EvaluateJerkAt(1)).toBe(-3);  
    expect(seg.EvaluateJerkAt(1.5)).toBe(-3);
    expect(seg.EvaluateJerkAt(2)).toBe(-3);



  });


});

