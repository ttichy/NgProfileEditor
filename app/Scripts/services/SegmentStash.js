"use strict";
/**
 * SegmentStash takes care of low level segment operations
 * A regular associative array could be used, but there are issues
 * with rounding
 */

// get app reference
var app=angular.module('profileEditor');

app.factory('SegmentStash',['FastMath',  function(FastMath) {

	var SegmentStash=function() {

		this.segments=[];

	};


	/**
	 * Initialize the stash with segments
	 * @param {Array} segmentArr Array of segments to initalize with 
	 */
	SegmentStash.prototype.InitializeWithSegments = function(segmentArr) {
		if(!Array.isArray(segmentArr))
			throw new Error('to initialize SegmentStash, pass in an array of segments');
		this.segments=segmentArr;
	};

	/**
	 * Inserts a segment. The position is taken from segment.initialTime
	 * @param {MotionSegment} segment segment to insert
	 * @returns {MotionSegment} newly added segment
	 */
	SegmentStash.prototype.Insert = function(segment) {
		var index=this.GetSegmentIndex(segment);

		if(index <0)
			return null;

		//insert segment into the array
		this.segments.splice(index,0,segment);

		var segLength=segment.finalTime-segment.initalTime;

		this.UpdateSegmentsAfter(index+1,segLength);

		return segment;

	};

	/**
	 * Appends a segment to the end
	 * @param {MotionSegment} segment segment to append
	 */
	SegmentStash.prototype.Append = function(segment){

		this.segments.push(segment);

	};


	/**
	 * After inserting or deleting a segment, all subsequent segments must be updated
	 * @param {Number} startingIndex Where to start updating
	 * @param {Number} offset        positive or negative number of seconds to update subsequent indeces
	 */
	SegmentStash.prototype.UpdateSegmentsAfter = function(startingIndex,offset) {
		

		//update segment times for segments after
		for (var i = startingIndex; i < this.segments.length; i++) {
			this.segments[i].initialTime+=offset;
			this.segments[i].finalTime+=offset;
		}


	};


	/**
	 * Checks and returns if exists an existing segment beginning at time initialTime
	 * @param {number} initialTime initial time of segment to check
	 * @returns {MotionSegment} existing segment or null if none found
	 */
	SegmentStash.prototype.GetSegmentAt = function(initialTime) {
		var index = this.GetSegmentIndex(initialTime);
		if(index<0)
			return null;

		return this.segments[index];

	};


	/**
	 * Gets segment index given initial time. This function is necessary, 
	 * as segment keys may not be exact match due to rounding errors
	 * @param {Number} initialTime segment identifier
	 */
	SegmentStash.prototype.GetSegmentIndex=function(initialTime){
		//quick check existing
		var exact = FastMath.binaryIndexOf.call(this.segments, initialTime);
		if (exact >= 0)
			return exact;

		//need to check when segment times are subject to rounding errors

		var idx = ~exact;
		if (FastMath.equal(this.segments[idx], initialTime))
			return idx;

		if (idx > 0 && FastMath.equal(this.segments[idx - 1], initialTime))
			return idx - 1;
		if (idx < this.segments.length - 1 && FastMath.equal(this.segments[idx + 1]))
			return idx + 1;

		return -1;
	};

	/**
	 * Deletes a segment and "stitches the hole ""
	 * @param {Number} initialTime segment identifier
	 * @returns {MotionSegment} The deleted segment or null if initialTime not valid
	 */
	SegmentStash.prototype.DeleteAt = function(initialTime){
		var index = this.GetSegmentIndex(initialTime);

		var removed = this.segments.splice(index,1);

	};

	/**
	 * Get all segments currently in the stash
	 * @returns {Array} returns array of all segments
	 */
	SegmentStash.prototype.GetAllSegments = function() {
		return this.segments;
	};


	var factory={};

	factory.MakeStash=function(){
		return new SegmentStash();
	};

	return factory;

}]);