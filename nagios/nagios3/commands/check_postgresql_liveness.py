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
        database_name=DB['DATABASE_USER'],
        database_user=DB['DATABASE_PASSWORD'],
        database_password=DB['DATABASE_NAME']
    )
 
	# get a connection, if a connect cannot be made an exception will be raised here
    print "conn_string is ", conn_string
    psycopg2.connect(conn_string)
    print('connected')
    psycopg2.close()
    print('closed')
 
	# conn.cursor will return a cursor object, you can use this cursor to perform queries
    print('OK - Database connection checking passed')
 
except Exception as error:
    print('CRITICAL - Database connection checking failed')