#!/bin/bash

patroniReplicas=$1

## the value must be running
master_node_state=`curl --silent --show-error http://$DATABASE_SERVICE_NAME.$OPENSHIFT_BUILD_NAMESPACE.svc.cluster.local:8008/patroni | jq --raw-output .state`
if [ $master_node_state != "running" ]; then
    echo "CRITICAL - Patroni health checking failed"
    exit 2
fi

if [ ${patroniReplicas} == 2 ]; then
    ## the value must be streaming
    echo "p2"
    second_node_state=`curl --silent --show-error http://$DATABASE_SERVICE_NAME.$OPENSHIFT_BUILD_NAMESPACE.svc.cluster.local:8008/patroni | jq --raw-output .replication[0].state`
    if [ $second_node_state != "streaming" ]; then
        echo "CRITICAL - Patroni health checking failed"
        exit 2
    fi
fi

if [ ${patroniReplicas} == 3 ]; then
    ## the value must be streaming
    echo "p3"
    third_node_state=`curl --silent --show-error http://$DATABASE_SERVICE_NAME.$OPENSHIFT_BUILD_NAMESPACE.svc.cluster.local:8008/patroni | jq --raw-output .replication[1].state`
    if [ $third_node_state != "streaming" ]; then
        echo "CRITICAL - Patroni health checking failed"
        exit 2
    fi
fi

echo "OK - Patroni health checking passed"
exit 0