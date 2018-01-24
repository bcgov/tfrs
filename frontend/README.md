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
$ npm start
```


## Production
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

## Contributing
See our [contributing guidelines](contributing.md)
