"use strict";
/**
 * SegmentStash takes care of low level segment operations
 * A regular associative array could be used, but there are issues
 * with rounding
 */

// get app reference
var app=angular.module('profileEditor');

app.factory('SegmentStash',['FastMath',  function(FastMath) {

	var SegmentStash = function() {

		//backing array for segments
		this.segments=[];

	};

	/**
	 * Inserts a segment. The position is taken from segment.initialTime
	 * @param {MotionSegment} segment segment to insert
	 */
	SegmentStash.prototype.InsertAt = function(segment) {
		// body...
	};

	/**
	 * Gets a segment specified by initial time. Null if 
	 * @param {Number} initialTime segment initial time
	 * @returns {MotionSegment} segment at the specified time, or null
	 */
	SegmentStash.prototype.SegmentAt=function(initialTime){
		//quick check existing
		var existing=this.Segments[initialTime];

		var numSegments=this.SegmentKeys.length;

		//may be past the profile
		if(initialTime > this.SegmentKeys[numSegments-1])
			return null;

		//due to roundoff error, initial time may not match exactly, so check the long way
		if(!angular.isObject(existing))
		{
			var index=this.GetSegmentIndex(initialTime);

			if(index>=0)
				return this.Segments[this.SegmentKeys[index]];

			return null;

		}

		return existing;
	};

	/**
	 * Deletes a segment and "stitches the hole ""
	 * @param {Number} initialTime segment identifier
	 */
	SegmentStash.prototype.DeleteAt = function(initialTime){

	}

	/**
	 * Get all segments currently in the stash
	 * @returns {Array} returns array of all segments
	 */
	SegmentStash.prototype.GetAllSegments = function() {
		return this.segments;
	};

}]);