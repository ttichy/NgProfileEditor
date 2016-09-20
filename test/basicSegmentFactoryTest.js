
describe('Unit: basicSegmentFactory testing', function() {
  "use strict";

  var basicSegmentFactory;

  beforeEach(function() {
    module('profileEditor');

    inject(function(_basicSegmentFactory_) {
      basicSegmentFactory = _basicSegmentFactory_;
    });
  });

  it('should create a basic segment [0,0], [1,1] with jerk=-3, and correctly evalute position and velocities', function(){
    
    // https://www.desmos.com/calculator/kihyp1kjux

    // var seg = basicSegmentFactory.CreateBasicSegment(0,1,[-0.5,1.5,0,0]);
       
    var seg = basicSegmentFactory.createBasicSegment({jerk:-3, duration:1});
    seg.setInitialValues([0,0,0,1.5]);

    expect(seg.evaluatePositionAt(0)).toBe(0);
    expect(seg.evaluatePositionAt(1)).toBe(1.0);
    expect(seg.evaluatePositionAt(0.5)).toBeCloseTo(0.3125,3);


    expect(seg.evaluateVelocityAt(0)).toBe(0);
    expect(seg.evaluateVelocityAt(1)).toBe(1.5);
    expect(seg.evaluateVelocityAt(0.5)).toBe(1.125);


    expect(seg.evaluateAccelerationAt(0)).toBe(3);
    expect(seg.evaluateAccelerationAt(1)).toBe(0);
    expect(seg.evaluateAccelerationAt(0.5)).toBe(1.5);


    expect(seg.evaluateJerkAt(0)).toBe(-3);  
    expect(seg.evaluateJerkAt(1)).toBe(-3);
    expect(seg.evaluateJerkAt(0.5)).toBe(-3);


  });


  it('should create a basic segment [1,1], [2,2], with jerk-3, and correctly evalute position and velocities', function(){
    //var seg = basicSegmentFactory.CreateBasicSegment(1,2,[-0.5,0,1.5,1]);
  
  // https://www.desmos.com/calculator/kihyp1kjux
    var seg = basicSegmentFactory.createBasicSegment({jerk:-3, duration:1});

    seg.setInitialValues([1,1,1.5,0]);

    expect(seg.evaluatePositionAt(1)).toBe(1.0);
    expect(seg.evaluatePositionAt(1.5)).toBeCloseTo(1.688,3);
    expect(seg.evaluatePositionAt(2)).toBe(2);


    expect(seg.evaluateVelocityAt(1)).toBe(1.5);
    expect(seg.evaluateVelocityAt(1.5)).toBe(1.125);
    expect(seg.evaluateVelocityAt(2)).toBe(0);


    expect(seg.evaluateAccelerationAt(1)).toBe(0);
    expect(seg.evaluateAccelerationAt(1.5)).toBe(-1.5);
    expect(seg.evaluateAccelerationAt(2)).toBe(-3);


    expect(seg.evaluateJerkAt(1)).toBe(-3);  
    expect(seg.evaluateJerkAt(1.5)).toBe(-3);
    expect(seg.evaluateJerkAt(2)).toBe(-3);



  });


  it("Should create a basic segment [0,0], [1,1] with accel=2, and correctly evaluate", function(){
    var seg = basicSegmentFactory.createBasicSegment({a0:2,duration:1});


    seg.setInitialValues([0,0,0,0]);

    expect(seg.evaluatePositionAt(0)).toBe(0);
    expect(seg.evaluatePositionAt(1)).toBe(1.0);
    expect(seg.evaluatePositionAt(0.5)).toBe(0.25);


    expect(seg.evaluateVelocityAt(0)).toBe(0);
    expect(seg.evaluateVelocityAt(1)).toBe(2);
    expect(seg.evaluateVelocityAt(0.5)).toBe(1);


    expect(seg.evaluateAccelerationAt(0)).toBe(2);
    expect(seg.evaluateAccelerationAt(1)).toBe(2);
    expect(seg.evaluateAccelerationAt(0.5)).toBe(2);


    expect(seg.evaluateJerkAt(0)).toBe(0);  
    expect(seg.evaluateJerkAt(1)).toBe(0);
    expect(seg.evaluateJerkAt(0.5)).toBe(0);

  });


  it("Should create a basic segment [1,1], [1,1] with accel=2, and correctly evaluate", function() {
    var seg = basicSegmentFactory.createBasicSegment({
      a0: 2,
      duration: 1
    });


    seg.setInitialValues([1, 1, 2, 0]);

    expect(seg.evaluatePositionAt(1)).toBe(1);
    expect(seg.evaluatePositionAt(1.5)).toBe(2.25);
    expect(seg.evaluatePositionAt(2)).toBe(4);


    expect(seg.evaluateVelocityAt(1)).toBe(2);
    expect(seg.evaluateVelocityAt(1.5)).toBe(3);
    expect(seg.evaluateVelocityAt(2)).toBe(4);


    expect(seg.evaluateAccelerationAt(1)).toBe(2);
    expect(seg.evaluateAccelerationAt(1.5)).toBe(2);
    expect(seg.evaluateAccelerationAt(2)).toBe(2);


    expect(seg.evaluateJerkAt(1)).toBe(0);
    expect(seg.evaluateJerkAt(1.5)).toBe(0);
    expect(seg.evaluateJerkAt(2)).toBe(0);

  });


  it("Should create a basic segment [1,1], [1,1] with accel=2, call getFinalValues and get the right results", function() {
    var seg = basicSegmentFactory.createBasicSegment({
      a0: 2,
      duration: 1
    });

    seg.setInitialValues([1, 1, 2, 0]);

    var finalValues=seg.getFinalValues();

    expect(Array.isArray(finalValues)).toBe(true);

    expect(finalValues[0]).toBe(2);
    expect(finalValues[1]).toBe(0);
    expect(finalValues[2]).toBe(2);
    expect(finalValues[3]).toBe(4);
    expect(finalValues[4]).toBe(4);





  });



});

