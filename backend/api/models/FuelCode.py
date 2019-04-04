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
from django.db.models import PROTECT

from auditable.models import Auditable

from api.models.FuelCodeStatus import FuelCodeStatus


class FuelCode(Auditable):
    """
    Fuel codes for the Secure Document Upload
    """
    fuel_code = models.CharField(
        default="BCLCF",
        max_length=10,
        db_comment="Low Carbon Fuel Code [1st Part] (eg BCLCF in BCLCF101.4)"
    )
    fuel_code_version = models.IntegerField(
        db_comment="Low Carbon Fuel Code [2nd Part] (eg 101 in BCLCF101.4)"
    )
    fuel_code_version_minor = models.IntegerField(
        blank=False,
        default=0,
        null=False,
        db_comment="Low Carbon Fuel Code [3rd Part] (eg 4 in BCLCF101.4)"
    )
    company = models.CharField(
        max_length=100,
        db_comment="Company that produces the fuel. Can be used in "
                   "Freeform Text"
                   "Auto-suggestion (Will contain repeat entries)."
                   "Not to be confused with the fuel suppliers."
    )
    carbon_intensity = models.DecimalField(
        blank=True,
        null=True,
        max_digits=5,
        decimal_places=2,
        default=None,
        db_comment="Number value in gCO2e/MJ; negative values are allowed."
    )
    application_date = models.DateField(
        blank=True,
        null=True,
        db_comment="Application Date; The date the fuel producer submitted "
                   "application."
    )
    effective_date = models.DateField(
        blank=True,
        null=True,
        db_comment="Effective Date; The date the approved field code "
                   "becomes effective."
    )
    expiry_date = models.DateField(
        blank=True,
        null=True,
        db_comment="Expiry Date; The date that the approved fiel code "
                   "expires"
    )
    fuel = models.ForeignKey('ApprovedFuel', blank=False, null=False, on_delete=PROTECT)
    feedstock = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Feedstock used to produce the fuel. "
                   "Freeform Text"
                   "Auto-suggestion (Will contain repeat entries)."
                   "e.g. Corn, used cooking oil, cow manure, etc."
    )
    feedstock_location = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Region where the feedstock originates."
                   "Freeform Text"
                   "Auto-suggestion (Will contain repeat entries)."
                   "e.g. US Central"
    )
    feedstock_misc = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Feedstock Miscellaneous."
                   "Unique aspects to the feedstock production process."
                   "Freeform Text"
                   "Auto-suggestion (Will contain repeat entries)."
                   "e.g. Methane capture, peat, no peat"
    )
    facility_location = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="City/State/Province/Country where the location of "
                   "fuel production facility."
    )
    facility_nameplate = models.IntegerField(
        blank=True,
        null=True,
        db_comment="Production capacity of the fuel production facility."
                   "How much they can produce in a year?"
    )
    feedstock_transport_mode = models.ManyToManyField(
        'TransportMode',
        through='FeedstockTransportMode',
        related_name='+'
    )
    fuel_transport_mode = models.ManyToManyField(
        'TransportMode',
        through='FuelTransportMode',
        related_name='+'
    )
    former_company = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Previous name of the fuel producer."
                   "If the fuel producer changes name or purchased"
    )
    approval_date = models.DateField(
        blank=True,
        null=True,
        db_comment="The date that the fuel pathway is approved by the "
                   "director."
    )
    status = models.ForeignKey(
        FuelCodeStatus,
        on_delete=models.PROTECT,
        null=False
    )

    class Meta:
        db_table = 'fuel_code'
        unique_together = (('fuel_code', 'fuel_code_version',
                            'fuel_code_version_minor'),)

    db_table_comment = "Fuel Codes." \
                       "List of recognized fuel pathways in BC" \
                       "This will be used by compliance reporting."
