"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('accelSegmentFactory', function(basicSegmentFactory) {

	var factory={};

	/**
	 * Makes a new AccelMotionSegment given velocity information
	 * @param {[type]} t0 [initial time]
	 * @param {[type]} tf [final time]
	 * @param {[type]} p0 [initial position]
	 * @param {[type]} v0 [final position]
	 * @param {[type]} vf [final velocity]
	 * @param {[type]} j  [jerk as a percent of time]
	 */
	factory.MakeFromVelocity= function(t0,tf,p0,v0,vf,j){
		
		if(j<0 || j>1)
			throw new Error('expecting jerk between <0,1>');
		var basicSegment;
		var accelSegment;

		if(j===0){
			// consists of one basic segment
			var coeffs=[p0,v0,(vf-v0)/(tf-t0),0];

			basicSegment = basicSegmentFactory.CreateBasicSegment(t0,tf,coeffs);

			accelSegment=new AccelMotionSegment([basicSegment]);
			return accelSegment;
		}

		if(j==1){	
		//calculate times
			var t1=0.5*j*(tf-t0);
			var tm=(tf-t0)-2*t1;
			var t2=t1+tm;
	
			var aMax=2*(vf-v0)/(tf+t2-t1);
	
			var jerk = aMax/(tf-t0);
	
			var coeffs1=[p0,v0,0,jerk/6];
	
			basicSegment=basicSegmentFactory.CreateBasicSegment(t0,t0+t1,coeffs1);
	
			var coeffs2=[basicSegment.EvaluatePositionAt(t0+t1),basicSegment.EvaluateVelocityAt(t0+t1),aMax/2,jerk/6];
	
			var basicSegment2=basicSegmentFactory.CreateBasicSegment(t0+t1,tf,coeffs2);
	
			accelSegment = new AccelMotionSegment([basicSegment,basicSegment2]);
	
			return accelSegment;
		}


	};


	factory.MakeFromPosition = function(t0,tf,p0,pf,v0,j){

	};


	/**
	 * AccelMotion segment constructor
	 * @param {Array} basicSegments [array of basic segments]
	 */
	var AccelMotionSegment = function(basicSegments){
		if(!Array.isArray(basicSegments))
			throw new Error('Expecting an array parameter');
		if(basicSegments.length<1 || basicSegments.length > 3)
			throw new Error('Expecting aray length to be 1,2 or 3');


		this.type='acceleration';
		this.basicSegments=basicSegments;
	};

	AccelMotionSegment.prototype.EvaluatePositionAt = function(x) {
		//which segment does x fall in
		
		var segment = this.FindSegmentAtTime(x);
		segment.EvaluatePositionAt(x);
		
	};

	AccelMotionSegment.prototype.FindSegmentAtTime = function(time){
		var segment = this.basicSegments.filter(function(value){

		});
	}

	AccelMotionSegment.prototype.AllSegments = function() {
		
		return this.basicSegments;
		
	};

});