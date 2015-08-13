"use strict";
// get app reference
var app=angular.module('profileEditor');


app.service('presenterService',['motionProfileFactory', function(motionProfileFactory){

	var service={};

	var registeredGraphs={};

	var knownTypes=['motion','friction','frictionCoeff','externalTorque','externalForce'];
	Object.seal(knownTypes);


	/**
	 * Creates and registeres a linear profile
	 */
	service.CreateLinearProfile = function(){
		var profile=motionProfileFactory.CreateMotionProfile("linear");
		registeredGraphs.motion=profile;
	};


	/**
	 * Creates and registeres a rotary profile
	 */
	service.CreateRotaryprofile=function(){
		var profile=motionProfileFactory.CreateMotionProfile("rotary");
		registeredGraphs.motion=profile;
	};

	/**
	 * Registers a load name
	 * @param {string} loadName name of load that is being registered
	 * @param {string} loadType type of load (friction, inertia, external, etc.)
	 */
	service.RegisterLoad=function(loadName, loadType){

		var valid=knownTypes.filter(function(knownType){
			return knownType===loadType;
		});

		if(valid.length===0)
			throw new Error("Attemping to register an unknown type");

		if(loadType=='motion')
			throw new Error("You can't register motion as a type. Use CreateLinearProfile or CreateRotaryProfile");

		registeredGraphs.loadType=loadName;

	};

	service.GetAllRegisteredGraphs=function() {
		return registeredGraphs;
	};


	service.GetKnownGraphTypes=function(){
		return knownTypes;
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


}]);