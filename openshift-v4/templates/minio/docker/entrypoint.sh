#!/bin/bash

${MINIO_BIN} server --config-dir=${MINIO_CONFIG_DIR} $@ ${MINIO_DATA_DIR}
