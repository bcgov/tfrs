from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.NotificationMessage import NotificationMessage
from api.models.User import User


class RemoveIDIRUsers(OperationalDataScript):
    """
    Removes some of the IDIR users from prod
    """
    is_revertable = False
    comment = 'Removes some of the IDIR users from prod'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        pass


script_class = RemoveIDIRUsers
