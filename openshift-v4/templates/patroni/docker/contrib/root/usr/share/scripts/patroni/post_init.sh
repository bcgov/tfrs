#!/usr/bin/env bash
set -Eeu

if [[ (! -z "$APP_USER") &&  (! -z "$APP_PASSWORD") && (! -z "$APP_DATABASE")]]; then
  echo "Creating user ${APP_USER}"
  psql "$1" -w -c "create user ${APP_USER} WITH LOGIN ENCRYPTED PASSWORD '${APP_PASSWORD}'"

  echo "Creating database ${APP_DATABASE}"
  psql "$1" -w -c "CREATE DATABASE ${APP_DATABASE} OWNER ${APP_USER} ENCODING '${APP_DB_ENCODING:-UTF8}' LC_COLLATE = '${APP_DB_LC_COLLATE:-en_US.UTF-8}' LC_CTYPE = '${APP_DB_LC_CTYPE:-en_US.UTF-8}'"

  echo "Creating extensions" 
  psql -U postgres -q -d "${APP_DATABASE}" -c 'create extension if not exists hstore'
  psql -U postgres -q -d "${APP_DATABASE}" -c 'create extension if not exists pg_trgm'

else
  echo "Skipping user creation"
  echo "Skipping database creation"
fi