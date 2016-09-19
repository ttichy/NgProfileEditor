"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('MotionSegment', ['FastMath','SegmentStash', function( fastMath, SegmentStash) {

	/**
	 * MotionSegment is a generic segment of which a motion profile consists of
	 * @param {Number} t0 initial Time
	 * @param {Number} tf final Time
	 */
	var MotionSegment = function(t0,tf){
		
		if(!angular.isNumber(t0) || fastMath.lt(t0,0))
			throw new Error('initial time t0 is not a valid time');
		if(!angular.isNumber(tf) || fastMath.lt(tf,0))
			throw new Error('final time tf is not a valid time');

		var segTime=tf-t0;
		if(fastMath.leq(segTime,0))
			throw new Error('MotionSegment time duration is less or equal to zero');

		this.initialTime=t0;
		this.finalTime=tf;

		this.id=this.GenerateId();

		//each segment can hold other segments
		this.segments=SegmentStash.MakeStash();

	};


	/**
	 * Primitive value of the BasicMotionSegment object
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf
	 * @return {number} initial time of the segment
	 */
	MotionSegment.prototype.valueOf = function() {
		return this.initialTime;
	};

	/**
	 * Generate unique id 
	 */
	MotionSegment.prototype.GenerateId = function() {

		var mSec=(new Date()).getTime().toString();
		var rnd = Math.floor(Math.random()*100).toString();

		var idStr=mSec+rnd;

		return parseInt(idStr,10);

	};


	MotionSegment.prototype.GetAllSegments = function() {
		return this.segments.GetAllSegments();
	};

	var factory={};

	factory.MotionSegment=MotionSegment;

	return factory;

}]);