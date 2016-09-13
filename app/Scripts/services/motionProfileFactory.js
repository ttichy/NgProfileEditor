/**
 * Creates MotionProfile. MotionProfile object contains a collection of all known segment types.
 * 
 */


"use strict";
// get app reference
var app=angular.module('profileEditor');


app.factory('motionProfileFactory', ['basicSegmentFactory', 'accelSegmentFactory','FastMath','ProfileHelper',
 function(basicSegmentFactory, accelSegmentFactory, fastMath, profileHelper) {

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

		this.Segments = {}; //associative array for all segments. Key is initial time

		this.SegmentKeys=[]; // keep a handy copy of all keys for Segments. Always sorted.

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
	 * Checks and returns if exists an existing segment beginning at time initialTime
	 * @param {number} initialTime initial time of segment to check
	 * @returns {MotionSegment} existing segment or null if none found
	 */
	MotionProfile.prototype.GetExistingSegment = function(initialTime){

		//quick check existing
		var existing=this.Segments[initialTime];

		var numSegments=this.SegmentKeys.length;

		//may be past the profile
		if(initialTime > this.SegmentKeys[numSegments-1])
			return null;

		//due to roundoff error, initial time may not match exactly, so check the long way
		if(!angular.isObject(existing))
		{
			var result=fastMath.binaryIndexOf.call(this.SegmentKeys,initialTime);

			if(result>0)
				throw new Error('expecting negative result here, since exact match was checked above');

			var idx = result;
			if(result<0)
				idx=~result;
			if(fastMath.equal(this.SegmentKeys[idx],initialTime))
				return this.Segments[idx];
			//check the index before if it exists
			if(idx>0 && fastMath.equal(this.SegmentKeys[idx-1],initialTime))
				return this.Segments[idx-1];
			//check the index after if it exists
			if(idx<numSegments-1 && fastMath.equal(this.SegmentKeys[idx+1],initialTime))
				return this.Segments[idx+1];
		
			return null;	//not found
		}

		return existing;

		


	};

	/**
	 * Inserts or appends a segment into the motion profile
	 * @param {MotionSegment} segment Segment to insert into the profile
	 */
	MotionProfile.prototype.InsertSegment=function(segment) {
		
		//quick check existing
		var existing=this.Segments[segment.initialTime];
	};

	/**
	 * Puts segment into the profile ? WHAT DOES THIS DO??
	 * @param {MotionSegment} segment to be put into the profile. 
	 */
	MotionProfile.prototype.PutSegment = function(segment) {

		// is there already a segment at this initial time?	
		
		// check the fast way for an existing segment
		var existing=this.Segments[segment.initialTime];

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
		profileHelper.validateSegments(this.GetAllBasicSegments());
		//TODO: explore faster way to validate profile segments

	};

	/**
	 * Deletes specified segment. Suppose we have segments 1, 2 and 3 and want to delete 2.
	 * 	First, we delete segment 2. Then, we modify the initial values of segment 3 to be the final values of segment 1
	 * @param {MotionSegment} segment segment to delete
	 */
	MotionProfile.prototype.DeleteSegment = function(segment) {

		var existing=this.Segments[segment.initialTime];

		if(!angular.isObject(existing))
			return;

		// need to find the previous and next segments
		var segmentPos=this.SegmentKeys.indexOf(segment.initialTime);
		if(segmentPos<0)
			throw new Error("Couldn't find segment in the SegmentKeys");

		//check if this is the last segment
		if (this.SegmentKeys[segmentPos] === this.SegmentKeys[this.SegmentKeys.length - 1]) {
			// yes - last segment
			delete this.Segments[segment.initialTime];
			this.SegmentKeys.splice(segmentPos, 1);

		} else {
			// not last segment
			// 
			// we need to save the initial values of the segment that is about to be deleted
			var t0 = segment.initialTime;
			var p0 = segment.EvaluatePositionAt(segment.initialTime);
			var v0 = segment.EvaluateVelocityAt(segment.initialTime);
			var a0 = segment.EvaluateAccelerationAt(segment.initialTime);

			// get the next segment
			var nextSegmentKey=this.SegmentKeys[segmentPos+1];
			var nextSegment=this.Segments[nextSegmentKey];

			//save the final values
			var pf=nextSegment.EvaluatePositionAt(nextSegment.finalTime);
			var vf=nextSegment.EvaluateVelocityAt(nextSegment.finalTime);
			var af=nextSegment.EvaluateAccelerationAt(nextSegment.finalTime);


			var newSegment=nextSegment.ModifyInitialValues(t0,a0,v0,p0);

			// delete the segment
			delete this.Segments[nextSegment.initialTime];
			this.SegmentKeys.splice(nextSegmentKey, 1);

			this.Segments[t0]=newSegment;


		}




		

	};


	return factory;

}]);