#!/bin/bash

# Not how I would normally do this but it'll work for a demo/test

sed -e "s/LICENSE/$LICENSE_PLATE/g" -e "s/CLUSTER/$CLUSTER_NAME/g" -e "s/MOUNT_ENV/nonprod/g" -e "s/ENV/tools/g" deployment.yaml > vault-$LICENSE_PLATE-tools.yaml
sed -e "s/LICENSE/$LICENSE_PLATE/g" -e "s/CLUSTER/$CLUSTER_NAME/g" -e "s/MOUNT_ENV/nonprod/g" -e "s/ENV/dev/g" deployment.yaml > vault-$LICENSE_PLATE-dev.yaml
sed -e "s/LICENSE/$LICENSE_PLATE/g" -e "s/CLUSTER/$CLUSTER_NAME/g" -e "s/MOUNT_ENV/nonprod/g" -e "s/ENV/test/g" deployment.yaml > vault-$LICENSE_PLATE-test.yaml
sed -e "s/LICENSE/$LICENSE_PLATE/g" -e "s/CLUSTER/$CLUSTER_NAME/g" -e "s/MOUNT_ENV/prod/g" -e "s/ENV/prod/g" deployment.yaml > vault-$LICENSE_PLATE-prod.yaml

