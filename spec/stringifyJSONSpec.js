// test cases are described in fixtures.js
describe('stringifyJSON', function() {

  it('should identify datatypes correctly', function() {

    elemDataTypeTestCases.forEach(function(test) {
      var expected = test[1];
      var result = elemDataType(test[0]);
      expect(result).to.equal(expected);
    });

  });


  it('should match the result of calling JSON.stringify', function() {

    stringifiableObjects.forEach(function(test) {
      var expected = JSON.stringify(test);
      var result = stringifyJSON(test);
      expect(result).to.equal(expected);
    });

    unstringifiableValues.forEach(function(obj) {
      var expected = JSON.stringify(obj);
      var result = stringifyJSON(obj);
      expect(result).to.equal(expected);
    });

  });
});
