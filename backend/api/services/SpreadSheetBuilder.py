import xlwt


class SpreadSheetBuilder(object):
    """
    Class to build spreadsheets
    """
    def __init__(self):
        self.workbook = xlwt.Workbook(encoding='utf-8')

    def add_credit_transfers(self, credit_trades):
        """
        Adds a spreadsheet for credit transfers
        """
        worksheet = self.workbook.add_sheet("Credit Transfers")
        row_index = 0

        columns = [
            "Transaction ID", "Compliance Period", "Type", "Credits From",
            "Credits To", "Quantity of Credits", "Value per Credit", "Status",
            "Effective Date", "Comments"
        ]

        header_style = xlwt.easyxf('font: bold on')

        # Build Column Headers
        for col_index, value in enumerate(columns):
            worksheet.write(row_index, col_index, value, header_style)

        comment_format = xlwt.easyxf('align: wrap on, vert centre')
        date_format = xlwt.easyxf(num_format_str='yyyy-mm-dd')
        quantity_format = xlwt.easyxf(num_format_str='#,##0')
        value_format = xlwt.easyxf(num_format_str='#,##0.00')

        # Build the rows
        for credit_trade in credit_trades:
            row_index += 1

            worksheet.write(row_index, 0, credit_trade.id)

            if credit_trade.compliance_period:
                worksheet.write(row_index, 1,
                                credit_trade.compliance_period.description)

            if credit_trade.type:
                worksheet.write(row_index, 2, credit_trade.type.friendly_name)

            if credit_trade.type.the_type not in [
                    "Credit Validation", "Part 3 Award"]:
                worksheet.write(row_index, 3, credit_trade.credits_from.name)

            if credit_trade.type.the_type not in ["Credit Retirement"]:
                worksheet.write(row_index, 4, credit_trade.credits_to.name)

            worksheet.write(row_index, 5, credit_trade.number_of_credits,
                            quantity_format)

            if credit_trade.type.the_type in ["Sell", "Buy"]:
                worksheet.write(row_index, 6,
                                credit_trade.fair_market_value_per_credit,
                                value_format)

            worksheet.write(row_index, 7, credit_trade.status.friendly_name)
            worksheet.write(row_index, 8, credit_trade.trade_effective_date,
                            date_format)

            comment = "\n".join(
                '{}: "{}"'.format(
                    comment.create_user.display_name, comment.comment
                ) for comment in credit_trade.comments
            )
            worksheet.write(row_index, 9, comment, comment_format)

        # set the widths for the columns that we expect to be longer
        worksheet.col(3).width = 7500
        worksheet.col(4).width = 7500
        worksheet.col(9).width = 10000

    def add_fuel_suppliers(self, fuel_suppliers):
        """
        Adds a spreadsheet for fuel suppliers
        """
        worksheet = self.workbook.add_sheet("Fuel Suppliers")
        row_index = 0

        columns = [
            "ID", "Company Name", "Credit Balance", "Status", "Actions"
        ]

        header_style = xlwt.easyxf('font: bold on')

        # Build Column Headers
        for col_index, value in enumerate(columns):
            worksheet.write(row_index, col_index, value, header_style)

        # Build the rows
        for fuel_supplier in fuel_suppliers:
            row_index += 1

            worksheet.write(row_index, 0, fuel_supplier.id)
            worksheet.write(row_index, 1, fuel_supplier.name)
            worksheet.write(
                row_index, 2,
                fuel_supplier.organization_balance['validated_credits'])
            worksheet.write(row_index, 3, fuel_supplier.status.status)
            worksheet.write(row_index, 4, fuel_supplier.actions_type.the_type)

        # set the widths for the columns that we expect to be longer
        worksheet.col(1).width = 7500

    def save(self, response):
        """
        Appends the workbook to the response for streaming
        """
        self.workbook.save(response)
