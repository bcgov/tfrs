#!/bin/bash

rabbitmqConnectionTest=$(python3 ./t.py)
echo $rabbitmqConnectionTest
if [[ $rabbitmqConnectionTest == OK* ]];
then
        exit 0
else
        exit 2
fi