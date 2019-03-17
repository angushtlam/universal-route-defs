"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.route = route;
exports.routes = routes;
exports.logRoutes = logRoutes;

/**
 * This is a route function definer. This will allow a neat way to
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
  return Object.assign({}, children, {
    get: url
  });
}
/**
 * This function that takes an object of route definitions and nests all of the
 * children definitions correctly by prefixing them with the appropriate parent
 * url.
 *
 * @param {*} urls Map of route()ified url definitions.
 * @param {*} parentGet Internally used parameter to correctly prefix children
 *                      routes with the parent's url definition.
 */


function routes() {
  var urls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var parentGet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return '';
  };

  // If there is a get function in the root of this set of urls, overload the
  // get function with the parent's get function.
  // The only case where there wouldn't be a get function is the very first
  // call.
  if (urls.get) {
    // We need to keep reference to the urls.get function so it won't disappear
    // and the new overridden version won't try to call itself.
    var definedGet = urls.get;

    urls.get = function (props) {
      return parentGet(props) + definedGet(props);
    };
  } // Continue prefixing all of the subroutes of the set of urls by calling this
  // function recursively.


  var subroutes = Object.keys(urls).filter(function (key) {
    return key !== 'get';
  });
  subroutes.forEach(function (key) {
    routes(urls[key], urls.get);
  });
  return urls;
}

function logRoutes() {
  var urls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var subroutes = Object.keys(urls).filter(function (key) {
    return ['get'].indexOf(key) < 0;
  });
  subroutes.forEach(function (key) {
    console.log(urls[key].get());
    debugRouteMap(urls[key]);
  });
}
