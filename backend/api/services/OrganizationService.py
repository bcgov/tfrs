import datetime
from django.db.models import Q, Sum, Count

from api.models.ComplianceReport import ComplianceReport
from api.models.CreditTrade import CreditTrade


class OrganizationService(object):
    @staticmethod
    def get_pending_deductions(organization):
        deductions = 0
        pending_trades = CreditTrade.objects.filter(
            (Q(status__status__in=[
                "Submitted", "Recommended", "Not Recommended"
            ]) &
                Q(type__the_type="Sell") &
                Q(initiator_id=organization.id) &
                Q(is_rescinded=False)) |
            (Q(status__status__in=[
                "Accepted", "Recommended", "Not Recommended"
            ]) &
                Q(type__the_type="Buy") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False))
        ).aggregate(total_credits=Sum('number_of_credits'))

        if pending_trades['total_credits'] is not None:
            deductions += pending_trades['total_credits']

        compliance_report = ComplianceReport.objects.annotate(
            Count('supplements')
        ).filter(
                supplements__count=0,
                organization_id=organization.id
        ).filter(
            ~Q(status__director_status__status__in=[
                "Accepted", "Rejected"
            ]) &
            ~Q(status__fuel_supplier_status__status__in=[
                "Draft", "Deleted"
            ])
        )

        for report in compliance_report:
            group_id = report.group_id(filter_drafts=False)
            supplemental_report = ComplianceReport.objects.filter(
                ~Q(status__director_status__status__in=[
                    "Accepted", "Rejected"
                ]) &
                ~Q(status__fuel_supplier_status__status__in=[
                    "Draft", "Deleted"
                ])
            ).filter(id=group_id).first()

            if supplemental_report and supplemental_report.summary:
                deductions += supplemental_report.summary.credits_offset

        return deductions

    @staticmethod
    def get_max_credit_offset(organization, compliance_year):
        effective_date_deadline = datetime.date(int(compliance_year), 3, 31)

        credits = CreditTrade.objects.filter(
            (Q(status__status="Approved") &
                Q(type__the_type="Sell") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                Q(trade_effective_date__lte=effective_date_deadline)) |
            (Q(status__status="Approved") &
                Q(type__the_type="Buy") &
                Q(initiator_id=organization.id) &
                Q(is_rescinded=False) &
                Q(trade_effective_date__lte=effective_date_deadline)) |
            (Q(type__the_type="Part 3 Award") &
                Q(status__status="Approved") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                Q(trade_effective_date__lte=effective_date_deadline)) |
            (Q(type__the_type="Credit Validation") &
                Q(status__status="Approved") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                Q(compliance_period__description=compliance_year))
        ).aggregate(total=Sum('number_of_credits'))

        debits = CreditTrade.objects.filter(
            (Q(status__status__in=[
                "Submitted", "Recommended", "Not Recommended", "Approved"
            ]) &
                Q(type__the_type="Sell") &
                Q(initiator_id=organization.id) &
                Q(is_rescinded=False) &
                Q(trade_effective_date__lte=effective_date_deadline)) |
            (Q(status__status__in=[
                "Accepted", "Recommended", "Not Recommended", "Approved"
            ]) &
                Q(type__the_type="Buy") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                Q(trade_effective_date__lte=effective_date_deadline)) |
            (Q(type__the_type="Credit Reduction") &
                Q(status__status="Approved") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                Q(trade_effective_date__lte=effective_date_deadline))
        ).aggregate(total=Sum('number_of_credits'))

        total = credits['total'] - debits['total']
        return total
