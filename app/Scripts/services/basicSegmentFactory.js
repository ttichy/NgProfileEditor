"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('basicSegmentFactory', ['polynomialFactory','FastMath',function(polynomialFactory,FastMath) {

	var BasicMotionSegment = function(t0,tf, positionPolyCoeffs) {
		if(!angular.isNumber(t0))
			throw new Error('initial time t0 is not a number');
		if(!angular.isNumber(tf))
			throw new Error('final time tf is not a number');

		if(FastMath.lt(tf,t0))
			throw new Error('expecting final time to be greater than initial time');

		this.initialTime = t0;
		this.finalTime = tf;

		var poly = new polynomialFactory.CreatePolyAbCd(positionPolyCoeffs,t0,tf);


		this.positionPoly = poly;

		this.velocityPoly=this.positionPoly.Derivative();
		this.accelPoly = this.velocityPoly.Derivative();
		this.jerkPoly = this.accelPoly.Derivative();


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



