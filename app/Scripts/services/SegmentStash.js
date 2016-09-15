"use strict";
/**
 * SegmentStash takes care of low level segment operations
 * A regular associative array could be used, but there are issues
 * with rounding
 */

// get app reference
var app=angular.module('profileEditor');

app.service('SegmentStash',['FastMath',  function(FastMath) {

	var segments=[];

	/**
	 * Inserts a segment. The position is taken from segment.initialTime
	 * @param {MotionSegment} segment segment to insert
	 * @returns {MotionSegment} newly added segment
	 */
	this.Insert = function(segment) {
		var index=this.GetSegmentIndex(segment);

		if(index <0)
			return null;

		//insert segment into the array
		segments.splice(index,0,segment);

		var segLength=segment.finalTime-segment.initalTime;

		this.UpdateSegmentsAfter(index+1,segLength);

		return segment;

	};

	/**
	 * Appends a segment to the end
	 * @param {MotionSegment} segment segment to append
	 */
	this.Append = function(segment){

		segments.push(segment);

	};


	/**
	 * After inserting or deleting a segment, all subsequent segments must be updated
	 * @param {Number} startingIndex Where to start updating
	 * @param {Number} offset        positive or negative number of seconds to update subsequent indeces
	 */
	this.UpdateSegmentsAfter = function(startingIndex,offset) {
		

		//update segment times for segments after
		for (var i = startingIndex; i < segments.length; i++) {
			segments[i].initialTime+=offset;
			segments[i].finalTime+=offset;
		}


	};


	/**
	 * Checks and returns if exists an existing segment beginning at time initialTime
	 * @param {number} initialTime initial time of segment to check
	 * @returns {MotionSegment} existing segment or null if none found
	 */
	this.GetSegmentAt = function(initialTime) {
		var index = this.GetSegmentIndex(initialTime);
		if(index<0)
			return null;

		return segments[index];

	};


	/**
	 * Gets segment index given initial time. This function is necessary, 
	 * as segment keys may not be exact match due to rounding errors
	 * @param {Number} initialTime segment identifier
	 */
	this.GetSegmentIndex=function(initialTime){
		//quick check existing
		var exact = FastMath.binaryIndexOf.call(segments, initialTime);
		if (exact >= 0)
			return exact;

		//need to check when segment times are subject to rounding errors

		var idx = ~exact;
		if (FastMath.equal(segments[idx], initialTime))
			return idx;

		if (idx > 0 && FastMath.equal(segments[idx - 1], initialTime))
			return idx - 1;
		if (idx < segments.length - 1 && FastMath.equal(segments[idx + 1]))
			return idx + 1;

		return -1;
	};

	/**
	 * Deletes a segment and "stitches the hole ""
	 * @param {Number} initialTime segment identifier
	 * @returns {MotionSegment} The deleted segment or null if initialTime not valid
	 */
	this.DeleteAt = function(initialTime){
		var index = this.GetSegmentIndex(initialTime);

		var removed = segments.splice(index,1);

	};

	/**
	 * Get all segments currently in the stash
	 * @returns {Array} returns array of all segments
	 */
	this.GetAllSegments = function() {
		return segments;
	};

}]);