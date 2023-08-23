import xlwt

from collections import namedtuple, defaultdict
from decimal import Decimal

from api.models.FuelCode import FuelCode


class ComplianceReportSpreadsheet(object):
    """
    Class to build spreadsheets
    """

    def __init__(self):
        self.workbook = xlwt.Workbook(encoding='utf-8')

    def add_exclusion_agreement(self, exclusion_agreement):
        worksheet = self.workbook.add_sheet("Exclusion Agreement")
        row_index = 0

        columns = [
            "Transaction Type", "Fuel Type", "Trading Partner", "Postal Address",
            "Quantity", "Units",  "Quantity Not Sold", "Units"
        ]

        header_style = xlwt.easyxf('font: bold on')

        # Build Column Headers
        for col_index, value in enumerate(columns):
            worksheet.write(row_index, col_index, value, header_style)

        comment_format = xlwt.easyxf('align: wrap on, vert centre')
        date_format = xlwt.easyxf(num_format_str='yyyy-mm-dd')
        quantity_format = xlwt.easyxf(num_format_str='#,##0')
        value_format = xlwt.easyxf(num_format_str='#,##0.00')

        if exclusion_agreement is None:
            return

        # Build the rows
        for record in exclusion_agreement['records']:
            row_index += 1

            worksheet.write(row_index, 0, record['transaction_type'])
            worksheet.write(row_index, 1, record['fuel_type'])
            worksheet.write(row_index, 2, record['transaction_partner'])
            worksheet.write(row_index, 3, record['postal_address'])
            worksheet.write(row_index, 4, Decimal(record['quantity']), quantity_format)
            worksheet.write(row_index, 5, record['unit_of_measure'])
            worksheet.write(row_index, 6, Decimal(record['quantity_not_sold']), quantity_format)
            worksheet.write(row_index, 7, record['unit_of_measure'])

    def add_schedule_a(self, schedule_a):
        worksheet = self.workbook.add_sheet("Schedule A")
        row_index = 0

        columns = [
            "Trading Partner", "Postal Address",
            "Fuel Class", "Received or Transferred",
            "Quantity"
        ]

        header_style = xlwt.easyxf('font: bold on')

        # Build Column Headers
        for col_index, value in enumerate(columns):
            worksheet.write(row_index, col_index, value, header_style)

        comment_format = xlwt.easyxf('align: wrap on, vert centre')
        date_format = xlwt.easyxf(num_format_str='yyyy-mm-dd')
        quantity_format = xlwt.easyxf(num_format_str='#,##0')
        value_format = xlwt.easyxf(num_format_str='#,##0.00')

        if schedule_a is None:
            return

        # Build the rows
        for record in schedule_a['records']:
            row_index += 1

            worksheet.write(row_index, 0, record['trading_partner'])
            worksheet.write(row_index, 1, record['postal_address'])
            worksheet.write(row_index, 2, record['fuel_class'])
            worksheet.write(row_index, 3, record['transfer_type'])
            worksheet.write(row_index, 4, Decimal(record['quantity']), quantity_format)

    def add_schedule_b(self, schedule_b, compliance_period):
        worksheet = self.workbook.add_sheet("Schedule B")
        row_index = 0

        columns = [
            "Fuel Type", "Fuel Class", "Provision", "Fuel Code or Schedule D Provision",
            "Quantity", "Units", "Carbon Intensity Limit", "Carbon Intensity of Fuel",
            "Energy Density", "EER", "Energy Content", "Credit", "Debit"
        ]
        if compliance_period >= 2023:
            columns = [
                "Fuel Type", "Fuel Class", "Provision", "Fuel Code or Schedule D Provision",
                "Quantity", "Units", "Carbon Intensity Limit", "Carbon Intensity of Fuel",
                "Energy Density", "EER", "Energy Content", "Compliance Units"
            ]

        header_style = xlwt.easyxf('font: bold on')

        # Build Column Headers
        for col_index, value in enumerate(columns):
            worksheet.write(row_index, col_index, value, header_style)

        comment_format = xlwt.easyxf('align: wrap on, vert centre')
        date_format = xlwt.easyxf(num_format_str='yyyy-mm-dd')
        quantity_format = xlwt.easyxf(num_format_str='#,##0')
        value_format = xlwt.easyxf(num_format_str='#,##0.00')

        if schedule_b is None:
            return

        # Build the rows
        for record in schedule_b['records']:
            row_index += 1

            worksheet.write(row_index, 0, record['fuel_type'])
            worksheet.write(row_index, 1, record['fuel_class'])
            worksheet.write(row_index, 2, record['provision_of_the_act'])
            if record['fuel_code'] is not None:
                fuel_code_id = record['fuel_code']
                fuel_code = FuelCode.objects.filter(id=fuel_code_id).first()
                if fuel_code:
                    fuel_code_string = fuel_code.fuel_code + \
                        str(fuel_code.fuel_code_version) + '.' + \
                        str(fuel_code.fuel_code_version_minor)
                    worksheet.write(row_index, 3, fuel_code_string)
                else:
                    worksheet.write(row_index, 3, record['fuel_code'])
            else:
                if record['schedule_d_sheet_index'] is not None:
                    worksheet.write(row_index, 3, 'From Schedule D')
            worksheet.write(row_index, 4, Decimal(record['quantity']), quantity_format)
            worksheet.write(row_index, 5, record['unit_of_measure'])
            worksheet.write(row_index, 6, Decimal(record['ci_limit']))
            worksheet.write(row_index, 7, Decimal(record['effective_carbon_intensity']))
            worksheet.write(row_index, 8, Decimal(record['energy_density']))
            worksheet.write(row_index, 9, Decimal(record['eer']))
            worksheet.write(row_index, 10, Decimal(record['energy_content']))
            if compliance_period < 2023:
                if record['credits'] is not None:
                    worksheet.write(row_index, 11, Decimal(record['credits']))
                if record['debits'] is not None:
                    worksheet.write(row_index, 12, Decimal(record['debits']))
            else:
                compliance_units = None
                if record['credits'] is not None:
                    compliance_units = Decimal(record['credits'])
                if compliance_units is None and record['debits'] is not None:
                    compliance_units = Decimal(record['debits']) * -1
                worksheet.write(row_index, 11, compliance_units)

    def add_schedule_c(self, schedule_c):
        worksheet = self.workbook.add_sheet("Schedule C")
        row_index = 0

        columns = [
            "Fuel Type", "Fuel Class", "Quantity", "Units",
            "Expected Use", "Rationale"
        ]

        header_style = xlwt.easyxf('font: bold on')

        # Build Column Headers
        for col_index, value in enumerate(columns):
            worksheet.write(row_index, col_index, value, header_style)

        comment_format = xlwt.easyxf('align: wrap on, vert centre')
        date_format = xlwt.easyxf(num_format_str='yyyy-mm-dd')
        quantity_format = xlwt.easyxf(num_format_str='#,##0')
        value_format = xlwt.easyxf(num_format_str='#,##0.00')

        if schedule_c is None:
            return

        # Build the rows
        for record in schedule_c['records']:
            row_index += 1

            worksheet.write(row_index, 0, record['fuel_type'])
            worksheet.write(row_index, 1, record['fuel_class'])
            worksheet.write(row_index, 2, Decimal(record['quantity']), quantity_format)
            worksheet.write(row_index, 3, record['unit_of_measure'])
            worksheet.write(row_index, 4, record['expected_use'])
            if record['rationale'] is not None:
                worksheet.write(row_index, 5, record['rationale'])

    def add_schedule_d(self, schedule_d):
        worksheet = self.workbook.add_sheet("Schedule D")
        row_index = 0

        header_style = xlwt.easyxf('font: bold on')
        comment_format = xlwt.easyxf('align: wrap on, vert centre')
        date_format = xlwt.easyxf(num_format_str='yyyy-mm-dd')
        quantity_format = xlwt.easyxf(num_format_str='#,##0')
        value_format = xlwt.easyxf(num_format_str='#,##0.00')

        if schedule_d is None:
            return

        for sheet in schedule_d['sheets']:

            if row_index != 0:
                row_index += 2

            columns = [
                "Fuel Type", "Feedstock", "Fuel Class"
            ]

            for col_index, value in enumerate(columns):
                worksheet.write(row_index, col_index, value, header_style)

            row_index += 1

            worksheet.write(row_index, 0, sheet['fuel_type'])
            worksheet.write(row_index, 1, sheet['feedstock'])
            worksheet.write(row_index, 2, sheet['fuel_class'])

            row_index += 1
            worksheet.write(row_index, 0, 'Inputs', header_style)

            row_index += 1
            columns = [
                "Worksheet", "Cell", "Value", "Units", "Description"
            ]

            for col_index, value in enumerate(columns):
                worksheet.write(row_index, col_index, value, header_style)

            for input in sheet['inputs']:
                row_index += 1

                worksheet.write(row_index, 0, input['worksheet_name'])
                worksheet.write(row_index, 1, input['cell'])
                worksheet.write(row_index, 2, input['value'])
                worksheet.write(row_index, 3, input['units'])
                worksheet.write(row_index, 4, input['description'])

            row_index += 1
            worksheet.write(row_index, 0, 'Outputs', header_style)

            row_index += 1
            columns = [
                "Output", "Value"
            ]

            for col_index, value in enumerate(columns):
                worksheet.write(row_index, col_index, value, header_style)

            for output in sheet['outputs']:
                row_index += 1

                worksheet.write(row_index, 0, output['description'])
                worksheet.write(row_index, 1, Decimal(output['intensity']), value_format)

    def add_schedule_summary(self, summary, compliance_period):
        worksheet = self.workbook.add_sheet("Summary")
        row_index = 0

        header_style = xlwt.easyxf('font:bold on')
        quantity_format = xlwt.easyxf(num_format_str='#,##0')
        value_format = xlwt.easyxf(num_format_str='#,##0.00')
        currency_format = xlwt.easyxf(num_format_str='$#,##0.00')
        description_format = xlwt.easyxf('align: wrap on')
        if summary is None:
            return

        line_details = {
            '1': 'Volume of gasoline class non-renewable fuel supplied',
            '2': 'Volume of gasoline class renewable fuel supplied',
            '3': 'Total volume of gasoline class fuel supplied (Line 1 + Line 2)',
            '4': 'Volume of Part 2 gasoline class renewable fuel required (5% of Line 3)',
            '5': 'Net volume of renewable fuel notionally transferred to and received from other suppliers as'
                 ' reported in Schedule A',
            '6': 'Volume of renewable fuel retained (up to 5% of Line 4)',
            '7': 'Volume of renewable fuel previously retained (from Line 6 of previous compliance period)',
            '8': 'Volume of renewable obligation deferred (up to 5% of Line 4)',
            '9': 'Volume of renewable obligation added (from Line 8 of previous compliance period)',
            '10': 'Net volume of renewable Part 2 gasoline class fuel supplied (Total of Line 2 + Line 5 - Line 6 '
                  '+ Line 7 + Line 8 - Line 9)',
            '11': 'Gasoline class non-compliance payable (Line 4 - Line 10) x $0.30/L',
            '12': 'Volume of diesel class non-renewable fuel supplied',
            '13': 'Volume of diesel class renewable fuel supplied',
            '14': 'Total volume of diesel class fuel supplied (Line 12 + Line 13)',
            '15': 'Volume of Part 2 diesel class renewable fuel required (4% of Line 14)',
            '16': 'Net volume of renewable fuel notionally transferred to and received from other suppliers'
                  ' as reported in Schedule A',
            '17': 'Volume of renewable fuel retained (up to 5% of Line 15)',
            '18': 'Volume of renewable fuel previously retained (from Line 17 of previous compliance report)',
            '19': 'Volume of renewable obligation deferred (up to 5% of Line 15)',
            '20': 'Volume of renewable obligation added (from Line 19 of previous compliance period)',
            '21': 'Net volume of renewable Part 2 diesel class fuel supplied (Total of Line 13 + Line 16 - Line 17 +'
                  ' Line 18 + Line 19 - Line 20)',
            '22': 'Diesel class non-compliance payable (Line 15 - Line 21) x $0.45/L',
            '23': 'Total credits from fuel supplied (from Schedule B)',
            '24': 'Total debits from fuel supplied (from Schedule B)',
            '25': 'Net credit or debit balance for compliance period',
            '26': 'Banked credits used to offset outstanding debits (if applicable)',
            '26A': 'Banked credits used to offset outstanding debits - Previous Reports',
            '26B': 'Banked credits used to offset outstanding debits - Supplemental Report',
            '26C': 'Banked credits spent that will be returned due to debit decrease - Supplemental Report',
            '27': 'Outstanding debit balance',
            '28': 'Part 3 non-compliance penalty payable'
        }
        if compliance_period >= 2023:
            line_details['25'] = 'Net compliance unit balance for compliance period'
            line_details['29A'] = 'Available compliance unit balance on March 31, ' + str(int(compliance_period) + 1)
            line_details['29B'] = 'Compliance unit balance change from assessment'
            line_details['29C'] = 'Available compliance unit balance after assessment on March 31, ' + str(int(compliance_period) + 1)
            line_details['28'] = 'Non-compliance penalty payable (' + str(int(Decimal(summary['lines']['28'])/600)) + ' units * $600 CAD per unit)'

        line_format = defaultdict(lambda: quantity_format)
        line_format['11'] = currency_format
        line_format['22'] = currency_format
        line_format['28'] = currency_format

        columns = [
            "Part 2 Gasoline Class - 5% Renewable Requirement",
            "Line",
            "Litres"
        ]
        for col_index, value in enumerate(columns):
            worksheet.write(row_index, col_index, value, header_style)

        for line in range(1, 11+1):
            row_index += 1
            worksheet.write(row_index, 0, line_details[str(line)], description_format)
            worksheet.write(row_index, 1, 'Line {}'.format(line))
            worksheet.write(row_index, 2, Decimal(summary['lines'][str(line)]), line_format[str(line)])

        row_index += 1
        columns = [
            "Diesel Class - 4% Renewable Requirement",
            "Line",
            "Litres"
        ]

        for col_index, value in enumerate(columns):
            worksheet.write(row_index, col_index, value, header_style)

        for line in range(12, 22+1):
            row_index += 1
            worksheet.write(row_index, 0, line_details[str(line)], description_format)
            worksheet.write(row_index, 1, 'Line {}'.format(line))
            worksheet.write(row_index, 2, Decimal(summary['lines'][str(line)]), line_format[str(line)])

        row_index += 1
        columns = [
            "Part 3 - Low Carbon Fuel Requirement Summary" if compliance_period < 2023 else "Low Carbon Fuel Requirement",
            "Line",
            "Value"
        ]

        for col_index, value in enumerate(columns):
            worksheet.write(row_index, col_index, value, header_style)

        if compliance_period >= 2023:
            compliance_lines = ['25','29A','29B','28','29C']
            for line in compliance_lines:
                if line != '28' or (line == '28' and summary['lines'][line] > 0):
                    row_index += 1
                    worksheet.write(row_index, 0, line_details[line], description_format)
                    if line.isdigit():
                        worksheet.write(row_index, 1, f'Line {line}')
                    worksheet.write(row_index, 2, Decimal(summary['lines'][line]), line_format[str(line)])
        else:
            for line in range(23, 28+1):
                row_index += 1
                worksheet.write(row_index, 0, line_details[str(line)], description_format)
                worksheet.write(row_index, 1, 'Line {}'.format(line))
                worksheet.write(row_index, 2, Decimal(summary['lines'][str(line)]), line_format[str(line)])

        row_index += 1
        columns = [
            "Non-compliance Penalty Payable",
            "Line",
            "Value"
        ]

        for col_index, value in enumerate(columns):
            worksheet.write(row_index, col_index, value, header_style)

        for line in [11, 22, 28]:
            row_index += 1
            worksheet.write(row_index, 0, line_details[str(line)], description_format)
            worksheet.write(row_index, 1, 'Line {}'.format(line))
            worksheet.write(row_index, 2, Decimal(summary['lines'][str(line)]), line_format[str(line)])

        row_index += 1
        worksheet.write(row_index, 0, 'Total non-compliance penalty payable (Line 11 + Line 22 + Line 28)',
                        description_format)
        worksheet.write(row_index, 2, Decimal(summary['total_payable']), currency_format)

        worksheet.col(0).width = 12000


    def save(self, response):
        """
        Appends the workbook to the response for streaming
        """
        self.workbook.save(response)
