import datetime
from django.db.models import Q, Sum, Count

from api.models.ComplianceReport import ComplianceReport
from api.models.CreditTrade import CreditTrade


class OrganizationService(object):
    @staticmethod
    def get_pending_transfers_value(organization):
        pending_transfers_value = 0
        pending_trades = CreditTrade.objects.filter(
            (Q(status__status__in=["Submitted", "Accepted", "Recommended", "Not Recommended"]) &
                Q(type__the_type="Sell") &
                Q(initiator_id=organization.id) &
                Q(is_rescinded=False) &
                (Q(trade_effective_date__gte=datetime.datetime.now()) | Q(trade_effective_date__isnull=True)))
                |
                (Q(status__status__in=["Accepted", "Recommended", "Not Recommended"]) &
                Q(type__the_type="Buy") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                (Q(trade_effective_date__gte=datetime.datetime.now()) | Q(trade_effective_date__isnull=True)))
        ).aggregate(total_credits=Sum('number_of_credits'))

        if pending_trades['total_credits'] is not None:
            pending_transfers_value = pending_trades['total_credits']

        return pending_transfers_value

    @staticmethod
    def get_pending_deductions(
            organization,
            ignore_pending_supplemental=True
    ):
        deductions = 0
        deductions += OrganizationService.get_pending_transfers_value(organization)

        compliance_report = ComplianceReport.objects.annotate(
            Count('supplements')
        ).filter(
            supplements__count=0,
            organization_id=organization.id
        ).filter(
            ~Q(status__fuel_supplier_status__status__in=[
                "Draft", "Deleted"
            ])
        )

        for report in compliance_report:
            group_id = report.group_id(filter_drafts=False)

            compliance_report = ComplianceReport.objects.filter(
                ~Q(status__director_status__status__in=[
                    "Accepted", "Rejected"
                ]) &
                ~Q(status__fuel_supplier_status__status__in=[
                    "Deleted"
                ])
            ).filter(id=group_id).first()

            if compliance_report and compliance_report.summary:
                if compliance_report.supplements_id and \
                        compliance_report.supplements_id > 0:
                    previous_offset = 0
                    supplements_end = False

                    if compliance_report.status.fuel_supplier_status_id in [
                        "Draft"
                    ]:
                        compliance_report = compliance_report.supplements

                        if compliance_report.status.director_status_id in [
                                "Accepted"
                        ]:
                            previous_offset = compliance_report.summary.credits_offset

                        if compliance_report.status.director_status_id in [
                                "Rejected"
                        ]:
                            supplements_end = True

                        if compliance_report.status.director_status_id in [
                                "Accepted"
                        ]:
                            previous_offset = compliance_report.summary.credits_offset
                            supplements_end = True

                    current_offset = compliance_report.summary.credits_offset
                    current = compliance_report

                    while current.supplements is not None and not supplements_end:
                        current = current.supplements

                        if current.status.director_status_id in [
                                "Accepted"
                        ]:
                            previous_offset = current.summary.credits_offset
                            supplements_end = True

                    if current.status.director_status_id not in [
                        "Rejected"
                    ] and current_offset is not None and \
                            previous_offset is not None and \
                            previous_offset < current_offset:
                        deductions += (current_offset - previous_offset)
                elif compliance_report.status.director_status_id not in \
                        ["Rejected"]:
                    if compliance_report.summary.credits_offset is not None:
                        deductions += compliance_report.summary.credits_offset

            # if report.status.director_status_id == 'Accepted' and \
            #         ignore_pending_supplemental:
            #     deductions -= report.summary.credits_offset

        if deductions < 0:
            deductions = 0

        return deductions

    @staticmethod
    def get_max_credit_offset(organization, compliance_year, exclude_reserved=False):
        effective_date_deadline = datetime.date(
            int(compliance_year) + 1, 3, 31
        )
        compliance_period_effective_date = datetime.date(
            int(compliance_year), 1, 1
        )

        credits = CreditTrade.objects.filter(
            (Q(status__status="Approved") &
                Q(type__the_type="Sell") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                Q(trade_effective_date__lte=datetime.datetime.now()) &
                Q(trade_effective_date__lte=effective_date_deadline)) |
            (Q(status__status="Approved") &
                Q(type__the_type="Buy") &
                Q(initiator_id=organization.id) &
                Q(is_rescinded=False) &
                Q(trade_effective_date__lte=datetime.datetime.now()) &
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
                Q(compliance_period__effective_date__lte=compliance_period_effective_date))
        ).aggregate(total=Sum('number_of_credits'))

        debits = CreditTrade.objects.filter(
            (Q(status__status="Approved") &
                Q(type__the_type="Sell") &
                Q(initiator_id=organization.id) &
                Q(is_rescinded=False) &
                Q(trade_effective_date__lte=effective_date_deadline)) |
            (Q(status__status="Approved") &
                Q(type__the_type="Buy") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                Q(trade_effective_date__lte=effective_date_deadline)) |
            (Q(type__the_type="Credit Reduction") &
                Q(status__status="Approved") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                Q(compliance_period__effective_date__lte=compliance_period_effective_date))
        ).aggregate(total=Sum('number_of_credits'))

        total_in_compliance_period = 0
        if credits and credits.get('total') is not None:
            total_in_compliance_period = credits.get('total')

        if debits and debits.get('total') is not None:
            total_in_compliance_period -= debits.get('total')
        if exclude_reserved:
            pending_deductions = OrganizationService.get_pending_transfers_value(organization)
        else:
            pending_deductions = OrganizationService.get_pending_deductions(organization, ignore_pending_supplemental=False)
        
        validated_credits = organization.organization_balance.get(
            'validated_credits', 0
        )

        total_balance = validated_credits - pending_deductions
        total_available_credits = min(total_in_compliance_period, total_balance)

        if total_available_credits < 0:
            total_available_credits = 0

        return total_available_credits
