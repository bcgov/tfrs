import os
from minio import Minio
from minio.error import MinioError, ResponseError

MINIO = {
    'ENDPOINT': os.getenv('MINIO_ENDPOINT', None),
    'USE_SSL': bool(os.getenv('MINIO_USE_SSL', 'False').lower() in ['true', 1]),
    'ACCESS_KEY': os.getenv('MINIO_ACCESS_KEY', None),
    'SECRET_KEY': os.getenv('MINIO_SECRET_KEY', None)
}

minio = Minio(MINIO['ENDPOINT'],
    access_key=MINIO['ACCESS_KEY'],
    secret_key=MINIO['SECRET_KEY'],
    secure=MINIO['USE_SSL'])

try:
    minio = Minio(MINIO['ENDPOINT'],
                    access_key=MINIO['ACCESS_KEY'],
                    secret_key=MINIO['SECRET_KEY'],
                    secure=MINIO['USE_SSL'])

    _objects = minio.list_buckets()
    print('OK - Minio connection checking passed')
except MinioError as _error:
    print('CRITICAL - Minio connection checking failed')