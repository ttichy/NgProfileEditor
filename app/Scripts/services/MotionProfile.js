/**
 * Creates MotionProfile. MotionProfile is a list of MotionSegments.
 * MotionSegments represent the various available segments in a profile, such as BasicSegment, AccelSegment,
 * CamSegment, IndexSegment, etc...
 * 
 */


"use strict";
// get app reference
var app=angular.module('profileEditor');


app.factory('motionProfileFactory', ['MotionSegment', 'SegmentStash','FastMath','ProfileHelper',
 function(MotionSegment, SegmentStash, fastMath, profileHelper) {

	var factory = {};

	factory.CreateMotionProfile=function(type){
		return new MotionProfile(type);
	};

	/*
	MOTION PROFILE OBJECT LOGIC
	 */

	var MotionProfile = function(type) {

		this.ProfileType = "rotary";

		if (type === "linear")
			this.ProfileType = "linear";

		//stash to hold segments
		 this.stash = SegmentStash;
	};



	/**
	 * Gets all basic segments that exist in the profile. Basic Segments are the most basic building blocks
	 */
	MotionProfile.prototype.GetAllBasicSegments = function() {
		var allSegments=[];
		// using associative array to hold all segments -> quick and easy to search
		this.stash.GetAllSegments().forEach(function(element){
			allSegments.push(element.GetAllBasicSegments());
		});

		// previous code gets us an array of arrays, we need to flatten it
		return allSegments.reduce(function(a, b) {
  			return a.concat(b);
  		});
	};

	MotionProfile.prototype.GetAllSegments = function() {
		return this.stash.GetAllSegments();
	};


	/**
	 * Checks and returns if exists an existing segment beginning at time initialTime
	 * @param {number} initialTime initial time of segment to check
	 * @returns {MotionSegment} existing segment or null if none found
	 */
	MotionProfile.prototype.GetExistingSegment = function(initialTime){

		return this.stash.GetSegmentAt(initialTime);
	};

	/**
	 * Inserts or appends a segment into the motion profile
	 * @param {MotionSegment} segment Segment to insert into the profile
	 */
	MotionProfile.prototype.InsertSegment=function(segment) {
		
		if(!(segment instanceof MotionSegment.MotionSegment))
			throw new Error('Attempting to insert an object which is not a MotionSegment');

		this.stash.Insert(segment);
	};


	MotionProfile.prototype.AppendSegment = function(segment) {
		this.stash.Append(segment);
	};


	/**
	 * Puts segment into the profile ? WHAT DOES THIS DO??
	 * @param {MotionSegment} segment to be put into the profile. 
	 */
	MotionProfile.prototype.PutSegment = function(segment) {

		// is there already a segment at this initial time?	
		var existing=this.GetExistingSegment(segment.initialTime);

		if (angular.isObject(existing)) {
			//logic to insert the segment
			
			// the existing segment better be longer than the segment being inserted.
			if(fastMath.leq(existing.finalTime,segment.finalTime))
				throw new Error("Exiting segment is shorter than the new one");
			
			// DON'T overwrite the existing segment YET
			//this.Segments[segment.intialTime]=segment;

			//handle the slicing of the existing segment first
			var t0=segment.finalTime;
			var p0=segment.EvaluatePositionAt(t0);
			var v0=segment.EvaluateVelocityAt(t0);
			var a0=segment.EvaluateAccelerationAt(t0);
			var remainder = existing.ModifyInitialValues(t0,a0,v0,p0);

			var pos=this.SegmentKeys.indexOf(segment.initialTime);
			if(pos<0)
				throw new Error("Couldn't find segment in the SegmentKeys");

			// insert the remainder segment into the index
			this.SegmentKeys.splice(pos+1,0,remainder.initialTime);

			this.Segments[remainder.initialTime]=remainder;

			//then overwrite the segment
			this.Segments[segment.initialTime]=segment;

		}
		else {
			this.Segments[segment.initialTime]=segment;
			
			// adding always means at the end, so simply
			this.SegmentKeys.push(segment.initialTime);
		}

		//validate all segments
		profileHelper.validateBasicSegments(this.GetAllBasicSegments());
		//TODO: explore faster way to validate profile segments

	};

	/**
	 * Deletes specified segment. Suppose we have segments 1, 2 and 3 and want to delete 2.
	 * 	First, we delete segment 2. Then, we modify the initial values of segment 3 to be the final values of segment 1
	 * @param {MotionSegment} segment segment to delete
	 */
	MotionProfile.prototype.DeleteSegment = function(segment) {

		if(!(segment instanceof MotionSegment.MotionSegment))
			throw new Error('Cannot delete segement, because it is not MotionSegment');

		return this.stash.DeleteAt(segment.initialTime);

	};


	return factory;

}]);