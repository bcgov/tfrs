from django.db import migrations
from django.db.migrations import RunPython


def create_permissions(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")

    permission.objects.using(db_alias).bulk_create([
        permission(code='LOGIN', name='LOGIN', description='A minimum permission needed for an authenticated user to access the system.'),
        permission(code='ADMIN', name='System Administrator', description='Gives the user System Administration power in the system. Assignment of this permission should go to a very limited set of users an an as needed/backup basis.'),
        permission(code='USER_MANAGEMENT', name='User Management', description='Gives the user access to the User Management screens'),
        permission(code='ROLES_AND_PERMISSIONS', name='Roles and Permissions', description='Gives the user access to the Roles and Permissions screens'),
        permission(code='ADD_FS_USER', name='Add Fuel Supplier User', description='Add Fuel Supplier User'),
        permission(code='VIEW_APPROVED_CREDIT_TRANSFERS', name='View Approved Credit Transfers', description='View Approved Credit Transfers'),
        permission(code='VIEW_CREDIT_TRANSFERS', name='View Credit Transfers', description='View Credit Transfers'),
        permission(code='VIEW_FUEL_SUPPLIERS', name='View Fuel Suppliers', description='View Fuel Suppliers'),
        permission(code='PROPOSE_CREDIT_TRANSFER', name='Propose Credit Transfer', description='Propose Credit Transfer'),
        permission(code='RESCIND_CREDIT_TRANSFER', name='Rescind Credit Transfer', description='Rescind Credit Transfer'),
        permission(code='REFUSE_CREDIT_TRANSFER', name='Refuse Credit Transfer', description='Refuse Credit Transfer'),
        permission(code='SIGN_CREDIT_TRANSFER', name='Sign Credit Transfer', description='Sign Credit Transfer'),
        permission(code='RECOMMEND_CREDIT_TRANSFER', name='Recommend Credit Transfer', description='Recommend/Not Recommend Credit Transfer'),
        permission(code='DECLINE_CREDIT_TRANSFER', name='Decline Transfer', description='Decline Transfer'),
        permission(code='APPROVE_CREDIT_TRANSFER', name='Approve Transfer', description='Approve Transfer'),
        permission(code='VIEW_PRIVILEGED_COMMENTS', name='View Privileged Comments', description='Gives the user access to view privileged comments'),
        permission(code='EDIT_PRIVILEGED_COMMENTS', name='Edit Privileged Comments', description='Gives the user access to edit privileged comments'),
        permission(code='VIEW_COMPLIANCE_PERIODS', name='View Compliance Periods', description='Gives the user access to view compliance periods'),
        permission(code='EDIT_COMPLIANCE_PERIODS', name='Edit Compliance Periods', description='Gives the user access to edit compliance periods')
    ])


def drop_permissions(apps, schema_editor):
    db_alias = schema_editor.connection.alias
    permission = apps.get_model("api", "Permission")

    permission.objects.using(db_alias).filter(code='LOGIN').delete()
    permission.objects.using(db_alias).filter(code='ADMIN').delete()
    permission.objects.using(db_alias).filter(code='USER_MANAGEMENT').delete()
    permission.objects.using(db_alias).filter(code='ROLES_AND_PERMISSIONS').delete()
    permission.objects.using(db_alias).filter(code='ADD_FS_USER').delete()
    permission.objects.using(db_alias).filter(code='VIEW_APPROVED_CREDIT_TRANSFERS').delete()
    permission.objects.using(db_alias).filter(code='VIEW_CREDIT_TRANSFERS').delete()
    permission.objects.using(db_alias).filter(code='VIEW_FUEL_SUPPLIERS').delete()
    permission.objects.using(db_alias).filter(code='PROPOSE_CREDIT_TRANSFER').delete()
    permission.objects.using(db_alias).filter(code='RESCIND_CREDIT_TRANSFER').delete()
    permission.objects.using(db_alias).filter(code='REFUSE_CREDIT_TRANSFER').delete()
    permission.objects.using(db_alias).filter(code='SIGN_CREDIT_TRANSFER').delete()
    permission.objects.using(db_alias).filter(code='RECOMMEND_CREDIT_TRANSFER').delete()
    permission.objects.using(db_alias).filter(code='DECLINE_CREDIT_TRANSFER').delete()
    permission.objects.using(db_alias).filter(code='APPROVE_CREDIT_TRANSFER').delete()

    permission.objects.using(db_alias).filter(code='VIEW_PRIVILEGED_COMMENTS').delete()
    permission.objects.using(db_alias).filter(code='EDIT_PRIVILEGED_COMMENTS').delete()
    permission.objects.using(db_alias).filter(code='VIEW_COMPLIANCE_PERIODS').delete()
    permission.objects.using(db_alias).filter(code='EDIT_COMPLIANCE_PERIODS').delete()

def create_credit_trade_statuses(apps, schema_editor):
    db_alias = schema_editor.connection.alias
    ct_status = apps.get_model("api", "CreditTradeStatus")

    ct_status.objects.using(db_alias).bulk_create([
        ct_status(id=1, status='Draft', description='The Credit Transfer has been created but is only visible to the initiating organization.', display_order=1, effective_date='2017-01-01'),
        ct_status(id=2, status='Submitted', description='The Credit Transfer Proposal has been created and is visible to both the initiating and responding Fuel Suppliers, and is waiting on the response from the Respondent.', display_order=2, effective_date='2017-01-01'),
        ct_status(id=3, status='Accepted', description='The Credit Transfer has been accepted by the Respondent and is waiting on approval by the Director.', display_order=3, effective_date='2017-01-01'),
        ct_status(id=4, status='Recommended', description='The Credit Transfer has been has been reviewed by a Government Analyst and is Recommended for Approval  by the Director.', display_order=4, effective_date='2017-01-01'),
        ct_status(id=5, status='Not Recommended', description='The Credit Transfer has been has been reviewed by a Government Analyst and is Not Recommended for Approval by the Director.', display_order=4, effective_date='2017-01-01'),
        ct_status(id=6, status='Approved', description='The Credit Transfer has been has been approved by the Director and will be Completed as soon as the Effective Date of the Credit Trade has been reached.', display_order=5, effective_date='2017-01-01'),
        ct_status(id=7, status='Completed', description='The Credit Transfer has been Completed and the Credit Balance(s) of the Fuel Supplier(s) has been updated.', display_order=6, effective_date='2017-01-01'),
        ct_status(id=8, status='Cancelled', description='The Credit Transfer has been cancelled by one of the participants in the Credit Trade. Shows up as Rescinded or Refused.', display_order=7, effective_date='2017-01-01'),
        ct_status(id=9, status='Declined', description='The Credit Transfer has been rejected by the Director.', display_order=8, effective_date='2017-01-01'),
        ct_status(id=10, status='Refused', description='The Credit Transfer has been refused by the Respondent.', display_order=9, effective_date='2017-01-01')

    ])

def drop_credit_trade_statuses(apps, schema_editor):
    db_alias = schema_editor.connection.alias
    ct_status = apps.get_model("api", "CreditTradeStatus")

    ct_status.objects.using(db_alias).filter(status='Refused').delete()
    ct_status.objects.using(db_alias).filter(status='Declined').delete()
    ct_status.objects.using(db_alias).filter(status='Cancelled').delete()
    ct_status.objects.using(db_alias).filter(status='Completed').delete()
    ct_status.objects.using(db_alias).filter(status='Approved').delete()
    ct_status.objects.using(db_alias).filter(status='Not Recommended').delete()
    ct_status.objects.using(db_alias).filter(status='Recommended').delete()
    ct_status.objects.using(db_alias).filter(status='Accepted').delete()
    ct_status.objects.using(db_alias).filter(status='Submitted').delete()
    ct_status.objects.using(db_alias).filter(status='Draft').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_audit_tables'),
    ]

    operations = [
        RunPython(create_permissions, drop_permissions),
        RunPython(create_credit_trade_statuses, drop_credit_trade_statuses)
    ]
