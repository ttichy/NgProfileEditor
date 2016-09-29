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


		this.initialPosition=0;
		this.initialVelocity=0;

		if (type === "linear")
			this.ProfileType = "linear";

		MotionSegment.MotionSegment.call(this);
	};



	MotionProfile.prototype = Object.create(MotionSegment.MotionSegment.prototype);
	MotionProfile.prototype.constructor = MotionProfile;


	/**
	 * Set the initial position and velocity for this motion profile
	 * @param {Number} position position in [rad] or [m]
	 * @param {Number} velocity velocity in [rad/s] or [m/s]
	 */
	MotionProfile.prototype.setInitialConditions = function(position, velocity) {
		this.initialPosition=position;
		this.initialVelocity=velocity;
	};

	/**
	 * Gets all basic segments that exist in the profile. Basic Segments are the most basic building blocks
	 */
	MotionProfile.prototype.GetAllBasicSegments = function() {
		var allSegments=[];
		// using associative array to hold all segments -> quick and easy to search
		this.segments.getAllSegments().forEach(function(element){
			allSegments.push(element.getAllSegments());
		});

		// previous code gets us an array of arrays, we need to flatten it
		return allSegments.reduce(function(a, b) {
  			return a.concat(b);
  		});
	};

	MotionProfile.prototype.GetAllSegments = function() {
		return this.segments.getAllSegments();
	};


	/**
	 * Checks and returns if exists an existing segment beginning at time initialTime
	 * @param {number} initialTime initial time of segment to check
	 * @returns {MotionSegment} existing segment or null if none found
	 */
	MotionProfile.prototype.GetExistingSegment = function(initialTime){

		return this.segments.findSegmentWithInitialTime(initialTime);
	};

	/**
	 * Inserts or appends a segment into the motion profile
	 * @param {MotionSegment} segment Segment to insert into the profile
	 */
	MotionProfile.prototype.InsertSegment=function(segment,segmentId) {
		
		if(!(segment instanceof MotionSegment.MotionSegment))
			throw new Error('Attempting to insert an object which is not a MotionSegment');

		//need to get final values of previous segment
		var prev = this.segments.getPreviousSegment(segmentId);

		//modify the segment being inserted to make sure initial values == previous segment's final values
		var lastValues=prev.getFinalValues();
		segment.modifyInitialValues(lastValues[0],lastValues[1],lastValues[2],lastValues[3]);

		var newSegment=this.segments.insertAt(segment,segmentId);
		if(!newSegment)
			throw new Error("inserting a segment failed");

		//after inserting a segment, all subsequent segments must be recalculated
		var current=this.segments.getNextSegment(newSegment.id);
		while(current){
			prev=this.segments.getPreviousSegment(current.id);
			lastValues=prev.getFinalValues();
			current.modifyInitialValues(lastValues[0],lastValues[1],lastValues[2],lastValues[3]);

			//move next
			current=this.segments.getNextSegment(current.id);
		}



	};

	/**
	 * Append segment at the end of the current profile
	 * @param  {[type]} segment [description]
	 * @return {[type]}         [description]
	 */
	MotionProfile.prototype.appendSegment = function(segment) {
		if (!(segment instanceof MotionSegment.MotionSegment))
			throw new Error('Attempting to insert an object which is not a MotionSegment');
		
		// even though we append at the end, still have to make sure that initial/final conditions are satisfied

		var lastSegment=this.segments.lastSegment();
		if(lastSegment){
			var lastValues=lastSegment.getFinalValues();
			segment.modifyInitialValues(lastValues[0],lastValues[1],lastValues[2],lastValues[3]);			
		}


		this.segments.insertAt(segment, null);
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
			var remainder = existing.modifyInitialValues(t0,a0,v0,p0);

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
	 * @param {MotionSegment} segmentId identify segment to delete
	 */
	MotionProfile.prototype.DeleteSegment = function(segmentId) {

		if(!fastMath.isNumeric(segmentId) || fastMath.lt(segmentId,0))
			throw new Error('expect segmentId to be a positive integer');

		var previous = this.segments.getPreviousSegment(segmentId);
		var current=this.segments.getNextSegment(segmentId);

		var segToDelete=this.segments.delete(segmentId);
		if(!segToDelete)
			throw new Error("Unable to delete segment with id "+segmentId);

		//could be the only segment
		if(this.segments.countSegments()===0)
			return segToDelete;

		var previousValues;

		//handle first segment
		if(!previous)
		{
			previousValues=[0,0,this.initialVelocity,this.initialPosition];
		}
		else
			previousValues=previous.getFinalValues();

		while(current){
			
			current.modifyInitialValues(previousValues[0],previousValues[1],previousValues[2],previousValues[3]);

			//move forward
			previous=current;
			current = this.segments.getNextSegment(current.id);
			previousValues=previous.getFinalValues();

		}


		return segToDelete;

	};


	return factory;

}]);