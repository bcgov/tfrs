
from django.db import migrations, connection
from datetime import datetime
from api.models.NotificationChannel import NotificationChannel
from collections import namedtuple


def create_initial_data_0023(apps, schema_editor):
    """Load initial data (previously stored in fixtures)
    This is for core (essential) data only -- operational data should be inserted with scripts

    This script is designed to look for existing data and add any missing elements, without
    disrupting existing data, or load a database from nothing (as for testing)

    It is idempotent and irreversible
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately versioned
    # for this migration (so this shouldn't ever need to be maintained if fields change)
    permission = apps.get_model("api", "Permission")
    ct_status = apps.get_model("api", "CreditTradeStatus")
    ct_type = apps.get_model("api", "CreditTradeType")
    ct_zero_reason = apps.get_model("api", "CreditTradeZeroReason")
    org_actions_type = apps.get_model("api", "OrganizationActionsType")
    org_type = apps.get_model("api", "OrganizationType")
    org_status = apps.get_model("api", "OrganizationStatus")
    role = apps.get_model("api", "Role")
    org = apps.get_model("api", "Organization")
    org_balance = apps.get_model("api", "OrganizationBalance")
    role_permission = apps.get_model("api", "RolePermission")
    signing_authority_assertion = apps.get_model("api", "SigningAuthorityAssertion")
    compliance_period = apps.get_model("api", "CompliancePeriod")

    permissions = [
        permission(code='LOGIN', name='LOGIN',
                   description='A minimum permission needed for an authenticated user to access the system.'),
        permission(code='ADMIN', name='System Administrator',
                   description='Gives the user System Administration power in the system. Assignment of this permission should go to a very limited set of users an an as needed/backup basis.'),
        permission(code='USER_MANAGEMENT', name='User Management',
                   description='Gives the user access to the User Management screens'),
        permission(code='ROLES_AND_PERMISSIONS', name='Roles and Permissions',
                   description='Gives the user access to the Roles and Permissions screens'),
        permission(code='ADD_FS_USER', name='Add Fuel Supplier User', description='Add Fuel Supplier User'),
        permission(code='VIEW_APPROVED_CREDIT_TRANSFERS', name='View Approved Credit Transfers',
                   description='View Approved Credit Transfers'),
        permission(code='VIEW_CREDIT_TRANSFERS', name='View Credit Transfers', description='View Credit Transfers'),
        permission(code='VIEW_FUEL_SUPPLIERS', name='View Fuel Suppliers', description='View Fuel Suppliers'),
        permission(code='EDIT_FUEL_SUPPLIERS', name='Edit Fuel Suppliers', description='Gives the user access to create and update Fuel Suppliers'),
        permission(code='PROPOSE_CREDIT_TRANSFER', name='Propose Credit Transfer',
                   description='Propose Credit Transfer'),
        permission(code='RESCIND_CREDIT_TRANSFER', name='Rescind Credit Transfer',
                   description='Rescind Credit Transfer'),
        permission(code='REFUSE_CREDIT_TRANSFER', name='Refuse Credit Transfer', description='Refuse Credit Transfer'),
        permission(code='SIGN_CREDIT_TRANSFER', name='Sign Credit Transfer', description='Sign Credit Transfer'),
        permission(code='RECOMMEND_CREDIT_TRANSFER', name='Recommend Credit Transfer',
                   description='Recommend/Not Recommend Credit Transfer'),
        permission(code='DECLINE_CREDIT_TRANSFER', name='Decline Transfer', description='Decline Transfer'),
        permission(code='APPROVE_CREDIT_TRANSFER', name='Approve Transfer', description='Approve Transfer'),
        permission(code='VIEW_PRIVILEGED_COMMENTS', name='View Privileged Comments',
                   description='Gives the user access to view privileged comments'),
        permission(code='EDIT_PRIVILEGED_COMMENTS', name='Edit Privileged Comments',
                   description='Gives the user access to edit privileged comments'),
        permission(code='VIEW_COMPLIANCE_PERIODS', name='View Compliance Periods',
                   description='Gives the user access to view compliance periods'),
        permission(code='EDIT_COMPLIANCE_PERIODS', name='Edit Compliance Periods',
                   description='Gives the user access to edit compliance periods')
    ]

    for new_permission in permissions:
        if not permission.objects.using(db_alias).filter(code=new_permission.code).exists():
            permission.objects.using(db_alias).bulk_create([new_permission])
        else:
            print('skipping existing permission {}'.format(new_permission.code))

    ct_statuses = [
        ct_status(id=1, status='Draft',
                  description='The Credit Transfer has been created but is only visible to the initiating organization.',
                  display_order=1, effective_date='2017-01-01'),
        ct_status(id=2, status='Submitted',
                  description='The Credit Transfer Proposal has been created and is visible to both the initiating and responding Fuel Suppliers, and is waiting on the response from the Respondent.',
                  display_order=2, effective_date='2017-01-01'),
        ct_status(id=3, status='Accepted',
                  description='The Credit Transfer has been accepted by the Respondent and is waiting on approval by the Director.',
                  display_order=3, effective_date='2017-01-01'),
        ct_status(id=4, status='Recommended',
                  description='The Credit Transfer has been has been reviewed by a Government Analyst and is Recommended for Approval  by the Director.',
                  display_order=4, effective_date='2017-01-01'),
        ct_status(id=5, status='Not Recommended',
                  description='The Credit Transfer has been has been reviewed by a Government Analyst and is Not Recommended for Approval by the Director.',
                  display_order=4, effective_date='2017-01-01'),
        ct_status(id=6, status='Approved',
                  description='The Credit Transfer has been has been approved by the Director and will be Completed as soon as the Effective Date of the Credit Trade has been reached.',
                  display_order=5, effective_date='2017-01-01'),
        ct_status(id=7, status='Completed',
                  description='The Credit Transfer has been Completed and the Credit Balance(s) of the Fuel Supplier(s) has been updated.',
                  display_order=6, effective_date='2017-01-01'),
        ct_status(id=8, status='Cancelled',
                  description='The Credit Transfer has been cancelled by one of the participants in the Credit Trade. Shows up as Rescinded or Refused.',
                  display_order=7, effective_date='2017-01-01'),
        ct_status(id=9, status='Declined', description='The Credit Transfer has been rejected by the Director.',
                  display_order=8, effective_date='2017-01-01'),
        ct_status(id=10, status='Refused', description='The Credit Transfer has been refused by the Respondent.',
                  display_order=9, effective_date='2017-01-01')
    ]

    for new_ct_status in ct_statuses:
        if not ct_status.objects.using(db_alias).filter(id=new_ct_status.id).exists():
            ct_status.objects.using(db_alias).bulk_create([new_ct_status])
        else:
            print('skipping existing credit trade status {}'.format(new_ct_status.status))

    ct_types = [
        ct_type(id=1, the_type='Sell',
                description='The selling of Low Carbon Fuel Credits by the Initiator of the Trade or Opportunity.',
                display_order=1, effective_date='2017-01-01', expiration_date='2117-01-01', is_gov_only_type=False),
        ct_type(id=2, the_type='Buy',
                description='The buying of Low Carbon Fuel Credits by the Initiator of the Trade or Opportunity.',
                display_order=2, effective_date='2017-01-01', expiration_date='2117-01-01', is_gov_only_type=False),
        ct_type(id=3, the_type='Credit Validation',
                description='An adjustment of the number of Fuel Credits owned by a Fuel Supplier initiated by the BC Government.',
                display_order=3, effective_date='2017-01-01', expiration_date='2117-01-01', is_gov_only_type=True),
        ct_type(id=4, the_type='Credit Retirement',
                description='The retirement of Fuel Credits owned by a Fuel Supplier by the BC Government.',
                display_order=4, effective_date='2017-01-01', expiration_date='2117-01-01', is_gov_only_type=True),
        ct_type(id=5, the_type='Part 3 Award',
                description='The awarding of Low Carbon Fuel Credits to a Fuel Supplier following the completion of a Part 3 Agreement milestone.',
                display_order=5, effective_date='2017-01-01', expiration_date='2117-01-01', is_gov_only_type=True)
    ]

    for new_ct_type in ct_types:
        if not ct_type.objects.using(db_alias).filter(id=new_ct_type.id).exists():
            ct_type.objects.using(db_alias).bulk_create([new_ct_type])
        else:
            print('skipping existing credit trade type {}'.format(new_ct_type.the_type))

    ct_zero_reasons = [
        ct_zero_reason(id=1, reason='Internal',
                       description='The credits were transferred between units within a single organization at no cost.',
                       display_order=1, effective_date='2017-01-01', expiration_date='2117-01-01'),
        ct_zero_reason(id=2, reason='Other',
                       description='The transaction was at zero cost for some other reason. Specify the details in the comment box below.',
                       display_order=2, effective_date='2017-01-01', expiration_date='2117-01-01'),
    ]

    for new_ct_zero_reason in ct_zero_reasons:
        if not ct_zero_reason.objects.using(db_alias).filter(id=new_ct_zero_reason.id).exists():
            ct_zero_reason.objects.using(db_alias).bulk_create([new_ct_zero_reason])
        else:
            print('skipping existing credit trade zero reason {}'.format(new_ct_zero_reason.reason))

    org_actions_types = [
        org_actions_type(id=1, the_type='Buy And Sell',
                         description='An Organization permitted to both Buy and Sell Low Carbon Credits.',
                         display_order=1, effective_date='2017-01-01', expiration_date=None),
        org_actions_type(id=2, the_type='Sell Only',
                         description='An Organization permitted to only to Sell Low Carbon Credits.', display_order=2,
                         effective_date='2017-01-01', expiration_date=None),
        org_actions_type(id=3, the_type='None',
                         description='An Organization not currently permitted to either Buy and Sell Low Carbon Credits.',
                         display_order=3, effective_date='2017-01-01', expiration_date=None)
    ]

    for new_org_actions_type in org_actions_types:
        if not org_actions_type.objects.using(db_alias).filter(id=new_org_actions_type.id).exists():
            org_actions_type.objects.using(db_alias).bulk_create([new_org_actions_type])
        else:
            print('skipping existing organization actions type {}'.format(new_org_actions_type.the_type))

    org_types = [
        org_type(id=1, type='Government', description='Government of British Columbia', display_order=1,
                 effective_date='2017-01-01', expiration_date='2117-01-01'),
        org_type(id=2, type='Part3FuelSupplier', description='A Part 3 Fuel Supplier who can do credit transfers',
                 display_order=2, effective_date='2017-01-01', expiration_date='2117-01-01')
    ]

    for new_org_type in org_types:
        if not org_type.objects.using(db_alias).filter(id=new_org_type.id).exists():
            org_type.objects.using(db_alias).bulk_create([new_org_type])
        else:
            print('skipping existing organization type {}'.format(new_org_type.type))

    org_statuses = [
        org_status(id=1, status='Active',
                   description='The Fuel Supplier is an active participant in the Low Carbon Credits trading market.',
                   display_order=1, effective_date='2017-01-01', expiration_date=None),
        org_status(id=2, status='Archived',
                   description='The Fuel Supplier has been archived and is no longer a participant in the Low Carbon Credits trading market.',
                   display_order=1, effective_date='2017-01-01', expiration_date=None)
    ]

    for new_org_status in org_statuses:
        if not org_status.objects.using(db_alias).filter(id=new_org_status.id).exists():
            org_status.objects.using(db_alias).bulk_create([new_org_status])
        else:
            print('skipping existing organization status {}'.format(new_org_status.status))

    roles = [
        role(name='Admin', description='A System Administrator in the application with User Management and Roles and Permissions access.', is_government_role=True, display_order=1),
        role(name='FSManager', description='A Fuel Supplier user with authority to act on behalf of the Fuel Supplier on Credit Transfers.', is_government_role=False, display_order=2),
        role(name='FSUser', description='A Fuel Supplier user with limited abilities to take actions.', is_government_role=False, display_order=3),
        role(name='GovDirector', description='A government user with authorization to Approve Credit Transfers.', is_government_role=True, display_order=4),
        role(name='GovUser', description='A regular government user in the system.', is_government_role=True, display_order=5)
    ]

    for new_role in roles:
        if not role.objects.using(db_alias).filter(name=new_role.name).exists():
            role.objects.using(db_alias).bulk_create([new_role])
        else:
            print('skipping existing role {}'.format(new_role.name))

    role_permissions = [
        role_permission(role=role.objects.using(db_alias).get(name='Admin'),
                        permission=permission.objects.using(db_alias).get(code='EDIT_COMPLIANCE_PERIODS')),
        role_permission(role=role.objects.using(db_alias).get(name='Admin'),
                        permission=permission.objects.using(db_alias).get(code='EDIT_FUEL_SUPPLIERS')),
        role_permission(role=role.objects.using(db_alias).get(name='Admin'),
                        permission=permission.objects.using(db_alias).get(code='LOGIN')),
        role_permission(role=role.objects.using(db_alias).get(name='Admin'),
                        permission=permission.objects.using(db_alias).get(code='ROLES_AND_PERMISSIONS')),
        role_permission(role=role.objects.using(db_alias).get(name='Admin'),
                        permission=permission.objects.using(db_alias).get(code='USER_MANAGEMENT')),
        role_permission(role=role.objects.using(db_alias).get(name='Admin'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_COMPLIANCE_PERIODS')),
        role_permission(role=role.objects.using(db_alias).get(name='FSManager'),
                        permission=permission.objects.using(db_alias).get(code='PROPOSE_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='FSManager'),
                        permission=permission.objects.using(db_alias).get(code='LOGIN')),
        role_permission(role=role.objects.using(db_alias).get(name='FSManager'),
                        permission=permission.objects.using(db_alias).get(code='REFUSE_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='FSManager'),
                        permission=permission.objects.using(db_alias).get(code='RESCIND_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='FSManager'),
                        permission=permission.objects.using(db_alias).get(code='SIGN_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='FSManager'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_CREDIT_TRANSFERS')),
        role_permission(role=role.objects.using(db_alias).get(name='FSUser'),
                        permission=permission.objects.using(db_alias).get(code='LOGIN')),
        role_permission(role=role.objects.using(db_alias).get(name='FSUser'),
                        permission=permission.objects.using(db_alias).get(code='PROPOSE_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='FSUser'),
                        permission=permission.objects.using(db_alias).get(code='REFUSE_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='FSUser'),
                        permission=permission.objects.using(db_alias).get(code='RESCIND_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='FSUser'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_CREDIT_TRANSFERS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='APPROVE_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='LOGIN')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='DECLINE_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='EDIT_FUEL_SUPPLIERS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='EDIT_PRIVILEGED_COMMENTS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_APPROVED_CREDIT_TRANSFERS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_COMPLIANCE_PERIODS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='EDIT_COMPLIANCE_PERIODS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_CREDIT_TRANSFERS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_FUEL_SUPPLIERS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovDirector'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_PRIVILEGED_COMMENTS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='LOGIN')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='PROPOSE_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='EDIT_FUEL_SUPPLIERS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='EDIT_PRIVILEGED_COMMENTS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='RECOMMEND_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='RESCIND_CREDIT_TRANSFER')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_APPROVED_CREDIT_TRANSFERS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_COMPLIANCE_PERIODS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_CREDIT_TRANSFERS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_FUEL_SUPPLIERS')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='VIEW_PRIVILEGED_COMMENTS'))
    ]

    for new_role_permission in role_permissions:
        if not role_permission.objects.using(db_alias).filter(role=role.objects.using(db_alias).get(name=new_role_permission.role.name),
                                                              permission=permission.objects.using(db_alias).get(code=new_role_permission.permission.code)).exists():
            role_permission.objects.using(db_alias).bulk_create([new_role_permission])
        else:
            print('skipping existing role<->permission {}:{}'.format(new_role_permission.role.name,
                                                                     new_role_permission.permission.code))

    if not org.objects.using(db_alias).filter(id=1).exists():
        org.objects.using(db_alias).create(
            id=1,
            type=org_type.objects.using(db_alias).get(type='Government'),
            actions_type=org_actions_type.objects.using(db_alias).get(the_type='Buy And Sell'),
            status=org_status.objects.using(db_alias).get(status='Active'),
            name='Government Of British Columbia'
        )

        org_balance.objects.using(db_alias).create(
            credit_trade=None,
            effective_date='2017-04-01',
            expiration_date=None,
            organization_id=1,
            validated_credits=1000000000000000
        )
    else:
        print('skipped creating existing government organization')

    if not compliance_period.objects.using(db_alias).all():
        compliance_period.objects.using(db_alias).create(
            display_order=1,
            effective_date=datetime.today().strftime('%Y-%m-%d'),
            expiration_date=None,
            description="Auto-generated initial compliance period"
        )

    if not signing_authority_assertion.objects.using(db_alias).all():
        signing_authority_assertion.objects.using(db_alias).create(
            display_order=1,
            effective_date=datetime.today().strftime('%Y-%m-%d'),
            expiration_date=None,
            description="Auto-generated initial signing authority assertion"
        )


def create_permissions_0025(apps, schema_editor):
    """
    Adds the historical data entry permission and attach it to the
    Government User and Government Director roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    permission.objects.using(db_alias).create(
        code="USE_HISTORICAL_DATA_ENTRY",
        name="Use Historical Data Entry",
        description="Allows the user to use the functions of "
                    "Historical Data Entry"
    )

    role_permission.objects.using(db_alias).bulk_create([
        role_permission(
            role=role.objects.using(db_alias).get(name='GovDirector'),
            permission=permission.objects.using(db_alias).get(
                code='USE_HISTORICAL_DATA_ENTRY')
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name='GovUser'),
            permission=permission.objects.using(db_alias).get(
                code='USE_HISTORICAL_DATA_ENTRY')
        )
    ])


