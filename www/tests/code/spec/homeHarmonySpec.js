describe('Home Harmony - Sample Test', function() {
    it('should just pass this one', function() {
      
      beforeEach(function(){
        module('main');
        inject(function (_userAPI_ ) {
            userAPI = _userAPI_;
        })
      });
      expect(true).to.equal(true);
  });

});

/*
  var input;
  var output;
  //Use the part below as a template.
  it('should return an order for package installs, for a valid dependency list.', function() {
    //Simple tree with one leaf
    input1 = ["leaf: ",
             "dep1: leaf",
             "dep2: dep1",
             "dep3: dep2"];
    var dependentPackages = ["dep1","dep2","dep3"];
    output1 = dependencyInstaller(input1);
    for(var i=0; i<dependentPackages.length; i++) {
      expect(output1.indexOf("leaf") < output1.indexOf(dependentPackages[i])).to.equal(true);
    }
    expect(output1.length).to.equal(input1.length);

    //Dependency tree with multiple leaves
    input2 = ["leaf1: ",
              "dep1: leaf1",
              "leaf2: ",
              "leaf3: "];
    output2 = dependencyInstaller(input2);
    expect(output2.length).to.equal(4);
    expect(output2.indexOf("leaf1") < output2.indexOf("dep1")).to.equal(true);
  });

  it('should be able to process inputs with multiple packages dependent on a package.', function() {
    //A dependency tree, with dep1, dep2 and dep3 dependent on a leaf
    input = ["dep3: leaf",
             "dep2: leaf",
             "dep1: leaf",
             "leaf: "];
    output = dependencyInstaller(input);
    var dependents = ["dep3","dep2","dep1"];
    for(var i=0; i<dependents.length; i++) {
      expect(output.indexOf("leaf") < output.indexOf(dependents[i])).to.equal(true);
    }
  });

  it('should reject dependencies with loops.', function() {
    //A dependency tree containing a loop
    input1 = ["KittenService: ",
             "Leetmeme: Cyberportal",
             "Cyberportal: Ice",
             "CamelCaser: KittenService",
             "Fraudstream: ",
             "Ice: Leetmeme"];
    output1 = dependencyInstaller(input1);
    expect(output1.length).to.equal(0);

    //A dependency tree containing a package with a self-loop (that depends on itself)
    input2 = ["pkg1:pkg1"];
    output2 = dependencyInstaller(input2);
    expect(output2.length).to.equal(0);
  });

  it('should reject inputs without atleast one independent package.', function() {
    //A dependency tree without leaves
    input = ["dep1: dep2",
             "dep2: dep3"];
    output = dependencyInstaller(input);
    expect(output.length).to.equal(0);
  });

  it('should reject inputs with atleast one invalid dependency tree.', function() {
    //Two dependency trees: one valid and one without a leaf
    input = ["dep3: dep2",
              "dep2: dep1",
              "dep1: leaf",
              "leaf: ",
              "dep7: dep6",
              "dep6: dep5"];
    output = dependencyInstaller(input);
    expect(output.length).to.equal(0);
  });

  it('should reject inputs with packages that are dependent on nonexistent packages.', function() {
    //A dependency tree with a package dependent on an invalid package.
    input = ["dep3: dep7",
             "dep2: dep1",
             "dep1: leaf",
             "leaf: "];
    output = dependencyInstaller(input);
    expect(output.length).to.equal(0);
  })

});
*/
