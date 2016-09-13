"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('MotionSegment', ['polynomialFactory', 'FastMath', function(polynomialFactory, fastMath) {

	/**
	 * MotionSegment is a generic segment of which a motion profile consists of
	 * @param {Number} t0 initial Time
	 * @param {Number} tf final Time
	 */
	var MotionSegment = function(t0,tf){
		
		if(!angular.isNumber(t0))
			throw new Error('initial time t0 is not a number');
		if(!angular.isNumber(tf))
			throw new Error('final time tf is not a number');

		var segTime=tf-t0;
		if(fastMath.leq(segTime,0))
			throw new Error('MotionSegment time duration is less or equal to zero');

		this.initialTime=t0;
		this.finalTime=tf;

		//each segment can hold other segments
		this.segments=[];

	};

	MotionSegment.prototype.GetAllSegments = function() {
		return this.segments;
	};

	var factory={};

	factory.MotionSegment=MotionSegment;

	return factory;

}]);