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
        user_list = [
            "idemitsuapollo",
            "iacdavid",
            "BHumphreys",
            "DHudema",
            "GBhatia",
            "GBhatia2",
            "KMack",
            "SStener"
        ]

        users = UserCreationRequest.objects.filter(
            external_username__in=user_list
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
