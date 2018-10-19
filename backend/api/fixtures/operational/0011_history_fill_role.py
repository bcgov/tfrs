from django.db import transaction
from django.db.models import Q

from api.management.data_script import OperationalDataScript
from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.Role import Role


class HistoryFillRole(OperationalDataScript):
    """
    Fills in the user_role_id column for the credit trade history
    if its empty
    """
    is_revertable = False
    comment = 'Fill empty roles in Credit Trade History with Director'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        gov_director_role = Role.objects.get(name="GovDirector")

        # 6, 7 Approved/Completed for older systems
        # Recorded/Approved for newer systems
        # We need to hardcode this as the name might change and
        # this is for older history records that dont have any roles
        # attached
        CreditTradeHistory.objects.filter(
            user_role_id=None,
            status_id__in=[6, 7]
        ).update(
            user_role_id=gov_director_role
        )

script_class = HistoryFillRole
