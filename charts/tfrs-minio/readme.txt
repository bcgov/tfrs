create secret to have the following two keys
  root-user
  root-password
helm -f ./values-dev.yaml install tfrs-minio oci://registry-1.docker.io/bitnamicharts/minio --version 13.6.2
