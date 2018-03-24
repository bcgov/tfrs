Installation and setup of the Frontend Application
------------------------

This instructions works with the current version of nodejs (v9.7.1) & npm (5.6.0) as of 2018-03-22.

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
