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

from api.managers.ExpectedUseManager import ExpectedUseManager
from api.models.mixins.DisplayOrder import DisplayOrder
from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class ExpectedUse(Auditable, DisplayOrder, EffectiveDates):
    """
    Different options for the Expected Use column in Schedule C
    """
    description = models.CharField(
        max_length=100,
        unique=True,
        db_comment="Description on what the fuel is going to be used for."
    )

    objects = ExpectedUseManager()

    class Meta:
        db_table = 'expected_use_type'

    db_table_comment = "Look up table that will contain values for the " \
                       "Expected Use column in Schedule C." \
                       "It's suppose to classify what the fuel type is " \
                       "going to be used for. e.g. Heating Oil, Aviation, " \
                       "Department of National Defence, etc."
