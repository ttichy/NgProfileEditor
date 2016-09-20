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

	/**
	 * [nodesHash description]
	 * @type {Object} associative array of nodes. Each node contains a motion segment
	 */
		this.nodesHash={};
		
		this.segmentsList=LinkedList.MakeLinkedList();

	};

	/**
	 * Inserts a segment in front of another segment identified by segmentId
	 * @param {MotionSegment} segment   Segment to insert
	 * @param {integer} segmentId segment Id of segment to insert in front of. If null, add at the end
	 */
	SegmentStash.prototype.insertAt = function(segment,segmentId) {
		if (!segment)
			throw new Error("Insert expects segment to be not null!");

		var newNode;

		if (segmentId)
		{ //there needs to be an existing node with this id
			var existingNode = this.nodesHash[segmentId];
			if (!existingNode)
				return null;

			newNode = this.segmentsList.insertAt(segment, existingNode);

		}
		else
		{
			newNode=this.segmentsList.add(segment);
		}
		
		this.nodesHash[segment.id] = newNode;	
		return segment;



	};


	/**
	 * Gets all segments currently in the stash
	 * @returns {Array} array of MotionSegment
	 */
	SegmentStash.prototype.getAllSegments = function() {
		
		return this.segmentsList.getDataArray();

	};


	/**
	 * Deletes segment specified by segment id
	 * @param {Number} segmentId 
	 */
	SegmentStash.prototype.delete = function(segmentId) {
		if(!FastMath.isNumeric(segmentId) || FastMath.lt(0))
			throw new Error("Delete expects id to be a number >=0");

		var nodeToDel = this.nodesHash[segmentId];
		if(! nodeToDel)
			return null;

		var deletedNode=nodeToDel;
		delete this.nodesHash[segmentId];

		return this.segmentsList.removeNode(nodeToDel);


	};

	var factory={};

	factory.makeStash=function(){
		return new SegmentStash();
	};

	return factory;

}]);