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

from api.managers.NotionalTransferTypeManager import \
    NotionalTransferTypeManager
from api.models.mixins.DisplayOrder import DisplayOrder
from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class NotionalTransferType(Auditable, DisplayOrder, EffectiveDates):
    """
    Contains a list of possible transfer types for Schedule A.
    (Notional Transfers)
    """
    the_type = models.CharField(
        max_length=25,
        unique=True,
        db_comment="Transfer types for Schedule A."
                   "e.g. Received or Transferred."
    )

    def __str__(self):
        return self.the_type

    objects = NotionalTransferTypeManager()

    def natural_key(self):
        return (self.the_type,)

    class Meta:
        db_table = 'notional_transfer_type'

    db_table_comment = "Contains a list of possible transfer types for " \
                       "Schedule A (Notional Transfers)." \
                       "e.g. Received or Transferred"
