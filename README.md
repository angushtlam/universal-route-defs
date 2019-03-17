# universal-route-defs
Simple utility that allows a full stack JavaScript application to easily declare nested routes and retrieve the corresponding URL paths in a shared module.

## Why is this useful
For full stack web projects, it's convenient to have all of the routes the application uses in located in one place. `universal-route-defs` allow you to define nested routes for better organization. It also has support for middlewares that uses route parameters (like Express, Koa, Hapi).

If your project is set up to be a monorepo, there is an added benefit of sharing the route definitions in the frontend and middleware server. No more copypasting and inconsistent routes!

## Usage
First, define the routes using the `route` function provided by `universal-route-defs`.
```javascript
// shared_urls.js
import { route, routes } from 'universal-route-defs'

export default routes({
  root: route(() => '/', {}),
  api: route(() => '/api', {
    userData: route((props = { username: ':username', }) => `/user/${props.username}`)
  }),
  user: route((props = { username: ':username', }) => `/user/${props.username}`),
})
```

Then, replace URLs in middleware (example for Express)
```javascript
// index.js
import urls from './shared_urls'

// urls.root.get() returns '/'
router.get(urls.root.get(), (request, response) => { ... })

// urls.api.user.get() returns '/user/:username'
router.get(urls.user.get(), (request, response) => { ... })

// urls.api.userData.get() returns '/api/user/:username'
router.get(urls.api.userData.get(), (request, response) => { ... })

// You can replace properties through the get function that is a part of a route
// urls.api.userData.get({ username: 'angushtlam', }) returns '/api/user/angushtlam'
router.get(urls.api.userData.get({ username: 'angushtlam', }), (request, response) => { ... })
```

Finally, the frontend can also consume the same data.
```javascript
// frontend/index.js
let username = 'angushtlam' // Pretend this variable is dynamically determined.

fetch(urls.api.userData.get({ username: username, }))
.then(response => { return response.json() })
.then(data => { ... })
```

## Documentation
### `route(url, children = {})`
Arguments:
_url_ - The route you want this function to resolve to.
_children_ - Any subroutes that you want to nest under. Takes an object of named routes. By default this is empty.

The `route` function is an important building block for this library to work. You will need this function puts your route definitions in the correct format.

#### `.get(props)`
All route functions have a `get` property that resolves the route at the given location (that means you can't name one of your routes `get`. Pro Tip: you should name your routes with only nouns). You can optionally provide an object of defined values and the route will replace any prop strings with the provided values (see usage in example above).

### `routes(urls)`
Arguments:
_urls_ - The object of urls you've defined with `route`.

This function is where all the magic happens. This goes through the object of `route`s you've defined and appropriately prefixes your child routes.

### `logRoutes(urls)`
Arguments:
_urls_ - The object of urls you've defined with `route`.

This function prints out all of the routes you've defined in an object with this library. Useful utility function.