def delete_permissions_0025(apps, schema_editor):
    """
    Removes the historical data entry permission from the Government roles
    and deletes the actual permission.

    This is for reversing the migration.
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code="USE_HISTORICAL_DATA_ENTRY",
        role__name__in=["GovDirector", "GovUser"]).delete()

    permission.objects.using(db_alias).filter(
        code="USE_HISTORICAL_DATA_ENTRY"
    ).delete()


def create_notification_channels_0026(apps, schema_editor):
    """
    Adds the IN-APP, SMS, and EMAIL communications channels, with default settings
    """
    db_alias = schema_editor.connection.alias

    channel = apps.get_model("api", "NotificationChannel")

    channel.objects.using(db_alias).bulk_create([
        channel(channel=NotificationChannel.AvailableChannels.IN_APP.name, enabled=True, subscribe_by_default=True),
        channel(channel=NotificationChannel.AvailableChannels.SMS.name, enabled=False, subscribe_by_default=False),
        channel(channel=NotificationChannel.AvailableChannels.EMAIL.name, enabled=True, subscribe_by_default=False)
    ])


def delete_notification_channels_0026(apps, schema_editor):
    """
    Removes the historical data entry permission from the Government roles
    and deletes the actual permission.

    This is for reversing the migration.
    """
    db_alias = schema_editor.connection.alias

    channel = apps.get_model("api", "NotificationChannel")

    channel.objects.using(db_alias).filter(
        channel__in=[NotificationChannel.AvailableChannels.IN_APP.name,
                     NotificationChannel.AvailableChannels.SMS.name,
                     NotificationChannel.AvailableChannels.EMAIL.name]
    ).delete()


def update_organization_name_0029(apps, schema_editor):
    """
    Renames Government Of British Columbia to
    Government of British Columbia
    (lowercase 'of')
    """
    db_alias = schema_editor.connection.alias

    organization = apps.get_model("api", "Organization")

    organization.objects.using(db_alias).filter(
        name="Government Of British Columbia"
    ).update(name="Government of British Columbia")


def revert_organization_name_0029(apps, schema_editor):
    """
    Renames Government of British Columbia back to
    Government Of British Columbia
    (lowercase 'Of')
    """
    db_alias = schema_editor.connection.alias

    organization = apps.get_model("api", "Organization")

    organization.objects.using(db_alias).filter(
        name="Government of British Columbia"
    ).update(name="Government Of British Columbia")


def update_roles_descriptions_0032(apps, schema_editor):
    """
    Renames the descriptions of the roles to something
    more useful
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model("api", "Role")

    role.objects.using(db_alias).filter(
        name="Admin"
    ).update(
        description="Administrator",
        display_order=3
    )

    role.objects.using(db_alias).filter(
        name="GovUser"
    ).update(
        description="Government Analyst",
        display_order=1
    )

    role.objects.using(db_alias).filter(
        name="GovDirector"
    ).update(
        description="Government Director",
        display_order=2
    )

    role.objects.using(db_alias).filter(
        name="FSUser"
    ).update(
        description="Credit Trader",
        display_order=4
    )

    role.objects.using(db_alias).filter(
        name="FSManager"
    ).update(
        description="Signing Authority",
        display_order=5
    )

    fs_admin = role.objects.using(db_alias).filter(
        name="FSAdmin"
    )

    if fs_admin:
        fs_admin.update(
            description="Managing User",
            display_order=6
        )
    else:
        role.objects.using(db_alias).create(
            name="FSAdmin",
            description="Managing User",
            is_government_role=False,
            display_order=6
        )

    guest = role.objects.using(db_alias).filter(
        name="FSNoAccess"
    )

    if guest:
        guest.update(
            description="Guest",
            display_order=7
        )
    else:
        role.objects.using(db_alias).create(
            name="FSNoAccess",
            description="Guest",
            is_government_role=False,
            display_order=7
        )


def revert_roles_descriptions_0032(apps, schema_editor):
    """
    Renames the descriptions back to their previous states
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model("api", "Role")

    role.objects.using(db_alias).filter(
        name="Admin"
    ).update(
        description="A System Administrator in the application with User "
                    "Management and Roles and Permissions access."
    )

    role.objects.using(db_alias).filter(
        name="GovUser"
    ).update(
        description="A regular government user in the system."
    )

    role.objects.using(db_alias).filter(
        name="GovDirector"
    ).update(
        description="A government user with authorization to Approve Credit "
                    "Transfers."
    )

    role.objects.using(db_alias).filter(
        name="FSUser"
    ).update(
        description="A Fuel Supplier user with limited abilities to take "
                    "actions."
    )

    role.objects.using(db_alias).filter(
        name="FSManager"
    ).update(
        description="A Fuel Supplier user with authority to act on behalf of "
                    "the Fuel Supplier on Credit Transfers."
    )

    role.objects.using(db_alias).filter(
        name="FSAdmin"
    ).update(
        description="A Fuel Supplier adminuser with authority to add and "
                    "remove organizational users."
    )

    role.objects.using(db_alias).filter(
        name="FSNoAccess"
    ).update(
        description="A Fuel Supplier user defined in the system, but with no "
                    "access to system functionality."
    )


def update_permissions_0033(apps, schema_editor):
    """
    Updates the permissions and removes the create/edit fuel suppliers
    from Government Analyst and Director roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    permission.objects.using(db_alias).create(
        code='EDIT_FUEL_SUPPLIER_USERS',
        name="Edit Fuel Supplier Users' Information"
    )

    role_permission.objects.using(db_alias).bulk_create([
        role_permission(
            role=role.objects.using(db_alias).get(name='Admin'),
            permission=permission.objects.using(db_alias).get(
                code='EDIT_FUEL_SUPPLIER_USERS')
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name='Admin'),
            permission=permission.objects.using(db_alias).get(
                code='VIEW_APPROVED_CREDIT_TRANSFERS')
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name='Admin'),
            permission=permission.objects.using(db_alias).get(
                code='VIEW_CREDIT_TRANSFERS')
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name='Admin'),
            permission=permission.objects.using(db_alias).get(
                code='VIEW_FUEL_SUPPLIERS')
        )
    ])


def revert_permissions_0033(apps, schema_editor):
    """
    Reverts the permission back to its previous state by assigning
    back the permission back to Government Analyst and Director
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "EDIT_FUEL_SUPPLIER_USERS",
            "VIEW_APPROVED_CREDIT_TRANSFERS",
            "VIEW_CREDIT_TRANSFERS",
            "VIEW_FUEL_SUPPLIERS"
        ],
        role__name="Admin").delete()

    permission.objects.using(db_alias).filter(
        code="EDIT_FUEL_SUPPLIER_USERS"
    ).delete()


def update_permissions_0034(apps, schema_editor):
    """
    Updates the permissions and removes the create/edit fuel suppliers
    from Government Analyst and Director roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).bulk_create([
        role_permission(
            role=role.objects.using(db_alias).get(name='FSNoAccess'),
            permission=permission.objects.using(db_alias).get(
                code='VIEW_CREDIT_TRANSFERS')
        )
    ])


def revert_permissions_0034(apps, schema_editor):
    """
    Reverts the permission back to its previous state by assigning
    back the permission back to Government Analyst and Director
    """
    db_alias = schema_editor.connection.alias

    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "VIEW_CREDIT_TRANSFERS"
        ],
        role__name="FSNoAccess").delete()
    

