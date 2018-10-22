// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  // your code goes here
  var result;
  var currType;
 
  if (!isValidJSON(json)) {return undefined;}

  var parseSubString = function(currString) {
    currType = dataType(currString);

    if (isEmptyArray(currString)) {
      return [];
    
    } else if (isEmptyObj(currString)) {
      return {};
    

    } else if (isSingleElement(currString)) {
      if (currType === 'array') {
        return formattedSingleArrayElement(currString);
      } else if (currType === 'obj') {
        return formattedSingleObjElement(currString);
      }

    } else {
        if (currType === 'array') {
            var subElements = seperateArrayIntoSubElements(currString);
            var subArray = [];
            subElements.forEach(function(element) {
              subArray.push(parseSubString(element));
            });
            return subArray;
        } else if (currType === 'obj') {
            if (hasOuterMostBraces(currString)) {
              return parseSubString(removeOuterBraces(currString));
            } else if (hasAdditionalObjElements(currString)) {
              var subElements = seperateObjIntoSubElements(currString);
              var subObjs = {};
              subElements.forEach(function(element) {
                var tempObj = parseSubString(element);
                var key = Object.keys(tempObj)[0];
                var value = tempObj[key]
                subObjs[key] = value;
              });
              return subObjs;
            } else if (hasComplexObjValue(currString)) {
              var subObj = {};
              var key = splitComplexObj(currString)[0];
              var valueStr = splitComplexObj(currString)[1];
              var value = (parseSubString(valueStr));
              subObj[key] = value;
              return subObj;
            }
        }
    }
  }

  result = parseSubString(json);
  return result;
};

var isValidJSON = function(json) {
  var openBracketsFound = 0;
  var closeBracketsFound = 0;
  var openBracesFound = 0;
  var closeBracesFound = 0;
  var quotesFound = 0;
  for (var i = 0; i < json.length; i++) {
    if (json[i] === '[') {openBracketsFound++;}
    if (json[i] === ']') {closeBracketsFound++;}
    if (json[i] === '{') {openBracesFound++;}
    if (json[i] === '}') {closeBracesFound++;}
    if (json[i] === '"') {quotesFound++;}
    if (closeBracesFound > openBracesFound || closeBracketsFound > openBracketsFound) {
      return false;
    }
  }
  if (closeBracesFound !== openBracesFound || closeBracketsFound !== openBracketsFound || quotesFound % 2 !== 0) {
    return false;
  }
  return true;
}

var dataType = function(string) {
  if (string.slice(0,1) === '{') {
    return 'obj';
  } else if (string.slice(0,1) === '[') {
    return 'array';
  }

  var openBracketsFound = 0;
  var closeBracketsFound = 0;
  var openBracesFound = 0;
  var closeBracesFound = 0;
  var quotesFound = 0;
  for (var i = 0; i < string.length; i++) {
    if (string[i] === '[') {openBracketsFound++;}
    if (string[i] === ']') {closeBracketsFound++;}
    if (string[i] === '{') {openBracesFound++;}
    if (string[i] === '}') {closeBracesFound++;}
    if (string[i] === '"') {quotesFound++;}
    if (string[i] === ':') {
      if (openBracketsFound === closeBracketsFound && 
        openBracesFound === closeBracesFound && quotesFound % 2 === 0) {
        return 'obj';
      }
    }
  }
  return 'array';
}


var splitComplexObj = function(string) {
  // takes in a string of a single object element with a complex value and returns
  // an array with index 0 being the key and index 1 being the value string
  var key = string.split(':')[0].split('"')[1];
  var value = string.slice(string.indexOf(':')+1).trim()
  return [key, value]
}



var isEmptyArray = function(string) {
  return (string === '[]');
}

var isEmptyObj = function(string) {
  return (string === '{}');
}

var isSingleElement = function(string) {
    var containsAdditionalArrays = string.includes('[');
    var containsAdditionalObjs = string.includes('{');
    var containsAdditionalArrayElements = (!string.includes(':') && string.includes(','));
    var containsAdditionalObjElements = (string.indexOf(':') !== string.lastIndexOf(':'));
    return !(containsAdditionalArrays || containsAdditionalObjs 
      || containsAdditionalArrayElements || containsAdditionalObjElements)
}

var hasOuterMostBraces = function(string) {
  return (string[0] === '{' && string[string.length-1] === '}')
}

var removeOuterBraces = function(string) {
  return string.slice(1,-1);
}


