from django.db import migrations
from django.db.migrations import RunPython


def update_permissions(apps, schema_editor):
    """
    Updates the permissions and removes the create/edit fuel suppliers
    from Government Analyst and Director roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    notification_subscription = apps.get_model("api", "NotificationSubscription")
    permission.objects.using(db_alias).filter(
        code="VIEW_CREDIT_TRANSFERS"
    ).update(
        name="View compliance unit transactions",
        description="View compliance unit transactions"
    )

    permission.objects.using(db_alias).filter(
        code="VIEW_APPROVED_CREDIT_TRANSFERS"
    ).update(
        name="View recorded compliance unit transactions",
        description="view compliance unit transactions within the Historical "
                    "Data Entry tool prior to them being committed"
    )

    permission.objects.using(db_alias).filter(
        code="CREDIT_CALCULATION_MANAGE"
    ).update(
        name="Edit compliance unit calculation values",
        description="edit values used in compliance unit calculation formula"
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_LINK_TO_CREDIT_TRADE"
    ).update(
        name="Link file submissions to compliance unit transactions",
        description="establish link between file submissions and compliance unit transactions"
    )

    permission.objects.using(db_alias).filter(
        code="RECOMMEND_CREDIT_TRANSFER"
    ).update(
        name="Recommend Credit transfers and Initiative Agreement submissions",
        description="Make recommendations to the director for Credit transfers and Initiative Agreement submissions"
    )

    permission.objects.using(db_alias).filter(
        code="APPROVE_CREDIT_TRANSFER"
    ).update(
        name="Record credit transfers and issue credits under Initiative Agreements",
        description="Record credit transfers and issue credits under Initiative Agreements"
    )

    permission.objects.using(db_alias).filter(
        code="DECLINE_CREDIT_TRANSFER"
    ).update(
        name="Decline credit transfers Initiative Agreement submissions",
        description="Decline to record credit transfers and decline to issue credits under Initiative Agreements"
    )

    permission.objects.using(db_alias).filter(
        code="PROPOSE_CREDIT_TRANSFER"
    ).update(
        name="Create new credit transfer",
        description="Create new credit transfer"
    )

    permission.objects.using(db_alias).filter(
        code="RESCIND_CREDIT_TRANSFER"
    ).update(
        name="Rescind a credit transfer",
        description="Rescind a credit transfer sent to another organization"
    )

    permission.objects.using(db_alias).filter(
        code="CREDIT_CALCULATION_VIEW"
    ).update(
        name="View compliance unit calculation values",
        description="View values used in compliance unit calculation formula"
    )

    permission.objects.using(db_alias).filter(
        code="REFUSE_CREDIT_TRANSFER"
    ).update(
        name="Refuse a credit transfer",
        description="Refuse a credit transfer proposed by another organization"
    )

    permission.objects.using(db_alias).filter(
        code="SIGN_CREDIT_TRANSFER"
    ).update(
        name="Propose and accept credit transfers",
        description="Propose and accept credit transfers"
    )

    permission.objects.using(db_alias).filter(
        code="USE_HISTORICAL_DATA_ENTRY"
    ).update(
        name="Use Historical Data Entry",
        description="Record compliance unit transactions approved outside of TFRS"
    )

def revert_permissions(apps, schema_editor):
    """
    Reverts the permission back to its previous state by assigning
    back the permission back to Government Analyst and Director
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    permission.objects.using(db_alias).filter(
        code="VIEW_CREDIT_TRANSFERS"
    ).update(
        name="View credit transactions",
        description="View credit transactions"
    )

    permission.objects.using(db_alias).filter(
        code="VIEW_APPROVED_CREDIT_TRANSFERS"
    ).update(
        name="View recorded credit transactions",
        description="view credit transactions within the Historical "
                    "Data Entry tool prior to them being committed"
    )

    permission.objects.using(db_alias).filter(
        code="CREDIT_CALCULATION_MANAGE"
    ).update(
        name="Edit credit calculation values",
        description="edit values used in credit calculation formula"
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_LINK_TO_CREDIT_TRADE"
    ).update(
        name="Link file submissions to Part 3 Awards",
        description="establish link between file submissions and Part 3 Awards"
    )

    permission.objects.using(db_alias).filter(
        code="RECOMMEND_CREDIT_TRANSFER"
    ).update(
        name="Recommend Credit Transfer Proposals and Part 3 Awards",
        description="recommend or not recommend approval of Credit Transfer Proposals and Part 3 Awards"
    )

    permission.objects.using(db_alias).filter(
        code="APPROVE_CREDIT_TRANSFER"
    ).update(
        name="Approve credit transfer proposals and Part 3 Awards",
        description="approve credit transfer proposals and Part 3 Awards"
    )

    permission.objects.using(db_alias).filter(
        code="DECLINE_CREDIT_TRANSFER"
    ).update(
        name="Decline to approve credit transfer proposals and Part 3 Awards",
        description="decline credit transfer proposals and Part 3 Awards"
    )

    permission.objects.using(db_alias).filter(
        code="PROPOSE_CREDIT_TRANSFER"
    ).update(
        name="Create New Credit Transfer Proposal",
        description="create new credit transfer proposal"
    )

    permission.objects.using(db_alias).filter(
        code="RESCIND_CREDIT_TRANSFER"
    ).update(
        name="Rescind a credit transfer proposal",
        description="rescind a credit transfer proposal sent to another organization"
    )

    permission.objects.using(db_alias).filter(
        code="CREDIT_CALCULATION_VIEW"
    ).update(
        name="View credit calculation values",
        description="view values used in credit calculation formula"
    )

    permission.objects.using(db_alias).filter(
        code="REFUSE_CREDIT_TRANSFER"
    ).update(
        name="Refuse a credit transfer proposal",
        description="refuse a credit transfer proposal received from another organization"
    )

    permission.objects.using(db_alias).filter(
        code="SIGN_CREDIT_TRANSFER"
    ).update(
        name="Propose and accept credit transfer proposals",
        description="propose and accept credit transfer proposals"
    )

    permission.objects.using(db_alias).filter(
        code="USE_HISTORICAL_DATA_ENTRY"
    ).update(
        name="Use Historical Data Entry",
        description="Record credit transactions approved outside of TFRS"
    )

class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0014_update_trade_effective_dates'),
    ]

    operations = [
        RunPython(update_permissions, revert_permissions)
    ]