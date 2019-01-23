from django.db import migrations
from django.db.migrations import RunPython


def rename_to_file_submission(apps, schema_editor):
    """
    Renames references of document upload to file submission
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')
    permission = apps.get_model('api', 'Permission')

    role.objects.using(db_alias).filter(
        name="FSDoc"
    ).update(
        description="File Submission (Government)"
    )

    role.objects.using(db_alias).filter(
        name="FSDocSubmit"
    ).update(
        description="File Submission"
    )

    role_permission.objects.using(db_alias).filter(
        permission__code="DOCUMENTS_CREATE_DRAFT",
        role__name="FSDoc"
    ).delete()

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_CREATE_DRAFT"
    ).update(
        name="Upload files into a draft state",
        description="Securely upload files and save as a draft (not visible "
                    "to Government)."
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_GOVERNMENT_REVIEW"
    ).update(
        name="Review file submissions",
        description="The ability to review file submissions (mark them as "
                    "reviewed status)."
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_SUBMIT"
    ).update(
        name="File Submissions",
        description="Securely upload and submit file."
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_VIEW"
    ).update(
        name="View file submissions",
        description="View and download file submissions that have been "
                    "securely uploaded."
    )


def revert_to_document_upload(apps, schema_editor):
    """
    Renames file submission references back to document upload
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')
    permission = apps.get_model('api', 'Permission')

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
        permission=permission.objects.using(db_alias).get(
            code="DOCUMENTS_CREATE_DRAFT"),
        role=role.objects.using(db_alias).get(name="FSDoc")
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_CREATE_DRAFT"
    ).update(
        name="Upload documents into a draft state",
        description="Securely upload documents and save as a draft (not "
                    "visible to Government)."
    )

    permission.objects.using(db_alias).filter(
        code="DOCUMENTS_GOVERNMENT_REVIEW"
    ).update(
        name="Review uploaded documents",
        description="The ability to review uploaded documents (mark them as "
                    "reviewed status)."
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
        description="View and download documents that have been securely "
                    "uploaded."
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0070_rename_credit_retirement'),
    ]

    operations = [
        RunPython(rename_to_file_submission,
                  revert_to_document_upload)
    ]
