from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.TransactionType import TransactionType


class AddTransactionTypes(OperationalDataScript):
    """
    Adds Transaction Types
    """
    is_revertable = False
    comment = 'Adds Transaction Types'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        TransactionType.objects.create(
            the_type="Purchased",
            display_order="1",
            effective_date="2017-01-01"
        )
        TransactionType.objects.create(
            the_type="Sold",
            display_order="2",
            effective_date="2017-01-01"
        )

script_class = AddTransactionTypes
