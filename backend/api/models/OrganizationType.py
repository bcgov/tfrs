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

from auditable.models import Auditable
from api.managers.OrganizationTypeManager import OrganizationTypeManager


class OrganizationType(Auditable):
    type = models.CharField(max_length=25,
                            unique=True,
                            db_comment='Organization type enumeration. Natural key.')
    description = models.CharField(max_length=1000, blank=True, null=True,
                                   db_comment='Displayed name')
    display_order = models.IntegerField(blank=True, null=True,
                                        db_comment='Relative rank in display sorting order')
    effective_date = models.DateField(blank=True, null=True, db_comment='Not valid before')
    expiration_date = models.DateField(blank=True, null=True, db_comment='Not valid after')

    def __str__(self):
        return self.type

    objects = OrganizationTypeManager()

    def natural_key(self):
        return (self.type,)

    class Meta:
        db_table = 'organization_type'

    db_table_comment = 'Possible types of organization.' \
                       'Used to differentiate available actions and displays'
