"use strict";
// get app reference
var app=angular.module('profileEditor');

app.factory('polynomialFactory', function() {

    var factory ={};

    var cuberoot=function cuberoot(x) {
        var y = Math.pow(Math.abs(x), 1/3);
        return x < 0 ? -y : y;
    };

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

        /**
         * Calculate cubic roots - props to http://stackoverflow.com/a/27176424/1579778
         */
        Polynomial.prototype.Roots = function() {

            var D;
            var u;

            if (Math.abs(this.A) < 1e-8) { // Quadratic case, ax^2+bx+c=0
                this.A = this.B;
                this.B = this.C;
                this.C = this.D;
                if (Math.abs(this.A) < 1e-8) { // Linear case, ax+b=0
                    this.A = this.B;
                    this.B = this.C;
                    if (Math.abs(this.A) < 1e-8) // Degenerate case
                        return [];
                    return [-this.B / this.A];
                }

                D = this.B * this.B - 4 * this.A * this.C;
                if (Math.abs(D) < 1e-8)
                    return [-this.B / (2 * this.A)];
                else if (D > 0)
                    return [(-this.B + Math.sqrt(D)) / (2 * this.A), (-this.B - Math.sqrt(D)) / (2 * this.A)];
                return [];
            }

            // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - this.B/3a)
            var p = (3 * this.A * this.C - this.B * this.B) / (3 * this.A * this.A);
            var q = (2 * this.B * this.B * this.B - 9 * this.A * this.B * this.C + 27 * this.A * this.A * this.D) / (27 * this.A * this.A * this.A);
            var roots;

            if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1/3
                roots = [cuberoot(-q)];
            } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
                roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
            } else {
                D = q * q / 4 + p * p * p / 27;
                if (Math.abs(D) < 1e-8) { // D = 0 -> two roots
                    roots = [-1.5 * q / p, 3 * q / p];
                } else if (D > 0) { // Only one real root
                    u = cuberoot(-q / 2 - Math.sqrt(D));
                    roots = [u - p / (3 * u)];
                } else { // D < 0, three roots, but needs to use complex numbers/trigonometric solution
                    u = 2 * Math.sqrt(-p / 3);
                    var t = Math.acos(3 * q / p / u) / 3; // D < 0 implies p < 0 and acos argument in [-1..1]
                    var k = 2 * Math.PI / 3;
                    roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
                }
            }

            // Convert back from depressed cubic
            for (var i = 0; i < roots.length; i++)
                roots[i] -= this.B / (3 * this.A);

            return roots;
        };



        Polynomial.prototype.toPrettyString = function() {
            return this.this.A+'(x-'+ this.startPoint +')^3 + '+this.B+'(x-'+this.startPoint+')^2 + '+this.C+'(x-' + this.startPoint + ')'+this.D;
        };



        var poly = new Polynomial(coeffs.reverse(),startPoint);

        return poly;

    };

    return factory;
});
