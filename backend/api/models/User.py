"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

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
from django.core.validators import RegexValidator
import django.contrib.auth.validators

from .OrganizationBalance import OrganizationBalance

from auditable.models import Auditable


class User(AbstractUser, Auditable):
    username = models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
                                 message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")

    password = models.CharField(max_length=128, blank=True, null=True)
    email = email = models.EmailField(blank=True, null=True)

    title = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(validators=[phone_regex], max_length=17,
                             blank=True, null=True)
    cell_phone = models.CharField(validators=[phone_regex], max_length=17,
                                  blank=True, null=True)
    organization = models.ForeignKey(
        'Organization',
        related_name='users',
        blank=True, null=True, on_delete=models.SET_NULL)
    effective_date = models.DateField(auto_now_add=True, blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)

    # Siteminder headers
    authorization_id = models.CharField(max_length=500, blank=True, null=True)
    authorization_guid = models.UUIDField(unique=True, default=None, null=True)
    authorization_directory = models.CharField(max_length=100, blank=True,
                                               null=True)
    authorization_email = models.EmailField(blank=True, null=True)
    display_name = models.CharField(max_length=500, blank=True, null=True)

    @property
    def organization_balance(self):
        organization_balance = OrganizationBalance.objects.filter(
            organization_id=self.organization.id,
            expiration_date=None).first()

        if organization_balance:
            balance = organization_balance.validated_credits
        else:
            balance = 0

        return balance

    class Meta:
        db_table = 'user'
