"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('AccelSegment', ['MotionSegment','basicSegmentFactory','FastMath', function(MotionSegment,basicSegmentFactory,fastMath) {

	var factory={};

	/**
	 * Makes a new AccelMotionSegment given velocity information
	 * @param {[type]} t0 [initial time]
	 * @param {[type]} tf [final time]
	 * @param {[type]} p0 [initial position]
	 * @param {[type]} v0 [final position]
	 * @param {[type]} vf [final velocity]
	 * @param {[type]} jPct  [jerk as a percent of time]
	 * @returns {AccelMotionSegment} [freshly created accel segment]
	 */
	factory.MakeFromVelocity= function(t0,tf,p0,v0,vf,jPct){

		if(angular.isUndefined(jPct) || jPct<0 || jPct>1)
			throw new Error('expecting jerk between <0,1>');
		

		var basicSegment, basicSegment2, basicSegment3;
		var accelSegment;
		var coeffs, coeffs1,coeffs2,coeffs3,coeffs4;

		if(jPct===0){
			// consists of one basic segment
			coeffs=[p0,v0,(vf-v0)/(tf-t0),0];

			basicSegment = basicSegmentFactory.CreateBasicSegment(t0,tf,coeffs);

			accelSegment=new AccelMotionSegment([basicSegment]);
			return accelSegment;
		}

		var aMax;
		var jerk;
		var th;
	
		if(jPct==1){	
			// two basic segments

			// th - duration of half the accel segment
			th=(tf-t0)/2;
			aMax = (vf-v0)/th;
			jerk = aMax/th;

			coeffs1=[p0,v0,0,jerk/6];

			basicSegment=basicSegmentFactory.CreateBasicSegment(t0,t0+th,coeffs1);
	
			coeffs2=[basicSegment.EvaluatePositionAt(t0+th),basicSegment.EvaluateVelocityAt(t0+th),aMax/2,-jerk/6];
	
			basicSegment2=basicSegmentFactory.CreateBasicSegment(t0+th,tf,coeffs2);
	
			accelSegment = new AccelMotionSegment([basicSegment,basicSegment2]);
	
			return accelSegment;
		}

		// last case is three basic segments

		var td1; //duration of first and third segments
		var tdm; //duration of the middle segment
		td1=0.5*jPct*(tf-t0);
		tdm=tf-t0-2*(td1);

		//calculate max accel by dividing the segment into three chunks
		// and using the fact that (vf-v0) equals area under acceleration
		aMax=(vf-v0)/(td1+tdm);
		jerk=aMax/td1;

		coeffs1=[jerk/6,0,v0,p0];
		basicSegment = basicSegmentFactory.CreateBasicSegment(t0,t0+td1,coeffs1);

		coeffs2=[0, aMax/2,basicSegment.EvaluateVelocityAt(t0+td1),basicSegment.EvaluatePositionAt(t0+td1)]; // middle segment has no jerk
		basicSegment2 = basicSegmentFactory.CreateBasicSegment(t0+td1,t0+td1+tdm,coeffs2);

		coeffs3=[-jerk/6, aMax/2,basicSegment2.EvaluateVelocityAt(t0+td1+tdm), basicSegment2.EvaluatePositionAt(t0+td1+tdm)];
		basicSegment3 = basicSegmentFactory.CreateBasicSegment(t0+td1+tdm,tf,coeffs3);

		accelSegment = new AccelMotionSegment([basicSegment, basicSegment2, basicSegment3]);

		return accelSegment;


	};


	factory.MakeFromPosition = function(t0,tf,p0,pf,v0,j){
		//TODO: add awesome JS here
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

		var t0=basicSegments[0].initialTime;
		var tf=basicSegments[basicSegments.length-1].finalTime;

		MotionSegment.MotionSegment.call(this,t0,tf);

		//TODO: check ordering of the basicSegments (increasing time)

		this.type='acceleration';


		// each segment (regardless of type) has initialTime and finalTime
		this.initialTime=basicSegments[0].initialTime;
		this.finalTime=basicSegments[basicSegments.length-1].finalTime;

		this.basicSegments=basicSegments;
	};


	AccelMotionSegment.prototype = Object.create(MotionSegment.MotionSegment.prototype);
	AccelMotionSegment.prototype.constructor = AccelMotionSegment;

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

		// could have two segments, if time falls right at the end of the first segment
		// and the beginning of 2nd
		if(segment.length > 2)
			throw new Error("Found "+segment.length+" segments, expecting 1 or 2.");

		//since all profile variables (p,v,a) are continuous, we'll just pick the first one
		return segment[0];
	};

	AccelMotionSegment.prototype.GetAllBasicSegments = function() {
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