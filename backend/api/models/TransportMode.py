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

from api.managers.TransportModeManager import TransportModeManager
from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class TransportMode(Auditable, EffectiveDates):
    """
    Fuel transport modes
    """
    name = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        unique=True,
        db_comment="Transport mode name"
    )

    objects = TransportModeManager()

    def natural_key(self):
        """
        Allows type 'name' to be used to identify
        a row in the table
        """
        return (self.name,)

    class Meta:
        db_table = 'fuel_transport_mode_type'

    db_table_comment = "List of transportation modes available " \
                       "for fuel or feedstock (eg Truck, Rail) as part of " \
                       "a fuel code definition"


class FeedstockTransportMode(Auditable):
    """
    Feedstock transport mode relationship table
    """
    transport_mode = models.ForeignKey(
        'TransportMode',
        on_delete=models.PROTECT
    )

    fuel_code = models.ForeignKey(
        'FuelCode',
        on_delete=models.PROTECT
    )

    class Meta:
        db_table = 'feedstock_transport_mode_fuel_code'

    db_table_comment = "Maintains a many-to-many relationship between the fuel code " \
                       "table and transport mode table to capture the fuel code feedstock " \
                       "transport mode."


class FuelTransportMode(Auditable):
    """
    Finished fuel transport mode relationship table
    """
    transport_mode = models.ForeignKey(
        'TransportMode',
        on_delete=models.PROTECT
    )

    fuel_code = models.ForeignKey(
        'FuelCode',
        on_delete=models.PROTECT
    )

    class Meta:
        db_table = 'fuel_transport_mode_fuel_code'

    db_table_comment = "Maintains a many-to-many relationship between the fuel code " \
                       "table and transport mode table to capture the fuel code finished fuel " \
                       "transport mode."

