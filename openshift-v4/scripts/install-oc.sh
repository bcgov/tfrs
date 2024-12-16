#!/bin/bash
set -e

# Define the version or source of OpenShift CLI
OC_DOWNLOAD_URL="https://mirror.openshift.com/pub/openshift-v4/clients/ocp/stable/openshift-client-linux.tar.gz"

# Create a temporary directory for the download
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# Download and extract the OpenShift CLI
echo "Downloading OpenShift CLI..."
curl -LO "$OC_DOWNLOAD_URL"
echo "Extracting OpenShift CLI..."
tar -xvf openshift-client-linux.tar.gz

# Move the binaries to /usr/local/bin for global access
echo "Installing OpenShift CLI..."
sudo mv oc /usr/local/bin/
sudo mv kubectl /usr/local/bin/

# Clean up temporary files
cd -
rm -rf $TEMP_DIR

# Verify installation
echo "OpenShift CLI installed successfully:"
oc version --client
