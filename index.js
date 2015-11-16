var includes = require('lodash.includes');
var keys = require('lodash.keys');
var every = require('lodash.every');
var reduce = require('lodash.reduce');
var map = require('lodash.map');
var isString = require('lodash.isstring');
var isEmpty = require('lodash.isempty');


var fromChildNodes = function(doc) {
  if (!(doc.childNodes && doc.childNodes.length)) {
    return [];
  }

  return map(doc.childNodes, toJSON);
};

var fromAttributes = function(doc) {
  if (!(doc.attributes && doc.attributes.length)) {
    return {};
  }

  return reduce(doc.attributes, function(attrs, attr) {
    attrs[attr.nodeName] = attr.nodeValue;
    return attrs;
  }, {});
};

var fromNodeValue = function(doc) {
  return isString(doc.nodeValue) ? doc.nodeValue : undefined;
};

var toJSON = function(doc) {
  if (!doc) {
    return {};
  }

  var isRoot = every(keys(doc), function(key) {
    return !includes(['nodeName', 'tagName', 'localName', 'nodeValue'], key);
  });

  if (isRoot) {
    return toJSON(doc.lastChild);
  }

  return JSON.parse(JSON.stringify({
    name: doc.nodeName,
    attrs: fromAttributes(doc),
    value: fromNodeValue(doc),
    childs: fromChildNodes(doc).filter(function(child) {
      return !isEmpty(child);
    })
  }));
};

module.exports = toJSON;