from datetime import timedelta

from api.services.AutosaveService import AutosaveService
from api.services.DocumentService import DocumentService
from api.services.SecurityScan import SecurityScan
from tfrs.celery import app as celery_app


@celery_app.task
def remove_orphans():
    print('starting orphan removal')
    DocumentService.remove_orphans()


@celery_app.task
def resubmit_stalled_scans():
    print('starting scan resubmission service')
    SecurityScan.resubmit_stalled_scans()


@celery_app.task
def reap_autosave():
    print('starting autosave cache reaper')
    AutosaveService.remove_expired_entries(timedelta(days=90))
