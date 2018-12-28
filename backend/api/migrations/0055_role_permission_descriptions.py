from django.db import migrations
from django.db.migrations import RunPython


def update_permission_names(apps, schema_editor):
    """
    Updates the permission names so they make more sense
    when they're being displayed to the user.
    Shortens some of the Role names
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    permission.objects.using(db_alias).filter(
        code="APPROVE_CREDIT_TRANSFER"
    ).update(
        name="Approve Credit Transaction",
        description="The ability to make a statuatory decision by "
                    "approving a credit transaction (Credit Transfer "
                    "Proposal, Part 3 Award, Validation, and Reduction)."
    )

    permission.objects.using(db_alias).filter(
        code="ASSIGN_FS_ROLES"
    ).update(
        name="Assign Roles to Fuel Supplier Users",
        description="The ability to assign roles to the users within "
                    "an organization."
    )

    permission.objects.using(db_alias).filter(
        code="ASSIGN_GOVERNMENT_ROLES"
    ).update(
        name="Assign Government Roles",
        description="The ability to assign roles to government users."
    )

    permission.objects.using(db_alias).filter(
        code="DECLINE_CREDIT_TRANSFER"
    ).update(
        name="Decline to Approve Credit Transaction",
        description="The ability to make a statuatory decision by declining "
                    "to approve a credit transaction (Credit Transfer "
                    "Proposal, Part 3 Award, Validation, and Reduction)."
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_CREATE_DRAFT"
    ).update(
        name="Upload documents into a draft state",
        description="Securely upload documents and save as a draft "
                    "(not visible to Government)."
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_GOVERNMENT_REVIEW"
    ).update(
        name="Review uploaded documents",
        description="The ability to review uploaded documents (mark "
                    "them as reviewed status)."
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_SUBMIT"
    ).update(
        name="Upload documents",
        description="Securely upload and submit documents."
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_VIEW"
    ).update(
        name="View uploaded documents",
        description="View and download documents that have been "
                    "securely uploaded."
    )

    permission.objects.using(db_alias).filter(
        code="EDIT_COMPLIANCE_PERIODS"
    ).update(
        description="The ability to edit compliance periods."
    )

    permission.objects.using(db_alias).filter(
        code="EDIT_FUEL_SUPPLIERS"
    ).update(
        name="Organization Management",
        description="The ability to create and update organizations."
    )

    permission.objects.using(db_alias).filter(
        code="EDIT_PRIVILEGED_COMMENTS"
    ).update(
        description="The ability to create and update privileged comments "
                    "that are only visible to government users."
    )

    permission.objects.using(db_alias).filter(
        code="PROPOSE_CREDIT_TRANSFER"
    ).update(
        name="Create New Credit Transfer Proposal",
        description="The ability to create a new Credit Transfer Proposal. "
                    "For Government users, this permission grants the "
                    "ability to create a New Credit Transaction (Part 3 "
                    "Award, Validation, Reduction)."
    )

    permission.objects.using(db_alias).filter(
        code="RECOMMEND_CREDIT_TRANSFER"
    ).update(
        name="Recommend Credit Transactions",
        description="The ability to either recommend or not recommend "
                    "approval of a credit transaction (Credit Transfer "
                    "Proposal, Part 3 Award, Validation, and Reduction)."
    )

    permission.objects.using(db_alias).filter(
        code="REFUSE_CREDIT_TRANSFER"
    ).update(
        name="Refuse a Credit Transfer Proposal",
        description="The ability to refuse a Credit Transfer Proposal "
                    "sent to your organization by another fuel supplier."
    )

    permission.objects.using(db_alias).filter(
        code="RESCIND_CREDIT_TRANSFER"
    ).update(
        name="Rescind a Credit Transfer Proposal",
        description="The ability to rescind or otherwise cancel a Credit "
                    "Transfer Proposal. For Government users, this "
                    "permission grants the ability to recall a recommended "
                    "Credit Transaction (Part 3 Award, Validation, "
                    "Reduction) as draft."
    )

    permission.objects.using(db_alias).filter(
        code="SIGN_CREDIT_TRANSFER"
    ).update(
        name="Sign a Credit Transfer Proposal",
        description="The ability to sign and execute a Credit Transfer "
                    "Proposal."
    )

    permission.objects.using(db_alias).filter(
        code="USER_MANAGEMENT"
    ).update(
        description="The ability to add new users and edit existing users"
    )

    permission.objects.using(db_alias).filter(
        code="VIEW_APPROVED_CREDIT_TRANSFERS"
    ).update(
        name="View Recorded Credit Transactions",
        description="The ability to view queued or recorded transactions "
                    "within the Historical Data Entry tool prior to those "
                    "transactions being committed."
    )

    permission.objects.using(db_alias).filter(
        code="VIEW_CREDIT_TRANSFERS"
    ).update(
        name="View Credit Transactions",
        description="The ability to view credit transaction entries, "
                    "including Credit Transfer Proposals, Part 3 Awards, "
                    "Validations, and Reductions."
    )

    permission.objects.using(db_alias).filter(
        code="VIEW_FUEL_SUPPLIERS"
    ).update(
        name="View Fuel Supplier Information",
        description="The ability to view all fuel supplier information, "
                    "including sensitive information (e.g. credit balances)."
    )

    permission.objects.using(db_alias).filter(
        code="VIEW_PRIVILEGED_COMMENTS"
    ).update(
        description="The ability to view privileged comments (comments that "
                    "are only visible to government users)."
    )

    permission.objects.using(db_alias).filter(
        code="USE_HISTORICAL_DATA_ENTRY"
    ).update(
        description="Allows the user to enter credit transactions that "
                    "have already been approved outside of TFRS."
    )

    role.objects.using(db_alias).filter(
        name="FSDoc"
    ).update(
        description="Document Upload (Government)"
    )

    role.objects.using(db_alias).filter(
        name="FSDocSubmit"
    ).update(
        description="Document Upload"
    )

    role_permission.objects.using(db_alias).create(
        role=role.objects.using(db_alias).get(name="FSNoAccess"),
        permission=permission.objects.using(db_alias).get(
            code="LOGIN")
    )


def revert_permission_names(apps, schema_editor):
    """
    Reverts the names to their previous states
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    permission.objects.using(db_alias).filter(
        code="APPROVE_CREDIT_TRANSFER"
    ).update(
        name="Approve Transfer",
        description="Approve Transfer"
    )

    permission.objects.using(db_alias).filter(
        code="ASSIGN_FS_ROLES"
    ).update(
        name="Assign Fuel Supplier Roles",
        description="Allows the user to assign fuel supplier "
                    "roles to users"
    )

    permission.objects.using(db_alias).filter(
        code="ASSIGN_GOVERNMENT_ROLES"
    ).update(
        name="Assign Government Roles",
        description="Allows the user to assign government roles to users"
    )

    permission.objects.using(db_alias).filter(
        code="DECLINE_CREDIT_TRANSFER"
    ).update(
        name="Decline Transfer",
        description="Decline Transfer"
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_GOVERNMENT_REVIEW"
    ).update(
        name="Review documents",
        description="Government can accept documents for review"
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_CREATE_DRAFT"
    ).update(
        name="Submit draft documents",
        description="Submit secure documents with draft status"
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_SUBMIT"
    ).update(
        name="Submit documents",
        description="Submit secure documents"
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_VIEW"
    ).update(
        name="View documents",
        description="View secure documents"
    )

    permission.objects.using(db_alias).filter(
        code="EDIT_COMPLIANCE_PERIODS"
    ).update(
        description="Gives the user access to edit compliance periods"
    )

    permission.objects.using(db_alias).filter(
        code="EDIT_FUEL_SUPPLIERS"
    ).update(
        name="Edit Organization Information",
        description="Allows the user to create and update organizations"
    )

    permission.objects.using(db_alias).filter(
        code="EDIT_PRIVILEGED_COMMENTS"
    ).update(
        description="Create and Update Privileged Comments"
    )

    permission.objects.using(db_alias).filter(
        code="PROPOSE_CREDIT_TRANSFER"
    ).update(
        name="Propose Credit Transfer",
        description="Propose Credit Transfer"
    )

    permission.objects.using(db_alias).filter(
        code="RECOMMEND_CREDIT_TRANSFER"
    ).update(
        name="Recommend Credit Transfer",
        description="Recommend/Not Recommend Credit Transfer"
    )

    permission.objects.using(db_alias).filter(
        code="REFUSE_CREDIT_TRANSFER"
    ).update(
        name="Refuse Credit Transfer",
        description="Refuse Credit Transfer"
    )

    permission.objects.using(db_alias).filter(
        code="RESCIND_CREDIT_TRANSFER"
    ).update(
        name="Rescind Credit Transfer",
        description="Rescind Credit Transfer"
    )

    permission.objects.using(db_alias).filter(
        code="SIGN_CREDIT_TRANSFER"
    ).update(
        name="Sign Credit Transfer",
        description="Sign Credit Transfer"
    )

    permission.objects.using(db_alias).filter(
        code="USE_HISTORICAL_DATA_ENTRY"
    ).update(
        description="Allows the user to use the functions of Historical "
                    "Data Entry"
    )

    permission.objects.using(db_alias).filter(
        code="USER_MANAGEMENT"
    ).update(
        description="Gives the user access to the User Management screens"
    )

    permission.objects.using(db_alias).filter(
        code="VIEW_APPROVED_CREDIT_TRANSFERS"
    ).update(
        name="View Approved Credit Transfers",
        description="View Approved Credit Transfers"
    )

    permission.objects.using(db_alias).filter(
        code="VIEW_CREDIT_TRANSFERS"
    ).update(
        name="View Credit Transfers",
        description="View Credit Transfers"
    )

    permission.objects.using(db_alias).filter(
        code="VIEW_FUEL_SUPPLIERS"
    ).update(
        name="View Fuel Suppliers",
        description="View Fuel Suppliers"
    )

    permission.objects.using(db_alias).filter(
        code="VIEW_PRIVILEGED_COMMENTS"
    ).update(
        description="View (Read) Privileged Comments"
    )

    role.objects.using(db_alias).filter(
        name="FSDoc"
    ).update(
        description="A Fuel Supplier user with authority to view "
                    "documents and submit drafts."
    )

    role.objects.using(db_alias).filter(
        name="FSDocSubmit"
    ).update(
        description="A Fuel Supplier user with authority to submit documents"
    )

    role_permission.objects.using(db_alias).filter(
        role=role.objects.using(db_alias).get(name="FSNoAccess"),
        permission=permission.objects.using(db_alias).get(code="LOGIN")
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0054_organization_descriptions_update'),
    ]

    operations = [
        RunPython(update_permission_names,
                  revert_permission_names)
    ]
