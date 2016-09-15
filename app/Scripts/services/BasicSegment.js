"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('basicSegmentFactory', ['polynomialFactory','MotionSegment','FastMath',function(polynomialFactory,MotionSegment,FastMath) {

	var BasicMotionSegment = function(t0,tf, positionPolyCoeffs) {

		MotionSegment.MotionSegment.call(this,t0,tf);

		var poly = new polynomialFactory.CreatePolyAbCd(positionPolyCoeffs,t0,tf);


		this.positionPoly = poly;

		this.velocityPoly=this.positionPoly.Derivative();
		this.accelPoly = this.velocityPoly.Derivative();
		this.jerkPoly = this.accelPoly.Derivative();

		
		//wait until polynomials are assigned, then calculate initial and final vel/pos
		this.initialVelocity = this.EvaluateVelocityAt(t0);
		this.finalVelocity = this.EvaluateVelocityAt(tf);

		this.initialPosition = this.EvaluatePositionAt(t0);
		this.finalPosition=this.EvaluatePositionAt(tf);


	};

	BasicMotionSegment.prototype = Object.create(MotionSegment.MotionSegment.prototype);
	BasicMotionSegment.prototype.constructor = BasicMotionSegment;


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



