var includes = require('lodash.includes');
var keys = require('lodash.keys');
var every = require('lodash.every');
var reduce = require('lodash.reduce');
var map = require('lodash.map');


var fromChildNodes = function(doc) {
  if (!(doc.childNodes && doc.childNodes.length)) {
    return [];
  }

  return map(doc.childNodes, toJSON);
};

var fromAttributes = function(doc) {
  if (!(doc.attributes && doc.attributes.length)) {
    return [];
  }

  return reduce(doc.attributes, function(attrs, attr) {
    attrs[attr.nodeName] = attr.nodeValue;
    return attrs;
  }, {});
};

var toJSON = function(doc) {
  if (!doc) {
    return {};
  }

  var isRoot = every(keys(doc), function(key) {
    return !includes(['nodeName', 'tagName', 'localName'], key);
  });

  if (isRoot) {
    return toJSON(doc.firstChild);
  }

  return {
    name: doc.nodeName,
    childs: fromChildNodes(doc),
    attrs: fromAttributes(doc)
  }
};

module.exports = toJSON;