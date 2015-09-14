
describe('Unit: valid factory injection', function() {
  "use strict";
  var polynomialFactory;
  var basicSegmentFactory;
  var accelSegmentFactory;
  var fm;

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

    inject(function(_FastMath_) {
      fm=_FastMath_;
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
  var fm;

  beforeEach(function() {
    module('profileEditor');

    inject(function(_polynomialFactory_){
      polynomialFactory=_polynomialFactory_;
    });

    inject(function(_FastMath_) {
      fm=_FastMath_;
    });

  });

  it('should create polynomial starting at 0 and evaluate it correctly', function(){
    var poly = polynomialFactory.CreatePolyAbCd([1,2,3,4],0,20);
    
    var result0=poly.EvaluateAt(0);
    var result1=poly.EvaluateAt(1);
    var result2=poly.EvaluateAt(2);

    expect(result0).toBe(4);
    expect(result1).toBe(10);
    expect(result2).toBe(26);

  });


  it('should create polynomial starting at 1 and evaluate it correctly', function(){
    var poly = polynomialFactory.CreatePolyAbCd([1,2,3,4],1,20);
    
    var result0=poly.EvaluateAt(1);
    var result1=poly.EvaluateAt(2);
    var result2=poly.EvaluateAt(3);

    expect(result0).toBe(4);
    expect(result1).toBe(10);
    expect(result2).toBe(26);

  });


  it('should create polynomial starting at 1 and throw error when evaluating at 0', function(){
    var poly = polynomialFactory.CreatePolyAbCd([1,2,3,4],1,20);

    expect(function() {poly.EvaluateAt(0);}).toThrow(new Error('Trying to evalute polynomial with x value less than the start point'));

  });


  it('should create polynomial starting at 1 and calculate its derivate', function(){
    var poly = polynomialFactory.CreatePolyAbCd([1,2,3,4],1,20);

    var der = poly.Derivative();

    var derAt1 = der.EvaluateAt(1);
    var derAt2 = der.EvaluateAt(2);
    
    expect(derAt1).toBe(3);
    expect(derAt2).toBe(10);

    var der2 = der.Derivative();

    var der2At1=der2.EvaluateAt(1);
    var der2At3=der2.EvaluateAt(3);

    expect(der2At1).toBe(4);
    expect(der2At3).toBe(16);
    

  });

  it('should calculate roots of cubic polynomial [1,-6,12,-8]', function(){

    var poly=polynomialFactory.CreatePolyAbCd([1,-6,12,-8],0,20);

    var roots = poly.Roots();

    expect(angular.isArray(roots));
    expect(fm.equal(roots[0],2)).toBe(true);

  });


  it('should calculate roots of cubic polynomial [1,6,12,8]', function(){

    var poly=polynomialFactory.CreatePolyAbCd([1,6,12,8],0,20);

    var roots = poly.Roots();

    expect(angular.isArray(roots));

    //this does have a root at -2, but since -2 is not greater than the startPoint (0), then ..
    expect(roots.length).toBe(0);


  });



  it('should calculate roots of quadratic polynomial [0,1,0,-1]', function(){

    var poly=polynomialFactory.CreatePolyAbCd([0,1,0,-1],0,20);

    var roots = poly.Roots();

    expect(angular.isArray(roots));
    expect(fm.equal(roots[0],1)).toBe(true);


  });

  it('should calculate roots of quadratic polynomial [0,1,0,1]', function(){

    var poly=polynomialFactory.CreatePolyAbCd([0,1,0,1],0,20);

    var roots = poly.Roots();

    expect(angular.isArray(roots));
    expect(roots.length).toBe(0);


  });

  it('should calculate roots of quadratic polynomial [1,-3,-144,432] and its derivative', function(){

    var poly=polynomialFactory.CreatePolyAbCd([1,-3,-144,432],0,20);

    var roots = poly.Roots();

    expect(angular.isArray(roots));
    expect(roots.length).toBe(2);

    //expect(fm.equal(roots[0],-12)); //-12 is not within start/end time
    expect(fm.equal(roots[0],3));
    expect(fm.equal(roots[0],12));

    var derivative=poly.Derivative();
    
    roots=derivative.Roots();
    expect(roots.length).toBe(1);

    //expect(fm.equal(roots[0],-6)); //-6 is not within start/end time
    expect(fm.equal(roots[0],8));    


  });

});

