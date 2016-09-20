"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('basicSegmentFactory', ['polynomialFactory','MotionSegment','FastMath',function(polyFactory,MotionSegment,FastMath) {

	var BasicMotionSegment = function(definition) {

		//definition one of jerk, accel, velocity, position
		
		
		this.duration=definition.duration;

		this.j=null;
		this.a0=null;
		this.v0=null;
		this.p0=null;

		// setup definition and convert from physical units to straight up polynomial
		if(definition.jerk)
			this.j=definition.jerk/6;
		if(definition.a0)
			this.a0=definition.a0/2;
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
	 * @param {Array} array of initial values [t0,j,a0,v0,x0]		

	 */
	BasicMotionSegment.prototype.setInitialValues = function(initialValues) {

		if(!Array.isArray(initialValues) || initialValues.length !=4)
			throw new Error("setInitialValues: expects an array of length 4");

		var t0=initialValues[0];
		var x0=initialValues[1];
		var v0=initialValues[2];
		var a0=initialValues[3];

		if(!FastMath.areNumeric(t0,x0,v0))
			throw new Error("setInitialValues: expects initial values to be numeric")	;
		var a=0,b=0,c=0,d=0;

		// segment setup has jerk
		if(this.j)
		{
			a=this.j;
			b=a0;
			c=v0;
			d=x0;
		}

		// segment setup with accel
		if(this.a0)
		{
			b=this.a0;
			c=v0;
			d=x0;
		}

		if(this.v0)
		{
			c=this.v0;
			d=x0;
		}

		if(this.x0)
			d=this.x0;

		this.t0=t0;


		//since we have initial values, we can setup the polynomials
		//Ax^3 + Bx^2 + Cx +D
		var poly=polyFactory.createPolyAbCd([a,b,c,d],t0,t0+this.duration);

        this.positionPoly = poly;
        this.velocityPoly=this.positionPoly.derivative();
        this.accelPoly = this.velocityPoly.derivative();
        this.jerkPoly = this.accelPoly.derivative();


		this.initialized=true;

	};

	/**
	 * Gets the final time, jerk, acceleration, velocity and position
	 * @return {Array} [time,jerk,acceleration, velocity, position]
	 */
	BasicMotionSegment.prototype.getFinalValues = function() {
		
		if(!this.initialized)
			return null;
		var tf=this.t0+this.duration;

		var finalJerk=this.jerkPoly.evaluateAt(tf);
		var finalAccel=this.accelPoly.evaluateAt(tf);
		var finalVelocity=this.velocityPoly.evaluateAt(tf);
		var finalPosition=this.positionPoly.evaluateAt(tf);

		return [tf,finalJerk,finalAccel,finalVelocity,finalPosition];


	};


	/**
	 * Evalutes position at time x
	 * @param  {Number} x time to evaluate at in [sec]
	 * @return {Number}   position in [rad/s] or[m]
	 */
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



