oc process -f ./nagios-base-bc.json | oc create -f -
oc process -f ./nagios-bc.json | oc create -f -
oc process -f ./nagios-dc.json