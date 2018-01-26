
# Build Status
Develop Branch: 
- Backend: [![Build Status](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/buildStatus/icon?job=mem-tfrs-tools-develop-tfrs-pipeline)](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/me/my-views/view/all/job/mem-tfrs-tools-develop-tfrs-pipeline/)      Frontend: [![Build Status](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/buildStatus/icon?job=mem-tfrs-tools-develop-client-pipeline)](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/job/mem-tfrs-tools-develop-client-pipeline)

Master Branch:
- Backend: [![Build Status](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/buildStatus/icon?job=mem-tfrs-tools-master-tfrs-pipeline)](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/job/mem-tfrs-tools-master-tfrs-pipeline) Frontend: [![Build Status](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/buildStatus/icon?job=mem-tfrs-tools-master-client-pipeline)](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/job/mem-tfrs-tools-master-client-pipeline)

# TFRS
Transportation Fuels Reporting System

### Usage
This software is being developed to streamline compliance reporting for transportation fuel suppliers  

### Data
Documentation for system data is dynamical generated using Schema Spy:
http://schema-spy-mem-tfrs-dev.pathfinder.gov.bc.ca/index.html  
> To learn more about the regulation governing the disclosure of data in this system please read [Renewable and Low Carbon Fuel Requirements Regulation 11.11 \(5\)](http://www.bclaws.ca/EPLibraries/bclaws_new/document/ID/freeside/394_2008#section11.11)

### Code
- css and js libraries provided as part of the Gov 2.0 Bootstrap Skeleton
- Django/Python
- React

### Project Status
This project is in development.
To see the status of feature development please refer to the [features](https://github.com/bcgov/tfrs/wiki/features/) page on the project wiki

### Getting Started (development)
This project is a Single Page Application with a REST API backend and a JavaScript (React) front-end.


#### Authentication

This project has implemented authentication via SiteMinder/BCeID. The entire application is protected by SiteMinder. It uses the headers sent by SiteMinder to authenticate a user. You can read more about it [here](docs/auth.md)

*Front-end authentication* Send a request to `api/users/current` to get the current authenticated user. If a user is unauthorized, it  shows an Unauthorized error page.

*API authentication* Makes use of Django's custom authentication.

**If you're working on both the api and the front-end client:**

The easiest way to have it up and running is to setup a web proxy (nginx or apache) in your local machine that has the path `/` pointing to the front-end server and `/api` pointing to the api server.

This project requires authentication via Siteminder headers. You would need to configure your webproxy to set specific headers:
```
proxy_set_header Host            $host;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_set_header Sm-UniversalId  "YOUR_USERNAME";
proxy_set_header Smgov-Userguid  "b5762a7b-87ba-46d0-b050-f4459124f60a";
```
It then checks this header against the  `authorization_id` field on `user` table in the database.

**If you're just working on one part of the stack (either backend or front-end)**

You may find it useful to bypass authentication. This happens automatically if you set the environment variable `DJANGO_DEBUG` to `true`.
Note that if you want to **not** bypass authentication, you need to setup a web proxy and set the host header to a hostname other than `localhost`.

#### REST API Server
[View the README for the backend](backend/README.md)

#### Front-End JavaScript Client
[View the README for the frontend](frontend/README.md)

### Getting Help or Reporting an Issue
To report bugs/issues/features requests, please file an [issue](https://github.com/bcgov/tfrs/issues/).

### How to Contribute
If you would like to contribute, please see our [contributing](contributing.md) guidelines.

There are also separate and specific contributing guidelines for our [frontend](frontend/contributing.md) and [backend](backend/contributing.md) codebases.

Please note that this project is released with a [Contributor Code of Conduct](code_of_conduct.md). By participating in this project you agree to abide by its terms.

### License
	Copyright 2017 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

This repository is maintained by [Low Carbon Fuels Branch](http://www2.gov.bc.ca/gov/content/industry/electricity-alternative-energy/transportation-energies/renewable-low-carbon-fuels). Click [here](https://github.com/bcgov/tfrs) for a complete list of our repositories on GitHub.
