/**
 * Creates MotionProfile. MotionProfile object contains a collection of all known segment types.
 * 
 */


"use strict";
// get app reference
var app=angular.module('profileEditor');


app.factory('motionProfileFactory', ['basicSegmentFactory', 'accelSegmentFactory', function(basicSegmentFactory, accelSegmentFactory) {

	var factory = {};



	var MotionProfile = function(type) {

		this.ProfileType = "rotary";

		if (type === "linear")
			this.ProfileType = "linear";

		this.Segments = [];

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
			allSegments.push(this.Segments[key].AllSegments);
		}

		return allSegments;
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


	MotionProfile.prototype.AddAccelSegment = function(accelSegment) {
		//TODO: check parameter type


	};

}]);