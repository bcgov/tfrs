# TFRS
Transportation Fuels Reporting System

[![Lifecycle:Stable](https://img.shields.io/badge/Lifecycle-Stable-97ca00)](https://www2.gov.bc.ca/gov/content/industry/electricity-alternative-energy/transportation-energies/renewable-low-carbon-fuels/transportation-fuels-reporting-system)

## Usage
Facilitates online Fuel Reporting and Low Carbon Fuel credit transfers supporting BC's market-based approach to avoiding lifecycle GHG emissions from transportation fuel.  

- Fuel suppliers buy and sell low carbon fuel credits
- Government approves credit transfers and tracks balances
- Government awards credits for infrastructure projects
- Government validates credits from the supply of low carbon fuels

## Project Status
* Develop Pipeline: [![Build Status](https://jenkins-basic-mem-tfrs-tools-tools.pathfinder.gov.bc.ca/buildStatus/icon?job=mem-tfrs-tools%2Fdevelop-pipeline)](https://jenkins-basic-mem-tfrs-tools-tools.pathfinder.gov.bc.ca/job/mem-tfrs-tools/job/develop-pipeline/)
* Master Pipeline: [![Build Status](https://jenkins-basic-mem-tfrs-tools-tools.pathfinder.gov.bc.ca/buildStatus/icon?job=mem-tfrs-tools%2Fmaster-pipeline)](https://jenkins-basic-mem-tfrs-tools-tools.pathfinder.gov.bc.ca/job/mem-tfrs-tools/job/master-pipeline/)


To see the status of feature development please refer to the [features](https://github.com/bcgov/tfrs/wiki/features/) page on the project wiki

## Data
### Data Architecture  

Documentation for system data is dynamical generated using Schema Spy:
http://schema-spy-mem-tfrs-dev.pathfinder.gov.bc.ca/index.html  

> To learn more about the regulation governing the disclosure of data in this system please read [Renewable and Low Carbon Fuel Requirements Regulation 11.11 \(5\)](http://www.bclaws.ca/EPLibraries/bclaws_new/document/ID/freeside/394_2008#section11.11)

### Project Material Publication
The materials published include:
- [Code Repositories](https://github.com/bcgov?utf8=%E2%9C%93&q=tfrs&type=&language=)
     - /tfrs/ 
     - /tfrs-docs/
     - /tfrs-openshift/
     - /tfrs-sonar-scanner/
     - /tfrs-functional-test-runner/
- Documentation (see Documentation section below)
- [Open Content Assessment](/open_content_assessment.md)
- Issue Tracking
     - Scrum Board for User Stories [Trello.com/TFRS1](https://trello.com/tfrs1)
     - Developer tasks and conversations on Users Stories [Github Issues](https://github.com/bcgov/tfrs/issues)

### Files in this repository
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

## Documentation
- [TFRS Readme](https://raw.githubusercontent.com/bcgov/tfrs/master/README.md)
- [TFRS Project Documentation](https://github.com/bcgov/tfrs/wiki)
- [TFRS Developer Documentation](./developer-guide.md)

## Getting Help or Reporting an Issue
To report bugs/issues/features requests, please file an [issue](https://github.com/bcgov/tfrs/issues/).

## How to Contribute
If you would like to contribute, please see our [contributing](contributing.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](code_of_conduct.md). By participating in this project you agree to abide by its terms.

## License
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

This repository is maintained by [Low Carbon Fuels Branch](http://www2.gov.bc.ca/gov/content/industry/electricity-alternative-energy/transportation-energies/renewable-low-carbon-fuels). Click [here](https://github.com/bcgov/?q=tfrs) for a complete list of our repositories on GitHub.

## Testing Thanks

Thanks to BrowserStack for Testing Tool support via OpenSource Licensing

[![BrowserStack](browserstack-logo-white-small.png)](http://browserstack.com/)
