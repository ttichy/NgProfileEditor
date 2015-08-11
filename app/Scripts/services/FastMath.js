
"use strict";
// get app reference
var app=angular.module('profileEditor');


app.service('FastMath', function() {
var epsilon = 2.220446049250313e-16;


		return {
			epsilon: epsilon,

			equal: function(a, b) {
				return this.abs(a - b) < (epsilon);

			},

			notEqual: function(a, b) {
				return !this.equal(a, b);
			},

			leq: function(a, b) {
				return a < b || this.equal(a, b);
			},

			geq: function(a, b) {
				return a > b || this.equal(a, b);
			},

			lt: function(a, b) {
				return a < b && !this.equal(a, b);
			},

			gt: function(a, b) {
				return a > b && !this.equal(a, b);
			},

			max: function(a, b) {
				if (a > b) {
					return a;
				}

				return b;
			},

			min: function(a, b) {
				if (a < b) {
					return a;
				}

				return b;
			},

			abs: function(a) {
				if (a < 0) {
					return -a;
				}

				return a;
			},

			sign: function(a) {
				if (a < 0) {
					return -1;
				}

				if (a > 0) {
					return 1;
				}

				return 0;
			},

			trunc: function(a) {
				var num = parseInt(a, 10);
				if (isNaN(num)) {
					return NaN;
				}

				return parseInt(num.toFixed(0), 10);
			},

			fix: function(a, p) {
				var num = parseFloat(a);
				if (isNaN(num)) {
					return NaN;
				}

				p = parseInt(p, 10);
				if (isNaN(p)) {
					p = 0;
				}

				return parseFloat(num.toFixed(p));
			}
		};
});

