#!/bin/bash

dbConnectionTest=$(python3 /etc/nagios3/commands/check_postgresql_liveness.py)
echo $dbConnectionTest
if [[ $dbConnectionTest == OK* ]];
then
        exit 0
else
        exit 2
fi

#PROJECT_NAME=$1

#databasePodName=`oc get pods -n $PROJECT_NAME | grep postgresql96 | awk '{print $1}'`

#databaseLivenessAlarm=false
#selectResult=`oc exec $databasePodName -c postgresql96 -n $PROJECT_NAME -- psql -h 127.0.0.1 -q -d tfrs -c 'SELECT 1' | grep row`
#if [ ${selectResult} == "(1 row)" ]; then
#        databaseLivenessAlarm=true
#fi
#if [ ${databaseLivenessAlarm} = true ]; then
#        echo "CRITICAL - $1 Postgresql liveness checking failed"
#        exit 2
#fi
#echo "OK - $1 Postgresql liveness checking passed successfully"
#exit 0
