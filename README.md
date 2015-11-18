# Don't Fear The Repo #

* [MKS Git workflow (Contributing.md)](https://github.com/dont-fear-the-repo/dont-fear-the-repo/blob/master/CONTRIBUTING.md)
* [MKS Waffle.io board for gitissues](https://waffle.io/dont-fear-the-repo/dont-fear-the-repo)
  * Please add what you're working on
  * Title it in the style of the commits, `<type>(<scope>): <subject>` 
    * for example `[fix](deploy): Edit package.json for heroku deploy`
  * Add labels that apply
* Google docs:
  * [User Experience](https://docs.google.com/document/d/14RDEGpsJsEkOgTtGHLJrjvb10u0nh4CDXpbxbuaVh2M/edit)
  * [Database/architecture](https://docs.google.com/document/d/1iHBleCRqJHEEkgui5CCL8jjCec6oTuwz0xUtFge3WMI/edit)
  * [Project Proposals and Diagrams](https://docs.google.com/document/d/15q0Lt2Fy0VXXR9gEYoBde-bjTDFyMLDdEvdFN5KIZGc/edit)
  * [TechNotes whiteboard](https://docs.google.com/document/d/1Xreu_c-Kg74K1OoVIxiu6yM1Bn9thl4ATuJUw9Ax1NM/edit)
  * [Brainstorming spreadsheet](https://docs.google.com/spreadsheets/d/1EsvvYa5koF6s6rNv4dpVaGud9n5Btmbdy0IsEN_wMh8/edit#gid=0)
  * [Brainstorming doc](https://docs.google.com/document/d/1M-FmnJfM4x67Epuljv-4uOUwvYMqrGwskUop3BWUJ_g)


---

## About

// TODO: update this
This is where we talk about the app.

## Installation

```bash
npm install
```

## Running Dev Server

```bash
npm run dev
```

### Using Redux DevTools

In development, Redux Devtools are enabled by default. You can toggle visibility and move the dock around using the following keyboard shortcuts:

- <kbd>Ctrl+H</kbd> Toggle DevTools Dock
- <kbd>Ctrl+Q</kbd> Move Dock Position
- see [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor) for more detail information.

## Building and Running Production Server

```bash
npm run build
npm run start
```

## Demo

// TODO: update this
A demonstration of this app can be seen [running on heroku](https://react-redux.herokuapp.com), which is a deployment of the [heroku branch](https://github.com/erikras/react-redux-universal-hot-example/tree/heroku).

## Explanation

What initially gets run is `bin/server.js`, which does little more than enable ES6 and ES7 awesomeness in the
server-side node code. It then initiates `server.js`. In `server.js` we proxy any requests to `/api/*` to the
[API server](#api-server), running at `localhost:3030`. All the data fetching calls from the client go to `/api/*`.
Aside from serving the favicon and static content from `/static`, the only thing `server.js` does is initiate delegate
rendering to `react-router`. At the bottom of `server.js`, we listen to port `3000` and initiate the API server.

#### Routing and HTML return

The primary section of `server.js` generates an HTML page with the contents returned by `react-router`. First we instantiate an `ApiClient`, a facade that both server and client code use to talk to the API server. On the server side, `ApiClient` is given the request object so that it can pass along the session cookie to the API server to maintain session state. We pass this API client facade to the `redux` middleware so that the action creators have access to it.

Then we perform [server-side data fetching](#server-side-data-fetching), wait for the data to be loaded, and render the page with the now-fully-loaded `redux` state.

The last interesting bit of the main routing section of `server.js` is that we swap in the hashed script and css from the `webpack-assets.json` that the Webpack Dev Server – or the Webpack build process on production – has spit out on its last run. You won't have to deal with `webpack-assets.json` manually because [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools) take care of that.

We also spit out the `redux` state into a global `window.__data` variable in the webpage to be loaded by the client-side `redux` code.

#### Server-side Data Fetching

We ask `react-router` for a list of all the routes that match the current request and we check to see if any of the matched routes has a static `fetchData()` function. If it does, we pass the redux dispatcher to it and collect the promises returned. Those promises will be resolved when each matching route has loaded its necessary data from the API server.

#### Client Side

The client side entry point is reasonably named `client.js`. All it does is load the routes, initiate `react-router`, rehydrate the redux state from the `window.__data` passed in from the server, and render the page over top of the server-rendered DOM. This makes React enable all its event listeners without having to re-render the DOM.

#### Redux Middleware

The middleware, [`clientMiddleware.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/middleware/clientMiddleware.js), serves two functions:

1. To allow the action creators access to the client API facade. Remember this is the same on both the client and the server, and cannot simply be `import`ed because it holds the cookie needed to maintain session on server-to-server requests.
2. To allow some actions to pass a "promise generator", a function that takes the API client and returns a promise. Such actions require three action types, the `REQUEST` action that initiates the data loading, and a `SUCCESS` and `FAILURE` action that will be fired depending on the result of the promise. There are other ways to accomplish this, some discussed [here](https://github.com/gaearon/redux/issues/99), which you may prefer, but to the author of this example, the middleware way feels cleanest.

#### API Server

This is where the meat of your server-side application goes. It doesn't have to be implemented in Node or Express at all. This is where you connect to your database and provide authentication and session management. In this example, it's just spitting out some json with the current time stamp.

#### Styles

// TODO: update this
This project uses [local styles](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284) using [css-loader](https://github.com/webpack/css-loader). The way it works is that you import your stylesheet at the top of the class with your React Component, and then you use the classnames returned from that import. Like so:

```javascript
const styles = require('./App.scss');
```

Then you set the `className` of your element to match one of the CSS classes in your SCSS file, and you're good to go!

```jsx
<div className={styles.mySection}> ... </div>
```

#### Unit Tests

The project uses [Mocha](https://mochajs.org/) to run unit tests and [Karma](http://karma-runner.github.io/0.13/index.html) as the test runner. Karma enables the feature that you are able to render your tests to the browser (e.g: Firefox, Chrome, etc.), which means you are able to use the [Test Utilities](http://facebook.github.io/react/docs/test-utils.html) from Facebook api like `renderIntoDocument()`.

To run the tests in the project, run `npm test`. If you have `Chrome` installed, it will be automatically launched as a test service for you.

There are additional tests for the API server, which can be run with `npm run test-node`. These tests are located in `/api/__tests__`.

To keep watching your test suites that you are working on, set `singleRun: false` in the `karma.conf.js` file. Be sure set it to `true` if you are running `npm test` on a continuous integration server (travis-ci, etc).

Tests should be placed in a `__tests__` folder within the same parent folder, within the `/src` folder. Filenames should end with `-test.js` to be automatically found by Webpack. Files and folders should be placed logically to be automatically found by other humans.

## Deployment on Heroku

// TODO: update this
To get this project to work on Heroku, you need to:

1. Remove the `"PORT": 8080` line from the `betterScripts` / `start-prod` section of `package.json`.
2. `heroku config:set NODE_ENV=production`
3. `heroku config:set NODE_PATH=./src`
4. `heroku config:set NPM_CONFIG_PRODUCTION=false`
  * This is to enable webpack to run the build on deploy.

The first deploy might take a while, but after that your `node_modules` dir should be cached.

## FAQ

#### How do I disable the dev tools?

They will only show in development, but if you want to disable them even there, set `__DEVTOOLS__` to `false` in `/webpack/dev.config.js`.

## Contributing

TODO: we should mention the original project here (with links) and thank the creator!

If you would like to submit a pull request, please make an effort to follow the guide in [CONTRIBUTING.md](CONTRIBUTING.md).

---
Thanks for checking this out.

– Don't Fear the Repo (Andrew, Melody, Michael, Ryan, Sujay)
