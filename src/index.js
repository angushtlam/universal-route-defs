/**
 * This is a recursive route function definer. This will allow a neat way to
 * centrally define URLs that you can use isomorphically.
 * 
 * @param {string, function} url URL of route
 * @param {object} children any children routes.
 */
function route(url = () => '/', children = {}) {
  // Force any children to call the parent function.
  const routify = {}
  Object.keys(children).forEach(key => {
    routify[key] = route(props => {
      // Call the parent route and the child's route definition.
      return url(props) + children[key].get(props)
    }, children[key] || {})
  })

  return Object.assign({}, routify, { get: url } )
}

export { route }