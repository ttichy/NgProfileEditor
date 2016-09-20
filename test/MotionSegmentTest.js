describe('Unit: MotionSegment functions-', function() {
  "use strict";
  var MotionSegment;

  beforeEach(function() {
    module('profileEditor');

    inject(function(_MotionSegment_) {
      MotionSegment = _MotionSegment_;
    });
  });


it("each segment should have a unique id",function(){

	var segment= new MotionSegment.MotionSegment(0,1);
	expect(segment.id).toEqual(jasmine.any(Number));

});







});