# TFRS client

Transportation Fuels Reporting System

## Description

The client (front-end) code that interacts with the TFRS API to form the user interface.

## Code:

* React with Redux
* css and js libraries provided as part of the Gov 2.0 Bootstrap Skeleton
* custom SASS
* various npm modules - see package.json

## Status

This project is in development. To see the status of feature development please refer to the features page on the project [wiki](https://github.com/bcgov/tfrs/wiki/features)

## Local Development

```bash
$ npm install
$ NODE_ENV=local # on Windows, `SET NODE_ENV=local`
$ npm start
```

Setting the environment to `local` will set the API URL to `http://localhost:8000`

## Production
On a linux server, simply run `npm run production` to trigger a build. Then, run `node server` to serve the static build

On windows, you can do either of the following:
```bat
> SET NODE_ENV=production
> webpack -p --config webpack.production.config.js
```
or if you can run bash/cygwin:
```bash
$ NODE_ENV=production webpack -p --config webpack.production.config.js
```
