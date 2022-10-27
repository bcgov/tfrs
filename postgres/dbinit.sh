#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --password "$POSTGRES_PASSWORD" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER tfrs with encrypted password 'development_only' superuser;
	CREATE DATABASE tfrs;
	GRANT ALL PRIVILEGES ON DATABASE tfrs TO tfrs;
EOSQL
