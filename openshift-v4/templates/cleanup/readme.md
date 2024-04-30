# Cleanup Cron Job

## cleanup-bc-docker.yaml

The build config to build a clean up image base on Openshift4 oc client image

## cleanup-cron.yaml

The Openshift Cron Job to run periodically to clean up unused resource on in ITVR spaces

## Dockerfile

The Dockerfile to build a new image on top of registry.redhat.io/openshift4/ose-cli
