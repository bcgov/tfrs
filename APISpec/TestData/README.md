TFRS - Generating/Loading Test Data
======================

Overview
--------
This folder contains reference and test data for the TFRS application and a mechanism for managing and generating the reference and test data files. Reference data is read-only data that is loaded into all instances of the application (Dev, Test and Prod) - status values, type lists, etc. Test data is fake data in the correct format to be loaded into the Dev and/or Test instances of the application for use in testing the system. Note that some tables - such as the Fuel Supplier data might be both - used for testing on Dev and Test and used as the seed data going into production.

Managing/Creating the Data
---------------------
The data is maintained in the _TFRS Data Generation.xlsm_ Excel file in the "in" folder. It has a series of tabs in it, and each one with a ".csv" extension is exported from the excel and used to drive the data generation process.  The test data itself is a combination of static data and formulas to generate data (e.g. random dates, values, etc.) and joins between tables. There is also a table of fake names and addresses to use for people/users in the system.

A VB Excel macro, invoked with the key combination Ctrl-Shift-V, exports all of the csv files in one step. Use the macro every time you update the test data.

Once exported, use the "gendata.bat" or "gendata.sh" scripts to generate the JSON files that make up the test data. The JSON files are (or should be) compatible with the "bulk" operations generated from the Swagger API. Loaded in the correct order, they will initialize the data to a proper state.

Loading the Test Data
----------------
Once the data is generated, two scripts (currently only in ".bat" form) are used to load the data via the API.  The load scripts have been used in another project but have not yet been tested for TFRS and may require some tweaking.

The "load.bat" file takes as arguments:

* a JSON file
* an "bulk" API endpoint
* a server URL (dev, test or prod)

and loads the data into the application.  The load.bat includes a call to authenticate the user with the application and create a cookie for the subsequent call to actually load the data. An improvement to the script would be a mechanism (e.g. a flag) to only make the authenticate when needed vs. every time - for example, on the first call of a sequence of loads.

The "load-all.bat" script takes just the server to be loaded and loads all of the tables to initialize the application. The load-all script is defined to load the tables in a relational correct order. Again - it has not yet been tested and may need further tweaking.