def update_permissions_0035(apps, schema_editor):
    """
    Updates the Admin permissions so it can assign roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    permission.objects.using(db_alias).create(
        code="ASSIGN_GOVERNMENT_ROLES",
        name="Assign Government Roles",
        description="Allows the user to assign government roles to users"
    )

    permission.objects.using(db_alias).create(
        code="ASSIGN_FS_ROLES",
        name="Assign Fuel Supplier Roles",
        description="Allows the user to assign fuel supplier roles to users"
    )

    role_permission.objects.using(db_alias).bulk_create([
        role_permission(
            role=role.objects.using(db_alias).get(name='Admin'),
            permission=permission.objects.using(db_alias).get(
                code='ASSIGN_GOVERNMENT_ROLES')
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name='Admin'),
            permission=permission.objects.using(db_alias).get(
                code='ASSIGN_FS_ROLES')
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name='FSAdmin'),
            permission=permission.objects.using(db_alias).get(
                code='ASSIGN_FS_ROLES')
        )
    ])


def revert_permissions_0035(apps, schema_editor):
    """
    Removes the permissions for assigning roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code__in=["ASSIGN_FS_ROLES", "ASSIGN_GOVERNMENT_ROLES"]
    ).delete()

    permission.objects.using(db_alias).filter(
        code__in=["ASSIGN_FS_ROLES", "ASSIGN_GOVERNMENT_ROLES"]
    ).delete()


def update_status_0036(apps, schema_editor):
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


def revert_status_0036(apps, schema_editor):
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


def add_role_0037(apps, schema_editor):
    """
    Adds the Deputy Director role and assigns permissions to it
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    gov_deputy_director_role = role.objects.using(db_alias).create(
        name="GovDeputyDirector",
        description="Government Deputy Director",
        is_government_role=True,
        display_order="8"
    )

    gov_director_permissions = permission.objects.using(db_alias).filter(
        role_permissions__role__name="GovDirector"
    ).distinct()

    gov_deputy_director_permissions = []

    for permission in gov_director_permissions:
        gov_deputy_director_permissions.append(
            role_permission(
                role=gov_deputy_director_role,
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(
        gov_deputy_director_permissions
    )


def delete_role_0037(apps, schema_editor):
    """
    Delete the Deputy Director role and remove the permissions assigned to it
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).filter(
        role__name="GovDeputyDirector"
    ).delete()

    role.objects.using(db_alias).filter(
        name="GovDeputyDirector"
    ).delete()


def update_permissions_0039(apps, schema_editor):
    """
    Updates the permissions for FS Admin User
    Also add an s to User
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', "Permission")
    role = apps.get_model('api', "Role")
    role_permission = apps.get_model('api', "RolePermission")

    role.objects.using(db_alias).filter(
        name="FSAdmin"
    ).update(
        description="Managing Users"
    )

    role_permission.objects.using(db_alias).bulk_create([
        role_permission(
            role=role.objects.using(db_alias).get(name="FSAdmin"),
            permission=permission.objects.using(db_alias).get(
                code="LOGIN")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="FSAdmin"),
            permission=permission.objects.using(db_alias).get(
                code="ADD_FS_USER")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="FSAdmin"),
            permission=permission.objects.using(db_alias).get(
                code="EDIT_FUEL_SUPPLIER_USERS")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="FSAdmin"),
            permission=permission.objects.using(db_alias).get(
                code="VIEW_CREDIT_TRANSFERS")
        )
    ])


def revert_permissions_0039(apps, schema_editor):
    """
    Reverts the permission back to its previous state for
    FS Admin User
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', "Role")
    role_permission = apps.get_model('api', "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "LOGIN",
            "ADD_FS_USER",
            "EDIT_FUEL_SUPPLIER_USERS"
            "VIEW_CREDIT_TRANSFERS"
        ],
        role__name="FSAdmin").delete()

    role.objects.using(db_alias).filter(
        name="FSAdmin"
    ).update(
        description="Managing User"
    )


def update_description_0042(apps, schema_editor):
    """
    Updates the role: Credit Trader to Credit Transfers
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', "Role")

    role.objects.using(db_alias).filter(
        name="FSUser"
    ).update(
        description="Credit Transfers"
    )


def revert_description_0042(apps, schema_editor):
    """
    Reverts the role back to Credit Trader from Credit Transfers
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', "Role")

    role.objects.using(db_alias).filter(
        name="FSUser"
    ).update(
        description="Credit Trader"
    )


def update_permissions_0043(apps, schema_editor):
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


def revert_permissions_0043(apps, schema_editor):
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


def create_initial_data_0046(apps, schema_editor):
    """Load initial data (previously stored in fixtures)
    This is for core (essential) data only -- operational data should be inserted with scripts

    This script is designed to look for existing data and add any missing elements, without
    disrupting existing data, or load a database from nothing (as for testing)

    It is idempotent and irreversible
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately versioned
    # for this migration (so this shouldn't ever need to be maintained if fields change)
    doc_status = apps.get_model("api", "DocumentStatus")
    doc_type = apps.get_model("api", "DocumentType")
    doc_cat = apps.get_model("api", "DocumentCategory")
    role = apps.get_model("api", "Role")
    permission = apps.get_model("api", "Permission")
    role_permission = apps.get_model("api", "RolePermission")

    doc_statuses = [
        doc_status(status='Draft',
                   display_order=1,
                   effective_date='2017-01-01'),
        doc_status(status='Submitted',
                   display_order=2,
                   effective_date='2017-01-01'),
        doc_status(status='Received',
                   display_order=3,
                   effective_date='2017-01-01')
    ]

    for new_doc_status in doc_statuses:
        if not doc_status.objects.using(db_alias).filter(status=new_doc_status.status).exists():
            doc_status.objects.using(db_alias).bulk_create([new_doc_status])
        else:
            print('skipping existing document status {}'.format(new_doc_status.status))

    doc_cats = [
        doc_cat(
            name='Part 3 Agreements',
            display_order=1
        )
    ]

    for new_doc_cat in doc_cats:
        if not doc_cat.objects.using(db_alias).filter(name=new_doc_cat.name).exists():
            doc_cat.objects.using(db_alias).bulk_create([new_doc_cat])
        else:
            print('skipping existing document category {}'.format(new_doc_cat.name))

    doc_types = [
        doc_type(the_type='Application',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Part 3 Agreements')
                 ),
        doc_type(the_type='Evidence',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Part 3 Agreements')
                 )
    ]

    for new_doc_type in doc_types:
        if not doc_type.objects.using(db_alias).filter(the_type=new_doc_type.the_type).exists():
            doc_type.objects.using(db_alias).bulk_create([new_doc_type])
        else:
            print('skipping existing document type {}'.format(new_doc_type.the_type))

    permissions = [
        permission(code='DOCUMENTS_CREATE_DRAFT', name='Submit draft documents',
                   description='Submit secure documents with draft status'),
        permission(code='DOCUMENTS_SUBMIT', name='Submit documents',
                   description='Submit secure documents'),
        permission(code='DOCUMENTS_GOVERNMENT_REVIEW', name='Review documents',
                   description='Government can accept documents for review'),
        permission(code='DOCUMENTS_VIEW', name='View documents',
                   description='View secure documents'),
    ]

    for new_permission in permissions:
        if not permission.objects.using(db_alias).filter(code=new_permission.code).exists():
            permission.objects.using(db_alias).bulk_create([new_permission])
        else:
            print('skipping existing permission {}'.format(new_permission.code))

    roles = [
        role(name='FSDoc', description='A Fuel Supplier user with authority to view documents and submit drafts',
             is_government_role=True, display_order=10),
        role(name='FSDocSubmit', description='A Fuel Supplier user with authority to submit documents',
             is_government_role=False, display_order=11)
    ]

    for new_role in roles:
        if not role.objects.using(db_alias).filter(name=new_role.name).exists():
            role.objects.using(db_alias).bulk_create([new_role])
        else:
            print('skipping existing role {}'.format(new_role.name))

    role_permissions = [
        role_permission(role=role.objects.using(db_alias).get(name='FSDoc'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_VIEW')),
        role_permission(role=role.objects.using(db_alias).get(name='FSDoc'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_CREATE_DRAFT')),
        role_permission(role=role.objects.using(db_alias).get(name='FSDocSubmit'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_VIEW')),
        role_permission(role=role.objects.using(db_alias).get(name='FSDocSubmit'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_CREATE_DRAFT')),
        role_permission(role=role.objects.using(db_alias).get(name='FSDocSubmit'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_SUBMIT')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_VIEW')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_GOVERNMENT_REVIEW'))
    ]

    for new_role_permission in role_permissions:
        if not role_permission.objects.using(db_alias).filter(
                role=role.objects.using(db_alias).get(name=new_role_permission.role.name),
                permission=permission.objects.using(db_alias).get(code=new_role_permission.permission.code)).exists():
            role_permission.objects.using(db_alias).bulk_create([new_role_permission])
        else:
            print('skipping existing role<->permission {}:{}'.format(new_role_permission.role.name,
                                                                     new_role_permission.permission.code))
            

def update_document_types_0052(apps, schema_editor):
    """
    Adds the description for Application and Evidence.
    Add 'Other' Category
    Adds Fuel Supply Records and Other
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    doc_cat = apps.get_model('api', 'DocumentCategory')
    doc_type = apps.get_model('api', 'DocumentType')

    doc_category = doc_cat(
        name='Other',
        display_order=2
    )

    if not doc_cat.objects.using(db_alias).filter(
            name=doc_category.name).exists():
        doc_cat.objects.using(db_alias).bulk_create([doc_category])

    doc_types = [
        doc_type(the_type='Application',
                 description='P3A Application',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Part 3 Agreements')
                 ),
        doc_type(the_type='Evidence',
                 description='P3A Milestone Evidence',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Part 3 Agreements')
                 ),
        doc_type(the_type='Records',
                 description='Fuel Supply Records',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Other')
                 ),
        doc_type(the_type='Other',
                 description='Other',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Other')
                 )
    ]

    for new_doc_type in doc_types:
        if not doc_type.objects.using(db_alias).filter(
                the_type=new_doc_type.the_type).exists():
            doc_type.objects.using(db_alias).bulk_create([new_doc_type])
        else:
            doc_type.objects.using(db_alias).filter(
                the_type=new_doc_type.the_type).update(
                    the_type=new_doc_type.the_type,
                    description=new_doc_type.description,
                    effective_date=new_doc_type.effective_date,
                    category=new_doc_type.category)


def revert_document_types_0052(apps, schema_editor):
    """
    Reverts the changes to document types.
    Removes the description for Application Evidence.
    Removes 'Other' Category
    Removes Fuel Supply Records and Other
    """
    db_alias = schema_editor.connection.alias

    doc_cat = apps.get_model('api', 'DocumentCategory')
    doc_type = apps.get_model('api', 'DocumentType')

    doc_type.objects.using(db_alias).filter(
        category=doc_cat.objects.get(name='Other')).delete()

    doc_type.objects.using(db_alias).filter(
        category=doc_cat.objects.get(
            name='Part 3 Agreements')).update(
                description=''
            )

    doc_cat.objects.using(db_alias).filter(
        name='Other').delete()
    

def update_organization_descriptions_0054(apps, schema_editor):
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


def revert_organization_descriptions_0054(apps, schema_editor):
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
    

def update_permission_names_0055(apps, schema_editor):
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


def revert_permission_names_0055(apps, schema_editor):
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


def add_comment_permission_0059(apps, schema_editor):
    """
    Adds the Add Comment permission and attach it to all roles
    except FSNoAccess
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    comment_permission = permission.objects.using(db_alias).create(
        code="ADD_COMMENT",
        name="Add Comment",
        description="The ability to add comments to credit transactions "
                    "(Credit Transfer Proposal, Part 3 Award, Validation, "
                    "and Reduction)."
    )

    role_permissions = []

    roles = role.objects.using(db_alias).filter(name__in=[
        "Admin", "FSAdmin", "FSDoc", "FSDocSubmit", "FSManager", "FSUser",
        "GovDeputyDirector", "GovDirector", "GovUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=comment_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_comment_permission_0059(apps, schema_editor):
    """
    Removes the Add Comment permission and all its links to the roles
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    role_permission.objects.using(db_alias).filter(
        permission=permission.objects.using(db_alias).get(code="ADD_COMMENT")
    ).delete()

    permission.objects.using(db_alias).filter(
        code="ADD_COMMENT"
    ).delete()


