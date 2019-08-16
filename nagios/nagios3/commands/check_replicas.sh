#!/bin/bash

PROJECT_NAME=$1
DEPLOYMENT=$2
MIN_REPLICAS=$3

if ! (oc project -q $PROJECT_NAME > /dev/null); then
    echo "Could not select project $PROJECT_NAME"
    exit 2
fi

if ($DEPLOYMENT=="rabbitmq"); then
        availableReplicas=$(oc get -o json StatefulSet $DEPLOYMENT| jq '.status.availableReplicas')
    else
        availableReplicas=$(oc get -o json dc $DEPLOYMENT| jq '.status.availableReplicas')
fi

if (($availableReplicas>=$MIN_REPLICAS)); then
                echo "OK - $1:$2 has $availableReplicas replicas available"
                exit 0
	else
                echo "CRITICAL - $1:$2 has $availableReplicas replicas available"
                exit 2
fi

