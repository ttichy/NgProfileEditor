describe('Unit: accelSegmentFactory testing', function() {
  "use strict";

  var accelSegmentFactory;

  beforeEach(function() {
    module('profileEditor');

    inject(function(_AccelSegment_) {
      accelSegmentFactory = _AccelSegment_;
    });
  });

  it('should create an accel segment (t0=0,tf=2,p0=0,v0=0,vf=10,j=0.5) and correctly evalute position and velocities', function() {

    var seg = accelSegmentFactory.MakeFromTimeVelocity(0, 2, 0, 0, 10, 0.5);

    expect(seg.getAllSegments().length).toBe(3);

    var seg1 = seg.getAllSegments()[0];
    var seg2 = seg.getAllSegments()[1];
    var seg3 = seg.getAllSegments()[2];



    expect(seg1.initialTime).toBe(0);
    expect(seg1.finalTime).toBe(0.5);
    expect(seg1.evaluatePositionAt(0)).toBe(0);
    expect(seg1.evaluatePositionAt(0.5)).toBeCloseTo(0.2777777, 4);

    expect(seg2.initialTime).toBe(0.5);
    expect(seg2.finalTime).toBe(1.5);
    expect(seg2.evaluatePositionAt(0.5)).toBeCloseTo(0.2777777, 4);
    expect(seg2.evaluatePositionAt(1.5)).toBeCloseTo(5.2777777777777, 4);


    expect(seg3.initialTime).toBe(1.5);
    expect(seg3.finalTime).toBe(2);
    expect(seg3.evaluatePositionAt(1.5)).toBeCloseTo(5.2777777777777, 4);
    expect(seg3.evaluatePositionAt(2)).toBe(10);

  });

  it('should create an accel segment (t0=2,tf=4,p0=10,v0=10,vf=0,j=0.5) and correctly evalute position and velocities', function() {

    var seg = accelSegmentFactory.MakeFromTimeVelocity(2, 4, 10, 10, 0, 0.5);

    expect(seg.getAllSegments().length).toBe(3);

    var seg1 = seg.getAllSegments()[0];
    var seg2 = seg.getAllSegments()[1];
    var seg3 = seg.getAllSegments()[2];

    expect(seg1.initialTime).toBe(2);
    expect(seg1.finalTime).toBe(2.5);

    expect(seg1.evaluatePositionAt(2)).toBe(10);


    expect(seg2.initialTime).toBe(2.5);
    expect(seg2.finalTime).toBe(3.5);


    expect(seg3.initialTime).toBe(3.5);
    expect(seg3.finalTime).toBe(4);
    expect(seg3.evaluatePositionAt(4)).toBe(20);
    expect(seg3.evaluateVelocityAt(4)).toBeCloseTo(0, 5);

  });

  it('should create an accel segment (t0=0,tf=2,p0=0,v0=0,vf=10,j=0.5), modify initial position and evaluate correctly', function() {

    var seg = accelSegmentFactory.MakeFromTimeVelocity(0, 2, 0, 0, 10, 0.5);

    var newSeg = seg.ModifyInitialValues(0, 0, 0, 1);


    var seg1 = newSeg.getAllSegments()[0];
    var seg2 = newSeg.getAllSegments()[1];
    var seg3 = newSeg.getAllSegments()[2];


    expect(seg1.initialTime).toBe(0);
    expect(seg1.finalTime).toBe(0.5);
    expect(seg1.evaluatePositionAt(0)).toBe(1);
    expect(seg1.evaluatePositionAt(0.5)).toBeCloseTo(1.2777777, 4);

    expect(seg2.initialTime).toBe(0.5);
    expect(seg2.finalTime).toBe(1.5);
    expect(seg2.evaluatePositionAt(0.5)).toBeCloseTo(1.2777777, 4);
    expect(seg2.evaluatePositionAt(1.5)).toBeCloseTo(6.2777777777777, 4);


    expect(seg3.initialTime).toBe(1.5);
    expect(seg3.finalTime).toBe(2);
    expect(seg3.evaluatePositionAt(1.5)).toBeCloseTo(6.2777777777777, 4);
    expect(seg3.evaluatePositionAt(2)).toBe(11);

  });

  it('should create an time-velocity accel segment (t0=0,tf=2,p0=0,v0=0,vf=10,j=0.5), modify initial velocity and evaluate correctly', function() {

    var seg = accelSegmentFactory.MakeFromTimeVelocity(0, 2, 0, 0, 10, 0.5);

    seg.ModifyInitialValues(0, 0, 1, 0);


    var seg1 = seg.getAllSegments()[0];
    var seg2 = seg.getAllSegments()[1];
    var seg3 = seg.getAllSegments()[2];


    expect(seg1.initialTime).toBe(0);
    expect(seg1.finalTime).toBe(0.5);
    expect(seg1.evaluatePositionAt(0)).toBe(0);
    expect(seg1.evaluatePositionAt(0.5)).toBe(0.75);

    expect(seg2.initialTime).toBe(0.5);
    expect(seg2.finalTime).toBe(1.5);
    expect(seg2.evaluatePositionAt(0.5)).toBe(0.75);
    expect(seg2.evaluatePositionAt(1.5)).toBe(6.25);


    expect(seg3.initialTime).toBe(1.5);
    expect(seg3.finalTime).toBe(2);
    expect(seg3.evaluatePositionAt(1.5)).toBe(6.25);
    expect(seg3.evaluatePositionAt(2)).toBe(11);

  });

  it('should create a time-velocity accel segment (t0=0,tf=2,p0=0,v0=0,vf=10,j=0.5), modify initial position AND velocity and evaluate correctly', function() {

    var seg = accelSegmentFactory.MakeFromTimeVelocity(0, 2, 0, 0, 10, 0.5);

    seg.ModifyInitialValues(0, 0, 1, 1);


    var seg1 = seg.getAllSegments()[0];
    var seg2 = seg.getAllSegments()[1];
    var seg3 = seg.getAllSegments()[2];


    expect(seg1.initialTime).toBe(0);
    expect(seg1.finalTime).toBe(0.5);
    expect(seg1.evaluatePositionAt(0)).toBe(1);
    expect(seg1.evaluatePositionAt(0.5)).toBe(1.75);

    expect(seg2.initialTime).toBe(0.5);
    expect(seg2.finalTime).toBe(1.5);
    expect(seg2.evaluatePositionAt(0.5)).toBe(1.75);
    expect(seg2.evaluatePositionAt(1.5)).toBe(7.25);


    expect(seg3.initialTime).toBe(1.5);
    expect(seg3.finalTime).toBe(2);
    expect(seg3.evaluatePositionAt(1.5)).toBe(7.25);
    expect(seg3.evaluatePositionAt(2)).toBe(12);

  });


  it('should create a time-distance accel segment (t0=0,tf=2,p0=0,v0=0,pf=10,j=0.5), and evaluate correctly',function(){

    var seg = accelSegmentFactory.MakeFromTimeDistance(0, 2, 0, 0, 10, 0.5);

    var segs = seg.getAllSegments();
    expect(segs.length).toBe(3);

    var seg1=segs[0];
    var seg2=segs[1];
    var seg3=segs[2];

    expect(seg1.initialTime).toBe(0);
    expect(seg1.finalTime).toBe(0.5);
    expect(seg1.evaluatePositionAt(0)).toBe(0);
    expect(seg1.evaluatePositionAt(0.5)).toBeCloseTo(0.27777,4);

    expect(seg2.initialTime).toBe(0.5);
    expect(seg2.finalTime).toBe(1.5);
    expect(seg2.evaluatePositionAt(0.5)).toBeCloseTo(0.277777,4);
    expect(seg2.evaluatePositionAt(1.5)).toBeCloseTo(5.2777777,4);


    expect(seg3.initialTime).toBe(1.5);
    expect(seg3.finalTime).toBe(2);
    expect(seg3.evaluatePositionAt(1.5)).toBeCloseTo(5.2777777,4);
    expect(seg3.evaluatePositionAt(2)).toBe(10);




  });

  it('should create a time-distance accel segment (t0=0,tf=2,p0=0,v0=0,pf=10,j=0.5), modify initial position AND velocity and evaluate correctly', function() {



    var seg = accelSegmentFactory.MakeFromTimeDistance(0, 2, 0, 0, 10, 0.5);

    var t0=0,a0=0,v0=1,p0=1;

    seg.ModifyInitialValues(t0,a0,v0,p0);


    var seg1 = seg.getAllSegments()[0];
    var seg2 = seg.getAllSegments()[1];
    var seg3 = seg.getAllSegments()[2];


    expect(seg1.initialTime).toBe(0);
    expect(seg1.finalTime).toBe(0.5);
    expect(seg1.evaluatePositionAt(0)).toBe(1);
    expect(seg1.evaluatePositionAt(0.5)).toBeCloseTo(1.722222,4);

    expect(seg2.initialTime).toBe(0.5);
    expect(seg2.finalTime).toBe(1.5);
    expect(seg2.evaluatePositionAt(0.5)).toBeCloseTo(1.722222,4);
    expect(seg2.evaluatePositionAt(1.5)).toBeCloseTo(6.722222,4);


    expect(seg3.initialTime).toBe(1.5);
    expect(seg3.finalTime).toBe(2);
    expect(seg3.evaluatePositionAt(1.5)).toBeCloseTo(6.722222,4);
    expect(seg3.evaluatePositionAt(2)).toBe(11);

  });


  it("Should correctly define an accel segment, 0 jerk with the time-distance permutation", function() {

    var seg = accelSegmentFactory.MakeFromTimeDistance(0, 1, 0, 0, 0.5, 0);
    var allSegs = seg.getAllSegments();

    expect(allSegs.length).toBe(1);

    var seg1 = allSegs[0];

    expect(seg1.initialTime).toBe(0);
    expect(seg1.finalTime).toBe(1);
    expect(seg1.evaluatePositionAt(0.5)).toBe(0.125);
    expect(seg1.evaluatePositionAt(1)).toBe(0.5);

    expect(seg1.evaluateVelocityAt(0.5)).toBe(0.5);
    expect(seg1.evaluateVelocityAt(1)).toBe(1);


  });

});