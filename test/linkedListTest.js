describe('Unit: linked list functions-', function() {
  "use strict";
  var linkedList;

  beforeEach(function() {
    module('profileEditor');

    inject(function(_LinkedList_) {
      linkedList = _LinkedList_;
    });
  });

  it("Should add 2 nodes successfully", function() {

    var list = linkedList.MakeLinkedList();
    expect(list).not.toBe(null);

    var data1 = {
      "data1": 1
    };
    var data2 = {
      "data2": 2
    };

    var data1p5 = {
      "data1.5": 1.5
    };

    list.add(data1);
    expect(list.Length()).toBe(1);
    expect(list.searchNodeAt(1).data).toBe(data1);

    list.add(data2);
    expect(list.Length()).toBe(2);
    expect(list.searchNodeAt(2).data).toBe(data2);


  });


  it("Should add 2 nodes and insert 3rd in the middle", function() {

    var list = linkedList.MakeLinkedList();
    expect(list).not.toBe(null);

    var data1 = {
      "data1": 1
    };
    var data2 = {
      "data2": 2
    };

    var data1p5 = {
      "data1.5": 1.5
    };

    list.add(data1);
    var node=list.add(data2);

    list.insertAt(node,data1p5);

    expect(list.Length()).toBe(3);
    expect(list.searchNodeAt(2).data).toBe(data1p5);
    expect(list.searchNodeAt(1).data).toBe(data1);
    expect(list.searchNodeAt(3).data).toBe(data2);

  });




  it("Should delete a node", function() {
  });



});
  