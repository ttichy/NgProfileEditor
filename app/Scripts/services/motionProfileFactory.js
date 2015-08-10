/**
 * Creates MotionProfile. MotionProfile object contains a collection of all known segment types.
 * 
 */


"use strict";
// get app reference
var app=angular.module('profileEditor');


app.factory('motionProfileFactory', ['basicSegmentFactory', 'accelSegmentFactory', function(basicSegmentFactory, accelSegmentFactory) {

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

		this.Segments = {};

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


	MotionProfile.prototype.AddAccelSegment = function(accelSegment) {
		//TODO: check parameter type
		
		var existing=this.Segments[accelSegment.initialTime];
		if(angular.isObject(existing))
			throw new Error('segment with initial time '+ accelSegment+' already exists');

		this.Segments[accelSegment.initialTime]=accelSegment;
		


	};

	return factory;

}]);