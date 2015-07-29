
describe('Unit: valid factory injection', function() {
  "use strict";
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

describe('Unit: polynomial factory', function() {
  "use strict";

  var polynomialFactory;

  beforeEach(function() {
    module('profileEditor');

    inject(function(_polynomialFactory_){
      polynomialFactory=_polynomialFactory_;
    });


  });

  it('should create polynomial starting at 0 and evaluate it correctly', function(){
    var poly = polynomialFactory.CreatePolyAbCd([1,2,3,4],0);
    
    var result0=poly.EvaluateAt(0);
    var result1=poly.EvaluateAt(1);
    var result2=poly.EvaluateAt(2);

    expect(result0).toBe(4);
    expect(result1).toBe(10);
    expect(result2).toBe(26);

  });


  it('should create polynomial starting at 1 and evaluate it correctly', function(){
    var poly = polynomialFactory.CreatePolyAbCd([1,2,3,4],1);
    
    var result0=poly.EvaluateAt(1);
    var result1=poly.EvaluateAt(2);
    var result2=poly.EvaluateAt(3);

    expect(result0).toBe(4);
    expect(result1).toBe(10);
    expect(result2).toBe(26);

  });


  it('should create polynomial starting at 1 and throw error when evaluating at 0', function(){
    var poly = polynomialFactory.CreatePolyAbCd([1,2,3,4],1);

    expect(function() {poly.EvaluateAt(0);}).toThrow(new Error('Trying to evalute polynomial with x value less than the start point'));

  });


  it('should create polynomial starting at 1 and calculate its derivate', function(){
    var poly = polynomialFactory.CreatePolyAbCd([1,2,3,4],1);

    var der = poly.Derivative();

    var derAt1 = der.EvaluateAt(1);
    var derAt2 = der.EvaluateAt(2);
    
    expect(derAt1).toBe(3);
    expect(derAt2).toBe(10);
    

  });



});

