
xdescribe('Unit: profile helper functions-', function() {
  "use strict";
  var polynomialFactory;
  var basicSegmentFactory;
  var accelSegmentFactory;
  var fm,ph,motionProfileFactory;

  beforeEach(function() {
  	module('profileEditor');
  	
    inject(function(_FastMath_) {
      fm=_FastMath_;
    });

    inject(function(_ProfileHelper_){
      ph=_ProfileHelper_;
    });

    inject(function(_basicSegmentFactory_) {
      basicSegmentFactory = _basicSegmentFactory_;
    });

    inject(function(_motionProfileFactory_, _AccelSegment_) {
      motionProfileFactory = _motionProfileFactory_;
      accelSegmentFactory = _AccelSegment_;
    });
  });



  it('profile helper should validate basic segments in a valid profile', function() {
    var profile=motionProfileFactory.createMotionProfile("rotary");

    var accelSegment=accelSegmentFactory.MakeFromTimeVelocity(0,2,0,0,10,0.5);

    profile.AppendSegment(accelSegment);

    accelSegment=accelSegmentFactory.MakeFromTimeVelocity(2,4,10,10,0,0.5);
    
    profile.AppendSegment(accelSegment);

    ph.validateBasicSegments(profile.getAllBasicSegments());


  });




  






});