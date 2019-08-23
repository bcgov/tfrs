#!/bin/bash

rabbitmqConnectionTest=$(python3 /etc/nagios3/commands/check_rabbitmq_connection.py)
echo $rabbitmqConnectionTest
if [[ $rabbitmqConnectionTest == OK* ]];
then
        exit 0
else
        exit 2
fi