def add_compliance_period_permission_0063(apps, schema_editor):
    """
    Adds the View Compliance Period permission to FSDoc and FSDocSubmit roles
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')
    permission = apps.get_model('api', 'Permission')

    compliance_period_permission = permission.objects.get(code='VIEW_COMPLIANCE_PERIODS')

    role_permissions = []

    roles = role.objects.using(db_alias).filter(name__in=[
       "FSDoc", "FSDocSubmit"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=compliance_period_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def add_new_document_statuses_0064(apps, schema_editor):
    """Add additional document statuses"""

    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately versioned
    # for this migration (so this shouldn't ever need to be maintained if fields change)
    doc_status = apps.get_model("api", "DocumentStatus")

    doc_statuses = [
        doc_status(status='Security Scan Failed',
                   display_order=4,
                   effective_date='2017-01-01'),
        doc_status(status='Pending Submission',
                   display_order=5,
                   effective_date='2017-01-01'),
    ]

    for new_doc_status in doc_statuses:
        if not doc_status.objects.using(db_alias).filter(status=new_doc_status.status).exists():
            doc_status.objects.using(db_alias).bulk_create([new_doc_status])
        else:
            print('skipping existing document status {}'.format(new_doc_status.status))


def remove_view_compliance_permission_0067(apps, schema_editor):
    """
    Removes the View Compliance Permission and the relationship
    to the roles that uses it.
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    view_compliance_permission = permission.objects.using(db_alias).filter(
        code="VIEW_COMPLIANCE_PERIODS"
    ).first()

    if view_compliance_permission:
        role_permission.objects.filter(
            permission_id=view_compliance_permission.id
        ).delete()

    view_compliance_permission.delete()


def add_view_compliance_permission_0067(apps, schema_editor):
    """
    Re-adds the View Compliance Period and the relationship to the roles
    that previously had it.
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    view_compliance_permission = permission.objects.using(db_alias).create(
        code="VIEW_COMPLIANCE_PERIODS",
        name="View Compliance Periods",
        description="Gives the user access to view compliance periods."
    )

    role_permissions = []

    roles = role.objects.using(db_alias).filter(name__in=[
        "Admin", "FSAdmin", "FSDoc", "FSDocSubmit", "FSManager", "FSUser",
        "GovDeputyDirector", "GovDirector", "GovUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=view_compliance_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def rename_to_compliance_reporting_materials_0068(apps, schema_editor):
    """
    Renames document type: Fuel Supply Records to Compliance
    Reporting Materials
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_type = apps.get_model('api', 'DocumentType')

    document_type.objects.using(db_alias).filter(
        the_type="Records"
    ).update(
        description="Compliance Reporting Materials"
    )


def revert_to_fuel_supply_records_0068(apps, schema_editor):
    """
    Renames transaction type: Compliance Reporting Materials to Fuel Supply
    Records
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_type = apps.get_model('api', 'DocumentType')

    document_type.objects.using(db_alias).filter(
        the_type="Records"
    ).update(
        description="Fuel Supply Records"
    )


def rename_to_credit_reduction_0070(apps, schema_editor):
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


def revert_to_credit_retirement_0070(apps, schema_editor):
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


def rename_to_file_submission_0071(apps, schema_editor):
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


def revert_to_document_upload_0071(apps, schema_editor):
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


def add_document_statuses_0074(apps, schema_editor):
    """
    Adds Cancelled and Rescinded statuses to DocumentStatus
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).bulk_create([
        document_status(
            status="Rescinded",
            effective_date="2017-01-01",
            display_order="6"
        ),
        document_status(
            status="Cancelled",
            effective_date="2017-01-01",
            display_order="7"
        )
    ])


def remove_document_statuses_0074(apps, schema_editor):
    """
    Re-adds the View Compliance Period and the relationship to the roles
    that previously had it.
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).filter(
        status__in=["Cancelled", "Rescinded"]).delete()


def remove_document_status_0075(apps, schema_editor):
    """
    Re-adds the View Compliance Period and the relationship to the roles
    that previously had it.
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).filter(
        status="Rescinded").delete()


def add_document_status_0075(apps, schema_editor):
    """
    Adds Cancelled and Rescinded statuses to DocumentStatus
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).create(
        status="Rescinded",
        effective_date="2017-01-01",
        display_order="6"
    )


def add_document_status_0076(apps, schema_editor):
    """
    Adds Archived status
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).create(
        status="Archived",
        effective_date="2017-01-01",
        display_order="8"
    )


def remove_document_status_0076(apps, schema_editor):
    """
    Removes the Archived status
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).filter(
        status="Archived").delete()


def remove_document_link_permission_0082(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    link_permission = permission.objects.using(db_alias).filter(
        code="DOCUMENTS_LINK_TO_CREDIT_TRADE"
    ).first()

    if link_permission:
        role_permission.objects.filter(
            permission_id=link_permission.id
        ).delete()

    link_permission.delete()


def add_document_link_permission_0082(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    link_permission = permission.objects.using(db_alias).create(
        code="DOCUMENTS_LINK_TO_CREDIT_TRADE",
        name="Establish links between credit transactions and secure file submissions",
        description="Gives the user access to modify document links."
    )

    role_permissions = []

    roles = role.objects.using(db_alias).filter(name__in=[
        "GovDeputyDirector", "GovDirector", "GovUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=link_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def add_fuel_code_statuses_0085(apps, schema_editor):
    """Add basic fuel code statuses"""

    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    fuel_code_status = apps.get_model('api', 'FuelCodeStatus')
    fuel_code_status.objects.using(db_alias).bulk_create([
        fuel_code_status(
            status='Draft',
            display_order=1
        ),
        fuel_code_status(
            status='Submitted',
            display_order=2
        ),
        fuel_code_status(
            status='Cancelled',
            display_order=3
        )
    ])


def remove_fuel_code_statuses_0085(apps, schema_editor):
    """
    Re-adds the View Compliance Period and the relationship to the roles
    that previously had it.
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    fuel_code_status = apps.get_model('api', 'FuelCodeStatus')
    fuel_code_status.objects.using(db_alias).filter(
        status__in=["Draft", "Submitted", "Cancelled"]).delete()


def add_fuel_code_permissions_0087(apps, schema_editor):
    """
    Creates the basic permissions for the roles to manage and view
    fuel codes
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    view_permission = permission.objects.using(db_alias).create(
        code="FUEL_CODES_VIEW",
        name="View Fuel Codes",
        description="The ability to access and view Fuel Codes."
    )

    manage_permission = permission.objects.using(db_alias).create(
        code="FUEL_CODES_MANAGE",
        name="Edit Fuel Codes",
        description="The ability to create and update Fuel Codes."
    )

    role_permissions = []

    roles = role_model.objects.using(db_alias).filter(name__in=[
        "GovDeputyDirector", "GovDirector", "GovUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=view_permission
            )
        )

        role_permissions.append(
            role_permission(
                role=role,
                permission=manage_permission
            )
        )

    roles = role_model.objects.using(db_alias).filter(name__in=[
        "FSAdmin", "FSManager", "FSUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=view_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_fuel_code_permissions_0087(apps, schema_editor):
    """
    Removes the fuel code permissions from roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    manage_permission = permission.objects.using(db_alias).filter(
        code="FUEL_CODES_MANAGE"
    ).first()

    if manage_permission:
        role_permission.objects.filter(
            permission_id=manage_permission.id
        ).delete()

    manage_permission.delete()

    view_permission = permission.objects.using(db_alias).filter(
        code="FUEL_CODES_VIEW"
    ).first()

    if view_permission:
        role_permission.objects.filter(
            permission_id=view_permission.id
        ).delete()

    view_permission.delete()


def update_fuel_code_status_effective_dates_0090(apps, schema_editor):
    """
    Adds the effective dates for fuel code status 
    """
    db_alias = schema_editor.connection.alias

    fuel_code_status = apps.get_model('api', 'FuelCodeStatus')

    fuel_code_status.objects.using(db_alias).update(
        effective_date="2017-01-01"
    )


def remove_fuel_code_status_effective_dates_0090(apps, schema_editor):
    """
    Removes the effective dates from fuel code status
    """
    db_alias = schema_editor.connection.alias

    fuel_code_status = apps.get_model('api', 'FuelCodeStatus')

    fuel_code_status.objects.using(db_alias).update(
        effective_date=None
    )


