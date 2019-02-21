from django.db import migrations
from django.db.migrations import RunPython


def rename_to_credit_reduction(apps, schema_editor):
    """
    Renames transaction type: Credit Retirement to Credit Reduction
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    credit_trade_type = apps.get_model('api', 'CreditTradeType')

    credit_trade_type.objects.using(db_alias).filter(
        the_type="Credit Retirement"
    ).update(
        the_type="Credit Reduction"
    )


def revert_to_credit_retirement(apps, schema_editor):
    """
    Renames transaction type: Credit Reduction back to Credit Retirement
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    credit_trade_type = apps.get_model('api', 'CreditTradeType')

    credit_trade_type.objects.using(db_alias).filter(
        the_type="Credit Reduction"
    ).update(
        the_type="Credit Retirement"
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0069_remove_documenthistory_user_role'),
    ]

    operations = [
        RunPython(rename_to_credit_reduction,
                  revert_to_credit_retirement)
    ]
