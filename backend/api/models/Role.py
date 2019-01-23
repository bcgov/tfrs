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

from auditable.models import Auditable
from api.managers.RoleManager import RoleManager

from .Permission import Permission


class Role(Auditable):
    """
    Table that will hold all the available Roles and descriptions
    """
    name = models.CharField(
        max_length=200,
        unique=True,
        db_comment="Role code. Natural key. Used internally."
                   "eg Admin, GovUser, GovDirector, etc"
    )

    description = models.CharField(
        max_length=1000,
        db_comment="Descriptive text explaining this role. "
                   "This is what's shown to the user."
    )

    is_government_role = models.BooleanField(
        default=False,
        db_comment="Flag. True if this is a government role "
                   "(eg. Analyst, Administrator)"
    )

    display_order = models.IntegerField(
        db_comment="Relative rank in display sorting order"
    )

    @property
    def permissions(self):
        """
        Permissions associated with the Role
        """
        permissions = Permission.objects.filter(
            role_permissions__role_id=self.id
        ).distinct()

        return permissions

    objects = RoleManager()

    def natural_key(self):
        """
        Allows us to match with the role name
        """
        return (self.name,)

    # Add effective_date and expiration_date
    class Meta:
        db_table = 'role'

    db_table_comment = "Table that will hold all the available Roles " \
                       "and descriptions."
