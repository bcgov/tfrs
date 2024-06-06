#!/bin/bash
set -e

# This script creates a pg_dump .tar file from an openshift pod
# and automatically downloads and restores the .tar into 
# a local postgres docker container

# 2 Arguments 
# $1 = 'test' or 'prod'
# #2 = 'local container name or id'
# example command
# . import-data.sh test 398cd4661173

if [ "$#" -ne 2 ]; then
    echo "Passed $# parameters. Expected 2."
    exit 1
fi

# defaults set to test
project_name='0ab226-test'
pod_name='tfrs-spilo-0'
env='test'

local_container=$2

# checks if you are logged in to openshift
echo "** Checking Openshift creds"
oc whoami
echo "logged in"
echo

# prod variables
if [ $1 = "prod" ]; then
  project_name='0ab226-prod'
  pod_name='tfrs-crunchy-prod-tfrs-trg4-0'
  env='prod'
elif [ $1 = "dev" ]; then
  project_name='0ab226-dev'
  pod_name='tfrs-spilo-jan-0'
  env='dev'
else
  echo '** Using test variables'
  echo
fi

echo "** Setting project $env"
oc project $project_name
echo

echo "** Starting pg_dump"
oc exec $pod_name -- bash -c 'pg_dump -U postgres -F t --no-privileges --no-owner -c -d tfrs > /tmp/tfrs.tar'
echo

echo "** Downloading .tar file"
oc rsync $pod_name:/tmp/tfrs.tar ./
echo

echo "** Copying .tar to local database container $local_container"
docker cp tfrs.tar $local_container:/tmp/tfrs.tar
echo

echo "** Restoring local database"
docker exec $local_container bash -c 'pg_restore -U tfrs --dbname=tfrs --no-owner --clean --if-exists --verbose /tmp/tfrs.tar' || true
# docker exec $local_container bash -c 'pg_restore -U tfrs --dbname=tfrs --no-owner --clean --if-exists --verbose /tmp/tfrs.tar'
echo

echo "** Cleaning up"
rm tfrs.tar

echo "** Finished database restore"
