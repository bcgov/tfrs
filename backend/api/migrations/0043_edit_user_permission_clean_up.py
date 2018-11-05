from django.db import migrations
from django.db.migrations import RunPython


def update_permissions(apps, schema_editor):
    """
    Removes similar looking permissions to remove
    redundancy
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', "Permission")
    role = apps.get_model('api', "Role")
    role_permission = apps.get_model('api', "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "ADD_FS_USER",
            "EDIT_FUEL_SUPPLIER_USERS"
        ]).delete()

    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "USER_MANAGEMENT"
        ],
        role__name__in=[
            "GovUser",
            "GovDirector",
            "GovDeputyDirector"
        ]).delete()

    role_permission.objects.using(db_alias).create(
        role=role.objects.using(db_alias).get(name="FSAdmin"),
        permission=permission.objects.using(db_alias).get(
            code="USER_MANAGEMENT")
    )

    permission.objects.using(db_alias).filter(
        code__in=[
            "ADD_FS_USER",
            "EDIT_FUEL_SUPPLIER_USERS"
        ]
    ).delete()

    permission.objects.using(db_alias).filter(
        code="EDIT_FUEL_SUPPLIERS"
    ).update(
        name="Edit Organization Information",
        description="Allows the user to create and update organizations"
    )


def revert_permissions(apps, schema_editor):
    """
    Adds the permissions back
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', "Permission")
    role = apps.get_model('api', "Role")
    role_permission = apps.get_model('api', "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "USER_MANAGEMENT"
        ],
        role__name__in=[
            "FSAdmin"
        ]).delete()

    permission.objects.using(db_alias).bulk_create([
        permission(
            code="ADD_FS_USER",
            description="Add Fuel Supplier User",
            name="Add Fuel Supplier User"
        ),
        permission(
            code="EDIT_FUEL_SUPPLIER_USERS",
            description="Add Fuel Supplier User",
            name="Edit Fuel Supplier Users' Information"
        )
    ])

    role_permission.objects.using(db_alias).bulk_create([
        role_permission(
            role=role.objects.using(db_alias).get(name="GovUser"),
            permission=permission.objects.using(db_alias).get(
                code="USER_MANAGEMENT")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="GovDirector"),
            permission=permission.objects.using(db_alias).get(
                code="USER_MANAGEMENT")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="GovDeputyDirector"),
            permission=permission.objects.using(db_alias).get(
                code="USER_MANAGEMENT")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="FSAdmin"),
            permission=permission.objects.using(db_alias).get(
                code="ADD_FS_USER")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="Admin"),
            permission=permission.objects.using(db_alias).get(
                code="EDIT_FUEL_SUPPLIER_USERS")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="GovUser"),
            permission=permission.objects.using(db_alias).get(
                code="EDIT_FUEL_SUPPLIER_USERS")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="GovDirector"),
            permission=permission.objects.using(db_alias).get(
                code="EDIT_FUEL_SUPPLIER_USERS")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="FSAdmin"),
            permission=permission.objects.using(db_alias).get(
                code="EDIT_FUEL_SUPPLIER_USERS")
        )
    ])

    permission.objects.using(db_alias).filter(
        code="EDIT_FUEL_SUPPLIERS"
    ).update(
        name="Edit Fuel Suppliers",
        description="Gives the user access to create and update "
                    "fuel suppliers"
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0042_update_credit_trader_role_description'),
    ]

    operations = [
        RunPython(update_permissions, revert_permissions)
    ]
