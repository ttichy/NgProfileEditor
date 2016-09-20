"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('basicSegmentFactory', ['polynomialFactory','MotionSegment','FastMath',function(polyFactory,MotionSegment,FastMath) {

	var BasicMotionSegment = function(definition) {

		//definition one of jerk, accel, velocity, position
		
		
		this.duration=definition.duration;

		this.j=0;
		this.a0=0;
		this.v0=0;
		this.p0=0;

		if(definition.jerk)
			this.j=definition.jerk;
		if(definition.a0)
			this.a0=definition.a0;
		if(definition.v0)
			this.v0=definition.v0;
		if(definition.p0)
			this.p0=definition.p0;



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




		//since we have initial values, we can setup the polynomials
		//Ax^3 + Bx^2 + Cx +D
		var poly=polyFactory.createPolyAbCd([this.j,a0,v0,x0],t0,t0+this.duration);

        this.positionPoly = poly;
        this.velocityPoly=this.positionPoly.derivative();
        this.accelPoly = this.velocityPoly.derivative();
        this.jerkPoly = this.accelPoly.derivative();


		this.initialized=true;

	};


	BasicMotionSegment.prototype.evaluatePositionAt = function(x) {
		if(this.initialized)
			return this.positionPoly.evaluateAt(x);

		throw new Error("Segment not intialized yet!");

	};


	BasicMotionSegment.prototype.evaluateVelocityAt = function(x) {
		if (this.initialized)
			return this.velocityPoly.evaluateAt(x);
		throw new Error("Segment not intialized yet!");
	};

	BasicMotionSegment.prototype.evaluateAccelerationAt = function(x) {
		if (this.initialized)
			return this.accelPoly.evaluateAt(x);
		throw new Error("Segment not intialized yet!");
	};

	BasicMotionSegment.prototype.evaluateJerkAt = function(x) {
		if (this.initialized)
			return this.jerkPoly.evaluateAt(x);
		throw new Error("Segment not intialized yet!");
	};





	var factory ={};

	factory.createBasicSegment = function(definition)
	{
		//TODO: check parameters

		var segment = new BasicMotionSegment(definition);

		return segment;

	};

	factory.BasicMotionSegment = BasicMotionSegment;

	return factory;

}]);



