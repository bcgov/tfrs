from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

from tfrs.settings import AMQP

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tfrs.settings')

app = Celery('tfrs', broker='amqp://{}:{}@{}:{}/{}'.format(
    AMQP['USER'],
    AMQP['PASSWORD'],
    AMQP['HOST'],
    AMQP['PORT'],
    AMQP['VHOST']))

app.conf.update({
    'beat_scheduler': 'django_celery_beat.schedulers:DatabaseScheduler'
})

app.autodiscover_tasks()

app.conf.update({
    'beat_schedule': {
        'minio-orphan-cleanup': {
            'task': 'api.tasks.remove_orphans',
            'schedule': 3600.0
        },
        'remove-expired-autosave-entries': {
            'task': 'api.tasks.reap_autosave',
            'schedule': 3600.0
        },
        'resubmit-stalled-scans': {
            'task': 'api.tasks.resubmit_stalled_scans',
            'schedule': 900.0
        }
    }
})
