from decimal import Decimal, ROUND_HALF_UP
from django.db.models import Q
from django.db.transaction import on_commit
from api.services.OrganizationService import OrganizationService


class ComplianceReportSummaryService(object):
    """
    Helper functions for Compliance Report Summary Calculations
    """
    
    @staticmethod
    def initialize_lines():
        """Initialize all lines to 0"""
        return {key: Decimal(0) for key in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
                                            '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
                                            '22', '23', '24', '25', '26', '26A', '26B', '26C', '27',
                                            '28', '29A', '29B', '29C']}
    
    @staticmethod
    def extract_summary_values(summary):
        """Extract and assign values from summary to corresponding lines."""
        attributes = [
            ('gasoline_class_retained', '6'),
            ('gasoline_class_previously_retained', '7'),
            ('gasoline_class_deferred', '8'),
            ('gasoline_class_obligation', '9'),
            ('diesel_class_retained', '17'),
            ('diesel_class_previously_retained', '18'),
            ('diesel_class_deferred', '19'),
            ('diesel_class_obligation', '20'),
            ('credits_offset', '26'),
            ('credits_offset_a', '26A'),
            ('credits_offset_b', '26B'),
            ('credits_offset_c', '26C')
        ]
        return {line: Decimal(0) if getattr(summary, attr) is None else getattr(summary, attr) for attr, line in attributes}
    
    @staticmethod
    def calculate_synthetic_totals(obj):
        """
        Calculate synthetic totals for a given object based on its schedules.
        This method takes in a main object and, based on its schedules, calculates the various totals and their 
        interactions, returning a dictionary that represents the synthetic totals for different fields.

        :param obj: The main object which contains schedules and other relevant attributes.
        :return: A dictionary containing the synthetic totals for different fields.
        """
        # Initialize the lines with default values
        lines = ComplianceReportSummaryService.initialize_lines()

        # If the object has a summary, update the initialized lines with its values
        if obj.summary:
            lines.update(ComplianceReportSummaryService.extract_summary_values(obj.summary))

        # Extract values from individual schedules and update the lines accordingly
        lines.update(ComplianceReportSummaryService.process_schedule_a(obj.schedule_a, lines))
        lines.update(ComplianceReportSummaryService.process_schedule_b(obj.schedule_b, lines))
        lines.update(ComplianceReportSummaryService.process_schedule_c(obj.schedule_c, lines))

        # Compute derived gasoline totals
        lines['3'] = lines['1'] + lines['2']  # Sum of petroleum and renewable gasoline
        # Apply hardcoded 5% renewable requirement to the sum
        lines['4'] = (lines['3'] * Decimal('0.05')).quantize(Decimal('1.'), rounding=ROUND_HALF_UP)

        # Sum up adjustments for gasoline values
        lines['10'] = lines['2'] + lines['5'] - lines['6'] + lines['7'] + lines['8'] - lines['9']
        lines['11'] = ((lines['4'] - lines['10']) * Decimal('0.30')).max(Decimal(0)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)

        # Compute derived diesel totals
        lines['14'] = lines['12'] + lines['13']  # Sum of petroleum and renewable diesel
        # Apply hardcoded 4% renewable requirement to the sum
        lines['15'] = (lines['14'] * Decimal('0.04')).quantize(Decimal('1.'), rounding=ROUND_HALF_UP)
        # Sum up adjustments for diesel values
        lines['21'] = lines['13'] + lines['16'] - lines['17'] + lines['18'] + lines['19'] - lines['20']
        lines['22'] = ((lines['15'] - lines['21']) * Decimal('0.45')).max(Decimal(0)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)

        # Calculate credits, debits, and resulting balance
        lines['25'] = lines['23'] - lines['24']  # Resulting balance from credits minus debits
        credit_difference = Decimal(lines['25'])

        # Determine if there's a penalty based on current balance
        current_balance = lines['25'] + lines['26']
        lines['27'] = 0 if current_balance > 0 else current_balance

        # Adjust for credits that need to be returned
        if lines.get('26C') and lines['26C'] > 0:
            lines['27'] = 0

        # Handle the logic for different compliance periods
        if int(obj.compliance_period.description) <= 2022:
            lines['28'] = int((lines['27'] * Decimal('-200.00')).max(Decimal(0)))
        else:
            # For later compliance periods, gather maximum available credit offsets
            max_credit_offset = max(0, OrganizationService.get_max_credit_offset(
                obj.organization,
                obj.compliance_period.description
            ))
            max_credit_offset_exclude_reserved = max(0, OrganizationService.get_max_credit_offset(
                obj.organization, 
                obj.compliance_period.description,
                exclude_reserved=True
            ))
            if obj.summary is not None and obj.summary.credits_offset is not None and obj.summary.credits_offset > 0:
                max_credit_offset += obj.summary.credits_offset
            available_compliance_unit_balance = min(max_credit_offset, max_credit_offset_exclude_reserved)
            net_compliance_unit_balance = lines['25']

            # Initialize snapshots and txs to their default values.
            previous_snapshots = []
            previous_transactions = []
            
            # If there are supplements, fetch and process previous transactions and snapshots
            if obj.supplements:
                previous_transactions, previous_snapshots = ComplianceReportSummaryService.get_previous_values(obj)
                total_previous_validation, total_previous_reduction = ComplianceReportSummaryService.calculate_balance_from_transactions(previous_transactions)
                
                desired_net_credit_balance_change = Decimal(lines['25'])
                net_compliance_unit_balance = desired_net_credit_balance_change - (total_previous_validation - total_previous_reduction)

            adjusted_balance = available_compliance_unit_balance + net_compliance_unit_balance

            # Update the 'lines' dictionary with the newly computed values from 'compute_lines_balance' without overwriting existing entries.
            updated_lines = ComplianceReportSummaryService.compute_lines_balance(net_compliance_unit_balance, adjusted_balance, 
                available_compliance_unit_balance, previous_snapshots, credit_difference)
            
            lines.update(updated_lines)

        # Compile and return the final synthetic totals
        synthetic_totals = {
            "total_petroleum_diesel": lines['12'],
            "total_petroleum_gasoline": lines['1'],
            "total_renewable_diesel": lines['13'],
            "total_renewable_gasoline": lines['2'],
            "net_diesel_class_transferred": lines['16'],
            "net_gasoline_class_transferred": lines['5'],
            "lines": lines,
            "total_payable": lines['11'] + lines['22'] + lines.get('28', Decimal(0))  # Assuming '28' might be an optional field
        }
        return synthetic_totals

    @staticmethod
    def process_schedule_a(schedule, lines):
        """Process schedule A values and return related values."""
        if schedule:
            net_gasoline_class_transferred = Decimal(schedule.net_gasoline_class_transferred if schedule else 0)
            net_diesel_class_transferred = Decimal(schedule.net_diesel_class_transferred if schedule else 0)
            
            lines['5'] = net_gasoline_class_transferred
            lines['16'] = net_diesel_class_transferred
        
        return lines

    @staticmethod
    def process_schedule_b(schedule, lines):
        """Process schedule B values and return related values."""
        if schedule:
            total_petroleum_diesel = Decimal(schedule.total_petroleum_diesel)
            total_petroleum_gasoline = Decimal(schedule.total_petroleum_gasoline)
            total_renewable_diesel = Decimal(schedule.total_renewable_diesel)
            total_renewable_gasoline = Decimal(schedule.total_renewable_gasoline)
            total_credits = Decimal(schedule.total_credits)
            total_debits = Decimal(schedule.total_debits)
            
            lines['1'] += total_petroleum_gasoline
            lines['2'] += total_renewable_gasoline
            lines['12'] += total_petroleum_diesel
            lines['13'] += total_renewable_diesel
            lines['23'] += total_credits
            lines['24'] += total_debits

        return lines

    @staticmethod
    def process_schedule_c(schedule, lines):
        """Process schedule C values and return related values."""
        if schedule:
            total_petroleum_diesel = Decimal(schedule.total_petroleum_diesel)
            total_petroleum_gasoline = Decimal(schedule.total_petroleum_gasoline)
            total_renewable_diesel = Decimal(schedule.total_renewable_diesel)
            total_renewable_gasoline = Decimal(schedule.total_renewable_gasoline)

            lines['1'] += total_petroleum_gasoline
            lines['2'] += total_renewable_gasoline
            lines['12'] += total_petroleum_diesel
            lines['13'] += total_renewable_diesel

        return lines

    @staticmethod
    def get_previous_values(current):
        """
        Traverse through supplements to gather previous transactions and snapshots.
        
        :param current: The starting object which has potential supplements.
        :return: A tuple containing lists of previous transactions and snapshots.
        """
        previous_transactions = []
        previous_snapshots = []
        
        # Loop through the supplements to fetch transactions and snapshots
        while current.supplements:
            current = current.supplements
            if current.credit_transaction:
                previous_transactions.append(current.credit_transaction)
            if current.compliance_report_snapshot:
                previous_snapshots.append(current.compliance_report_snapshot.snapshot)
        
        return previous_transactions, previous_snapshots

    @staticmethod
    def calculate_balance_from_transactions(transactions):
        """
        Calculate the total of previous validations and reductions from the transactions.
        
        :param transactions: A list of credit transactions.
        :return: A tuple containing the total of previous validations and reductions.
        """
        # Calculate the total number of credits for validations
        total_previous_validation = sum(t.number_of_credits for t in transactions if t.type.the_type == 'Credit Validation')
        # Calculate the total number of credits for reductions
        total_previous_reduction = sum(t.number_of_credits for t in transactions if t.type.the_type == 'Credit Reduction')
        
        return total_previous_validation, total_previous_reduction

    @staticmethod
    def compute_lines_balance(net_compliance_unit_balance, adjusted_balance, available_compliance_unit_balance, 
                              previous_snapshots, credit_difference):
        """
        Compute the balance for various line items based on the given parameters.
        
        :param net_compliance_unit_balance: Net balance of compliance units.
        :param adjusted_balance: Adjusted balance value.
        :param available_compliance_unit_balance: Available balance of compliance units excluding reserves.
        :param previous_snapshots: List of previous compliance report snapshots.
        :return: A dictionary representing the computed balance for different line items.
        """
        lines = {}
        total_previous_compliance_units = Decimal(0.0)

        # Determine balance for line items based on available and net compliance unit balances
        if available_compliance_unit_balance <= 0 and net_compliance_unit_balance < 0:
            lines['28'] = int((adjusted_balance * Decimal('-600.00')).max(Decimal(0))) if (adjusted_balance < 0) else 0
            lines['29A'] = 0
            if previous_snapshots:
                total_previous_compliance_units = sum(Decimal(snap.get("summary", {}).get("lines", {}).get("25", 0)) for snap in previous_snapshots)
            lines['29B'] = 0 if (available_compliance_unit_balance <= 0) else credit_difference - total_previous_compliance_units
            lines['29C'] = 0
        else:
            lines['29A'] = available_compliance_unit_balance
            lines['28'] = 0

            # Adjust the line item values based on the net and adjusted balances
            if net_compliance_unit_balance < 0 and adjusted_balance < 0:
                lines['29B'] = net_compliance_unit_balance if adjusted_balance > 0 else -available_compliance_unit_balance
                lines['28'] = int((adjusted_balance * Decimal('-600.00')).max(Decimal(0))) if adjusted_balance < 0 else 0
            else:
                lines['29B'] = net_compliance_unit_balance

            lines['29C'] = lines['29A'] + lines['29B']

        return lines
