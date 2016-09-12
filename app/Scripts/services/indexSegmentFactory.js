"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('indexSegmentFactory', ['accelSegmentFactory','FastMath', function(accelSegmentFactory,fastMath) {

	var factory={};

	/**
	 * Makes a new IndexMotionSegment given velocity information
	 * @param {number} t0 [initial time in sec]
	 * @param {number} tf [final time in sec]
	 * @param {number} p0 [initial position in m or rad]
	 * @param {number} v0 [initial velocity in m/s or rad/s]
	 * @param {number} vf [final velocity in m/s or rad/s]
	 * @param {number} pf [final position in m or rad]
	 * @param {number} jPctAccel  [jerk as a percent of time during acceleration in pct]
	 * @param {number} jPctDecel [jerk as a percent of time during deceleration in pct]
	 * @param {number} vLim [velocity limit in m/s or rad/s. vLim ==null means no limit]
	 * @param {string} index type [trapezoidal or triangular]
	 */
	factory.MakeIndexSegment= function(t0,tf,p0,v0,vf,pf,jPctAccel, jPctDecel, vLim, indexType){

		if(angular.isUndefined(jPctAccel) || jPctAccel<0 || jPctAccel>1)
			throw new Error('expecting accel jerk between <0,1>');

		if(angular.isUndefined(jPctDecel) || jPctDecel<0 || jPctDecel>1)
			throw new Error('expecting decel jerk between <0,1>');

		if(angular.isUndefined(p0) || !angular.isf)
			throw new Error('expecting initial position to be defined');
		if(angular.isUndefined(v0))
			throw new Error('expecting initial velocity to be defined');
		
		if(!fastMath.areNumeric(t0,tf,v0,vf,pf,jPctAccel,jPctDecel,vLim))
		{
			throw new Error('Not all arguments are numeric!');
		}


		


	};



	/**
	 * IndexMotion segment constructor
	 * @param {Array} basicSegments [array of basic segments]
	 */
	var IndexMotionSegment = function(basicSegments){
		if(!Array.isArray(basicSegments))
			throw new Error('Expecting basicSegments to be an array parameter');
		if(basicSegments.length<3 || basicSegments.length > 7)
			throw new Error('Expecting basicSegments array length to be between 3 and 7');

		var sortedSegments = basicSegments.sort(fastMath.compareNumbers);
		
		this.type='index';


		// each segment (regardless of type) has initialTime and finalTime
		this.initialTime=basicSegments[0].initialTime;
		this.finalTime=basicSegments[basicSegments.length-1].finalTime;

		this.basicSegments=basicSegments;
	};

	AccelMotionSegment.prototype.EvaluatePositionAt = function(x) {
		//which segment does x fall in
		
		var segment = this.FindSegmentAtTime(x);
		return segment.EvaluatePositionAt(x);
		
	};

	AccelMotionSegment.prototype.EvaluateVelocityAt = function(x) {
		//which segment does x fall in
		
		var segment = this.FindSegmentAtTime(x);
		return segment.EvaluateVelocityAt(x);
	};

	AccelMotionSegment.prototype.EvaluateAccelerationAt = function(x) {
		//which segment does x fall in
		
		var segment = this.FindSegmentAtTime(x);
		return segment.EvaluateAccelerationAt(x);
	};


	AccelMotionSegment.prototype.FindSegmentAtTime = function(time){
		var segment = this.basicSegments.filter(function(bSeg){
			return fastMath.geq(time,bSeg.initialTime) && fastMath.leq(time,bSeg.finalTime);
		});
		
		if(!angular.isObject(segment[0]))
			throw new Error("Couldn't find basic segment that contains time "+time);

		if(segment.length > 1)
			throw new Error("Found "+segment.length+" segments, expecting exactly one.");

		return segment[0];
	};

	AccelMotionSegment.prototype.AllSegments = function() {
		return this.basicSegments;
	};


	/**
	 * Modifies segment initial values. Used when adding a point in the middle of a segment.
	 * @param {float} t0 new initial time
	 * @param {float} a0 new initial acceleration
	 * @param {float} v0 new initial velocity
	 * @param {float} p0 new initial position
	 */
	AccelMotionSegment.prototype.ModifyInitialValues=function(t0,a0,v0,p0){
		var last=this.basicSegments.length-1;
		var tf=this.basicSegments[last].finalTime;
		var af = this.EvaluateAccelerationAt(tf);
		var vf=this.EvaluateVelocityAt(tf);

		var jPct;
		if(last===0)
			jPct=0;
		else if(last==1)
			jPct=1;
		else
		{
			var firstDuration=this.basicSegments[0].finalTime-this.basicSegments[0].initialTime;
			var totalDuration=this.basicSegments[2].finalTime-this.basicSegments[0].initialTime;
			jPct=2*firstDuration/totalDuration;

		}

		
		return factory.MakeFromVelocity(t0,tf,p0,v0,vf,jPct);


	};


	return factory;

}]);