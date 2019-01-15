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

from api.models.Document import Document
from auditable.models import Auditable


class DocumentMilestone(Auditable):
    """
    Holds the credit trade proposal information between the
    organizations
    """
    document = models.ForeignKey(
        Document,
        related_name='milestones',
        on_delete=models.PROTECT,
        null=False
    )

    agreement_name = models.CharField(
        blank=True, max_length=1000, null=True,
    )

    milestone = models.CharField(
        blank=True, max_length=1000, null=True,
        db_comment="Record section of agreement containing milestone."
    )

    class Meta:
        db_table = 'document_milestone'

    db_table_comment = "Extension of the Document File for Milestone " \
                       "attachment types."
