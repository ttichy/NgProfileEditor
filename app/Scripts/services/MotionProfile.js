/**
 * Creates MotionProfile. MotionProfile is a list of MotionSegments.
 * MotionSegments represent the various available segments in a profile, such as BasicSegment, AccelSegment,
 * CamSegment, IndexSegment, etc...
 * 
 */


"use strict";
// get app reference
var app=angular.module('profileEditor');


app.factory('motionProfileFactory', ['MotionSegment', 'FastMath','ProfileHelper',
 function(MotionSegment, fastMath, profileHelper) {

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

		MotionSegment.MotionSegment.call(this);

	};



	MotionProfile.prototype = Object.create(MotionSegment.MotionSegment.prototype);
	MotionProfile.prototype.constructor = MotionProfile;


	/**
	 * Gets all basic segments that exist in the profile. Basic Segments are the most basic building blocks
	 */
	MotionProfile.prototype.getAllBasicSegments = function() {
		var allSegments=[];
		// using associative array to hold all segments -> quick and easy to search
		this.stash.GetAllSegments().forEach(function(element){
			allSegments.push(element.getAllSegments());
		});

		// previous code gets us an array of arrays, we need to flatten it
		return allSegments.reduce(function(a, b) {
  			return a.concat(b);
  		});
	};

	MotionProfile.prototype.getAllSegments = function() {
		return this.stash.GetAllSegments();
	};





	return factory;

}]);