'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This is a recursive route function definer. This will allow a neat way to
 * centrally define URLs that you can use isomorphically.
 * 
 * @param {string, function} url URL of route
 * @param {object} children any children routes.
 */
function route() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
    return '/';
  };
  var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Force any children to call the parent function.
  var routify = {};
  Object.keys(children).forEach(function (key) {
    routify[key] = route(function (props) {
      // Call the parent route and the child's route definition.
      return url(props) + children[key].get(props);
    }, children[key] || {});
  });

  return Object.assign({}, routify, { get: url });
}

exports.route = route;