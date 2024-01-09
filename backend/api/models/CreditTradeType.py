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

from api.managers.TheTypeManager import TheTypeManager
from api.models.mixins.DisplayOrder import DisplayOrder
from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class CreditTradeType(Auditable, DisplayOrder, EffectiveDates):
    """
    Holds the different types of Credit Trades and if they're only usable
    by government users only
    """
    the_type = models.CharField(
        max_length=25,
        blank=True,
        null=True,
        unique=True,
        db_comment='Enumerated value to describe the credit trade type.'
    )
    description = models.CharField(
        max_length=1000, blank=True, null=True,
        db_comment="Description of the credit trade type. This is the "
                   "displayed name."
    )

    is_gov_only_type = models.BooleanField(
        db_comment="Flag. True if only government users can create this type "
                   "of transfer."
    )

    objects = TheTypeManager()

    def natural_key(self):
        """
        Allows type 'description' (Sell, Buy, etc) to be used to identify
        a row in the table
        """
        return (self.the_type,)

    class Meta:
        db_table = 'credit_trade_type'

    db_table_comment = "Contains a list of credit transaction types, which " \
                       "are credit transfer, part 3 award, validation and " \
                       "reduction."

    @property
    def friendly_name(self):
        """
        Front-end language for the Credit Trade Type
        """
        if self.the_type in ["Buy", "Sell"]:
            return "Credit Transfer"

        if self.the_type == "Credit Reduction":
            return "Reduction"

        if self.the_type == "Credit Validation":
            return "Validation"
        
        if self.the_type == "Administrative Adjustment":
            return "Admin Adjustment"

        return self.the_type

    @property
    def notification_name(self):
        """
        Front-end language for the Credit Trade Type
        """
        if self.the_type in ["Buy", "Sell"]:
            return "Transfer"

        if self.the_type == "Credit Reduction" or self.the_type == "Credit Validation":
            return "Assessment"
        
        if self.the_type == "Administrative Adjustment":
            return "Admin Adjustment"
        
        if self.the_type == "Part 3 Award":
            return "Initiative Agreement"

        return self.the_type
