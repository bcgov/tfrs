"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel Requirements Regulation.

    OpenAPI spec version: v1


    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""

import inspect
import pkgutil
import smtplib
import sys
from collections import namedtuple

import pika
from pika.exceptions import AMQPError
from django.apps import AppConfig
from django.db.models.signals import post_migrate
from minio import Minio

from db_comments.db_actions import create_db_comments, \
    create_db_comments_from_models
from tfrs.settings import AMQP_CONNECTION_PARAMETERS, MINIO, DOCUMENTS_API, \
    EMAIL, RUNSERVER
from django.core.cache import caches
import random

redis_cache = caches['redis']

class APIAppConfig(AppConfig):
    """Django configuration class"""

    name = 'api'

    def ready(self):
        """Django callback when application is loaded"""

        # register our interest in the post_migrate signal
        post_migrate.connect(post_migration_callback, sender=self)

        if RUNSERVER:
            try:
                check_external_services()
                # Seed data in Redis cache
                self.seed_redis_cache()
            except RuntimeError as error:
                print('Startup checks failed. Not starting.')
                print(error)
                exit(-1)  # Django doesn't seem to do this automatically.

    def seed_redis_cache(self):
        """Seed initial data into Redis cache"""
        try:
            # Check if data has already been seeded to avoid duplicates
            if not redis_cache.get('redis_seeded'):
                for seq in range(1, 101):  # Adjust the range to create more entries if needed
                    key = f"balance_{seq}_2024"
                    value = random.randint(10000, 99999)  # Generates a random 5-digit number
                    redis_cache.set(key, value)

                redis_cache.set('redis_seeded', 1)  # Set a flag to indicate seeding is done
                print('Successfully seeded Redis cache')
        except Exception as e:
            print(f'Error seeding Redis cache: {e}')

def check_external_services():
    """Called after initialization. Use it to validate settings"""

    print('Checking AMQP connection')

    try:
        parameters = AMQP_CONNECTION_PARAMETERS
        connection = pika.BlockingConnection(parameters)
        connection.channel()
        connection.close()
    except AMQPError as _error:
        raise RuntimeError('AMQP connection failed')

    if DOCUMENTS_API['ENABLED']:
        print('Documents API enabled. Checking Minio connection')

        try:
            minio = Minio(MINIO['ENDPOINT'],
                          access_key=MINIO['ACCESS_KEY'],
                          secret_key=MINIO['SECRET_KEY'],
                          secure=MINIO['USE_SSL'])

            _objects = minio.list_buckets()

            if not minio.bucket_exists(MINIO['BUCKET_NAME']):
                print('Minio bucket doesn\'t exist. Creating it')
                try:
                    minio.make_bucket(MINIO['BUCKET_NAME'])
                except Exception as _error:
                    print(_error)
                    raise RuntimeError('Minio bucket creation failed')

        except Exception as _error:
            print(_error)
            raise RuntimeError('Minio connection failed')


    if EMAIL['ENABLED']:
        print('Email sending enabled. Checking connection')

        try:
            with smtplib.SMTP(host=EMAIL['SMTP_SERVER_HOST'],
                              port=EMAIL['SMTP_SERVER_PORT']) as server:
                server.noop()
        except Exception as error:
            print(error)
            raise RuntimeError('SMTP Connection failed')


def post_migration_callback(sender, **kwargs):
    """Post-migration hook. Use this to populate database comments"""

    # Dynamic comments from models
    create_db_comments_from_models(get_all_model_classes())

    # Static comments for Django-specific tables
    create_db_comments(
        table_name='django_admin_log',
        table_comment='Log of administrative activities',
        column_comments={
            'id': 'Primary key',
            'object_repr': 'Representation of accessed object'
        }
    )

    create_db_comments(
        table_name='auth_group',
        table_comment='Django Authentication groups (used by admin application)',
        column_comments={
            'id': 'Primary key'
        }
    )

    create_db_comments(
        table_name='auth_group_permissions',
        table_comment='Django Authentication groups to permissions mapping'
                      '(used by admin application)'
    )

    create_db_comments(
        table_name='auth_permission',
        table_comment='Django Authentication permissions (used by admin application)'
    )

    create_db_comments(
        table_name='user_groups',
        table_comment='Django Authentication. Map users to groups (used by admin application).'
    )

    create_db_comments(
        table_name='django_migrations',
        table_comment='Used to track Django database migration state',
        column_comments={
            'name': 'The filename containing the related migration',
            'applied': 'Flag. True if this migration was applied successfully'
        }
    )


def get_all_model_classes():
    """
    Get all the model classes in api.models. Easier than maintaining a list.
    """

    # Has to be a local import. Must be loaded late.
    import api.models

    classes = set()

    ModuleInfo = namedtuple('ModuleInfo', ['module_finder', 'name', 'ispkg'])

    for (module_finder, name, ispkg) in pkgutil.walk_packages(
            api.models.__path__,
            prefix='api.models.'
    ):

        sub_module = ModuleInfo(module_finder, name, ispkg)

        if sub_module.name in sys.modules:
            # we're already loaded (probably as a dependency of another)
            mod = sys.modules[sub_module.name]
        else:
            # load the module
            mod = sub_module.module_finder.find_module(sub_module.name).load_module()

        for name, obj in inspect.getmembers(mod):
            if inspect.getmodule(obj) is not None \
                    and inspect.getmodule(obj).__name__.startswith('api.models'):
                # Assume anything with a 'Meta' attribute is a model
                if inspect.isclass(obj) and hasattr(obj, 'Meta'):
                    classes.add(obj)

    return classes
