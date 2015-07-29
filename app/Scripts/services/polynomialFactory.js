"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('polynomialFactory', function() {

	var factory ={};


	/**
	 * Creates a new  polynomial with coefficients A,B,C,D
	 * Ax^3 + Bx^2 + Cx +D
	 * @param {Array} coeffs [array of coefficients]
	 */
	factory.CreatePolyAbCd =  function(coeffs,startPoint){
		if(!Array.isArray(coeffs) || coeffs.length!=4)
			throw new Error('expecting parameter of type array and length 4');

		if(!!!startPoint && startPoint < 0)
			throw new Error('expecting a valid startpoint');


		/**
		 * Polynomial of max 3rd degree
		 * @param {Array} coeffArray [description]
		 * @param {double} startPoint Point on the X-axis where to start evaluating
		 */
		var Polynomial = function(coeffArray,startPoint){

			if(!Array.isArray(coeffArray))
				throw new Error('Expecting coefficients to be in an array');

			if(coeffArray.length !=4)
				throw new Error('Length of coefficient array should be 4');

			if(startPoint===undefined)
				throw new Error('start point is needed!, got  '+startPoint);

			this.A = coeffArray[3];
			this.B = coeffArray[2];
			this.C = coeffArray[1];
			this.D = coeffArray[0];
			this.startPoint=startPoint;
		};


		Polynomial.prototype.EvaluateAt = function(x) {
			if(x < this.startPoint)
				throw new Error('Trying to evalute polynomial with x value less than the start point');
			return this.A * Math.pow(x-this.startPoint,3) + this.B * Math.pow(x-this.startPoint,2) + this.C*(x-this.startPoint) + this.D;
		};


		/**
		 * Takes derivative of this polynomial and returns a new polynomial
		 * @returns {Polynomial} a new polynomial
		 */
		Polynomial.prototype.Derivative = function() {
			var b = 3*this.A;
			var c = 2*this.B;
			var d = this.C;
			
			return new Polynomial([d,c,b,0],this.startPoint);
		};



		Polynomial.prototype.toPrettyString = function() {
			return this.A+'(x-'+ this.startPoint +')^3 + '+this.B+'(x-'+this.startPoint+')^2 + '+this.C+'(x-' + this.startPoint + ')'+this.D;
		};



		var poly = new Polynomial(coeffs.reverse(),startPoint);

		return poly;

	};

	return factory;
});



