var toJSON = module.exports = function(doc, obj) {
  if (!obj) {
    obj = {};
  }

  if (!doc) {
    return obj;
  }

  if (!doc.innerHTML) {
    return toJSON(doc.firstChild, obj);
  }

  var hasNodeList = function() {
    return (doc.childNodes !== null) && doc.childNodes.length;
  };

  var hasAttributes = function() {
    return (doc.attributes !== null) && doc.attributes.length;
  };

  var fromNodeList = function(nodeList) {
    return nodeList.map(function(node) {
      if (node.nodeType === 3) {
        return node.nodeValue;
      }

      return toJSON(node);
    });
  };

  var fromAttributes = function(attrs) {
    return attrs.map(function(attr) {
      return [attr.nodeName, attr.nodeValue];
    }).reduce(function(attrs, attr) {
      attrs[attr[0]] = attr[1];
      return attrs;
    }, {});
  };

  obj.type = doc.nodeName;

  if (hasNodeList()) {
    obj.content = fromNodeList(doc.childNodes);
    console.log(stringify(obj.content, null, 2));
  }

  if (hasAttributes()) {
    obj.attrs = fromAttributes(doc.attributes);
  }

  return obj;
};