var hasAdditionalObjElements = function(string) {
  // assumes input string describes an obj
  // has additional Obj Elements if there is a comma not inside of a string or array
  var openBracketsFound = 0;
  var closeBracketsFound = 0;
  var quotesFound = 0;
  for (var i = 0; i < string.length; i++) {
    if (string[i] === '[') {openBracketsFound++;}
    if (string[i] === ']') {closeBracketsFound++;}
    if (string[i] === '"') {quotesFound++;}
    if (string[i] === ',') {
      if (openBracketsFound === closeBracketsFound && quotesFound % 2 === 0) {
        return true;
      }
    }
  }
  return false;
}

var hasComplexObjValue = function(string) {
  // assumes input string describes obj that contains only 1 top level key/value pair
  if (!hasAdditionalObjElements(string)) {
    return (string.split(':')[1].includes('{') || string.split(':')[1].includes('['));
  }
  return false;
}

var formattedSingleArrayElement = function(currString) {
    var primitives = [true, false, NaN, null, undefined];
    var primitiveStrings = ['true', 'false', 'NaN', 'null', 'undefined'];
    if (currString[0] === ('"')) {
        return currString.slice(1,-1);
    } else {
        if (primitiveStrings.includes(currString)) {
            return primitives[primitiveStrings.indexOf(currString)];
        } else {
            return Number(currString);
        }
    }
}

var formattedSingleObjElement = function(currString) {
    var primitives = [true, false, NaN, null, undefined];
    var primitiveStrings = ['true', 'false', 'NaN', 'null', 'undefined'];
    var key = currString.split(':')[0].split('"')[1];
    var valueSide = currString.split(':')[1].trim();
    var value;
    if (valueSide.includes('"')) {
      value = valueSide.split('"')[1];
    } else {
        if (primitiveStrings.includes(valueSide)) {
            value = primitives[primitiveStrings.indexOf(valueSide)];
        } else {
            value = Number(valueSide);
        }
    }
    return {[key]: value};
}


var seperateArrayIntoSubElements = function(string) {
    var output = [];
    var reducedString = string.slice(1,string.length-1);
    var seperatedArray = reducedString.split(',');
    var openBracketsFound = 0;
    var closeBracketsFound = 0;
    var openBracesFound = 0;
    var closeBracesFound = 0;
    var lastElemMerged = -1;
    for (var i = 0; i < seperatedArray.length; i++) {
        for (var j = 0; j < seperatedArray[i].length; j++) {
            if (seperatedArray[i][j] === '[') {openBracketsFound++;}
            if (seperatedArray[i][j] === ']') {closeBracketsFound++;} 
            if (seperatedArray[i][j] === '{') {openBracesFound++;}
            if (seperatedArray[i][j] === '}') {closeBracesFound++;} 
        }
        if (openBracketsFound === closeBracketsFound && openBracesFound === closeBracesFound) {
            if (lastElemMerged === i-1) {
                output.push(seperatedArray[i].trim());
            } else {
                var tempConcat = '';
                for (var k = lastElemMerged+1; k <= i; k++) {
                    tempConcat += seperatedArray[k].trim();
                    if (k!==i) {
                        tempConcat += ', ';
                    }
                }
                output.push(tempConcat.trim());
            }
            lastElemMerged = i;
        }
    }
    return output;
}

var seperateObjIntoSubElements = function(string) {
  var output = [];
  var workingObj = string;
  if (workingObj[0] === '{') {workingObj = workingObj.slice(1,-1)}
  //var reducedObj = string.slice(1,string.length-1);
  var seperatedObj = workingObj.split(',');
  var openBracketsFound = 0;
  var closeBracketsFound = 0;
  var quotesFound = 0;
  var lastElemMerged = -1;
  for (var i = 0; i < seperatedObj.length; i++) {
    for (var j = 0; j < seperatedObj[i].length; j++) {
      if (seperatedObj[i][j] === '[') {openBracketsFound++;}
      if (seperatedObj[i][j] === ']') {closeBracketsFound++;}
      if (seperatedObj[i][j] === '"') {quotesFound++;}
    }
    if (openBracketsFound === closeBracketsFound && quotesFound%2===0) {
      if (lastElemMerged === i-1) {

        output.push('' + seperatedObj[i].trim() + '');
      } else {
        var tempConcat = '';
        for (var k = lastElemMerged+1; k <= i; k++) {
          tempConcat += seperatedObj[k].trim();
          if (k!==i) {
            tempConcat += ', ';
          }
        }
        output.push(tempConcat.trim() + '');
      }
      lastElemMerged = i;
    }
  }
  return output;
}
