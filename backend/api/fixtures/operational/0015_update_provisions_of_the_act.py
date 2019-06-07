from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.ProvisionOfTheAct import ProvisionOfTheAct


class UpdateProvisionsOfTheAct(OperationalDataScript):
    """
    Updates the effective dates for the provisions of the act,
    so it follows our pattern with the other credit calculation
    tables
    """
    is_revertable = False
    comment = 'Updates the Provisions of the Act effective dates and order'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        provisions = ProvisionOfTheAct.objects.order_by('description')
        display_order = 1

        for provision in provisions:
            provision.display_order = display_order
            provision.effective_date = "2017-01-01"
            provision.expiration_date = None
            provision.save()

            display_order += 1

script_class = UpdateProvisionsOfTheAct
