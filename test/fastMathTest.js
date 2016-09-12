
describe('Unit: fastmath functions-', function() {
  "use strict";
  var polynomialFactory;
  var basicSegmentFactory;
  var accelSegmentFactory;
  var fm;

  beforeEach(function() {
  	module('profileEditor');
  	
    inject(function(_FastMath_) {
      fm=_FastMath_;
    });

  });
  

  it('fastMath isNumeric function should return true when parameters are numbers', function() {
    expect(fm.isNumeric(4.5)).toBe(true);
    expect(fm.isNumeric(-4.5)).toBe(true);
    expect(fm.isNumeric(0)).toBe(true);
  	expect(fm.isNumeric(1e-3)).toBe(true);
  });

    it('fastMath isNumeric function should return false when parameters are not numbers', function() {
    expect(fm.isNumeric("4.5a")).toBe(false);
    expect(fm.isNumeric(NaN)).toBe(false);
    expect(fm.isNumeric(undefined)).toBe(false);
    expect(fm.isNumeric(Infinity)).toBe(false);
  });


  it('fastMath areNumeric function should return true when parameters are numbers', function() {
    expect(fm.areNumeric(4.5,-4.5,0,-1e-4)).toBe(true);
  });



  it('fastMath areNumeric function should return false when a parameter is not a number', function() {
    expect(fm.areNumeric(4.5,-4.5,0,-1e-4, NaN)).toBe(false);
  });

});