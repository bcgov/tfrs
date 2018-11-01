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


class OrganizationBalance(Auditable):
    """
    Credit Trade Balance for the Fuel Supplier
    """
    organization = models.ForeignKey(
        'Organization',
        related_name='balances',
        on_delete=models.CASCADE)
    validated_credits = models.BigIntegerField(
        db_comment='The actual balance of validated Low Carbon Fuel credits held by a fuel supplier between the effective_date and the expiration_date. If expiration_date is NULL then we assume that it is the current balance.'
    )

    effective_date = models.DateField(
        blank=True, null=True, db_comment='The date and time that the referenced credit balance for an organization become valid')
    expiration_date = models.DateField(
        blank=True, null=True, db_comment='The date and time that the referenced credit balance for an organization become invalid (i.e. changed).')

    credit_trade = models.ForeignKey(
        'CreditTrade',
        related_name='balances',
        blank=True, null=True,
        on_delete=models.PROTECT)

    class Meta:
        db_table = 'organization_balance'

    db_table_comment = 'Represents a fuel supplier organization\'s credit balance at a given point in time. The government organization does not have an actual credit balance, but rather one was set artificially high to enable the awarding or validating of credits to fuel suppliers within TFRS.'
