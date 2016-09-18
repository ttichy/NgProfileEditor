"use strict";

var app=angular.module('profileEditor');

app.factory('LinkedList', [ function() {


	/**
	 * Node of the linked list
	 * @param {Ojbect} data data object
	 */
	var Node = function(data){
		this.data=data;
		this.next=null;
		this.previous=null;
	};


	/**
	 * Double linked list functionality
	 * some code swiped from: https://code.tutsplus.com/articles/data-structures-with-javascript-singly-linked-list-and-doubly-linked-list--cms-23392
	 */
	var LinkedList = function() {
		this._length = 0;
		this.head = null;
		this.tail = null;
	};
	/**
	 * Add a value at the end of the list
	 * @param {Object} value value to add
	 */
	LinkedList.prototype.add = function(value) {
		var node = new Node(value);

		if (this._length) {
			this.tail.next = node;
			node.previous = this.tail;
			this.tail = node;
		} else {
			this.head = node;
			this.tail = node;
		}

		this._length++;

		return node;
	};

	/**
	 * Inserts into the list using an existing node
	 * @param  {Node} existing existing Node
	 * @param  {Object} data     new data to insert before existing node
	 * @return {Node}          new node that was inserted
	 */
	LinkedList.prototype.insertAt=function(existing,data){
		var node = new Node(data);
		var next = existing.next;
		var prev = existing.previous;

		node.next=existing;
		
		// if there is a previous node, wire it up
		if(prev)
		{
			prev.next=node;
			node.prev=prev;
		}

		this._length++;
		return node;

	};


	LinkedList.prototype.Length = function() {
		return this._length;
	};


	/**
	 * Get node at the specified position
	 * @param  {Number} position position to get node at
	 * @return {Node}          Node at specified position
	 */
	LinkedList.prototype.searchNodeAt = function(position) {
		var currentNode = this.head,
			length = this._length,
			count = 1,
			message = {
				failure: 'Failure: non-existent node in this list.'
			};

		// 1st use-case: an invalid position
		if (length === 0 || position < 1 || position > length) {
			throw new Error(message.failure);
		}

		// 2nd use-case: a valid position
		while (count < position) {
			currentNode = currentNode.next;
			count++;
		}

		return currentNode;
	};



	/**
	 * Removes node at specified position
	 * @param  {Number} position node at this position will be deleted
	 * @return {Object}          Deleted node
	 */
	LinkedList.prototype.remove = function(position) {
		var currentNode = this.head,
			length = this._length,
			count = 1,
			message = {
				failure: 'Failure: non-existent node in this list.'
			},
			beforeNodeToDelete = null,
			nodeToDelete = null,
			deletedNode = null;

		// 1st use-case: an invalid position
		if (length === 0 || position < 1 || position > length) {
			throw new Error(message.failure);
		}

		// 2nd use-case: the first node is removed
		if (position === 1) {
			this.head = currentNode.next;
			deletedNode=currentNode;

			// 2nd use-case: there is a second node
			if (!this.head) {
				this.head.previous = null;
				// 2nd use-case: there is no second node
			} else {
				this.tail = null;
			}

			this._length--;
			
			return deletedNode;

		}

		 // 3rd use-case: the last node is removed
		 if (position === this._length) {
			deletedNode=this.tail;
			this.tail = this.tail.previous;
			this.tail.next = null;

			this._length--;
			return deletedNode;

		} 

		// 4th use-case: a middle node is removed

		while (count < position) {
			currentNode = currentNode.next;
			count++;
		}

		beforeNodeToDelete = currentNode.previous;
		nodeToDelete = currentNode;
		var afterNodeToDelete = currentNode.next;

		beforeNodeToDelete.next = afterNodeToDelete;
		afterNodeToDelete.previous = beforeNodeToDelete;
		deletedNode = nodeToDelete;
		nodeToDelete = null;


		this._length--;

		return deletedNode;
	};


	var factory = {};
	factory.MakeLinkedList = function() {
		return new LinkedList();
	};


	return factory;
}]);