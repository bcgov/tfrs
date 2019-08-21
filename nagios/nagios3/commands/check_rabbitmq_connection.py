import os
import sys


import pika
from pika.exceptions import AMQPError
from django.apps import AppConfig
from django.db.models.signals import post_migrate
from minio import Minio
from minio.error import MinioError, ResponseError

from api.services.KeycloakAPI import list_users, get_token
from db_comments.db_actions import create_db_comments, \
    create_db_comments_from_models
from tfrs.settings import AMQP_CONNECTION_PARAMETERS, MINIO, DOCUMENTS_API, \
    KEYCLOAK, EMAIL, TESTING, RUNSERVER

from pika import ConnectionParameters, PlainCredentials

print('Checking AMQP connection')

AMQP_CONNECTION_PARAMETERS = ConnectionParameters(
    host=AMQP['HOST'],
    port=AMQP['PORT'],
    virtual_host=AMQP['VHOST'],
    credentials=PlainCredentials(AMQP['USER'], AMQP['PASSWORD'])
)

try:
    parameters = AMQP_CONNECTION_PARAMETERS
    connection = pika.BlockingConnection(parameters)
    connection.channel()
    connection.close()
except AMQPError as _error:
    raise RuntimeError('AMQP connection failed')