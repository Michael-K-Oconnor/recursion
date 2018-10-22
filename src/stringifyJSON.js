// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here
  var result;
  var currType;
  var isSingleElemObj = false;


  var stringifyElement = function(currElement) {
    currType = elemDataType(currElement);

    // BASE CASES
    if (currType === 'empty array') {
      return '[]';
    
    } else if (currType === 'empty obj') {
      return '{}';
    
    } else if (currType === 'single array element') {
      return stringifyArrayElement(currElement);
    
    } else if (currType === 'single simple obj element') {
      return stringifyObjElement(currElement);
    

    // RECURSIVE CASES
    } else if (currType === 'array') {
      var substring = '';
      currElement.forEach(function(elem) {
        substring = substring + stringifyElement(elem) + ', ';
      });
      substring = substring.slice(0,-2);
      return '[' + substring + ']';
        
    } else if (currType === 'obj') {
      var subElements = Object.entries(currElement);
      var substring = '';
      subElements.forEach(function(elem) {
        var key = elem[0];
        var value = elem[1];
        substring += stringifyElement({[key]: value}).slice(1,-1) + ', ';
      });
      substring = substring.slice(0,-2);
      return '{' + substring + '}';

    } else if (currType === 'single complex obj element') {
            
    }

  }

  result = stringifyElement(obj);
  return result;
};





var elemDataType = function(elem) {
    // returns the data structure the elem belongs to, either 'array' or 'obj'
    // returns data type of the element. Data types include:
    // 'empty array','single array element', 'array' 
    // 'empty obj', 'single simple obj element', 'single complex obj element', 'obj'
    // 'function' or undefined for undefined or unrecognized elements
    if (Array.isArray(elem) && elem.length === 0) 
      {return 'empty array';}

    if (typeof elem === 'boolean' || typeof elem === 'number' || 
          typeof elem === 'string' || elem === null) 
      {return 'single array element';}

    if (Array.isArray(elem) && elem.length >= 1) 
      {return 'array';}

    if (isObject(elem) && Object.keys(elem).length === 0) 
      {return 'empty obj';}

    if (isObject(elem) && Object.keys(elem).length === 1) {
      var value = Object.values(elem)[0];
      if (isObject(value) || Array.isArray(value) || typeof value === 'function') {
        return ('single complex obj element');
      } else {
        return ('single simple obj element');
      }
    }

    if (isObject(elem) && Object.keys(elem.length > 1)) 
      {return 'obj';}

    if (typeof elem === 'function') 
      {return 'function'}

    return undefined;
}


var isObject = function(elem) {
    if (elem === null) {return false;}
    if (Array.isArray(elem)) {return false;}
    return (typeof elem === 'object');
}


var stringifyArrayElement = function(elem) {
    // returns a string of the element
    return String(elem);
}

var stringifyObjElement = function(elem) {
    // returns a string of the key/value pair
    var key = Object.keys(elem)[0];
    var value = Object.values(elem)[0];
    return ('{"' + String(key) + '": "' + String(value) + '"}');
}
