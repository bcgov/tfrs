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


class ApprovedFuelClass(Auditable):
    """
    Approved Fuel to Fuel Class relationship
    """
    fuel = models.ForeignKey(
        'ApprovedFuel',
        related_name='approved_fuel_class',
        on_delete=models.PROTECT
    )

    fuel_class = models.ForeignKey(
        'FuelClass',
        related_name='approved_fuel_class',
        on_delete=models.PROTECT
    )

    class Meta:
        db_table = 'approved_fuel_class'

    db_table_comment = "Maintains the relationship between the fuel type " \
                       "and the fuel class "
