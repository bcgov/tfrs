from django.db import migrations
from django.db.migrations import RunPython


def update_status(apps, schema_editor):
    """
    Updates the permissions and removes the create/edit fuel suppliers
    from Government Analyst and Director roles
    """
    db_alias = schema_editor.connection.alias

    status = apps.get_model("api", "CreditTradeStatus")

    status.objects.using(db_alias).filter(
        status="Approved"
    ).update(
        status="Recorded",
        description="The Credit Transfer has been has been recorded by "
                    "the Government Analyst"
    )

    status.objects.using(db_alias).filter(
        status="Completed"
    ).update(
        status="Approved",
        description="The Credit Transfer has been Approved and the Credit "
                    "Balance(s) of the Fuel Supplier(s) has been updated."
    )


def revert_status(apps, schema_editor):
    """
    Reverts the permission back to its previous state by assigning
    back the permission back to Government Analyst and Director
    """
    db_alias = schema_editor.connection.alias

    status = apps.get_model("api", "CreditTradeStatus")

    status.objects.using(db_alias).filter(
        status="Approved"
    ).update(
        status="Completed",
        description="The Credit Transfer has been Completed and the Credit "
                    "Balance(s) of the Fuel Supplier(s) has been updated."
    )

    status.objects.using(db_alias).filter(
        status="Recorded"
    ).update(
        status="Approved",
        description="The Credit Transfer has been has been approved by the "
                    "Director and will be Completed as soon as the Effective "
                    "Date of the Credit Trade has been reached."
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0035_add_assign_role_permissions'),
    ]

    operations = [
        RunPython(update_status, revert_status)
    ]
