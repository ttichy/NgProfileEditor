/**
 * Creates MotionProfile. MotionProfile object contains a collection of all known segment types.
 * 
 */


"use strict";
// get app reference
var app=angular.module('profileEditor');


app.service('motionProfileFactory', ['basicSegmentFactory', 'accelSegmentFactory','FastMath', function(basicSegmentFactory, accelSegmentFactory, fastMath) {

	var service = {};

	service.CreateMotionProfile=function(type){
		return new MotionProfile(type);
	};


	/*
	MOTION PROFILE OBJECT LOGIC
	 */

	var MotionProfile = function(type) {

		this.ProfileType = "rotary";

		if (type === "linear")
			this.ProfileType = "linear";

		this.Segments = {}; //associative array for all segments
		this.SegmentKeys=[]; // keep a handy copy of all keys for Segments

	};


	/**
	 * Gets all basic segments that exist in the profile
	 */
	MotionProfile.prototype.GetAllBasicSegments = function() {
		
		// using associative array to hold all segments -> quick and easy to search
		var allSegments=[];

		for(var key in this.Segments) {
			if(!this.Segments.hasOwnProperty(key))
				continue;
			allSegments.push(this.Segments[key].AllSegments());
		}

		// previous code gets us an array of arrays, we need to flatten it
		return allSegments.reduce(function(a, b) {
  			return a.concat(b);
  		});
	};

	/**
	 * Gets segment at specified time
	 * @param {float} time 
	 * @returns {Segment} motionsegment at specified time
	 */
	MotionProfile.prototype.GetSegmentAtInitialTime = function(time) {
		// TODO: handle errors?
		return this.Segments[time];
	};


	/**
	 * Puts segment into the profile
	 * @param {MotionSegment} segment to be put into the profile
	 */
	MotionProfile.prototype.PutSegment = function(segment) {

		// is there already a segment at this initial time?		
		var existing=this.Segments[segment.initialTime];


		if (angular.isObject(existing)) {
			//logic to insert the segment
			
			// the existing segment better be longer than the segment being inserted.
			if(fastMath.leq(existing.finaTime,segment.finalTime))
				throw new Error("Exiting segment is shorter than the new one");
			// the new segment is simply added
			this.Segments[segment.IntialTime]=segment;

			//but need to handle the "rest" of the existing one
			var t0=segment.finalTime;
			var p0=segment.EvaluatePositionAt(t0);
			var v0=segment.EvaluateVelocityAt(t0);
			var a0=segment.EvaluateAccelerationAt(t0);
			var remainder = existing.ModifyInitial(t0,a0,v0,p0);
			this.Segments[remainder.InitiaTime]=remainder;
		}
		else {
			//logic to add the segment
		}


	};

	return service;

}]);