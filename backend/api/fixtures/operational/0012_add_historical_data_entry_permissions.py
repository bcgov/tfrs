from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.Permission import Permission
from api.models.Role import Role
from api.models.RolePermission import RolePermission


class AddHistoricalDataEntryPermissions(OperationalDataScript):
    """
    Adds a new permission called Use Historical Data Entry and add it
    to Government Analyst and Government Director
    """
    comment = 'Add Use Historical Data Entry and assign it to Government roles'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        permission = Permission.objects.create(
            code="USE_HISTORICAL_DATA_ENTRY",
            name="Use Historical Data Entry",
            description="Allows the user to use the functions of "
                        "Historical Data Entry"
        )

        RolePermission.objects.create(
            role=Role.objects.get(name="GovUser"),
            permission=permission
        )

        RolePermission.objects.create(
            role=Role.objects.get(name="GovDirector"),
            permission=permission
        )

script_class = AddHistoricalDataEntryPermissions
