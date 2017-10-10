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

### Project Status
This project is in development.
To see the status of feature development please refer to the [features](https://github.com/bcgov/tfrs/wiki/features/) page on the project wiki

### Development

If using Windows as your development environment, install the following:
- Python 3.5.1 - Select one of the installation options here that fits your workstation type: https://www.python.org/downloads/release/python-351/
- Postgresql http://www.enterprisedb.com/products/pgdownload.do#windows
Be sure to edit the "PATH" environment variable to your in the advanced system settings on the control panel and add the postgresql bin folder. If you already have a PATH variable set to something you can add another separated by a semicolon. e.g. "C:\blah\npm; C:\Program Files\PostgreSQL\9.6\bin"
(Without doing this you will have problems with psycopg2 not being able to find the postgrsql libraries)
- Visual Studio Community 2017 Preview https://www.visualstudio.com/vs/preview/ with the Python extensions (As of 2017-4-18 the Preview version is required in order to use the Python extensions, which can be selected at time of install)

### Getting Started (development)
#### REST API Server
Once you have python, install the required modules

`pip install -r requirements.txt`

Once you have postgres setup, set the following environment variables

```bash
DATABASE_SERVICE_NAME=localhost
DATABASE_ENGINE=postgresql
DATABASE_ENGINE=postgresql
DATABASE_NAME=<database name>
DATABASE_USER=<postgres user>
DATABASE_PASSWORD=<password>
```

Once you have django, set up the database tables

`python manage.py migrate`

...and run the server

`python manage.py runserver`

#### Front-End JavaScript Client
[View the README for the client](client/README.md)


### Code Generation

This project has made use of the Swagger.io Code Generator.  Here is the procedure for generation of code:

1. First install an environment capable of running Java 7+ programs.  As of 2017-5-2 the current JRE can be used.   
2. If building the code generator from source, follow the instructions at the code generator extension repository:
   https://github.com/bcgov/Swagger-Codegen-Extension   
   An alternative to building from source is to obtain the jar files for the code generator and extension.
3. Make changes to the Excel file currently located at `tfrs\APISpec\in\TFRSSwagger.xlsm`
4. Export from Excel using the CTRL-SHIFT-V macro in the above excel file
5. Run the file called `update.bat` located in `tfrs\APISpec`
6. In the Swagger-Codgen-Extension folder, run the Django generator batch file with the following parameters:  
   `generate-all-django.bat <path to OpenAPI YAML file> <output folder name> <path to configuration file>`
	1. The OpenAPI YAML file is located in this repository at `tfrs/ApiSpec/TFRSswagger.yaml` 
	2. The configuration file is located in this repository at `tfrs/ApiSpec/swagger-codegen-config.json`
7. Copy the following artifacts to the folder `server` in this repository.
	1. admin.py
	2. serializers.py
	3. urls.py
	4. test_api_simple
	5. views.py
	6. fakedata.py
	7. models folder
8. If the data model was changed, use the makemigrations feature of python django to make a migration (Visual Studio has a short cut to this - right click the project, select python, then Django Make Migrations...)
9. Run the migration (There is an option to run migrations in the same python menu as above)
10. Run automated tests and ensure they all pass
	1. The Visual Studio Test Explorer can be used to easily start the tests
11. Run the following to ensure code coverage works:
	1. `coverage run --source='.' manage.py test`
    2. `coverage xml`
12. Commit the code to your fork of the repository
13. Do a test build in your OpenShift instance to ensure the build works
14. If the build works, do a pull request.   


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
