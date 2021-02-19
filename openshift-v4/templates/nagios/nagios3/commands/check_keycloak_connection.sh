#!/bin/bash

keycloakConnectionTest=$(python3 /etc/nagios3/commands/check_keycloak_connection.py)
echo $keycloakConnectionTest
if [[ $keycloakConnectionTest == OK* ]];
then
        exit 0
else
        exit 2
fi