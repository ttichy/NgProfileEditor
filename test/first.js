
describe('Unit: polynomialFactory', function() {
  var polynomialFactory;

  beforeEach(function() {
  	module('profileEditor');
  	
  	inject(function(_polynomialFactory_){
  		polynomialFactory=_polynomialFactory_;
  	});
  });
  
  it('1 should equal 1', function() {
  	expect(1).toEqual(1);
  });


  it('should have CreatePolyAbCd function', function() {
  	expect(angular.isFunction(polynomialFactory.CreatePolyAbCd)).toBe(true);
  });

});