def rename_fsdoc_role_0091(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', 'Role')

    fsdoc_role = role.objects.using(db_alias).filter(
        name="FSDoc"
    ).first()

    fsdoc_role.name = 'GovDoc'

    fsdoc_role.save()


def revert_rename_fsdoc_role_0091(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', 'Role')

    fsdoc_role = role.objects.using(db_alias).filter(
        name="GovDoc"
    ).first()

    fsdoc_role.name = 'FSDoc'

    fsdoc_role.save()


approved_fuel_names_0093 = [
    'Biodiesel',
    'CNG',
    'Electricity',
    'Ethanol',
    'HDRD',
    'Hydrogen',
    'LNG',
    'Propane',
    'Renewable diesel',
    'Renewable gasoline'
]


def add_transport_modes_and_approved_fuels_0093(apps, schema_editor):
    """Add initial transport modes and approved fuels"""

    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    transport_mode = apps.get_model('api', 'TransportMode')
    transport_mode.objects.using(db_alias).bulk_create([
        transport_mode(
            name='Truck',
            effective_date='2017-01-01'
        ),
        transport_mode(
            name='Rail',
            effective_date='2017-01-01'
        ),
        transport_mode(
            name='Marine',
            effective_date='2017-01-01'
        ),
        transport_mode(
            name='Adjacent',
            effective_date='2017-01-01'
        ),
        transport_mode(
            name='Pipeline',
            effective_date='2017-01-01'
        )
    ])

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel.objects.using(db_alias).bulk_create(
        map(lambda af: approved_fuel(
            name=af,
            effective_date='2017-01-01'
        ), approved_fuel_names_0093)
    )


def remove_transport_modes_and_approved_fuels_0093(apps, schema_editor):
    """
    Remove initial transport modes and approved fuels
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    transport_mode = apps.get_model('api', 'TransportMode')
    transport_mode.objects.using(db_alias).filter(
        name__in=["Truck", "Rail", "Marine", "Adjacent", "Pipeline"]).delete()

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel.objects.using(db_alias).filter(
        name__in=approved_fuel_names_0093).delete()


def add_trgrm_extension_0096(apps, schema_editor):
    """
    Add the postgresql trigram matching extension
    """
    if schema_editor.connection.vendor == 'postgresql':
        with schema_editor.connection.cursor() as cursor:
            cursor.execute("create extension if not exists pg_trgm")


def add_autocomplete_indices_0097(apps, schema_editor):
    """
    Add the postgresql indices for faster autocompletion
    """
    if schema_editor.connection.vendor != 'postgresql':
        return

    Index = namedtuple('Index', [
        'index_name',
        'table',
        'column'
    ])

    indices = [
        Index('idx_autocomplete_company', 'fuel_code', 'company'),
        Index('idx_autocomplete_former_company', 'fuel_code', 'former_company'),
        Index('idx_autocomplete_feedstock', 'fuel_code', 'feedstock'),
        Index('idx_autocomplete_feedstock_location', 'fuel_code', 'feedstock_location'),
        Index('idx_autocomplete_feedstock_misc', 'fuel_code', 'feedstock_misc')
    ]

    with schema_editor.connection.cursor() as cursor:
        for index in indices:
            cursor.execute("create index {index_name} on {table} USING GIST ({column} gist_trgm_ops)"
                           .format(table=index.table,
                                   column=index.column,
                                   index_name=index.index_name))


def rename_submitted_status_0098(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    status = apps.get_model('api', 'FuelCodeStatus')

    submitted_status = status.objects.using(db_alias).filter(
        status="Submitted"
    ).first()

    if submitted_status:
        submitted_status.status = 'Approved'
        submitted_status.save()


def revert_submitted_status_0098(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    status = apps.get_model('api', 'FuelCodeStatus')

    approved_status = status.objects.using(db_alias).filter(
        status="Approved"
    ).first()

    if approved_status:
        approved_status.status = 'Submitted'
        approved_status.save()


def add_natural_gas_based_gasoline_0099(apps, schema_editor):
    """
    Add natural gas based gasoline into Approved Fuel
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel.objects.using(db_alias).create(
        name="Natural gas-based gasoline",
        effective_date="2017-01-01"
    )


def remove_natural_gas_based_gasoline_0099(apps, schema_editor):
    """
    Removes natural gas based gasoline from Approved Fuel
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel.objects.using(db_alias).filter(
        name="Natural gas-based gasoline"
    ).delete()


def add_credit_calculation_permissions_0105(apps, schema_editor):
    """
    Creates the basic permissions for the roles to manage and view
    credit calculation related tables
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    view_permission = permission.objects.using(db_alias).create(
        code="CREDIT_CALCULATION_VIEW",
        name="View Credit Calculation Limits",
        description="The ability to access and view credit calculation limits."
    )

    manage_permission = permission.objects.using(db_alias).create(
        code="CREDIT_CALCULATION_MANAGE",
        name="Edit Credit Calculation Limits",
        description="The ability to create and update credit calculation "
                    "limits."
    )

    role_permissions = []

    roles = role_model.objects.using(db_alias).filter(name__in=[
        "GovDeputyDirector", "GovDirector", "GovUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=view_permission
            )
        )

        role_permissions.append(
            role_permission(
                role=role,
                permission=manage_permission
            )
        )

    roles = role_model.objects.using(db_alias).filter(name__in=[
        "FSAdmin", "FSManager", "FSUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=view_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_credit_calculation_permissions_0105(apps, schema_editor):
    """
    Removes the credit calculation permissions from roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    manage_permission = permission.objects.using(db_alias).filter(
        code="CREDIT_CALCULATION_MANAGE"
    ).first()

    if manage_permission:
        role_permission.objects.filter(
            permission_id=manage_permission.id
        ).delete()

    manage_permission.delete()

    view_permission = permission.objects.using(db_alias).filter(
        code="CREDIT_CALCULATION_VIEW"
    ).first()

    if view_permission:
        role_permission.objects.filter(
            permission_id=view_permission.id
        ).delete()

    view_permission.delete()


def add_fuel_classes_0106(apps, schema_editor):
    """
    Creates the fuel classes: Gasoline and Diesel
    """
    db_alias = schema_editor.connection.alias

    fuel_class = apps.get_model('api', 'FuelClass')

    fuel_class.objects.using(db_alias).bulk_create([
        fuel_class(
            fuel_class="Diesel",
            display_order=1,
            effective_date='2017-01-01'
        ),
        fuel_class(
            fuel_class="Gasoline",
            display_order=2,
            effective_date='2017-01-01'
        )
    ])


def remove_fuel_classes_0106(apps, schema_editor):
    """
    Removes the credit calculation permissions from roles
    """
    db_alias = schema_editor.connection.alias

    fuel_class = apps.get_model('api', 'FuelClass')

    fuel_class.objects.using(db_alias).all().delete()


def add_credit_calculation_fuel_types_0111(apps, schema_editor):
    """
    Removes the fuel types that will be moved into its own categories
    Adds some fuel types
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).filter(
        credit_calculation_only=True
    ).delete()

    approved_fuel.objects.using(db_alias).bulk_create([
        approved_fuel(
            name="Petroleum-based diesel",
            effective_date="2017-01-01",
            credit_calculation_only=True
        ),
        approved_fuel(
            name="Petroleum-based gasoline",
            effective_date="2017-01-01",
            credit_calculation_only=True
        )
    ])


def remove_credit_calculation_fuel_types_0111(apps, schema_editor):
    """
    Re-adds the fuel types that were removed
    Removes the additional fuel types that were generated by this migration
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).bulk_create([
        approved_fuel(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel",
            effective_date="2017-01-01",
            credit_calculation_only=True
        ),
        approved_fuel(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel",
            effective_date="2017-01-01",
            credit_calculation_only=True
        ),
        approved_fuel(
            name="Petroleum-based diesel fuel or diesel fuel produced from "
                 "biomass",
            effective_date="2017-01-01",
            credit_calculation_only=True
        ),
        approved_fuel(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "gasoline produced from biomass",
            effective_date="2017-01-01",
            credit_calculation_only=True
        ),
        approved_fuel(
            name="Hydrogenation-derived renewable diesel fuel",
            effective_date="2017-01-01",
            credit_calculation_only=True
        ),
        approved_fuel(
            name="Renewable fuel in relation to diesel class fuel",
            effective_date="2017-01-01",
            credit_calculation_only=True
        ),
        approved_fuel(
            name="Renewable fuel in relation to gasoline class fuel",
            effective_date="2017-01-01",
            credit_calculation_only=True
        )
    ])


def add_categories_0114(apps, schema_editor):
    """
    Adds additional fuel types for credit calculation
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'DefaultCarbonIntensityCategory')

    category.objects.using(db_alias).bulk_create([
        category(
            name="CNG",
            display_order=1
        ),
        category(
            name="Electricity",
            display_order=2
        ),
        category(
            name="Hydrogen",
            display_order=3
        ),
        category(
            name="LNG",
            display_order=4
        ),
        category(
            name="Natural gas-based gasoline",
            display_order=5
        ),
        category(
            name="Petroleum-based diesel",
            display_order=6
        ),
        category(
            name="Petroleum-based gasoline",
            display_order=7
        ),
        category(
            name="Propane",
            display_order=8
        ),
        category(
            name="Renewable Fuel in relation to diesel class fuel",
            display_order=9
        ),
        category(
            name="Renewable Fuel in relation to gasoline class fuel",
            display_order=10
        )
    ])

    category = apps.get_model('api', 'EnergyDensityCategory')

    category.objects.using(db_alias).bulk_create([
        category(
            name="Biodiesel",
            display_order=1
        ),
        category(
            name="CNG",
            display_order=2
        ),
        category(
            name="Electricity",
            display_order=3
        ),
        category(
            name="Ethanol",
            display_order=4
        ),
        category(
            name="Hydrogenation-derived renewable diesel fuel",
            display_order=5
        ),
        category(
            name="Hydrogen",
            display_order=6
        ),
        category(
            name="LNG",
            display_order=7
        ),
        category(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "gasoline produced from biomass",
            display_order=8
        ),
        category(
            name="Petroleum-based diesel fuel or diesel fuel produced from "
                 "biomass",
            display_order=9
        ),
        category(
            name="Propane",
            display_order=10
        )
    ])

    category = apps.get_model('api', 'EnergyEffectivenessRatioCategory')

    category.objects.using(db_alias).bulk_create([
        category(
            name="CNG",
            display_order=1
        ),
        category(
            name="Electricity",
            display_order=2
        ),
        category(
            name="Hydrogen",
            display_order=3
        ),
        category(
            name="LNG",
            display_order=4
        ),
        category(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel",
            display_order=5
        ),
        category(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel",
            display_order=6
        ),
        category(
            name="Propane",
            display_order=7
        )
    ])


def remove_categories_0114(apps, schema_editor):
    """
    Removes the credit calculation fuel types
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'DefaultCarbonIntensityCategory')
    category.objects.using(db_alias).delete()

    category = apps.get_model('api', 'EnergyDensityCategory')
    category.objects.using(db_alias).delete()

    category = apps.get_model('api', 'EnergyEffectivenessRatioCategory')
    category.objects.using(db_alias).delete()


def add_categories_0116(apps, schema_editor):
    """
    Adds additional fuel types for credit calculation
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    default_carbon_intensity_category = apps.get_model(
        'api', 'DefaultCarbonIntensityCategory')
    energy_density_category = apps.get_model(
        'api', 'EnergyDensityCategory')
    energy_effectiveness_ratio_category = apps.get_model(
        'api', 'EnergyEffectivenessRatioCategory')

    approved_fuel.objects.using(db_alias).filter(
        name="Biodiesel"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Renewable Fuel in relation to diesel class fuel"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Biodiesel"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="CNG"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="CNG"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="CNG"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="CNG"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Electricity"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Electricity"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Electricity"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Electricity"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Ethanol"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Renewable Fuel in relation to gasoline class fuel"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Ethanol"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="HDRD"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Renewable Fuel in relation to diesel class fuel"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Hydrogenation-derived renewable diesel fuel"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Hydrogen"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Hydrogen"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Hydrogen"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Hydrogen"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="LNG"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="LNG"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="LNG"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="LNG"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Natural gas-based gasoline"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Natural gas-based gasoline"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "gasoline produced from biomass"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Petroleum-based diesel"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or diesel fuel produced from "
                 "biomass"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Petroleum-based gasoline"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "gasoline produced from biomass"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Propane"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Propane"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Propane"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Propane"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable diesel"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or diesel fuel produced from "
                 "biomass"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable gasoline"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "gasoline produced from biomass"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel"
        )
    )


def remove_categories_0116(apps, schema_editor):
    """
    Removes the credit calculation fuel types
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel.objects.using(db_alias).update(
        default_carbon_intensity_category=None,
        energy_density_category=None,
        energy_effectiveness_ratio_category=None
    )


def add_unit_of_measures_0117(apps, schema_editor):
    """
    Adds additional fuel types for credit calculation
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    unit_of_measure = apps.get_model('api', 'UnitOfMeasure')

    uom_l = unit_of_measure.objects.using(db_alias).create(
        name="L",
        effective_date="2017-01-01"
    )
    uom_kg = unit_of_measure.objects.using(db_alias).create(
        name="kg",
        effective_date="2017-01-01"
    )
    uom_kwh = unit_of_measure.objects.using(db_alias).create(
        name="kWh",
        effective_date="2017-01-01"
    )
    uom_m3 = unit_of_measure.objects.using(db_alias).create(
        name="m³",
        effective_date="2017-01-01"
    )

    approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "Biodiesel", "Ethanol", "HDRD", "Natural gas-based gasoline",
            "Petroleum-based diesel", "Petroleum-based gasoline",
            "Propane", "Renewable diesel", "Renewable gasoline"
        ]
    ).update(
        unit_of_measure=uom_l
    )
    approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "Hydrogen", "LNG"
        ]
    ).update(
        unit_of_measure=uom_kg
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Electricity"
    ).update(
        unit_of_measure=uom_kwh
    )
    approved_fuel.objects.using(db_alias).filter(
        name="CNG"
    ).update(
        unit_of_measure=uom_m3
    )


def remove_unit_of_measures_0117(apps, schema_editor):
    """
    Removes the credit calculation fuel types
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    unit_of_measure = apps.get_model('api', 'UnitOfMeasure')

    approved_fuel.objects.using(db_alias).update(
        unit_of_measure=None
    )

    unit_of_measure.objects.using(db_alias).delete()


def add_descriptions_0119(apps, schema_editor):
    """
    Adds Fuel Descriptions
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).filter(
        name="Biodiesel"
    ).update(
        description="Biodiesel fuel"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="CNG"
    ).update(
        description="Compressed natural gas"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Ethanol"
    ).update(
        description="Ethanol produced from biomass"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="HDRD"
    ).update(
        description="Hydrogenation-derived renewable diesel fuel"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="LNG"
    ).update(
        description="Liquefied natural gas"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Petroleum-based diesel"
    ).update(
        description="Diesel fuel, diesel, petroleum-based diesel"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Petroleum-based gasoline"
    ).update(
        description="Gasoline"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Renewable diesel"
    ).update(
        description="Diesel fuel produced from biomass"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Renewable gasoline"
    ).update(
        description="Gasoline produced from biomass"
    )


def remove_descriptions_0119(apps, schema_editor):
    """
    Removes the descriptions from fuels
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).update(
        description=None
    )


def add_fuel_class_relationships_0121(apps, schema_editor):
    """
    Adds Fuel Descriptions
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel_class = apps.get_model('api', 'ApprovedFuelClass')
    fuel_class = apps.get_model('api', 'FuelClass')

    diesel_fuels = approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "Biodiesel", "CNG", "Electricity", "HDRD", "Hydrogen", "LNG",
            "Petroleum-based diesel", "Propane", "Renewable diesel"
        ]
    )

    diesel_fuel_classes = []

    for fuel in diesel_fuels:
        diesel_fuel_classes.append(
            approved_fuel_class(
                fuel=approved_fuel.objects.using(db_alias).get(
                    name=fuel.name
                ),
                fuel_class=fuel_class.objects.using(db_alias).get(
                    fuel_class="Diesel"
                )
            )
        )

    approved_fuel_class.objects.using(db_alias).bulk_create(
        diesel_fuel_classes)

    gasoline_fuels = approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "CNG", "Electricity", "Ethanol", "Hydrogen",
            "Natural gas-based gasoline", "Petroleum-based gasoline",
            "Propane", "Renewable gasoline"
        ]
    )

    gasoline_fuel_classes = []

    for fuel in gasoline_fuels:
        gasoline_fuel_classes.append(
            approved_fuel_class(
                fuel=approved_fuel.objects.using(db_alias).get(
                    name=fuel.name
                ),
                fuel_class=fuel_class.objects.using(db_alias).get(
                    fuel_class="Gasoline"
                )
            )
        )

    approved_fuel_class.objects.using(db_alias).bulk_create(
        gasoline_fuel_classes)


def remove_fuel_class_relationships_0121(apps, schema_editor):
    """
    Removes the descriptions from fuels
    """
    db_alias = schema_editor.connection.alias

    approved_fuel_class = apps.get_model('api', 'ApprovedFuelClass')

    approved_fuel_class.objects.using(db_alias).delete()


