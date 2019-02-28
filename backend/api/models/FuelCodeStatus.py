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

from api.managers.FuelCodeStatusManager import FuelCodeStatusManager
from api.models.mixins.DisplayOrder import DisplayOrder
from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class FuelCodeStatus(Auditable, DisplayOrder, EffectiveDates):
    """
    List of Possible statuses for documents.
    """
    status = models.CharField(
        max_length=25,
        blank=True,
        null=True,
        unique=True,
        db_comment="Contains an enumerated value to describe the fuel code "
                   "status. This is a unique natural key."
    )

    objects = FuelCodeStatusManager()

    def natural_key(self):
        """
        Allows type 'status' to be used to identify
        a row in the table
        """
        return (self.status,)

    class Meta:
        db_table = 'fuel_code_status'

    db_table_comment = "List of possible statuses." \
                       "(Cancelled, Draft, Submitted)"
