# TFRS
Transportation Fuels Reporting System

### Usage
This software is being developed to streamline compliance reporting for transportation fuel suppliers  

### Data
Documentation for system data is dynamical generated using Schema Spy:
http://schema-spy-mem-tfrs-dev.pathfinder.gov.bc.ca/index.html

### Code
- css and js libraries provided as part of the Gov 2.0 Bootstrap Skeleton
- Django/Python

### Project Status
This project is in development. 
The following Deliverable have been produced:
- low-fidelity and hi-fidelity mockups for
	* Credit Transfer and Credit Awards
		- Dashboard
		- Credit account balance
		- Account activity
		- Setting, Alerts, Notifications
		- Create/Edit a proposed credit transfer
		- Accept/Approve a proposed/authorized credit transfer
	* Compliance Reporting
		- Compliance Report
		- Exclusions Report
		- Exemption Report
- prototype of credit transfer and award application using Django Templates and Static Controllers to input test data
- Deployment pipeline built out so far includes:
	* build (openshift pipeline/jenkins)
	* deploy (openshift pipeline/jenkins)
	* automated datamodeling (schema spy)
	* functional testing (navUnit) (*in progress*)
	* code analysis and vulnerability testing (sonar cubes) (*in progress*) 
- architectural deployment (*in progress*)
	* React front-end
	* REST API
	* Django Back-end
	* Postgres Database

### Getting Help or Reporting an Issue
To report bugs/issues/features requests, please file an [issue](https://github.com/bcgov/tfrs/issues/).

### How to Contribute
If you would like to contribute, please see our [contributing](contributing.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](code_of_conduct.md). By participating in this project you agree to abide by its terms.

### Licence
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
