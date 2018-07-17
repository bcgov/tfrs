"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel Requirements Regulation.

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
    status = models.CharField(max_length=25, blank=True, null=True, unique=True)
    description = models.CharField(max_length=4000, blank=True, null=True)
    effective_date = models.DateField(blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)
    display_order = models.IntegerField()

    objects = CreditTradeStatusManager()

    def natural_key(self):
        return (self.status,)

    class Meta:
        db_table = 'credit_trade_status'

    @property
    def action(self):
        if self.status == 'Draft':
            return 'Save Draft'
        elif self.status == 'Submitted':
            return 'Propose'
        elif self.status == 'Accepted':
            return 'Accept'
        elif self.status == 'Cancelled':
            return 'Cancel'
        elif self.status == 'Recommended':
            return 'Recommend for Approval'
        elif self.status == 'Approved':
            return 'Approve'
        elif self.status == 'Declined':
            return 'Decline to Approve'
        elif self.status == 'Refused':
            return 'Refuse'
