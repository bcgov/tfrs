#!/bin/bash

ENV_NAME=$1

if [ ${ENV_NAME} == "dev" ]; then
    rm -f /etc/nagios3/conf.d/*-test.cfg
    rm -f /etc/nagios3/conf.d/*-prod.cfg
fi
if [ ${ENV_NAME} == "test" ]; then
    rm -f /etc/nagios3/conf.d/*-dev.cfg
    rm -f /etc/nagios3/conf.d/*-prod.cfg
fi
if [ ${ENV_NAME} == "prod" ]; then
    rm -f /etc/nagios3/conf.d/*-dev.cfg
    rm -f /etc/nagios3/conf.d/*-test.cfg
fi