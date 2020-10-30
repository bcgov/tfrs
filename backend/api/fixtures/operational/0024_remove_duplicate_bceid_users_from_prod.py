from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.NotificationMessage import NotificationMessage
from api.models.User import User
from api.models.UserCreationRequest import UserCreationRequest


class RemoveBCEIDUsers(OperationalDataScript):
    """
    Removes some of the duplicate BCEID users from prod
    """
    is_revertable = False
    comment = 'Removes some of the duplicate BCEID users from prod'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        users = UserCreationRequest.objects.filter(
            user_id__in=[123, 124, 125, 126, 128, 131, 158, 159]
        )

        for user in users:
            NotificationMessage.objects.filter(
                user_id=user.user_id
            ).delete()

            UserCreationRequest.objects.filter(
                user_id=user.user_id
            ).delete()

            User.objects.filter(
                id=user.user_id
            ).delete()


script_class = RemoveBCEIDUsers
