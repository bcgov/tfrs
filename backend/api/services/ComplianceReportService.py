import json
import re
from collections import defaultdict, namedtuple
from decimal import Decimal

from django.db.models import Q
from django.db.transaction import on_commit

from api.models.ComplianceReport import ComplianceReport, \
    ComplianceReportWorkflowState, ComplianceReportStatus
from api.models.ComplianceReportHistory import ComplianceReportHistory
from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType
from api.models.Organization import Organization
from api.services.CreditTradeService import CreditTradeService

from api.notifications.notification_types import NotificationType
from api.async_tasks import async_send_notifications
from tfrs import settings

Delta = namedtuple('Delta', ['path', 'field', 'action', 'old_value', 'new_value'])


class ComplianceReportService(object):
    """
    Helper functions for Compliance Reporting
    """

    @staticmethod
    def _array_difference(ancestor, current, field, path, i=0):
        longest = max(len(ancestor[field]) if field in ancestor else 0,
                      len(current[field]) if field in current else 0)

        if i >= longest:
            return []

        if i >= len(current[field]):
            return [
                       Delta(path='.'.join(path),
                             field='{}[{}]'.format(field, i),
                             action='removed',
                             old_value=ancestor[field][i],
                             new_value=None)._asdict()
                   ] + ComplianceReportService._array_difference(ancestor, current, field, path, i + 1)

        if i >= len(ancestor[field]):
            return [
                       Delta(path='.'.join(path),
                             field='{}[{}]'.format(field, i),
                             action='added',
                             old_value=None,
                             new_value=current[field][i])._asdict()
                   ] + ComplianceReportService._array_difference(ancestor, current, field, path, i + 1)

        if isinstance(current[field][i], dict):
            comparison = ComplianceReportService.compute_delta(current[field][i],
                                                               ancestor[field][i],
                                                               path=path + ['{}[{}]'.format(field, i)])

            return comparison + ComplianceReportService._array_difference(ancestor, current, field, path, i + 1)

        if str(current[field][i]) != str(ancestor[field][i]):
            return [
                       Delta(path='.'.join(path),
                             field='{}[{}]'.format(field, i),
                             action='modified',
                             old_value=ancestor[field][i],
                             new_value=current[field][i])._asdict()
                   ] + ComplianceReportService._array_difference(ancestor, current, field, path, i + 1)

        return ComplianceReportService._array_difference(ancestor, current, field, path, i + 1)

    @staticmethod
    def compute_delta(snapshot, ancestor_snapshot, path=[]):

        differences = []

        blacklist_keys = ['id', 'deltas', 'timestamp', 'status',
                          'read_only', 'actions', 'version', 'timestamp',
                          'history', 'actor', 'has_snapshot', 'is_supplemental',
                          'display_name', 'nickname', 'supplemental_note']

        if snapshot is None and ancestor_snapshot is not None:
            differences += [Delta(path='.'.join(path),
                                  field=path[len(path)-1],
                                  action='removed',
                                  old_value=ancestor_snapshot,
                                  new_value=None)._asdict()]
            return differences

        if ancestor_snapshot is None and snapshot is not None:
            differences += [Delta(path='.'.join(path),
                                  field=path[len(path)-1],
                                  action='added',
                                  old_value=None,
                                  new_value=snapshot)._asdict()]
            return differences

        if ancestor_snapshot is None and snapshot is None:
            return differences

        for k in snapshot.keys():
            if k in blacklist_keys:
                continue
            current_path = path + [k]
            if k not in ancestor_snapshot:
                differences += [Delta(path='.'.join(path),
                                      field=k,
                                      action='added',
                                      old_value=None,
                                      new_value=snapshot[k])._asdict()]
                continue
            if isinstance(snapshot[k], dict):
                comparison = ComplianceReportService.compute_delta(snapshot[k],
                                                                   ancestor_snapshot[k],
                                                                   path=current_path)
                if len(comparison) > 0:
                    differences += comparison
                continue
            if isinstance(snapshot[k], list):

                if re.match('schedule_d\.sheets\[\d+\]\.outputs','.'.join(path + [k])):
                    # looks like schedule d output sheet. sorting by description for
                    # stability of deltas
                    ancestor_snapshot[k] = sorted(ancestor_snapshot[k], key=lambda o: o['description'])
                    snapshot[k] = sorted(snapshot[k], key=lambda o: o['description'])

                differences += ComplianceReportService._array_difference(ancestor_snapshot, snapshot, k, path)
                continue
            if str(snapshot[k]) != str(ancestor_snapshot[k]):
                differences += [Delta(path='.'.join(path),
                                      field=k,
                                      action='modified',
                                      old_value=ancestor_snapshot[k],
                                      new_value=snapshot[k])._asdict()]

        for k in ancestor_snapshot.keys():
            if k in blacklist_keys:
                continue
            if k not in snapshot:
                differences += [Delta(path='.'.join(path),
                                      field=k,
                                      action='removed',
                                      old_value=ancestor_snapshot[k],
                                      new_value=None)._asdict()]

        return differences

    @staticmethod
    def get_organization_compliance_reports(organization,value=None):
        """
        Fetch the compliance reports with various rules based on the user's
        organization
        """
        # Government Organization -- assume OrganizationType id 1 is gov
        gov_org = Organization.objects.get(type=1)
        if organization == gov_org:
            # If organization == Government
            #  don't show "Draft" transactions
            #  don't show "Deleted" transactions
            compliance_reports = ComplianceReport.objects.filter(
                ~Q(status__fuel_supplier_status__status__in=[
                    "Draft", "Deleted"
                ])
            ).select_related("status") \
                .select_related("type")
        else:
            # If organization == Fuel Supplier
            # Show all compliance reports for which we are the organization
            compliance_reports = ComplianceReport.objects.filter(
                Q(organization=organization) &
                ~Q(status__fuel_supplier_status__status__in=["Deleted"])
            ).select_related("status") \
                .select_related("type")

        return compliance_reports

    @staticmethod
    def create_history(compliance_report, is_new=False):
        """
        Create the CreditTradeHistory
        """
        user = (
            compliance_report.create_user
            if is_new or compliance_report.update_user is None
            else compliance_report.update_user)

        role_id = None

        if user:
            if user.roles.filter(name="GovDirector").exists():
                role_id = user.roles.get(name="GovDirector").id
            elif user.roles.filter(name="GovDeputyDirector").exists():
                role_id = user.roles.get(name="GovDeputyDirector").id
            else:
                role_id = user.roles.first().id

        history = ComplianceReportHistory.objects.filter(
            Q(compliance_report_id=compliance_report.id) &
            Q(status__fuel_supplier_status__status=compliance_report.status.fuel_supplier_status_id) &
            Q(status__analyst_status__status=compliance_report.status.analyst_status_id) &
            Q(status__manager_status__status=compliance_report.status.manager_status_id) &
            Q(status__director_status__status=compliance_report.status.director_status_id))
        # if a history record is already present with same status then don't create a new one.
        if len(history) > 0:
            return
        
        created_status = ComplianceReportWorkflowState.objects.create(
            fuel_supplier_status=compliance_report.status.fuel_supplier_status,
            analyst_status=compliance_report.status.analyst_status,
            manager_status=compliance_report.status.manager_status,
            director_status=compliance_report.status.director_status
        )
        created_status.save()

        history = ComplianceReportHistory(
            compliance_report_id=compliance_report.id,
            status_id=created_status.id,
            create_user=user,
            user_role_id=role_id
        )

        history.save()

    @staticmethod
    def create_director_transactions(compliance_report, creating_user):
        """
        Validate or Reduce credits when the director accepts a compliance
        report

        Always use the snapshot as the basis for calculation, so we don't
        recompute anything and possibly alter the values

        :param compliance_report:
        :return:
        """
        previous_transactions = []
        current = compliance_report
        is_supplemental = False

        if current.supplements:
            is_supplemental = True

        while current.supplements is not None:
            current = current.supplements
            if current.credit_transaction is not None:
                previous_transactions.append(current.credit_transaction)

        total_previous_reduction = Decimal(0.0)
        total_previous_validation = Decimal(0.0)

        for transaction in previous_transactions:
            if transaction.type.the_type in ['Credit Validation']:
                total_previous_validation += transaction.number_of_credits
            if transaction.type.the_type in ['Credit Reduction']:
                total_previous_reduction += transaction.number_of_credits

        if settings.DEVELOPMENT:
            print('we have {} previous transactions to consider'.format(len(previous_transactions)))
            print('Total of previous reductions: {}'.format(total_previous_reduction))
            print('Total of previous validations: {}'.format(total_previous_validation))

        if compliance_report.snapshot is None:
            raise InvalidStateException()

        snapshot = compliance_report.snapshot
        COMPLIANCE_PERIOD_2023_AND_ABOVE = int(snapshot['compliance_period']['description']) >= 2023

        if 'summary' not in snapshot:
            raise InvalidStateException()
        if 'lines' not in snapshot['summary']:
            raise InvalidStateException()

        lines = snapshot['summary']['lines']
        if COMPLIANCE_PERIOD_2023_AND_ABOVE:
            # If a compliance report is in a deficit position(i.e., a negative net compliance unit balance for the
            # compliance period or negative value in Line 25 in the summary section) that is greater than
            # the organization’s available credit balance, then the available compliance unit balance needs to be
            # zeroed out when the director assesses (accepts) the compliance report.
            if Decimal(lines['25']) < Decimal(0) \
            and (Decimal(lines['29A']) + Decimal(lines['25'])) < 0:
                required_credit_transaction = Decimal(lines['29A']) * Decimal(-1.0)
            else:
                desired_net_credit_balance_change = Decimal(lines['25'])
                required_credit_transaction = desired_net_credit_balance_change - \
                                              (total_previous_validation - total_previous_reduction)
        else:
            desired_net_credit_balance_change = Decimal(0.0)

            if Decimal(lines['25']) > Decimal(0):
                desired_net_credit_balance_change = Decimal(lines['25'])
            elif Decimal(lines['25']) < 0 and Decimal(lines['26']) > Decimal(0):
                desired_net_credit_balance_change = Decimal(lines['26']) * Decimal(-1.0)

            required_credit_transaction = desired_net_credit_balance_change - \
                                        (total_previous_validation - total_previous_reduction)

            if settings.DEVELOPMENT:
                print('line 25 of current report: {}'.format(lines['25']))
                print('desired credit balance change: {}'.format(desired_net_credit_balance_change))
                print('required transaction to effect change: {}'.format(required_credit_transaction))

            if is_supplemental and Decimal(lines['25']) < 0 and \
                    (Decimal(lines['26']) + Decimal(lines['25'])) > 0:
                required_credit_transaction = Decimal(lines['26']) + Decimal(lines['25'])

            # Code 26C is used to identify credits that must be refunded to the supplier.
            # This occurs when our debit position decreases and we have already spent credits. 
            # In such cases, any excess credits must be returned to the supplier.
            if is_supplemental and Decimal(lines.get('26C', 0)) > 0:
                print("*** DIRECTOR 26C Increase to Credits ***")
                required_credit_transaction = Decimal(lines['26C'])
            
        if required_credit_transaction > Decimal(0):
            # do validation for Decimal(lines['25'])
            credit_transaction = CreditTrade(
                initiator=Organization.objects.get(id=1),
                respondent=compliance_report.organization,
                status=CreditTradeStatus.objects.get(status='Draft'),
                type=CreditTradeType.objects.get(the_type='Credit Validation'),
                number_of_credits=required_credit_transaction,
                compliance_period=compliance_report.compliance_period,
                create_user=creating_user,
                update_user=creating_user
            )
            credit_transaction.save()
            credit_transaction.refresh_from_db()
            CreditTradeService.approve(credit_transaction)
            compliance_report.credit_transaction = credit_transaction
            compliance_report.save()
            CreditTradeService.pvr_notification(None, credit_transaction)
        else:
            if required_credit_transaction < Decimal(0):
                if COMPLIANCE_PERIOD_2023_AND_ABOVE:
                    # Fetch the organization's balance from organization_balance property
                    org_balance = Decimal(compliance_report.organization.organization_balance['validated_credits'])
                    
                    # Deduct the pending deductions, if any, from the organization balance.
                    if 'deductions' in compliance_report.organization.organization_balance:
                        org_balance -= Decimal(compliance_report.organization.organization_balance['deductions'])
                    
                    # If required_credit_transaction is more negative than the organization balance,
                    # set it to be equal to the organization balance.
                    if org_balance + required_credit_transaction < Decimal(0):
                        required_credit_transaction = -org_balance

                credit_transaction = CreditTrade(
                    initiator=Organization.objects.get(id=1),
                    respondent=compliance_report.organization,
                    status=CreditTradeStatus.objects.get(status='Draft'),
                    type=CreditTradeType.objects.get(
                        the_type='Credit Reduction'
                    ),
                    number_of_credits=required_credit_transaction * Decimal(-1.0),
                    compliance_period=compliance_report.compliance_period,
                    create_user=creating_user,
                    update_user=creating_user
                )
                credit_transaction.save()
                credit_transaction.refresh_from_db()
                CreditTradeService.approve(credit_transaction)
                compliance_report.credit_transaction = credit_transaction
                compliance_report.save()
                CreditTradeService.pvr_notification(None, credit_transaction)

    @staticmethod
    def dispatch_notifications(
            previous_status,
            compliance_report: ComplianceReport
    ):
        if compliance_report.type.the_type == 'Exclusion Report':
            status, message, notification_type = ComplianceReportService.\
                get_exclusion_report_notification_message(
                    previous_status, compliance_report
                )
        else:
            status, message, notification_type = ComplianceReportService.\
                get_compliance_report_notification_message(
                    previous_status, compliance_report
                )

        interested_parties = []

        if status in [
                'Accepted',
                'Draft',
                'Rejected',
                'Requested Supplemental',
                'Submitted'
        ]:
            interested_parties.append(compliance_report.organization.id)

        if status in [
                'Accepted',
                'Not Recommended',
                'Recommended',
                'Rejected',
                'Requested Supplemental',
                'Submitted'
        ]:
            government = Organization.objects.filter(
                type__type='Government'
            ).first()

            interested_parties.append(government.id)

        notifications_to_send = []

        for interested_organization_id in interested_parties:
            notifications_to_send.append({
                'interested_organization_id': interested_organization_id,
                'message': message,
                'notification_type': notification_type,
                'originating_user_id': compliance_report.update_user.id,
                'related_organization_id': compliance_report.organization.id,
                'related_report_id': compliance_report.id
            })

        on_commit(lambda: async_send_notifications(notifications_to_send))

    @staticmethod
    def get_compliance_report_notification_message(
            previous_status,
            compliance_report: ComplianceReport
    ):
        current_status = compliance_report.status
        message = None
        notification_type = None
        status = None

        if current_status.fuel_supplier_status.status == 'Draft':
            status = 'Draft'

            message = NotificationType.COMPLIANCE_REPORT_DRAFT.name
            notification_type = NotificationType.COMPLIANCE_REPORT_DRAFT.value

        if current_status.fuel_supplier_status.status != \
                previous_status.fuel_supplier_status.status:
            status = current_status.fuel_supplier_status.status

            if status == 'Submitted':
                message = NotificationType.\
                    COMPLIANCE_REPORT_SUBMITTED.name
                notification_type = NotificationType.\
                    COMPLIANCE_REPORT_SUBMITTED.value

        if current_status.analyst_status.status != \
                previous_status.analyst_status.status:
            status = current_status.analyst_status.status

            if status == 'Recommended':
                message = NotificationType.\
                    COMPLIANCE_REPORT_RECOMMENDED_FOR_ACCEPTANCE_ANALYST.name
                notification_type = NotificationType.\
                    COMPLIANCE_REPORT_RECOMMENDED_FOR_ACCEPTANCE_ANALYST.value

            if status == 'Not Recommended':
                message = NotificationType.\
                    COMPLIANCE_REPORT_RECOMMENDED_FOR_REJECTION_ANALYST.name
                notification_type = NotificationType.\
                    COMPLIANCE_REPORT_RECOMMENDED_FOR_REJECTION_ANALYST.value

            if status == 'Requested Supplemental':
                message = NotificationType.\
                    COMPLIANCE_REPORT_REQUESTED_SUPPLEMENTAL.name
                notification_type = NotificationType.\
                    COMPLIANCE_REPORT_REQUESTED_SUPPLEMENTAL.value

        if current_status.manager_status.status != \
                previous_status.manager_status.status:
            status = current_status.manager_status.status

            if status == 'Recommended':
                message = NotificationType.\
                    COMPLIANCE_REPORT_RECOMMENDED_FOR_ACCEPTANCE_MANAGER.name
                notification_type = NotificationType.\
                    COMPLIANCE_REPORT_RECOMMENDED_FOR_ACCEPTANCE_MANAGER.value

            if status == 'Not Recommended':
                message = NotificationType.\
                    COMPLIANCE_REPORT_RECOMMENDED_FOR_REJECTION_MANAGER.name
                notification_type = NotificationType.\
                    COMPLIANCE_REPORT_RECOMMENDED_FOR_REJECTION_MANAGER.value

            if status == 'Requested Supplemental':
                message = NotificationType.\
                    COMPLIANCE_REPORT_REQUESTED_SUPPLEMENTAL.name
                notification_type = NotificationType.\
                    COMPLIANCE_REPORT_REQUESTED_SUPPLEMENTAL.value

        if current_status.director_status.status != \
                previous_status.director_status.status:
            status = current_status.director_status.status

            if status == 'Accepted':
                message = NotificationType.COMPLIANCE_REPORT_ACCEPTED.name
                notification_type = NotificationType.\
                    COMPLIANCE_REPORT_ACCEPTED.value

            if status == 'Rejected':
                message = NotificationType.COMPLIANCE_REPORT_REJECTED.name
                notification_type = NotificationType.\
                    COMPLIANCE_REPORT_REJECTED.value

        return status, message, notification_type

    @staticmethod
    def get_exclusion_report_notification_message(
            previous_status,
            compliance_report: ComplianceReport
    ):
        current_status = compliance_report.status
        message = None
        notification_type = None
        status = None

        if current_status.fuel_supplier_status.status == 'Draft':
            status = 'Draft'

            message = NotificationType.EXCLUSION_REPORT_DRAFT.name
            notification_type = NotificationType.EXCLUSION_REPORT_DRAFT.value

        if current_status.fuel_supplier_status.status != \
                previous_status.fuel_supplier_status.status:
            status = current_status.fuel_supplier_status.status

            if status == 'Submitted':
                message = NotificationType.\
                    EXCLUSION_REPORT_SUBMITTED.name
                notification_type = NotificationType.\
                    EXCLUSION_REPORT_SUBMITTED.value

        if current_status.analyst_status.status != \
                previous_status.analyst_status.status:
            status = current_status.analyst_status.status

            if status == 'Recommended':
                message = NotificationType.\
                    EXCLUSION_REPORT_RECOMMENDED_FOR_ACCEPTANCE_ANALYST.name
                notification_type = NotificationType.\
                    EXCLUSION_REPORT_RECOMMENDED_FOR_ACCEPTANCE_ANALYST.value

            if status == 'Not Recommended':
                message = NotificationType.\
                    EXCLUSION_REPORT_RECOMMENDED_FOR_REJECTION_ANALYST.name
                notification_type = NotificationType.\
                    EXCLUSION_REPORT_RECOMMENDED_FOR_REJECTION_ANALYST.value

            if status == 'Requested Supplemental':
                message = NotificationType.\
                    EXCLUSION_REPORT_REQUESTED_SUPPLEMENTAL.name
                notification_type = NotificationType.\
                    EXCLUSION_REPORT_REQUESTED_SUPPLEMENTAL.value

        if current_status.manager_status.status != \
                previous_status.manager_status.status:
            status = current_status.manager_status.status

            if status == 'Recommended':
                message = NotificationType.\
                    EXCLUSION_REPORT_RECOMMENDED_FOR_ACCEPTANCE_MANAGER.name
                notification_type = NotificationType.\
                    EXCLUSION_REPORT_RECOMMENDED_FOR_ACCEPTANCE_MANAGER.value

            if status == 'Not Recommended':
                message = NotificationType.\
                    EXCLUSION_REPORT_RECOMMENDED_FOR_REJECTION_MANAGER.name
                notification_type = NotificationType.\
                    EXCLUSION_REPORT_RECOMMENDED_FOR_REJECTION_MANAGER.value

            if status == 'Requested Supplemental':
                message = NotificationType.\
                    EXCLUSION_REPORT_REQUESTED_SUPPLEMENTAL.name
                notification_type = NotificationType.\
                    EXCLUSION_REPORT_REQUESTED_SUPPLEMENTAL.value

        if current_status.director_status.status != \
                previous_status.director_status.status:
            status = current_status.director_status.status

            if status == 'Accepted':
                message = NotificationType.EXCLUSION_REPORT_ACCEPTED.name
                notification_type = NotificationType.\
                    EXCLUSION_REPORT_ACCEPTED.value

            if status == 'Rejected':
                message = NotificationType.EXCLUSION_REPORT_REJECTED.name
                notification_type = NotificationType.\
                    EXCLUSION_REPORT_REJECTED.value

        return status, message, notification_type


class InvalidStateException(Exception):
    """
    Used to indicate that the compliance report is not in a state we can
    generate a PVR from (missing data, wrong version, etc.)
    """
    pass
