# universal-route-defs
Simple utility that allows a full stack JavaScript application to easily declare nested routes and retrieve the corresponding URL paths in a shared module.

## Why is this useful (what I use it for)
For the full stack web _(NodeJS)_ projects that I am building, its convenient to have all of the routes the application uses in located in one module. As an example, I will first define the routes using the `route` function provided by `universal-route-defs`.
```javascript
// shared_urls.js
import { route } from 'universal-route-defs'

export default {
  root: route(() => '/', {}),
  api: route(() => '/api', {
    userData: route(
      (props = { username: ':username', }) => {
        return `/user/${props.username}`
      }, {})
  }),
  user: route(props = { username: ':username', }) => {
    return `/user/${props.username}`
  }, {}),
}
```

Then, I can use them in my Express routes.
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

An additional benefit is that the frontend can also consume the same data store. No more copypasting and inconsistent routes!
```javascript
// frontend/index.js
let username = 'angushtlam' // Pretend this variable is dynamically determined.

fetch(urls.api.userData.get({ username: username, }))
.then((response) => { return response.json() })
.then((data) => { ... })
```

## Documentation
### `route(url, children)`
Arguments:
_url_ - The route you want this function to resolve to.
_children_ - Any subroutes that you want to nest under. Takes an object of named routes.

#### `.get(props)`
All route functions have a `get` property that resolves the route at the given location (that means you can't name one of your routes `get`. Pro Tip: you should name your routes with nouns). You can optionally provide an object of defined values and the route will replace any prop strings with the provided values (see usage in example above).
