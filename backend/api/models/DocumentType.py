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

from api.managers.DocumentTypeManager import DocumentTypeManager
from api.models.DocumentCategory import DocumentCategory
from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class DocumentType(Auditable, EffectiveDates):
    """
    Contains a list of types used to classify a document.
    """
    the_type = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        unique=True,
        db_comment="Short descriptive name of the document type."
    )

    description = models.CharField(
        max_length=1000, blank=True, null=True,
        db_comment="Description of the document type. This is the "
                   "displayed name."
    )

    category = models.ForeignKey(
        DocumentCategory,
        blank=False,
        null=False,
        unique=False,
        related_name='types'
    )

    objects = DocumentTypeManager()

    def natural_key(self):
        """
        Allows type 'description' (Application, Evidence, etc.) to be used to
        identify a row in the table
        """
        return (self.the_type,)

    class Meta:
        db_table = 'document_type'

    db_table_comment = "Contains a list of types used to classify a " \
                       "document such as P3A Application, " \
                       "Milestone Evidence, Fuel Supply Records, etc."
