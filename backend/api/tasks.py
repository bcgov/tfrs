from api.services.DocumentService import DocumentService
from tfrs.celery import app as celery_app

@celery_app.task
def remove_orphans():
    print('starting orphan removal')
    DocumentService.remove_orphans()

