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


class ApprovedFuelProvision(Auditable):
    """
    Cross-reference table to associate the provision, fuel type and the
    determination method to get the carbon intensity.
    """
    fuel = models.ForeignKey(
        'ApprovedFuel',
        on_delete=models.PROTECT
    )

    provision_act = models.ForeignKey(
        'ProvisionOfTheAct',
        on_delete=models.PROTECT
    )

    determination_type = models.ForeignKey(
        'CarbonIntensityDeterminationType',
        on_delete=models.PROTECT
    )

    class Meta:
        db_table = 'carbon_intensity_fuel_determination'
        unique_together = (('fuel', 'provision_act', 'determination_type'),)

    db_table_comment = "Cross-reference table to associate the provision, " \
                       "fuel type and the determination method to get the " \
                       "carbon intensity." \
                       "This should contain the information needed to get " \
                       "the Carbon Intensity Record."
