"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('basicSegmentFactory', ['polynomialFactory','MotionSegment','FastMath',function(polyFactory,MotionSegment,FastMath) {

	var BasicMotionSegment = function(duration, accel, jerk) {
		if (!FastMath.areNumeric(duration, accel, jerk))
			throw new Error("setInitialValues: expects all arguments to be numeric");
		if (FastMath.lt(duration, 0))
			throw new Error("Duration must be positive");
		if (FastMath.gt(accel, 0) && FastMath.gt(jerk, 0))
			throw new Error("BasicMotionSegment definition can't have both acceleration and jerk. Pick one!");
		if (FastMath.equal(accel, 0) && FastMath.equal(jerk, 0))
			throw new Error("BasicMotionSegment definition requires either acceleration or jerk, but not both");

		this.duration = duration;
		this.j = jerk;

		if (FastMath.gt(accel, 0)) {
			this.a0 = accel;
			this.hasJerk=false;
		}
		else
			this.a0 = null;
	

		this.x0 = null;
		this.v0 = null;
		this.t0 = null;


		this.initialized = false;

		//won't be using the stash, there is only one BasicSegment inside a BasicSegment
		this.segments = null;



	};

	BasicMotionSegment.prototype = Object.create(MotionSegment.MotionSegment.prototype);
	BasicMotionSegment.prototype.constructor = BasicMotionSegment;


	/**
	 * Sets the initial values for this basic segment
	 * @param {number} t0 initial time		
	 * @param {number} x0 initial position
	 * @param {number} v0 initial velocity
	 * @param {number} a0 initial acceleration
	 */
	BasicMotionSegment.prototype.setInitialValues = function(t0,x0,v0,a0) {
		if(!FastMath.areNumeric(t0,x0,v0))
			throw new Error("setInitialValues: expects t0,x0,v0 arguments to be numeric")	;

		this.t0=t0;
		this.x0=x0;
		this.v0=v0;
		
		//set initial accel only if this BasicSegment has jerk
		if(this.hasJerk)
			this.a0=a0;


		//since we have initial values, we can setup the polynomials
		//Ax^3 + Bx^2 + Cx +D
		var poly=polyFactory.CreatePolyAbcd([this.x0, this.v0, this.a0, this.j]);

        this.positionPoly = poly;
        this.velocityPoly=this.positionPoly.Derivative();
        this.accelPoly = this.velocityPoly.Derivative();



		this.initialized=true;

	};


	BasicMotionSegment.prototype.EvaluatePositionAt = function(x) {
		return this.positionPoly.EvaluateAt(x);
	};


	BasicMotionSegment.prototype.EvaluateVelocityAt = function(x) {
		return this.velocityPoly.EvaluateAt(x);
	};

	BasicMotionSegment.prototype.EvaluateAccelerationAt = function(x) {
		return this.accelPoly.EvaluateAt(x);
	};

	BasicMotionSegment.prototype.EvaluateJerkAt = function(x) {
		return this.jerkPoly.EvaluateAt(x);
	};





	var factory ={};

	factory.CreateBasicSegment = function(t0,tf,positionPolyCoeffs)
	{
		if(tf<=t0)
			throw new Error('final time must be greater than initial time');
		if(!Array.isArray(positionPolyCoeffs) || positionPolyCoeffs.length !=4)
			throw new Error('expecting array of length 4');

		var segment = new BasicMotionSegment(t0,tf,positionPolyCoeffs);

		return segment;

	};

	factory.BasicMotionSegment = BasicMotionSegment;

	return factory;

}]);



