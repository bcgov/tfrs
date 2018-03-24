
# Build Status

Develop Branch:
- Backend: [![Build Status](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/buildStatus/icon?job=mem-tfrs-tools-develop-tfrs-pipeline)](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/me/my-views/view/all/job/mem-tfrs-tools-develop-tfrs-pipeline/)      Frontend: [![Build Status](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/buildStatus/icon?job=mem-tfrs-tools-develop-client-pipeline)](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/job/mem-tfrs-tools-develop-client-pipeline)

Master Branch:
- Backend: [![Build Status](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/buildStatus/icon?job=mem-tfrs-tools-master-tfrs-pipeline)](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/job/mem-tfrs-tools-master-tfrs-pipeline) Frontend: [![Build Status](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/buildStatus/icon?job=mem-tfrs-tools-master-client-pipeline)](https://jenkins-mem-tfrs-tools.pathfinder.gov.bc.ca/job/mem-tfrs-tools-master-client-pipeline)

# TFRS
Transportation Fuels Reporting System

### Usage
Facilitates online Fuel Reporting and Low Carbon Fuel credit transfers supporting BC's market-based approach to avoiding lifecycle GHG emissions from transportation fuel.  

- Fuel suppliers buy and sell low carbon fuel credits
- Government approves credit transfers and tracks balances
- Government awards credits for infrastructure projects
- Government validates credits from the supply of low carbon fuels

** Files in this repository**
```
backend/                   - Backend codebase
docs/                      - Documentation
├── specifications-0.0.1   - old version of specifications
└── mockups                - mockups and wireframes
frontend/                  - Frontend codebase
functional-tests/          - BDD Tests
openshift/                 - OpenShift-specific files
├── scripts                - helper scripts
└── templates              - application templates
sonar-runner/
static/
zap/
book.json                  - GitBook configuration file
code_of_conduct.md
contributing.md          
Dockerfile                 - OpenShift-specific file
LICENSE
sonar-project.properties
```

### Data
Documentation for system data is dynamical generated using Schema Spy:
http://schema-spy-mem-tfrs-dev.pathfinder.gov.bc.ca/index.html  
> To learn more about the regulation governing the disclosure of data in this system please read [Renewable and Low Carbon Fuel Requirements Regulation 11.11 \(5\)](http://www.bclaws.ca/EPLibraries/bclaws_new/document/ID/freeside/394_2008#section11.11)

### Project Status
This project is in development.
To see the status of feature development please refer to the [features](https://github.com/bcgov/tfrs/wiki/features/) page on the project wiki

### Documentation
You can find project and development documentation in the [docs](/docs/) folder. The docs folder can also run on gitbook if you want to view it nicely formatted.

**Running the documentation on gitbook**

Install gitbook using npm, cd to the folder & run the server
```bash
$ npm install gitbook-cli -g
$ cd docs/
$ gitbook serve
```

### Getting Help or Reporting an Issue
To report bugs/issues/features requests, please file an [issue](https://github.com/bcgov/tfrs/issues/).

### How to Contribute
If you would like to contribute, please see our [contributing](contributing.md) guidelines.

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
