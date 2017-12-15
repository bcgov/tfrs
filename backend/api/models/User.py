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

from django.db import models
from django.contrib.auth.models import AbstractUser

from auditable.models import Auditable


class User(AbstractUser, Auditable):
    password = models.CharField(max_length=128, blank=True, null=True)
    authorization_id = models.CharField(max_length=500, blank=True, null=True)
    authorization_guid = models.UUIDField(unique=True, default=None, null=True)
    authorization_directory = models.CharField(max_length=100, blank=True,
                                               null=True)
    display_name = models.CharField(max_length=500, blank=True, null=True)
    organization = models.ForeignKey(
        'Organization',
        related_name='users',
        blank=True, null=True)
    effective_date = models.DateField(auto_now_add=True, blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)

    class Meta:
        db_table = 'user'
