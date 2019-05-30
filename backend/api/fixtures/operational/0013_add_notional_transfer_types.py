from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.NotionalTransferType import NotionalTransferType


class AddNotionalTransferTypes(OperationalDataScript):
    """
    Adds Notional Transfer Types
    """
    is_revertable = False
    comment = 'Adds Notional Transfer Types'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        NotionalTransferType.objects.create(
            the_type="Received",
            display_order="1",
            effective_date="2017-01-01"
        )
        NotionalTransferType.objects.create(
            the_type="Transferred",
            display_order="2",
            effective_date="2017-01-01"
        )

script_class = AddNotionalTransferTypes
