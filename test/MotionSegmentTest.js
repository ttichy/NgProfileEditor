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


it("creating a motion segment with invalid initial or final time should throw",function(){

	expect(function() {new MotionSegment.MotionSegment(0,0);}).toThrow();

	expect(function() {new MotionSegment.MotionSegment(-1,0);}).toThrow();
	expect(function() {new MotionSegment.MotionSegment(-2-1);}).toThrow();

});




});