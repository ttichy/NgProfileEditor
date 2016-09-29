"use strict";
// get app reference
var app=angular.module('profileEditor');


app.service('presenterService',['motionProfileFactory', 'graphProxy', function(motionProfileFactory,graphProxy){

	var service={};

	var registeredGraphs={};

	var loadTypes=['friction','frictionCoeff','externalTorque','externalForce'];
	var motionTypes=['position','velocity','acceleration','jerk'];

	Object.seal(loadTypes);


	/**
	 * Creates and registeres a linear profile
	 */
	service.CreateLinearProfile = function(){
		var profile=motionProfileFactory.createMotionProfile("linear");
		registeredGraphs.motion=profile;
	};


	/**
	 * Creates and registeres a rotary profile
	 */
	service.CreateRotaryprofile=function(){
		var profile=motionProfileFactory.createMotionProfile("rotary");
		registeredGraphs.motion=profile;
	};

	/**
	 * Registers a load name
	 * @param {string} loadName name of load that is being registered
	 * @param {string} loadType type of load (friction, inertia, external, etc.)
	 */
	service.CreateLoad=function(loadName, loadType){

		var valid=loadTypes.filter(function(knownType){
			return knownType===loadType;
		});

		if(valid.length===0)
			throw new Error("Attemping to register an unknown type");

		if(loadType=='motion')
			throw new Error("You can't register motion as a type. Use CreateLinearProfile or CreateRotaryProfile");

		registeredGraphs.loadType=loadName;

	};


	service.DeleteLoad = function(loadName) {

		if (angular.isObject(registeredGraphs.loadName)) {
			//TODO: check if NOT motion type
			delete registeredGraphs.loadName;
		}
	};


	service.GetAllRegisteredGraphs=function() {
		var types=[];
		angular.copy(registeredGraphs,types);
		return types;
	};


	service.GetKnownGraphTypes=function(){
		return loadTypes.concat(motionTypes);
	};


	/**
	 * Formats data for a given graph to graphing library specification	
	 * @param {string} graphName name of graph to format
	 * @return {Object} JSON data for specific graphing library (dygraphs)
	 */
	service.GetGraphData=function(graphName){
		var graph=registeredGraphs.graphName;
		if(!angular.isObject(graph))
			throw new Error('Can not find '+graphName+' in currently registered graphs');


		//dygraphs data format is 
		/*
                [1,10,100],
                [2,20,80],
                [3,50,60],
                [4,70,80]
              ],

        where the first column is the x axis, the rest of the columns are series

        */

	};



	service.MouseClick=function(canvasX,canvasY, graph){
		var data=graphProxy.toDataX(canvasX)
	};

	return service;

}]);