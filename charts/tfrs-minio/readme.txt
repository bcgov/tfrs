Add the following two keys to tfrs-minio-[env] secret
  root-user
  root-password
helm -n namespace -f ./values-dev.yaml install tfrs-minio oci://registry-1.docker.io/bitnamicharts/minio --version 13.6.2
Create Opensift route tfrs-minio-console-test
Update the existing route tfrs-minio-test to use the newly created service tfrs-minio api port