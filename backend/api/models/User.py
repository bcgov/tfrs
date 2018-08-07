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
from django.db.models import Q
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
import django.contrib.auth.validators

from auditable.models import Auditable
from api.managers.UserManager import UserManager

from .CreditTradeHistory import CreditTradeHistory
from .Permission import Permission
from .Role import Role
from .UserRole import UserRole


class User(AbstractUser, Auditable):
    """
    User Model
    """
    username = models.CharField(
        error_messages={'unique': "A user with that username already exists."},
        help_text="Required. 150 characters or fewer. Letters, digits and "
                  "@/./+/-/_ only.",
        max_length=150, unique=True,
        validators=[django.contrib.auth.validators.UnicodeUsernameValidator()],
        verbose_name='username',
        db_comment='Login Username'
    )
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the "
                "format: '+999999999'. Up to 15 digits allowed.")

    password = models.CharField(
        max_length=128, blank=True, null=True, db_comment='Password hash')
    email = models.EmailField(
        blank=True, null=True, db_comment='Primary email address')

    title = models.CharField(
        max_length=100, blank=True, null=True, db_comment='Professional Title')
    phone = models.CharField(
        validators=[phone_regex], max_length=17, blank=True, null=True,
        db_comment='Primary phone number')
    cell_phone = models.CharField(
        validators=[phone_regex], max_length=17, blank=True, null=True,
        db_comment='Mobile phone number')
    organization = models.ForeignKey(
        'Organization', related_name='users', blank=True, null=True,
        on_delete=models.SET_NULL)
    effective_date = models.DateField(auto_now_add=True, blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)

    # Siteminder headers
    authorization_id = models.CharField(
        max_length=500, blank=True, null=True, db_comment='Siteminder Header')
    authorization_guid = models.UUIDField(
        unique=True, default=None, null=True,
        db_comment='Siteminder Header. GUID used for authentication')
    authorization_directory = models.CharField(
        max_length=100, blank=True, null=True,
        db_comment='Siteminder Header (normally IDIR or BCeID)')
    authorization_email = models.EmailField(
        blank=True, null=True, db_comment='Siteminder Header')
    display_name = models.CharField(
        max_length=500, blank=True, null=True,
        db_comment='Siteminder Header (Displayed name for user)')

    def __str__(self):
        return str(self.id)

    @property
    def permissions(self):
        """
        Permissions that the user has based on the roles applied
        """
        return Permission.objects.distinct().filter(
            Q(role_permissions__role__in=self.roles)
        ).order_by('id')

    @property
    def roles(self):
        """
        Roles applied to the User
        """
        return Role.objects.filter(user_roles__user_id=self.id)

    def get_history(self, filters):
        """
        Helper function to get the user's activity.
        Filters are to be restricted based on the user's role.
        """
        history = CreditTradeHistory.objects.filter(
            filters, user_id=self.id
        ).order_by('-update_timestamp')

        return history

    def has_perm(self, permission):
        """
        Helper function to check if the user has the appropriate permission
        """
        if not self.roles.filter(
                Q(role_permissions__permission__code=permission)):
            return False

        return True

    @property
    def is_government_user(self):
        """
        Does this user have a government role?
        """
        if self.roles.filter(Q(is_government_role=True)):
            return True

        return False

    objects = UserManager()

    def natural_key(self):
        return (self.username,)

    class Meta:
        db_table = 'user'

    # Supplemental mapping for base class
    db_column_supplemental_comments = {
        'first_name': 'Django field. First name (retrieved from Siteminder',
        'last_name': 'Django field. Last name (retrieved from Siteminder)',
        'is_staff': 'Django field. Flag. True if staff user.',
        'is_superuser': 'Django field. Flag. True if superuser.',
        'is_active': 'Django field. True if can login.',
        'date_joined': 'Django field. Date account created.',
        'last_login': 'Django field. Last login time.',
    }

    db_table_comment = 'Users who may access the application'