def update_partially_renewable_fuel_types_0124(apps, schema_editor):
    """
    Marks some fuel types as partially renewable
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "Biodiesel", "Ethanol", "HDRD", "Natural gas-based gasoline",
            "Renewable diesel", "Renewable gasoline"
        ]
    ).update(
        is_partially_renewable=True
    )


def remove_partially_renewable_fuel_types_0124(apps, schema_editor):
    """
    Sets all fuel types to not be partially renewable
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "Biodiesel", "Ethanol", "HDRD", "Natural gas-based gasoline",
            "Renewable diesel", "Renewable gasoline"
        ]
    ).update(
        is_partially_renewable=False
    )


def update_to_lowercase_0125(apps, schema_editor):
    """
    Sets fuel to lowercase in Renewable Fuel in relation to ...
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'DefaultCarbonIntensityCategory')

    category.objects.using(db_alias).filter(
        name="Renewable Fuel in relation to diesel class fuel"
    ).update(
        name="Renewable fuel in relation to diesel class fuel"
    )

    category.objects.using(db_alias).filter(
        name="Renewable Fuel in relation to gasoline class fuel"
    ).update(
        name="Renewable fuel in relation to gasoline class fuel"
    )


def update_to_uppercase_0125(apps, schema_editor):
    """
    Sets fuel to uppercase in Renewable fuel in relation to ...
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'DefaultCarbonIntensityCategory')

    category.objects.using(db_alias).filter(
        name="Renewable fuel in relation to diesel class fuel"
    ).update(
        name="Renewable Fuel in relation to diesel class fuel"
    )

    category.objects.using(db_alias).filter(
        name="Renewable fuel in relation to gasoline class fuel"
    ).update(
        name="Renewable Fuel in relation to gasoline class fuel"
    )


def add_categories_0127(apps, schema_editor):
    """
    Adds petroleum-based diesel fuel and gasoline categories
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'PetroleumCarbonIntensityCategory')

    category.objects.using(db_alias).bulk_create([
        category(
            name="Petroleum-based diesel",
            display_order=1
        ),
        category(
            name="Petroleum-based gasoline",
            display_order=2
        )
    ])


def remove_categories_0127(apps, schema_editor):
    """
    Removes the petroleum-based categories
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'PetroleumCarbonIntensityCategory')
    category.objects.using(db_alias).delete()


def clean_filenames_0128(apps, schema_editor):
    """
    Removes query strings from urls
    """
    db_alias = schema_editor.connection.alias

    attachments = apps.get_model('api', 'DocumentFileAttachment')

    rows = attachments.objects.using(db_alias).filter(
        url__contains="?"
    )

    for row in rows:
        row.url = row.url.split('?')[0]
        row.save()


def add_compliance_report_types_and_statuses_0133(apps, schema_editor):
    """
    Adds Basic Compliance Report Types and Statuses
    """
    db_alias = schema_editor.connection.alias

    compliance_report_type = apps.get_model('api', 'ComplianceReportType')
    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_type.objects.using(db_alias).bulk_create([
        compliance_report_type(
            the_type='Compliance Report',
            description='Annual Compliance Report',
            display_order=10
        ),
        compliance_report_type(
            the_type='Exclusion Report',
            description='Annual Exclusion Report',
            display_order=20
        )
    ])

    compliance_report_status.objects.using(db_alias).bulk_create([
        compliance_report_status(
            status='Draft',
            display_order=10,
        ),
        compliance_report_status(
            status='Submitted',
            display_order=20,
        ),
        compliance_report_status(
            status='Deleted',
            display_order=5,
        )
    ])


def remove_compliance_report_types_and_statuses_0133(apps, schema_editor):
    """
    Removes Basic Compliance Report Types and Statuses
    """
    db_alias = schema_editor.connection.alias
    compliance_report_type = apps.get_model('api', 'ComplianceReportType')
    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_type.objects.using(db_alias).get(the_type='Compliance Report').delete()
    compliance_report_type.objects.using(db_alias).get(the_type='Exclusion Report').delete()
    compliance_report_status.objects.using(db_alias).get(status='Draft').delete()
    compliance_report_status.objects.using(db_alias).get(status='Submitted').delete()


def add_compliance_reporting_roles_0134(apps, schema_editor):
    """
    Creates the basic permissions for the roles to manage and view
    credit calculation related tables
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    manage_permission = permission.objects.using(db_alias).create(
        code="COMPLIANCE_REPORT_MANAGE",
        name="Manage Compliance Reports",
        description="The ability to create, update, and delete compliance reports"
    )

    manage_role = role_model.objects.using(db_alias).create(
        name="ComplianceReporting",
        description="Compliance Report Manager",
        display_order=1
    )

    role_permissions = []

    role_permissions.append(
        role_permission(
            role=manage_role,
            permission=manage_permission
        )
    )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_compliance_reporting_roles_0134(apps, schema_editor):
    """
    Removes the credit calculation permissions from roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')
    role_model = apps.get_model('api', 'Role')

    manage_permission = permission.objects.using(db_alias).filter(
        code="COMPLIANCE_REPORT_MANAGE"
    ).first()

    if manage_permission:
        role_permission.objects.filter(
            permission_id=manage_permission.id
        ).delete()

    manage_permission.delete()

    manage_role = role_model.objects.using(db_alias).filter(
        name="ComplianceReporting"
    ).first()

    manage_role.delete()


def update_categories_0140(apps, schema_editor):
    """
    Fixes the default carbon intensity category for Renewable diesel and
    Renewable gasoline
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    default_carbon_intensity_category = apps.get_model(
        'api', 'DefaultCarbonIntensityCategory')

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable diesel"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Renewable fuel in relation to diesel class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable gasoline"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Renewable fuel in relation to gasoline class fuel"
        )
    )


def revert_categories_0140(apps, schema_editor):
    """
    Reverts the changes
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    default_carbon_intensity_category = apps.get_model(
        'api', 'DefaultCarbonIntensityCategory')

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable diesel"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable gasoline"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline"
        )
    )


def update_descriptions_0143(apps, schema_editor):
    """
    Updates the provision field with the description.
    Updates the description with the determination_type description
    """
    db_alias = schema_editor.connection.alias

    provision_act = apps.get_model('api', 'ProvisionOfTheAct')
    determination_type = apps.get_model(
        'api', 'CarbonIntensityDeterminationType')

    provisions = provision_act.objects.using(db_alias).all()

    for provision_obj in provisions:
        determination_type_obj = determination_type.objects.using(
            db_alias).get(id=provision_obj.determination_type_id)
        provision_obj.provision = provision_obj.description
        provision_obj.description = determination_type_obj.description
        provision_obj.save()


def revert_descriptions_0143(apps, schema_editor):
    """
    Reverts the changes
    """
    db_alias = schema_editor.connection.alias

    provision_act = apps.get_model('api', 'ProvisionOfTheAct')

    provisions = provision_act.objects.using(db_alias).all()

    for provision_obj in provisions:
        provision_obj.description = provision_obj.provision
        provision_obj.provision = ""
        provision_obj.save()


def update_determination_type_0144(apps, schema_editor):
    """
    Updates the provision field with the description.
    Updates the description with the determination_type description
    """
    db_alias = schema_editor.connection.alias

    approved_fuel_provision = apps.get_model('api', 'ApprovedFuelProvision')
    provision_act = apps.get_model('api', 'ProvisionOfTheAct')

    rows = approved_fuel_provision.objects.using(db_alias).all()

    for row in rows:
        provision = provision_act.objects.using(db_alias).get(
            id=row.provision_id)
        row.determination_type_id = provision.determination_type_id
        row.save()


def remove_determination_type_0144(apps, schema_editor):
    """
    Reverts the changes
    """
    db_alias = schema_editor.connection.alias

    approved_fuel_provision = apps.get_model('api', 'ApprovedFuelProvision')

    rows = approved_fuel_provision.objects.using(db_alias).all()

    for row in rows:
        row.determination_type_id = None
        row.save()


def rename_table_sequences_0151(_apps, schema_editor):
    """
    Renames the table sequences so they match what the name of the actual
    tables are
    """
    if connection.vendor == 'postgresql':
        schema_editor.execute(
            'ALTER SEQUENCE carbon_intensity_determination_type_id_seq '
            'RENAME TO determination_type_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE approved_fuel_provision_id_seq '
            'RENAME TO carbon_intensity_fuel_determination_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE fuel_transport_mode_id_seq '
            'RENAME TO fuel_transport_mode_type_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE fuel_provisions_id_seq '
            'RENAME TO provision_act_id_seq;'
        )


def revert_table_seuqneces_0151(_apps, schema_editor):
    """
    Reverts the changes
    """
    if connection.vendor == 'postgresql':
        schema_editor.execute(
            'ALTER SEQUENCE determination_type_id_seq '
            'RENAME TO carbon_intensity_determination_type_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE carbon_intensity_fuel_determination_id_seq '
            'RENAME TO approved_fuel_provision_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE fuel_transport_mode_type_id_seq '
            'RENAME TO fuel_transport_mode_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE provision_act_id_seq '
            'RENAME TO fuel_provisions_id_seq;'
        )


def add_permission_0152(apps, schema_editor):
    """
    Adds EDIT_FUEL_SUPPLIER permission and adds it to the Managing Users
    role
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', "Permission")
    role = apps.get_model('api', "Role")
    role_permission = apps.get_model('api', "RolePermission")

    permission.objects.using(db_alias).create(
        code="EDIT_FUEL_SUPPLIER",
        description="Allows the user to update the address of their "
                    "organization",
        name="Edit Organization Address"
    )

    role_permission.objects.using(db_alias).create(
        role=role.objects.using(db_alias).get(name="FSAdmin"),
        permission=permission.objects.using(db_alias).get(
            code="EDIT_FUEL_SUPPLIER")
    )


def remove_permission_0152(apps, schema_editor):
    """
    Deletes the EDIT_FUEL_SUPPLIER permission.
    Removes the permission from the Managing Users role first
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', "Permission")
    role_permission = apps.get_model('api', "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code="EDIT_FUEL_SUPPLIER",
        role__name="FSAdmin").delete()

    permission.objects.using(db_alias).filter(
        code="EDIT_FUEL_SUPPLIER"
    ).delete()


def add_effective_dates_0154(apps, schema_editor):
    """
    Adds effective dates to the organization addresses
    """
    db_alias = schema_editor.connection.alias

    organization_address = apps.get_model('api', 'OrganizationAddress')

    organization_address.objects.using(db_alias).update(
        effective_date="2017-01-01"
    )


def remove_effective_dates_0154(apps, schema_editor):
    """
    Sets the effective dates back to null for the organization addresses
    """
    db_alias = schema_editor.connection.alias

    organization_address = apps.get_model('api', 'OrganizationAddress')

    organization_address.objects.using(db_alias).update(
        effective_date=None
    )


def add_compliance_manager_0165(apps, schema_editor):
    """
    Renames the existing Compliance Report Manager to Compliance Reporting
    Adds the Compliance Manager role for government
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', 'Role')

    role.objects.using(db_alias).filter(
        name="ComplianceReporting"
    ).update(
        description="Compliance Reporting"
    )

    role.objects.using(db_alias).create(
        name="GovComplianceManager",
        description="Compliance Manager",
        display_order=12,
        is_government_role=True
    )


def remove_compliance_manager_0165(apps, schema_editor):
    """
    Removes the credit calculation permissions from roles
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', 'Role')

    role.objects.using(db_alias).filter(
        name="GovComplianceManager"
    ).delete()

    role.objects.using(db_alias).filter(
        name="ComplianceReporting"
    ).update(
        description="Compliance Report Manager"
    )


def add_compliance_report_signing_permission_0166(apps, schema_editor):
    """
    Adds the signing compliance report permission and attaches it to
    the Signing Authority role
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    signing_permission = permission.objects.using(db_alias).create(
        code="SIGN_COMPLIANCE_REPORT",
        name="Sign a Compliance Report",
        description="The ability to sign and execute a Credit Transfer "
                    "Proposal."
    )

    role_permission.objects.create(
        role=role.objects.get(name="FSManager"),
        permission=signing_permission
    )


def remove_compliance_report_signing_permission_0166(apps, schema_editor):
    """
    Removes the signing compliance report permission and removes it
    from the role
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    signing_permission = permission.objects.using(db_alias).filter(
        code="SIGN_COMPLIANCE_REPORT"
    ).first()

    if signing_permission:
        role_permission.objects.filter(
            permission_id=signing_permission.id
        ).delete()

    signing_permission.delete()


