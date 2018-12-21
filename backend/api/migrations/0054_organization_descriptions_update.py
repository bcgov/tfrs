from django.db import migrations
from django.db.migrations import RunPython


def update_organization_descriptions(apps, schema_editor):
    """
    Updates the descriptions for Organization Status and Types
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    organization_actions_type = apps.get_model(
        'api', 'OrganizationActionsType')
    organization_status = apps.get_model('api', 'OrganizationStatus')
    organization_type = apps.get_model('api', 'OrganizationType')

    organization_actions_type.objects.using(db_alias).filter(
        the_type="Buy And Sell"
    ).update(
        description="Permitted to Buy and Sell Low Carbon Fuel Credits."
    )

    organization_actions_type.objects.using(db_alias).filter(
        the_type="Sell Only"
    ).update(
        description="Permitted to only Sell Low Carbon Fuel Credits."
    )

    organization_actions_type.objects.using(db_alias).filter(
        the_type="None"
    ).update(
        description="Not Permitted to Buy and Sell Low Carbon Fuel Credits."
    )

    organization_status.objects.using(db_alias).filter(
        status="Active").update(
            description="Active"
        )

    organization_status.objects.using(db_alias).filter(
        status="Archived").update(
            description="Inactive"
        )

    organization_type.objects.using(db_alias).filter(
        type="Part3FuelSupplier").update(
            description="Part 3 Fuel Supplier"
        )


def revert_organization_descriptions(apps, schema_editor):
    """
    Reverts the descriptions for Organization Status and Types
    """
    db_alias = schema_editor.connection.alias

    organization_actions_type = apps.get_model(
        'api', 'OrganizationActionsType')
    organization_status = apps.get_model('api', 'OrganizationStatus')
    organization_type = apps.get_model('api', 'OrganizationType')

    organization_actions_type.objects.using(db_alias).filter(
        the_type="Buy And Sell"
    ).update(
        description="An Organization permitted to both Buy and Sell "
                    "Low Carbon Credits."
    )

    organization_actions_type.objects.using(db_alias).filter(
        the_type="Sell Only"
    ).update(
        description="An Organization permitted to only to Sell Low "
                    "Carbon Credits."
    )

    organization_actions_type.objects.using(db_alias).filter(
        the_type="None"
    ).update(
        description="An Organization not currently permitted to "
                    "either Buy and Sell Low Carbon Credits."
    )

    organization_status.objects.using(db_alias).filter(
        status="Active").update(
            description="The Fuel Supplier is an active participant "
                        "in the Low Carbon Credits trading market."
        )

    organization_status.objects.using(db_alias).filter(
        status="Archived").update(
            description="The Fuel Supplier has been archived and is "
                        "no longer a participant in theLow Carbon "
                        "Credits trading market."
        )

    organization_type.objects.using(db_alias).filter(
        type="Part3FuelSupplier").update(
            description="A Part 3 Fuel Supplier who can do credit transfers"
        )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0053_auto_20181220_1644'),
    ]

    operations = [
        RunPython(update_organization_descriptions,
                  revert_organization_descriptions)
    ]
