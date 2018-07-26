from datetime import datetime

from django.db import migrations, IntegrityError
from django.db.migrations import RunPython


def create_initial_data(apps, schema_editor):
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
        role(name='Admin', description='A System Administrator in the application with User Management and Roles and Permissions access.', is_government_role=True),
        role(name='FSManager', description='A Fuel Supplier user with authority to act on behalf of the Fuel Supplier on Credit Transfers.', is_government_role=False),
        role(name='FSUser', description='A Fuel Supplier user with limited abilities to take actions.', is_government_role=False),
        role(name='GovDirector', description='A government user with authorization to Approve Credit Transfers.', is_government_role=True),
        role(name='GovUser', description='A regular government user in the system.', is_government_role=True)
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


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_audit_tables'),
    ]

    operations = [
        # This is a one-way trip
        RunPython(create_initial_data, reverse_code=None)
    ]
