import datetime
from django.db.models import Q, Sum, Count, Case, When, F

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
            ignore_pending_supplemental=True,
            compliance_period=None
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

            # if report.status.director_status_id == 'Accepted' and ignore_pending_supplemental:
            #     if report.summary is not None:
            #         if report.summary.credits_offset:
            #             deductions -= report.summary.credits_offset


        # Adjust deductions for reports in the current compliance period
        # This addresses a specific scenario where credits from the most recent
        # submitted but not accepted report in the current period should not be
        # considered as unavailable
        if compliance_period:
            # Get all unique report chains for the current compliance period
            report_chains = ComplianceReport.objects.filter(
                organization_id=organization.id,
                compliance_period__description=str(compliance_period)
            ).values('id').distinct()

            for chain in report_chains:
                # Get all reports in this chain, ordered from newest to oldest
                reports_in_chain = ComplianceReport.objects.filter(
                    id=chain['id']
                ).order_by('-id')
                # Traverse the chain backwards, looking for the first submitted
                # but not accepted report
                for report in reports_in_chain:
                    if report.status.fuel_supplier_status.status in ["Submitted"] and \
                      report.status.director_status.status not in ["Accepted", "Rejected"]:
                        # Subtract the credits_offset of this report from the total deductions
                        # This ensures that credits from the most recent relevant report
                        # are not incorrectly marked as unavailable
                        if report.summary and report.summary.credits_offset is not None:
                            deductions -= report.summary.credits_offset
                        # Break after processing the first relevant report in the chain
                        break

        if deductions < 0:
            deductions = 0

        return deductions

    @staticmethod
    def get_max_credit_offset(organization, compliance_year, exclude_reserved=False):
        # Calculate the deadline for the compliance period for credit_trades until the end of March the following year.
        effective_date_deadline = datetime.date(
            int(compliance_year) + 1, 3, 31
        )
        # Define the start date of the compliance period which is the first of January of the compliance year.
        compliance_period_effective_date = datetime.date(
            int(compliance_year), 1, 1
        )

        # Query to sum up all the approved and non-rescinded credits for the organization until the deadline.
        # Includes different types of credit transactions like selling, buying, and administrative adjustments.
        credits_until_deadline = CreditTrade.objects.filter(
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
                Q(compliance_period__effective_date__lte=compliance_period_effective_date)) |
            (Q(type__the_type="Administrative Adjustment") &
                Q(status__status="Approved") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                Q(number_of_credits__gte=0) &
                Q(trade_effective_date__lte=effective_date_deadline))
        ).aggregate(total=Sum('number_of_credits'))

        # print("CREDITS -- ", credits_until_deadline)
        
        # Query to sum up all approved, non-rescinded debits (outgoing credits) for the organization.
        all_debits = CreditTrade.objects.filter(
            (Q(status__status="Approved") &
                Q(type__the_type="Sell") &
                Q(initiator_id=organization.id) &
                Q(is_rescinded=False)) |
            (Q(status__status="Approved") &
                Q(type__the_type="Buy") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False)) |
            (Q(type__the_type="Credit Reduction") &
                Q(status__status="Approved") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False)) |
            (Q(type__the_type="Administrative Adjustment") &
                Q(status__status="Approved") &
                Q(respondent_id=organization.id) &
                Q(is_rescinded=False) &
                Q(number_of_credits__lt=0))
        ).aggregate(
            total=Sum(
                Case(
                    When(
                        Q(type__the_type="Administrative Adjustment") &
                        Q(number_of_credits__lt=0),
                        then=F('number_of_credits') * -1
                    ),
                    default=F('number_of_credits')
                )
            )
        )
        # print("DEBITS -- ", all_debits)

        # Calculate the net available balance by subtracting debits from credits.
        net_available_balance = 0
        if credits_until_deadline and credits_until_deadline.get('total') is not None:
            net_available_balance = credits_until_deadline.get('total')

        if all_debits and all_debits.get('total') is not None:
            net_available_balance -= all_debits.get('total')
        
        # Check if reserved credits should be excluded and calculate accordingly.
        if exclude_reserved:
            pending_deductions = OrganizationService.get_pending_transfers_value(organization)
        else:
            pending_deductions = OrganizationService.get_pending_deductions(organization, ignore_pending_supplemental=False, compliance_period=compliance_year)
        
        # print("PENDING DEDUCTIONS -- ", pending_deductions)
        # Deduct pending deductions from the available balance and ensure it does not drop below zero.
        available_balance_now = net_available_balance - pending_deductions
        if available_balance_now < 0:
            available_balance_now = 0

        # Return the current available balance after all calculations.
        return available_balance_now


    @staticmethod
    def get_max_credit_offset_for_interval(organization, compliance_date):
        effective_date_deadline = compliance_date.date()
        effective_year = effective_date_deadline.year

        if effective_date_deadline < datetime.date(effective_year, 4, 1):
            effective_year -= 1
        compliance_period_effective_date = datetime.date(
            int(effective_year), 1, 1
        )

        credits_until_deadline = CreditTrade.objects.filter(
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
              Q(compliance_period__effective_date__lte=compliance_period_effective_date)) |
            (Q(type__the_type="Administrative Adjustment") &
              Q(status__status="Approved") &
              Q(respondent_id=organization.id) &
              Q(is_rescinded=False) &
              Q(number_of_credits__gte=0) &
              Q(trade_effective_date__lte=effective_date_deadline))
        ).aggregate(total=Sum('number_of_credits'))

        all_debits = CreditTrade.objects.filter(
            (Q(status__status="Approved") &
              Q(type__the_type="Sell") &
              Q(initiator_id=organization.id) &
              Q(is_rescinded=False)) |
            (Q(status__status="Approved") &
              Q(type__the_type="Buy") &
              Q(respondent_id=organization.id) &
              Q(is_rescinded=False)) |
            (Q(type__the_type="Credit Reduction") &
              Q(status__status="Approved") &
              Q(respondent_id=organization.id) &
              Q(is_rescinded=False)) |
            (Q(type__the_type="Administrative Adjustment") &
              Q(status__status="Approved") &
              Q(respondent_id=organization.id) &
              Q(is_rescinded=False) &
              Q(number_of_credits__lt=0))
        ).aggregate(
            total=Sum(
                Case(
                    When(
                        Q(type__the_type="Administrative Adjustment") &
                        Q(number_of_credits__lt=0),
                        then=F('number_of_credits') * -1
                    ),
                    default=F('number_of_credits')
                )
            )
        )

        net_available_balance = 0
        if credits_until_deadline and credits_until_deadline.get('total') is not None:
            net_available_balance = credits_until_deadline.get('total')

        if all_debits and all_debits.get('total') is not None:
            net_available_balance -= all_debits.get('total')

        pending_deductions = OrganizationService.get_pending_deductions(organization, ignore_pending_supplemental=False)

        available_balance_now = net_available_balance - pending_deductions

        if available_balance_now < 0:
            available_balance_now = 0

        return available_balance_now
