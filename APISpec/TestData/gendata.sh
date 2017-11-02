#!/bin/bash

# Prerequisites for running this script:
# 1.  Python 2.7 is installed - assumes it is called python

PYTHONCMD=python

for file in in/*.csv
do
  echo Processing CSV file: $file
	$PYTHONCMD csv2json.py $file yes
done

# Create fixtures
FIXTUREPATH=../../server/fixtures
MKFIX=./mkfixture.py

$MKFIX CreditTradeStatus/*.json $FIXTUREPATH credittradestatus
$MKFIX CreditTradeType/*.json $FIXTUREPATH credittradetype
$MKFIX CreditTradeZeroReason/*.json $FIXTUREPATH credittradezeroreason
$MKFIX FuelSupplier/*.json $FIXTUREPATH fuelsupplier
$MKFIX FuelSupplierActionsType/*.json $FIXTUREPATH fuelsupplieractionstype
$MKFIX FuelSupplierBalance/*.json $FIXTUREPATH fuelsupplierbalance
$MKFIX FuelSupplierCCData/*.json $FIXTUREPATH fuelsupplierccdata
$MKFIX FuelSupplierContact/*.json $FIXTUREPATH fuelsuppliercontact
$MKFIX FuelSupplierContactRole/*.json $FIXTUREPATH fuelsuppliercontactrole
$MKFIX FuelSupplierStatus/*.json $FIXTUREPATH fuelsupplierstatus
$MKFIX FuelSupplierType/*.json $FIXTUREPATH fuelsuppliertype
$MKFIX NotificationType/*.json $FIXTUREPATH notificationtype
$MKFIX OpportunityStatus/*.json $FIXTUREPATH opportunitystatus
$MKFIX permissions/*.json $FIXTUREPATH permissions
$MKFIX rolepermission/*.json $FIXTUREPATH rolepermission
$MKFIX roles/*.json $FIXTUREPATH roles
$MKFIX userRole/*.json $FIXTUREPATH userRole
$MKFIX users/*.json $FIXTUREPATH users
