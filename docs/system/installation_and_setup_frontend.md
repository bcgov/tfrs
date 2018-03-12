Installation and setup of the Frontend Application
------------------------
## Description

The client (front-end) code interacts with the TFRS API to form the user interface.

## Code
The codebase is written in ReactJS and uses libraries and plugins within the react ecosystem.

This project uses node's package management system for dependencies, and webpack for bundling code for dev or production. All the package dependencies can be found in `package.json`

## Local Development
```bash
$ npm install
$ npm start
```

This will serve the frontend application on the default port (3000) unless you set it otherwise. The biggest advantage of running it in development mode is the use of Hot Module Replacement which enables you to change code & see it immediately without hitting reload/rebuilding, or stopping & starting the server.

The configuration settings for development mode is found in `webpack.config.js`


## Building for production/deployment
On a linux server:
```bash
$ export NODE_ENV=production
$ export PORT=3000

$ npm run production
$ node server
```

On windows, you can do either of the following:
```bat
> SET NODE_ENV=production
> webpack -p --config webpack.production.config.js
```
or if you can run bash/cygwin:
```bash
$ NODE_ENV=production webpack -p --config webpack.production.config.js
```

The configuration settings for production or build mode is found in `webpack.production.config.js`

## Contributing
See our [contributing guidelines](contributing.md)
