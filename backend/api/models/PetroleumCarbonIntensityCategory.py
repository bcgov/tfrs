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

from api.managers.NameManager import NameManager
from api.models.mixins.DisplayOrder import DisplayOrder
from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class PetroleumCarbonIntensityCategory(
        Auditable, DisplayOrder, EffectiveDates):
    """
    List of 'categories' used to classify the fuels for petroleum-based
    carbon intensity
    """
    name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        db_comment="Label for Petroleum-based Carbon Intensity Fuels."
    )

    objects = NameManager()

    class Meta:
        db_table = 'petroleum_carbon_intensity_category'

    db_table_comment = "List of 'categories' used to classify the fuels for " \
                       "petroleum carbon intensity."