def add_compliance_report_view_permission_0169(apps, schema_editor):
    """
    Adds the view compliance report permission and attaches it to
    the Compliance Manager role and the Compliance Reporting role
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    view_permission = permission.objects.using(db_alias).create(
        code="VIEW_COMPLIANCE_REPORT",
        name="View Compliance Reports",
        description="The ability to view compliance reports."
    )

    roles = role.objects.using(db_alias).filter(name__in=[
        "ComplianceReporting", "GovComplianceManager"
    ])

    role_permissions = []

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=view_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_compliance_report_view_permission_0169(apps, schema_editor):
    """
    Removes the view compliance report permission and removes it
    from the roles that had it
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    view_permission = permission.objects.using(db_alias).filter(
        code="VIEW_COMPLIANCE_REPORT"
    ).first()

    if view_permission:
        role_permission.objects.filter(
            permission_id=view_permission.id
        ).delete()

    view_permission.delete()


def add_idir_compliance_report_permissions_0171(apps, schema_editor):
    """
    Adds the Recommend Accept and Recommend Rejection for Government
    Analyst role.
    Adds the Recommend Accept and Recommend Rejection for Compliance
    Manager role (These should be different from the ones above, so we
    can distinguish them).
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    recommend_acceptance_perm = permission.objects.using(db_alias).create(
        code="ANALYST_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT",
        name="Recommend Acceptance",
        description="The ability to recommend approval of a compliance "
                    "report. (This is for Government Analyst)"
    )

    recommend_rejection_perm = permission.objects.using(db_alias).create(
        code="ANALYST_RECOMMEND_REJECTION_COMPLIANCE_REPORT",
        name="Recommend Rejection",
        description="The ability to recommend rejection of a compliance "
                    "report. (This is for Government Analyst)"
    )

    role_analyst = role.objects.using(db_alias).get(name="GovUser")

    role_permissions = []

    role_permissions.append(
        role_permission(
            role=role_analyst,
            permission=recommend_acceptance_perm
        )
    )

    role_permissions.append(
        role_permission(
            role=role_analyst,
            permission=recommend_rejection_perm
        )
    )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    recommend_acceptance_perm = permission.objects.using(db_alias).create(
        code="MANAGER_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT",
        name="Recommend Acceptance",
        description="The ability to recommend approval of a compliance "
                    "report. (This is for Compliance Manager)"
    )

    recommend_rejection_perm = permission.objects.using(db_alias).create(
        code="MANAGER_RECOMMEND_REJECTION_COMPLIANCE_REPORT",
        name="Recommend Rejection",
        description="The ability to recommend rejection of a compliance "
                    "report. (This is for Compliance Manager)"
    )

    role_manager = role.objects.using(db_alias).get(
        name="GovComplianceManager"
    )

    role_permissions = []

    role_permissions.append(
        role_permission(
            role=role_manager,
            permission=recommend_acceptance_perm
        )
    )

    role_permissions.append(
        role_permission(
            role=role_manager,
            permission=recommend_rejection_perm
        )
    )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_idir_compliance_report_permissions_0171(apps, schema_editor):
    """
    Removes the view compliance report permission and removes it
    from the roles that had it
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    acceptance_permission = permission.objects.using(db_alias).filter(
        code="ANALYST_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT"
    ).first()

    if acceptance_permission:
        role_permission.objects.filter(
            permission_id=acceptance_permission.id
        ).delete()

    acceptance_permission.delete()

    rejection_permission = permission.objects.using(db_alias).filter(
        code="ANALYST_RECOMMEND_REJECTION_COMPLIANCE_REPORT"
    ).first()

    if rejection_permission:
        role_permission.objects.filter(
            permission_id=rejection_permission.id
        ).delete()

    rejection_permission.delete()

    acceptance_permission = permission.objects.using(db_alias).filter(
        code="MANAGER_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT"
    ).first()

    if acceptance_permission:
        role_permission.objects.filter(
            permission_id=acceptance_permission.id
        ).delete()

    acceptance_permission.delete()

    rejection_permission = permission.objects.using(db_alias).filter(
        code="MANAGER_RECOMMEND_REJECTION_COMPLIANCE_REPORT"
    ).first()

    if rejection_permission:
        role_permission.objects.filter(
            permission_id=rejection_permission.id
        ).delete()

    rejection_permission.delete()


def add_compliance_report_new_statuses_0172(apps, schema_editor):
    """
    Adds Basic Compliance Report Types and Statuses
    """
    db_alias = schema_editor.connection.alias

    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')


    compliance_report_status.objects.using(db_alias).bulk_create([
        compliance_report_status(
            status='Unreviewed',
            display_order=100,
        ),
        compliance_report_status(
            status='Returned',
            display_order=110,
        ),
        compliance_report_status(
            status='Accepted',
            display_order=1,
        ),
        compliance_report_status(
            status='Rejected',
            display_order=2,
        ),
        compliance_report_status(
            status='Recommended',
            display_order=3,
        ),
        compliance_report_status(
            status='Not Recommended',
            display_order=4,
        ),
    ])


def remove_compliance_report_new_statuses_0172(apps, schema_editor):
    """
    Removes Basic Compliance Report Types and Statuses
    """
    db_alias = schema_editor.connection.alias
    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_status.objects.using(db_alias).get(status='Unreviewed').delete()
    compliance_report_status.objects.using(db_alias).get(status='Accepted').delete()
    compliance_report_status.objects.using(db_alias).get(status='Rejected').delete()
    compliance_report_status.objects.using(db_alias).get(status='Returned').delete()
    compliance_report_status.objects.using(db_alias).get(status='Recommended').delete()
    compliance_report_status.objects.using(db_alias).get(status='Not Recommended').delete()


def add_director_compliance_report_permissions_0180(apps, schema_editor):
    """
    Adds the Approve, Reject and View Compliance Reports to
    director positions
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    approve_permission = permission.objects.using(db_alias).create(
        code="APPROVE_COMPLIANCE_REPORT",
        name="Approve Compliance Report",
        description="The ability to make a statuatory decision by approving "
                    "a compliance report"
    )

    reject_permission = permission.objects.using(db_alias).create(
        code="REJECT_COMPLIANCE_REPORT",
        name="Reject Compliance Report",
        description="The ability to make a statuatory decision by rejecting "
                    "a compliance report"
    )

    view_permission = permission.objects.using(db_alias).get(
        code="VIEW_COMPLIANCE_REPORT"
    )

    roles = role.objects.using(db_alias).filter(
        name__in=["GovDirector", "GovDeputyDirector"]
    )

    role_permissions = []

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=approve_permission
            )
        )

        role_permissions.append(
            role_permission(
                role=role,
                permission=reject_permission
            )
        )

        role_permissions.append(
            role_permission(
                role=role,
                permission=view_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_director_compliance_report_permissions_0180(apps, schema_editor):
    """
    Removes the Approve, Reject and View Compliance Reports from
    director positions
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "APPROVE_COMPLIANCE_REPORT",
            "REJECT_COMPLIANCE_REPORT",
            "VIEW_COMPLIANCE_REPORT"
        ],
        role__name__in=["GovDirector", "GovDeputyDirector"]
    ).delete()

    permission.objects.using(db_alias).filter(
        code__in=["APPROVE_COMPLIANCE_REPORT", "REJECT_COMPLIANCE_REPORT"]
    ).delete()


def add_gov_analyst_view_compliance_report_permission_0183(apps, schema_editor):
    """
    Adds the View Compliance Report to the Gov Analyst role
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    view_permission = permission.objects.using(db_alias).get(
        code="VIEW_COMPLIANCE_REPORT"
    )

    role = role.objects.using(db_alias).get(name="GovUser")

    role_permission.objects.using(db_alias).create(
        role=role,
        permission=view_permission
    )


def remove_gov_analyst_view_compliance_report_permission_0183(apps, schema_editor):
    """
    Removes the View Compliance Reports from the Gov Analyst role
    """
    db_alias = schema_editor.connection.alias

    role_permission = apps.get_model('api', 'RolePermission')

    role_permission.objects.using(db_alias).filter(
        permission__code="VIEW_COMPLIANCE_REPORT",
        role__name="GovUser"
    ).delete()


def add_request_supplemental_report_status_0184(apps, schema_editor):
    """
    Adds Requested Supplemental to compliance report statuses
    """
    db_alias = schema_editor.connection.alias

    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_status.objects.using(db_alias).create(
        status='Requested Supplemental',
        display_order=120
    )


def remove_request_supplemental_report_status_0184(apps, schema_editor):
    """
    Removes Requested Supplemental from compliance report statuses
    """
    db_alias = schema_editor.connection.alias
    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_status.objects.using(db_alias).get(
        status='Requested Supplemental'
    ).delete()


def add_permissions_0188(apps, schema_editor):
    """
    Adds the missing permissions from certain roles
    """
    db_alias = schema_editor.connection.alias

    permission_model = apps.get_model(
        'api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    # Compliance Reporting
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "LOGIN", "VIEW_CREDIT_TRANSFERS", "FUEL_CODES_VIEW",
        "CREDIT_CALCULATION_VIEW"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="ComplianceReporting"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # Signing Authority
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "EDIT_FUEL_SUPPLIER", "VIEW_COMPLIANCE_REPORT"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="FSManager"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # File Submission
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "LOGIN", "VIEW_CREDIT_TRANSFERS", "FUEL_CODES_VIEW"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="FSDocSubmit"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # File Submission (Government)
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "LOGIN", "VIEW_CREDIT_TRANSFERS", "EDIT_PRIVILEGED_COMMENTS",
        "DOCUMENTS_LINK_TO_CREDIT_TRADE", "USE_HISTORICAL_DATA_ENTRY",
        "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS",
        "VIEW_APPROVED_CREDIT_TRANSFERS"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="GovDoc"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # Administrator
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "EDIT_PRIVILEGED_COMMENTS", "EDIT_FUEL_SUPPLIER",
        "VIEW_PRIVILEGED_COMMENTS"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="Admin"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # Director / Deputy Director
    roles = role_model.objects.using(db_alias).filter(name__in=[
        "GovDeputyDirector", "GovDirector"
    ])

    role_permissions = []

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=permission_model.objects.using(db_alias).get(
                    code="DOCUMENTS_VIEW"
                )
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # Compliance Manager
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "LOGIN", "VIEW_CREDIT_TRANSFERS", "ADD_COMMENT", "FUEL_CODES_VIEW",
        "PROPOSE_CREDIT_TRANSFER", "CREDIT_CALCULATION_MANAGE",
        "FUEL_CODES_MANAGE", "EDIT_PRIVILEGED_COMMENTS",
        "DOCUMENTS_LINK_TO_CREDIT_TRADE", "EDIT_FUEL_SUPPLIERS",
        "RECOMMEND_CREDIT_TRANSFER", "RESCIND_CREDIT_TRANSFER",
        "DOCUMENTS_GOVERNMENT_REVIEW", "USE_HISTORICAL_DATA_ENTRY",
        "CREDIT_CALCULATION_VIEW", "DOCUMENTS_VIEW", "VIEW_FUEL_SUPPLIERS"
        "VIEW_PRIVILEGED_COMMENTS", "VIEW_APPROVED_CREDIT_TRANSFERS"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="GovComplianceManager"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_permissions_0188(apps, schema_editor):
    """
    Removes the permissions that were added
    """
    db_alias = schema_editor.connection.alias

    role_permission = apps.get_model('api', 'RolePermission')

    # Compliance Reporting
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "LOGIN", "VIEW_CREDIT_TRANSFERS", "FUEL_CODES_VIEW",
            "CREDIT_CALCULATION_VIEW"
        ],
        role__name="ComplianceReporting"
    ).delete()

    # Signing Authority
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "EDIT_FUEL_SUPPLIER", "VIEW_COMPLIANCE_REPORT"
        ],
        role__name="FSManager"
    ).delete()

    # File Submission
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "LOGIN", "VIEW_CREDIT_TRANSFERS", "FUEL_CODES_VIEW"
        ],
        role__name="FSDocSubmit"
    ).delete()

    # File Submission (Government)
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "LOGIN", "VIEW_CREDIT_TRANSFERS", "EDIT_PRIVILEGED_COMMENTS",
            "DOCUMENTS_LINK_TO_CREDIT_TRADE", "USE_HISTORICAL_DATA_ENTRY",
            "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS",
            "VIEW_APPROVED_CREDIT_TRANSFERS"
        ],
        role__name="GovDoc"
    ).delete()

    # Administrator
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "EDIT_PRIVILEGED_COMMENTS", "EDIT_FUEL_SUPPLIER",
            "VIEW_PRIVILEGED_COMMENTS"
        ],
        role__name="Admin"
    ).delete()

    # Director / Deputy Director
    role_permission.objects.using(db_alias).filter(
        permission__code="DOCUMENTS_VIEW",
        role__name__in=["GovDeputyDirector", "GovDirector"]
    ).delete()

    # Compliance Manager
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "LOGIN", "VIEW_CREDIT_TRANSFERS", "ADD_COMMENT", "FUEL_CODES_VIEW",
            "PROPOSE_CREDIT_TRANSFER", "CREDIT_CALCULATION_MANAGE",
            "FUEL_CODES_MANAGE", "EDIT_PRIVILEGED_COMMENTS",
            "DOCUMENTS_LINK_TO_CREDIT_TRADE", "EDIT_FUEL_SUPPLIERS",
            "RECOMMEND_CREDIT_TRANSFER", "RESCIND_CREDIT_TRANSFER",
            "DOCUMENTS_GOVERNMENT_REVIEW", "USE_HISTORICAL_DATA_ENTRY",
            "CREDIT_CALCULATION_VIEW", "DOCUMENTS_VIEW", "VIEW_FUEL_SUPPLIERS"
            "VIEW_PRIVILEGED_COMMENTS", "VIEW_APPROVED_CREDIT_TRANSFERS"
        ],
        role__name="GovComplianceManager"
    ).delete()


def set_default_role_0192(apps, schema_editor):
    """
    Set FSNoAccess (Guest) as a default role
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', 'Role')

    guest_role = role.objects.using(db_alias).get(name="FSNoAccess")

    guest_role.default_role = True
    guest_role.save()


