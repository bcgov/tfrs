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
from api.managers.CreditTradeStatusManager import CreditTradeStatusManager


class CreditTradeStatus(Auditable):
    """
    Possible states that a credit transfer may be in.
    Application logic is couplied tightly to this table.
    """
    status = models.CharField(
        max_length=25,
        blank=True,
        null=True,
        unique=True,
        db_comment="Contains an enumerated value to describe the credit trade status."
                   "This is a unique natural key."
    )
    description = models.CharField(
        max_length=4000, blank=True, null=True, db_comment='Description of the credit trade status. This is the displayed name.')
    display_order = models.IntegerField(
        db_comment='Relative rank in display sorting order')
    effective_date = models.DateField(
        blank=True, null=True, db_comment='The calendar date the credit trade status type value became valid.')
    expiration_date = models.DateField(
        blank=True, null=True, db_comment='The calendar date the credit trade status type value is no longer valid.')

    objects = CreditTradeStatusManager()

    def natural_key(self):
        """
        Allows status 'name' (Draft, Accepted, etc) to be used to identify
        a row in the table
        """
        return (self.status,)

    class Meta:
        db_table = 'credit_trade_status'

    @property
    def action(self):
        if self.status == "Draft":
            return "Save Draft"
        elif self.status == "Submitted":
            return "Propose"
        elif self.status == "Accepted":
            return "Accept"
        elif self.status == "Cancelled":
            return "Cancel"
        elif self.status == "Recommended":
            return "Recommend for Approval"
        elif self.status == "Approved":
            return "Approve"
        elif self.status == "Declined":
            return "Decline to Approve"
        elif self.status == "Refused":
            return "Refuse"

    @property
    def friendly_name(self):
        """
        Front-end language for the Credit Trade Status
        """
        if self.status == "Accepted":
            return "Signed 2/2"
        elif self.status == "Cancelled":
            return "Deleted"
        elif self.status == "Approved":
            return "Approved"
        elif self.status in ["Not Recommended", "Recommended"]:
            return "Reviewed"
        elif self.status == "Recorded":
            return "Recorded"
        elif self.status == "Refused":
            return "Refused"
        elif self.status == "Submitted":
            return "Signed 1/2"

        return self.status

    db_table_comment = "Contains a list of statuses that a credit transfer " \
                       "proposal may be in. For example; Approved, " \
                       "Declined, Rescinded, etc. Note: application logic " \
                       "is tightly coupled to this table; therefore, " \
                       "changes to the enumerated values should be done " \
                       "with caution."
