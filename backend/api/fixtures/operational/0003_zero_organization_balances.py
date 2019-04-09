from datetime import datetime

from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.Organization import Organization
from api.models.OrganizationBalance import OrganizationBalance


class LoadOrganizationBalances(OperationalDataScript):

    comment = 'Set a zero-balance for all organizations with no existing balance objects'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        for org in Organization.objects.all():
            balance = OrganizationBalance.objects.filter(organization=org).first()
            if balance is None:
                print('{org.name} has no balance object. creating one with zero balance'.format(org=org))
                OrganizationBalance(organization=org,
                                    validated_credits=0,
                                    credit_trade=None,
                                    effective_date=datetime.today().strftime('%Y-%m-%d')).save()


script_class = LoadOrganizationBalances