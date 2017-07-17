SET TARGET_SERVER=http://localhost:59836

curl -c cookie %TARGET_SERVER%/api/authentication/dev/token?userId=

rem need to load FuelSupplierContacts before FuleSuppliers.

call load.bat CreditTradeStatus/CreditTradeStatus_TCS.json api/credittradestatuses/bulk "%TARGET_SERVER%"
call load.bat CreditTradeType/CreditTradeType_CTType.json api/credittradetypes/bulk "%TARGET_SERVER%"
call load.bat FuelSupplierActionsType/FuelSupplierActionsType_FSActionType.json api/fuelsupplieractionstypes/bulk "%TARGET_SERVER%"
call load.bat FuelSupplierContactRole/FuelSupplierContactRole_FSContactRole.json api/fuelsuppliercontactroles/bulk "%TARGET_SERVER%"
call load.bat FuelSupplierStatus/FuelSupplierStatus_FSStatus.json api/fuelsupplierstatuses/bulk "%TARGET_SERVER%"
call load.bat FuelSupplierType/FuelSupplierType_FSType.json api/fuelsuppliertypes/bulk "%TARGET_SERVER%"
call load.bat NotificationType/NotificationType_NotType.json api/notificationtypes/bulk "%TARGET_SERVER%"
call load.bat OpportunityStatus/OpportunityStatus_OppStatus.json api/opportunitystatuses/bulk "%TARGET_SERVER%"

call load.bat permissions/permissions_Perms.json api/permissions/bulk "%TARGET_SERVER%"
call load.bat roles/roles_Role.json api/roles/bulk "%TARGET_SERVER%"
call load.bat rolepermission/rolepermission_RP.json api/rolepermissions/bulk "%TARGET_SERVER%"
call load.bat users/users_user.json api/users/bulk "%TARGET_SERVER%"
call load.bat userRole/userRole_userRole.json api/userroles/bulk "%TARGET_SERVER%"

call load.bat FuelSupplier/FuelSupplier_FS.json api/fuelsuppliers/bulk "%TARGET_SERVER%"
call load.bat FuelSupplierCCData/FuelSupplierCCData_FSCCD.json api/fuelsupplierccdata/bulk "%TARGET_SERVER%"
call load.bat FuelSupplierContact/FuelSupplierContact_FSContact.json api/fuelsuppliercontacts/bulk "%TARGET_SERVER%"




