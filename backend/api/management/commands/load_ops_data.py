from django.core.management import BaseCommand
from django.db import transaction, connection

from api.management.commands._loader import ScriptLoader

class Command(BaseCommand):
    help = 'Loads operational data'

    def add_arguments(self, parser):
        parser.add_argument('script', help='script file or minio object name')
        parser.add_argument('--script-arg', nargs='+', help='argument for script')
        parser.add_argument('--revert', action='store_true', help='revert this script')
        parser.add_argument('--minio', action='store_true', help='fetch from Minio, not file')
        parser.add_argument('--minio-bucket', help='minio bucket')

        helptext = ('Load operational data. script should be either a local file or the name of an object on a' 
                    ' Minio host. If using Minio as the source, ensure that the environment has MINIO_ACCESS_KEY,'
                    ' MINIO_SECRET_KEY, and MINIO_ENDPOINT set. MINIO_ENDPOINT should be of the form "host:port"'
                    ' and not include a scheme')

        parser.description = helptext

    @transaction.atomic
    def _create_persistent_record(self,
                                  script_name='Unknown',
                                  source_code=None,
                                  is_reverting=False,
                                  successful=True,
                                  comment='Unknown'):
        with connection.cursor() as cursor:
                cursor.execute(
                    'insert into data_load_operations (script_name,'
                    ' is_reverting,'
                    ' successful,'
                    ' comment,'
                    ' source_code,'
                    ' run_at) values '
                    '(%s, %s, %s, %s, %s, current_timestamp)',
                    [script_name, is_reverting, successful, comment, source_code]
                )

    def handle(self, *args, **options):

        if 'minio' in options and options['minio'] is True:
            if 'minio_bucket' not in options:
                self.stdout.write(self.style.ERROR('You must provide minio-bucket'
                                                   ' when fetching from minio'))
                return

            (script, source_code) = ScriptLoader().load_from_minio(options['minio_bucket'],
                                                    options['script'])
        else:
            (script, source_code) = ScriptLoader().load_from_file(options['script'])

        script_instance = script(options['script'], options['script_arg'])

        script_metadata = {}
        script_metadata['comment'] = script_instance.comment
        script_metadata['source_code'] = source_code
        script_metadata['script_name'] = options['script']

        if 'revert' in options and options['revert'] is True:
            if not script_instance.is_revertable:
                self.stdout.write(self.style.ERROR('This script does not claim to be revertable'))
                return

            self.stdout.write('Reverting ops data script {}'.format(options['script']))

            if not script_instance.check_revert_preconditions():
                self.stdout.write(self.style.ERROR('Script preconditions not met. Not executing'))
                self._create_persistent_record(**script_metadata, successful=False, is_reverting=True)
                return

            script_instance.revert()
            self.stdout.write(self.style.SUCCESS('Successfully reverted ops data script {}'
                                                 ).format(options['script']))
            self._create_persistent_record(**script_metadata, successful=True, is_reverting=True)
        else:
            if not script_instance.check_run_preconditions():
                self.stdout.write(self.style.ERROR('Script preconditions not met. Not executing'))
                self._create_persistent_record(**script_metadata, successful=False)
                return

            script_instance.run()

            self.stdout.write(self.style.SUCCESS('Successfully loaded ops data script {}'
                                                 ).format(options['script']))
            self._create_persistent_record(**script_metadata, successful=True)

