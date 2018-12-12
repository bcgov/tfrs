import os


def config():
    return {
        'ENDPOINT': os.getenv('MINIO_ENDPOINT', None),
        'USE_SSL': bool(os.getenv('MINIO_USE_SSL', 'False').lower() in ['true', 1]),
        'ACCESS_KEY': os.getenv('MINIO_ACCESS_KEY', None),
        'SECRET_KEY': os.getenv('MINIO_SECRET_KEY', None),
        'BUCKET_NAME': os.getenv('MINIO_BUCKET_NAME', 'tfrs')
    }
