from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.SigningAuthorityAssertion import SigningAuthorityAssertion


class DeleteInitialSigningAuthorityAssertion(OperationalDataScript):

    is_revertable = False
    comment = 'Remove initial auto-generated signing assertion'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        SigningAuthorityAssertion.objects.get(description='Auto-generated initial signing authority assertion').delete()


script_class = DeleteInitialSigningAuthorityAssertion
