#!/bin/bash

minioConnectionTest=$(python3 /etc/nagios3/commands/check_minio_connection.py)
echo $minioConnectionTest
if [[ $minioConnectionTest == OK* ]];
then
        exit 0
else
        exit 2
fi
