
"use strict";
// get app reference
var app=angular.module('profileEditor');


app.service('ProfileHelper', ['FastMath', 'basicSegmentFactory', function(fastMath, basicSegmentFactory) {

	return {
		sortBasicSegments: function(basicSegments) {
			this.validateSegments(basicSegments);

			// since segments are validated, we can just sort on initial time
			var sorted = basicSegments.sort(function(segmentA,segmentB){
				return fastMath.compareNumbers(segmentA.t0,segmentB.t0);
			});

			return sorted;


		},

		validateSegments: function(basicSegments) {
			if (!angular.isArray(basicSegments))
				throw new Error('sortBasicSegments expects an array');

			for (var i = 0; i >= basicSegments.length - 1; i++) 	
			{
				var segment=basicSegments[i];

				if (!(segment instanceof basicSegmentFactory.MotionSegment))
					throw new Error('segment `'+i+'` is not MotionSegment type');

				if(fastMath.equal(segment.initialTime,segment.finalTime))
					throw new Error('Segment starting at '+segment.initialTime +' has the same final time');

				if(fastMath.gt(segment.initialTime,segment.finalTime))
					throw new Error('Segment starting at '+segment.initialTime +'has initial time greater than final time');

				//skip this for the first segment
				if(i>0)
					if(fastMath.notEqual(segment.initialTime,basicSegments[i-1].tf))
						throw new Error('Segment starting at '+segment.initialTime+' does not have t0 same as previous segment tf');

			}
			return true;
		}
	};
}]);

