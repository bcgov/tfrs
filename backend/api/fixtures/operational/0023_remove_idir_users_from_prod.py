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
        user_list = [
            "internal_bfinn",
            "internal_datrinid",
            "internal_kadougla",
            "internal_mahall",
            "internal_rpersram"
            "user1548979655487"
        ]

        NotificationMessage.objects.filter(
            user__username__in=user_list
        ).delete()

        User.objects.filter(
            username__in=user_list
        ).delete()


script_class = RemoveIDIRUsers
