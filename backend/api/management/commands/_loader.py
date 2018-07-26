import os

from minio import Minio

from api.management.data_script import OperationalDataScript


class ScriptLoader:

    def _load_from_string(self, str):
        globals = {}
        exec(str, globals)

        if 'script_class' not in globals:
            raise RuntimeError('This script does not contain a script_class reference')

        cls = globals['script_class']

        if not issubclass(cls, OperationalDataScript):
            raise RuntimeError('The class referenced within the script is not a subclass of'
                               ' OperationalDataScript')

        return globals

    def load_from_file(self, filename):
        with open(filename, 'r') as f:
            source = f.read()
            mod = self._load_from_string(source)
            return mod['script_class'], source

    def load_from_minio(self, bucket_name, object_name):
        access_key = os.getenv('MINIO_ACCESS_KEY', None)
        secret_key = os.getenv('MINIO_SECRET_KEY', None)
        endpoint = os.getenv('MINIO_ENDPOINT', None)

        minio = Minio(endpoint, access_key=access_key, secret_key=secret_key, secure=False)
        data = minio.get_object(bucket_name, object_name)

        chunks = []

        for buf in data.stream():
            chunks.append(buf)

        source = b''.join(chunks).decode('utf-8')
        mod = self._load_from_string(source)
        return mod['script_class'], source
