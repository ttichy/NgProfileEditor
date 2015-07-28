
describe('Unit: polynomialFactory', function() {
  var polynomialFactory;
  var basicSegmentFactory;
  var accelSegmentFactory;

  beforeEach(function() {
  	module('profileEditor');
  	
  	inject(function(_polynomialFactory_){
  		polynomialFactory=_polynomialFactory_;
  	});


  	inject(function(_basicSegmentFactory_) {
  		basicSegmentFactory = _basicSegmentFactory_;
  	});

  	inject(function(_accelSegmentFactory_) {
  		accelSegmentFactory =_accelSegmentFactory_;
  	});

  });
  

  it('polynomialFactory should have CreatePolyAbCd function', function() {
  	expect(angular.isFunction(polynomialFactory.CreatePolyAbCd)).toBe(true);
  });


  it('basicSegmentFactory should have CreateBasicSegment function', function() {
  	expect(angular.isFunction(basicSegmentFactory.CreateBasicSegment)).toBe(true);
  }); 



  it('accelSegmentFactory should have MakeFromVelocity function', function() {
  	expect(angular.isFunction(accelSegmentFactory.MakeFromVelocity)).toBe(true);
  });


});

