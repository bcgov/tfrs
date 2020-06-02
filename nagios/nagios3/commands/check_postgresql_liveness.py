#!/usr/bin/python
import psycopg2
import sys
import os
 
DB = {
    'DATABASE_SERVICE_NAME': os.getenv('DATABASE_SERVICE_NAME', None),
    'DATABASE_USER': os.getenv('DATABASE_USER', None),
    'DATABASE_PASSWORD': os.getenv('DATABASE_PASSWORD', None),
    'DATABASE_NAME': os.getenv('DATABASE_NAME', None)
}

try:

    conn_string = "host='{database_service_name}' dbname='{database_name}' user='{database_user}' password='{database_password}'".format(
        database_service_name=DB['DATABASE_SERVICE_NAME'],
        database_name=DB['DATABASE_NAME'],
        database_user=DB['DATABASE_USER'],
        database_password=DB['DATABASE_PASSWORD']
    )
 
    conn=psycopg2.connect(conn_string)
    conn.close()
 
    print('OK - Database connection checking passed')
 
except Exception as error:
    print('CRITICAL - Database connection checking failed')