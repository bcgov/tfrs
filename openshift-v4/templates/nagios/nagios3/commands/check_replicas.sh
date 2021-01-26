#!/bin/bash

PROJECT_NAME=$1
DEPLOYMENT=$2
MIN_REPLICAS=$3

if [ ${DEPLOYMENT} == "tfrs-test-rabbitmq-cluster" ] || [ ${DEPLOYMENT} == "tfrs-prod-rabbitmq-cluster" ]; then
    availableReplicas=$(oc get -o json StatefulSet ${DEPLOYMENT} -n $PROJECT_NAME | jq '.status.currentReplicas')
elif [ ${DEPLOYMENT} == "patroni-dev" ] || [ ${DEPLOYMENT} == "patroni-test" ] || [ ${DEPLOYMENT} == "patroni-prod" ]; then
    availableReplicas=$(oc get -o json StatefulSet ${DEPLOYMENT} -n $PROJECT_NAME | jq '.status.currentReplicas')
else availableReplicas=$(oc get -o json dc $DEPLOYMENT -n $PROJECT_NAME | jq '.status.availableReplicas')
fi

if (($availableReplicas>=$MIN_REPLICAS)); then
        echo "OK - $1:$2 has $availableReplicas replicas available"
        exit 0
	else
        echo "CRITICAL - $1:$2 has $availableReplicas replicas available"
        exit 2
fi

