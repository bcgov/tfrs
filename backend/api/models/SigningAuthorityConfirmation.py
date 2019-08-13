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


class SigningAuthorityConfirmation(Auditable):
    """
    Contains a history of assertions having been accepted by the officer or
    employee of the fuel supplier(s) (i.e. signing authority) of a Credit
    Transfer Proposal, a Compliance Report, or an Exclusion Report.
    """
    has_accepted = models.BooleanField(
        db_comment='Flag. True if the associated confirmation was accepted.'
    )
    credit_trade = models.ForeignKey(
        'CreditTrade',
        null=True,
        related_name='confirmations',
        on_delete=models.DO_NOTHING
    )
    compliance_report = models.ForeignKey(
        'ComplianceReport',
        null=True,
        related_name='confirmations',
        on_delete=models.DO_NOTHING
    )
    signing_authority_assertion = models.ForeignKey(
        'SigningAuthorityAssertion',
        related_name='confirmations',
        on_delete=models.PROTECT
    )
    title = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Title of the user who acccepted the assertion."
    )

    class Meta:
        db_table = 'signing_authority_confirmation'

    db_table_comment = "Contains a history of assertions having been " \
                       "accepted by the officer or employee of the fuel " \
                       "supplier(s) (i.e. signing authority) of a Credit " \
                       "Transfer Proposal, a Compliance Report, or an " \
                       "Exclusion Report."
