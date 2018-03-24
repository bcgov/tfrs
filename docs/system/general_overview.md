# General Overview

This project is a Single Page Application with a REST API backend and a JavaScript front-end.

### Code
The backend REST API is wrtten in Python (Django) and the frontend is written in JavaScript ES6 which is transpiled by babel through webpack.

Some pre-compiled css and js libraries are used from the [Gov 2.0 Bootstrap Skeleton](https://github.com/bcgov/Gov-2.0-Bootstrap-Skeleton)

Apart from unit tests, we also have functional and UI tests that are using the [BDD Stack](https://github.com/BCDevOps/BDDStack) on BCGov DevOps.

You can view the app here:
https://dev.lowcarbonfuels.gov.bc.ca/

You can view the api documentation here:
https://dev.lowcarbonfuels.gov.bc.ca/api/doc

### Project Status
This project is in development.

### System Overview & Setup
The project is deployed on OpenShift via two deployments: client (front-end) and tfrs (api/backend).

The frontend deployment is an nginx container created from a custom image.
The backend deployment is a python/django container created from an openshift image.
