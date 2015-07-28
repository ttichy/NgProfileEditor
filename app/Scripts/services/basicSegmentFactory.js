"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('basicSegmentFactory', function(polynomialFactory) {

	var MotionSegment = function(t0,tf, positionPolyCoeffs) {


		this.initialTime = t0;
		this.finalTime = tf;

		var poly = new polynomialFactory.CreatePolyAbCd(positionPolyCoeffs);


		this.positionPoly = poly;

		this.velocityPoly=this.positionPoly.Derivative();
		this.accelPoly = this.velocityPoly.Derivative();
		this.jerkPoly = this.accelPoly.Derivative();


	};


	MotionSegment.prototype.EvaluatePositionAt = function(x) {
		return this.positionPoly.EvaluateAt(x);
	};


	MotionSegment.prototype.EvaluateVelocityAt = function(x) {
		return this.velocityPoly.EvaluateAt(x);
	};

	MotionSegment.prototype.EvaluateAccelAt = function(x) {
		return this.velocityPoly.EvaluateAt(x);
	};




	var factory ={};

	factory.CreateBasicSegment = function(t0,tf,positionPolyCoeffs)
	{
		if(tf<=t0)
			throw new Error('final time must be greater than initial time');
		if(!Array.isArray(positionPolyCoeffs) || positionPolyCoeffs.length !=4)
			throw new Error('expecting array of length 4');

		var segment = new MotionSegment(t0,tf,positionPolyCoeffs);

		return segment;

	};


	return factory;

});



