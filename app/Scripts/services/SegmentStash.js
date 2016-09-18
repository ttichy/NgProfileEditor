"use strict";
/**
 * SegmentStash is the backing data structure for low level segment operations.
 * A motion profile is really a sorted array of MotionSegments. Some MotionSegments may contain other MotionSegments
 *
 * Also, in order to speed up search and insert/delete operation, two data structures are used:
 * linked list - insert
 * hashmap(array) - searching
 * 
 */

// get app reference
var app=angular.module('profileEditor');

app.factory('SegmentStash',['FastMath', 'LinkedList', function(FastMath,LinkedList) {


	var SegmentStash=function() {

		this.segmentsHash={};
		this.segmentsList=LinkedList.MakeList();

	};

	SegmentStash.prototype.InsertAt = function(segment,position) {
	if(arguments.length!==2)
		throw new Error("Insert expects 2 arguments: segment and position");

		if (!FastMath.isNumeric(position) || FastMath.lt(0))
			throw new Error("Insert expects position to be a number >=0");

	};



	SegmentStash.prototype.DeleteAt = function(position) {
		if(!FastMath.isNumeric(position) || FastMath.lt(0))
			throw new Error("Delete expects position to be a number >=0");
	};

	var factory={};

	factory.MakeStash=function(){
		return new SegmentStash();
	};

	return factory;

}]);