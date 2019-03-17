/**
 * This is a route function definer. This will allow a neat way to
 * centrally define URLs that you can use isomorphically.
 *
 * @param {string, function} url URL of route
 * @param {object} children any children routes.
 */
function route(url = () => '/', children = {}) {
  return Object.assign({}, children, {get: url})
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
function routes(urls = {}, parentGet = () => '') {
  // If there is a get function in the root of this set of urls, overload the
  // get function with the parent's get function.
  // The only case where there wouldn't be a get function is the very first
  // call.
  if (urls.get) {
    // We need to keep reference to the urls.get function so it won't disappear
    // and the new overridden version won't try to call itself.
    const definedGet = urls.get

    urls.get = props => {
      return parentGet(props) + definedGet(props)
    }
  }

  // Continue prefixing all of the subroutes of the set of urls by calling this
  // function recursively.
  const subroutes = Object.keys(urls).filter(key => key !== 'get')
  subroutes.forEach(key => {
    routes(urls[key], urls.get)
  })

  return urls
}

function logRoutes(urls = {}) {
  const subroutes = Object.keys(urls).filter(key => ['get'].indexOf(key) < 0)

  subroutes.forEach(key => {
    console.log(urls[key].get())
    debugRouteMap(urls[key])
  })
}

export {route, routes, logRoutes}
