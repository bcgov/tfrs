SET TARGET_SERVER=http://localhost:59836

curl -c cookie %TARGET_SERVER%/api/authentication/dev/token?userId=

rem need to load FuelSupplierContacts before FuleSuppliers.
call load.bat "FuelSupplierContacts\FuelSupplierContacts_Contact.json" api/fuelsuppliercontacts/bulk "%TARGET_SERVER%"
call load.bat "FuelSuppliers\FuelSuppliers_FuelSupplier.json" api/fuelsuppliers/bulk "%TARGET_SERVER%"









