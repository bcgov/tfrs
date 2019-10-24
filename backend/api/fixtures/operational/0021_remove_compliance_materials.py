from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.DocumentType import DocumentType


class UpdateDocumentType(OperationalDataScript):
    """
    Remove Compliance Report Materials
    """
    is_revertable = False
    comment = "Expires Compliance Reporting Materials in Document Type"

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        DocumentType.objects.filter(
            the_type="Records"
        ).update(
            expiration_date="2017-01-01"
        )

script_class = UpdateDocumentType