def remove_default_role_0192(apps, schema_editor):
    """
    Unflag all default roles
    """
    db_alias = schema_editor.connection.alias

    role_model = apps.get_model('api', 'Role')
    default_roles = role_model.objects.using(db_alias).filter(
        default_role=True
    )

    for role in default_roles:
        role.default_role = False
        role.save()


def add_permissions_0197(apps, schema_editor):
    """
    Adds the some permissions to the guest role
    Adjusts some permissions from the compliance manager
    """
    db_alias = schema_editor.connection.alias

    permission_model = apps.get_model('api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    # Guest
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "VIEW_COMPLIANCE_REPORT", "DOCUMENTS_VIEW", "FUEL_CODES_VIEW",
        "CREDIT_CALCULATION_VIEW"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="FSNoAccess"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # Compliance Reporting
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="ComplianceReporting"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    role_permission.objects.using(db_alias).filter(
        permission__code="ADD_COMMENT",
        role__name="FSAdmin"
    ).delete()


def remove_permissions_0197(apps, schema_editor):
    """
    Reverts the permissions back to how it was
    """
    db_alias = schema_editor.connection.alias

    permission_model = apps.get_model('api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    # Compliance Reporting
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS"
        ],
        role__name="ComplianceReporting"
    ).delete()

    # Managing Users
    role_permission.objects.using(db_alias).create(
        role=role_model.objects.using(db_alias).get(
            name="FSAdmin"
        ),
        permission=permission_model.objects.using(db_alias).get(
            code="ADD_COMMENT"
        )
    )

    # Guest
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "VIEW_COMPLIANCE_REPORT", "DOCUMENTS_VIEW", "FUEL_CODES_VIEW",
            "CREDIT_CALCULATION_VIEW"
        ],
        role__name="FSNoAccess"
    ).delete()


def add_permissions_0198(apps, schema_editor):
    """
    Adds the some permissions to the guest role
    Adjusts some permissions from the compliance manager
    """
    db_alias = schema_editor.connection.alias

    permission_model = apps.get_model('api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    # Compliance Reporting
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS"
        ],
        role__name="ComplianceReporting"
    ).delete()

    # Compliance Manager (IDIR)
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="GovComplianceManager"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_permissions_0198(apps, schema_editor):
    """
    Reverts the permissions back to how it was
    """
    db_alias = schema_editor.connection.alias

    permission_model = apps.get_model('api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    # Compliance Reporting
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="ComplianceReporting"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # Compliance Manager (IDIR)
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS"
        ],
        role__name="GovComplianceManager"
    ).delete()


class Migration(migrations.Migration):

    replaces = [('api', '0207_alter_notificationsubscription_notification_type')]

    dependencies = [
        ('api', '0001_squashed_0207_alter_notificationsubscription_notification_type'),
    ]

    operations = [
        migrations.RunPython(
            code=create_initial_data_0023,
        ),
        migrations.RunPython(
            code=create_permissions_0025,
            reverse_code=delete_permissions_0025,
        ),
        migrations.RunPython(
            code=create_notification_channels_0026,
            reverse_code=delete_notification_channels_0026,
        ),
        migrations.RunPython(
            code=update_organization_name_0029,
            reverse_code=revert_organization_name_0029,
        ),
        migrations.RunPython(
            code=update_roles_descriptions_0032,
            reverse_code=revert_roles_descriptions_0032,
        ),
        migrations.RunPython(
            code=update_permissions_0033,
            reverse_code=revert_permissions_0033,
        ),
        migrations.RunPython(
            code=update_permissions_0034,
            reverse_code=revert_permissions_0034,
        ),
        migrations.RunPython(
            code=update_permissions_0035,
            reverse_code=revert_permissions_0035,
        ),
        migrations.RunPython(
            code=update_status_0036,
            reverse_code=revert_status_0036,
        ),
        migrations.RunPython(
            code=add_role_0037,
            reverse_code=delete_role_0037,
        ),
        migrations.RunPython(
            code=update_permissions_0039,
            reverse_code=revert_permissions_0039,
        ),
        migrations.RunPython(
            code=update_description_0042,
            reverse_code=revert_description_0042,
        ),
        migrations.RunPython(
            code=update_permissions_0043,
            reverse_code=revert_permissions_0043,
        ),
        migrations.RunPython(
            code=create_initial_data_0046,
        ),
        migrations.RunPython(
            code=update_document_types_0052,
            reverse_code=revert_document_types_0052,
        ),
        migrations.RunPython(
            code=update_organization_descriptions_0054,
            reverse_code=revert_organization_descriptions_0054,
        ),
        migrations.RunPython(
            code=update_permission_names_0055,
            reverse_code=revert_permission_names_0055,
        ),
        migrations.RunPython(
            code=add_comment_permission_0059,
            reverse_code=remove_comment_permission_0059,
        ),
        migrations.RunPython(
            code=add_compliance_period_permission_0063,
        ),
        migrations.RunPython(
            code=add_new_document_statuses_0064,
        ),
        migrations.RunPython(
            code=remove_view_compliance_permission_0067,
            reverse_code=add_view_compliance_permission_0067,
        ),
        migrations.RunPython(
            code=rename_to_compliance_reporting_materials_0068,
            reverse_code=revert_to_fuel_supply_records_0068,
        ),
        migrations.RunPython(
            code=rename_to_credit_reduction_0070,
            reverse_code=revert_to_credit_retirement_0070,
        ),
        migrations.RunPython(
            code=rename_to_file_submission_0071,
            reverse_code=revert_to_document_upload_0071,
        ),
        migrations.RunPython(
            code=add_document_statuses_0074,
            reverse_code=remove_document_statuses_0074,
        ),
        migrations.RunPython(
            code=remove_document_status_0075,
            reverse_code=add_document_status_0075,
        ),
        migrations.RunPython(
            code=add_document_status_0076,
            reverse_code=remove_document_status_0076,
        ),
        migrations.RunPython(
            code=add_document_link_permission_0082,
            reverse_code=remove_document_link_permission_0082,
        ),
        migrations.RunPython(
            code=add_fuel_code_statuses_0085,
            reverse_code=remove_fuel_code_statuses_0085,
        ),
        migrations.RunPython(
            code=add_fuel_code_permissions_0087,
            reverse_code=remove_fuel_code_permissions_0087,
        ),
        migrations.RunPython(
            code=update_fuel_code_status_effective_dates_0090,
            reverse_code=remove_fuel_code_status_effective_dates_0090,
        ),
        migrations.RunPython(
            code=rename_fsdoc_role_0091,
            reverse_code=revert_rename_fsdoc_role_0091,
        ),
        migrations.RunPython(
            code=add_transport_modes_and_approved_fuels_0093,
            reverse_code=remove_transport_modes_and_approved_fuels_0093,
        ),
        migrations.RunPython(
            code=add_trgrm_extension_0096,
        ),
        migrations.RunPython(
            code=add_autocomplete_indices_0097,
        ),
        migrations.RunPython(
            code=rename_submitted_status_0098,
            reverse_code=revert_submitted_status_0098,
        ),
        migrations.RunPython(
            code=add_natural_gas_based_gasoline_0099,
            reverse_code=remove_natural_gas_based_gasoline_0099,
        ),
        migrations.RunPython(
            code=add_credit_calculation_permissions_0105,
            reverse_code=remove_credit_calculation_permissions_0105,
        ),
        migrations.RunPython(
            code=add_fuel_classes_0106,
            reverse_code=remove_fuel_classes_0106,
        ),
        migrations.RunPython(
            code=add_credit_calculation_fuel_types_0111,
            reverse_code=remove_credit_calculation_fuel_types_0111,
        ),
        migrations.RunPython(
            code=add_categories_0114,
            reverse_code=remove_categories_0114,
        ),
        migrations.RunPython(
            code=add_categories_0116,
            reverse_code=remove_categories_0116,
        ),
        migrations.RunPython(
            code=add_unit_of_measures_0117,
            reverse_code=remove_unit_of_measures_0117,
        ),
        migrations.RunPython(
            code=add_descriptions_0119,
            reverse_code=remove_descriptions_0119,
        ),
        migrations.RunPython(
            code=add_fuel_class_relationships_0121,
            reverse_code=remove_fuel_class_relationships_0121,
        ),
        migrations.RunPython(
            code=update_partially_renewable_fuel_types_0124,
            reverse_code=remove_partially_renewable_fuel_types_0124,
        ),
        migrations.RunPython(
            code=update_to_lowercase_0125,
            reverse_code=update_to_uppercase_0125,
        ),
        migrations.RunPython(
            code=add_categories_0127,
            reverse_code=remove_categories_0127,
        ),
        migrations.RunPython(
            code=clean_filenames_0128,
        ),
        migrations.RunPython(
            code=add_compliance_report_types_and_statuses_0133,
            reverse_code=remove_compliance_report_types_and_statuses_0133,
        ),
        migrations.RunPython(
            code=add_compliance_reporting_roles_0134,
            reverse_code=remove_compliance_reporting_roles_0134,
        ),
        migrations.RunPython(
            code=update_categories_0140,
            reverse_code=revert_categories_0140,
        ),
        migrations.RunPython(
            code=update_descriptions_0143,
            reverse_code=revert_descriptions_0143,
        ),
        migrations.RunPython(
            code=update_determination_type_0144,
            reverse_code=remove_determination_type_0144,
        ),
        migrations.RunPython(
            code=rename_table_sequences_0151,
            reverse_code=revert_table_seuqneces_0151,
        ),
        migrations.RunPython(
            code=add_permission_0152,
            reverse_code=remove_permission_0152,
        ),
        migrations.RunPython(
            code=add_effective_dates_0154,
            reverse_code=remove_effective_dates_0154,
        ),
        migrations.RunPython(
            code=add_compliance_manager_0165,
            reverse_code=remove_compliance_manager_0165,
        ),
        migrations.RunPython(
            code=add_compliance_report_signing_permission_0166,
            reverse_code=remove_compliance_report_signing_permission_0166,
        ),
        migrations.RunPython(
            code=add_compliance_report_view_permission_0169,
            reverse_code=remove_compliance_report_view_permission_0169,
        ),
        migrations.RunPython(
            code=add_idir_compliance_report_permissions_0171,
            reverse_code=remove_idir_compliance_report_permissions_0171,
        ),
        migrations.RunPython(
            code=add_compliance_report_new_statuses_0172,
            reverse_code=remove_compliance_report_new_statuses_0172,
        ),
        migrations.RunPython(
            code=add_director_compliance_report_permissions_0180,
            reverse_code=remove_director_compliance_report_permissions_0180,
        ),
        migrations.RunPython(
            code=add_gov_analyst_view_compliance_report_permission_0183,
            reverse_code=remove_gov_analyst_view_compliance_report_permission_0183,
        ),
        migrations.RunPython(
            code=add_request_supplemental_report_status_0184,
            reverse_code=remove_request_supplemental_report_status_0184,
        ),
        migrations.RunPython(
            code=add_permissions_0188,
            reverse_code=remove_permissions_0188,
        ),
        migrations.RunPython(
            code=set_default_role_0192,
            reverse_code=remove_default_role_0192,
        ),
        migrations.RunPython(
            code=add_permissions_0197,
            reverse_code=remove_permissions_0197,
        ),
        migrations.RunPython(
            code=add_permissions_0198,
            reverse_code=remove_permissions_0198,
        ),
    ]