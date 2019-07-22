from enum import Enum
from decimal import Decimal

from django.db import models

from api.models.ProvisionOfTheAct import ProvisionOfTheAct
from api.models.ApprovedFuel import ApprovedFuel
from api.models.ExpectedUse import ExpectedUse
from api.models.FuelClass import FuelClass
from api.models.FuelCode import FuelCode
from api.models.NotionalTransferType import NotionalTransferType
from auditable.models import Commentable


class ScheduleA(Commentable):
    """
    Container for a single instance of "Schedule A - Notional Transfers of
    Renewable Fuel" report.
    """
    class Meta:
        db_table = 'compliance_report_schedule_a'

    db_table_comment = 'Container for a single instance of "Schedule A - ' \
                       'Notional Transfers of Renewable Fuel" report.'


class ScheduleARecord(Commentable):
    """
    Line items for "Schedule A - Notional Transfers of Renewable Fuel" report.
    """
    schedule = models.ForeignKey(
        ScheduleA,
        related_name='records',
        on_delete=models.PROTECT,
        null=False
    )

    transfer_type = models.ForeignKey(
        NotionalTransferType,
        on_delete=models.PROTECT,
        null=False
    )

    fuel_class = models.ForeignKey(
        FuelClass,
        on_delete=models.PROTECT,
        null=False
    )

    quantity = models.DecimalField(
        blank=False,
        null=False,
        decimal_places=2,
        max_digits=20,
        db_comment="Quantity of fuel supplied."
    )

    trading_partner = models.CharField(
        max_length=200,
        blank=False,
        null=False,
        db_comment="Legal organization name of the trading partner. This is "
                   "a free form text field with auto-suggested values from "
                   "existing Organization names."
    )

    postal_address = models.CharField(
        max_length=200,
        blank=False,
        null=False,
        db_comment="Contains the trading partner address. This is a free "
                   "form text field with auto-suggested values from existing "
                   "Organization addresses."
    )

    class Meta:
        db_table = 'compliance_report_schedule_a_record'
        ordering = ['id']

    db_table_comment = 'Line items for "Schedule A - Notional Transfers of ' \
                       'Renewable Fuel" report.'


class ScheduleB(Commentable):
    """
    Container for a single instance of "Schedule B - Part 3 Fuel Supply"
    report.
    """
    class Meta:
        db_table = 'compliance_report_schedule_b'

    db_table_comment = 'Container for a single instance of "Schedule B - ' \
                       'Part 3 Fuel Supply" report.'


class ScheduleBRecord(Commentable):
    """
    Sets of worksheets for "Schedule D" report.
    """
    schedule = models.ForeignKey(
        ScheduleB,
        related_name='records',
        on_delete=models.PROTECT,
        null=False
    )

    fuel_type = models.ForeignKey(
        ApprovedFuel,
        on_delete=models.PROTECT,
        null=False
    )

    fuel_class = models.ForeignKey(
        FuelClass,
        on_delete=models.PROTECT,
        null=False
    )

    quantity = models.DecimalField(
        blank=False,
        null=False,
        decimal_places=2,
        max_digits=20,
        db_comment="Quantity of fuel supplied."
    )

    provision_of_the_act = models.ForeignKey(
        ProvisionOfTheAct,
        on_delete=models.PROTECT,
        null=False
    )

    fuel_code = models.ForeignKey(
        FuelCode,
        on_delete=models.PROTECT,
        null=True
    )

    intensity = models.DecimalField(
        blank=True,
        decimal_places=2,
        default=None,
        max_digits=5,
        null=True,
        db_comment="Carbon Intensity (gCO2e/MJ). Only for alternative method."
                   "Must be Null otherwise"
    )

    schedule_d_sheet_index = models.IntegerField(
        default=None,
        null=True,
        db_comment='An zero-based index into id-sorted schedule D sheets for the case where '
                   'intensity was computed via the GHGenius provision'
    )

    class Meta:
        db_table = 'compliance_report_schedule_b_record'
        ordering = ['id']

    db_table_comment = 'Line items for "Schedule B - Part 3 Fuel Supply" ' \
                       'report.'


class ScheduleC(Commentable):
    """
    Container for a single instance of "Schedule C - " Fuels Used for
    Other Purposes" report.
    """
    class Meta:
        db_table = 'compliance_report_schedule_c'
    db_table_comment = 'Container for a single instance of "Schedule C - "' \
                       'Fuels Used for Other Purposes" report.'


class ScheduleCRecord(Commentable):
    """
    Line items for "Schedule C - Fuels Used for Other Purposes" report.
    """
    schedule = models.ForeignKey(
        ScheduleC,
        related_name='records',
        on_delete=models.PROTECT,
        null=False
    )

    fuel_type = models.ForeignKey(
        ApprovedFuel,
        on_delete=models.PROTECT,
        null=False
    )

    fuel_class = models.ForeignKey(
        FuelClass,
        on_delete=models.PROTECT,
        null=False
    )

    quantity = models.DecimalField(
        blank=False,
        null=False,
        decimal_places=2,
        max_digits=20,
        db_comment="Quantity of fuel supplied."
    )

    expected_use = models.ForeignKey(
        ExpectedUse,
        on_delete=models.PROTECT,
        null=False
    )

    rationale = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment='Alternate rationale when expected use is "other".'
    )

    class Meta:
        db_table = 'compliance_report_schedule_c_record'
        ordering = ['id']

    db_table_comment = 'Line items for "Schedule C - Fuels Used for Other ' \
                       'Purposes" report.'


class ScheduleD(Commentable):
    class Meta:
        db_table = 'compliance_report_schedule_d'

    db_table_comment = 'Sets of worksheets for "Schedule D" report.'


class ScheduleDSheet(Commentable):
    """
    Represents a single fuel in a Schedule D report
    """
    schedule = models.ForeignKey(
        ScheduleD,
        related_name='sheets',
        on_delete=models.PROTECT,
        null=False
    )

    fuel_type = models.ForeignKey(
        ApprovedFuel,
        on_delete=models.PROTECT,
        null=False
    )

    fuel_class = models.ForeignKey(
        FuelClass,
        on_delete=models.PROTECT,
        null=False
    )

    feedstock = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'compliance_report_schedule_d_sheet'
        ordering = ['id']

    db_table_comment = "Represents a single fuel in a Schedule D report"


class ScheduleDSheetInput(Commentable):
    """
    Represents a set of spreadsheet inputs for a Schedule D record
    """
    sheet = models.ForeignKey(
        ScheduleDSheet,
        related_name='inputs',
        on_delete=models.PROTECT,
        null=False
    )

    worksheet_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Short descriptive name of the worksheet for user reference"
    )
    cell = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Spreadsheet cell address"
    )
    value = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Value entered in spreadsheet cell"
    )
    units = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Unit (eg percent, L) of value in spreadsheet cell"
    )
    description = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Description or purpose of the value"
    )

    class Meta:
        db_table = 'compliance_report_schedule_d_sheet_input'
        ordering = ['id']

    db_table_comment = "Represents a set of spreadsheet inputs for a " \
                       "Schedule D record"


class ScheduleDSheetOutput(Commentable):
    """
    Represents a set of spreadsheet outputs for a Schedule D record
    """
    class OutputCells(Enum):
        """
        Enum of possible output cell names
        """
        DISPENSING = "Fuel Dispensing"
        DISTRIBUTION = "Fuel Distribution and Storage"
        PRODUCTION = "Fuel Production"
        FEEDSTOCK_TRANSMISSION = "Feedstock Transmission"
        FEEDSTOCK_RECOVERY = "Feedstock Recovery"
        FEEDSTOCK_UPGRADING = "Feedstock Upgrading"
        LAND_USE_CHANGE = "Land Use Change"
        FERTILIZER = "Fertilizer Manufacture"
        GAS_LEAKS_AND_FLARES = "Gas Leaks and Flares"
        CO2_AND_H2S_REMOVED = "CO₂ and H₂S Removed"
        EMISSIONS_DISPLACED = "Emissions Displaced"
        FUEL_USE_HIGH_HEATING_VALUE = "Fuel Use (High Heating Value)"

    sheet = models.ForeignKey(
        ScheduleDSheet,
        related_name='outputs',
        on_delete=models.PROTECT,
        null=False
    )

    intensity = models.DecimalField(
        blank=True,
        decimal_places=50,
        default=Decimal('0.00'),
        max_digits=100,
        null=True,
        db_comment="Carbon Intensity (gCO2e/MJ)"
    )

    description = models.CharField(
        choices=[(c, c.name) for c in OutputCells],
        max_length=100,
        blank=True,
        null=True,
        db_comment="Spreadsheet model output type (enumerated value)"
    )

    class Meta:
        db_table = 'compliance_report_schedule_d_sheet_output'
        unique_together = [['description', 'sheet']]

    db_table_comment = "Represents a set of spreadsheet outputs for a " \
                       "Schedule D record"


class ScheduleSummary(Commentable):
    """
    Stores a set of inputs from the summary page of a compliance report
    (eg fuel volume retained or deferred)
    """
    gasoline_class_retained = models.DecimalField(
        blank=True,
        null=True,
        decimal_places=2,
        max_digits=20,
        db_comment="Liters of gasoline-class fuel retained"
    )
    gasoline_class_deferred = models.DecimalField(
        blank=True,
        null=True,
        decimal_places=2,
        max_digits=20,
        db_comment="Liters of gasoline-class fuel deferred"
    )

    diesel_class_retained = models.DecimalField(
        blank=True,
        null=True,
        decimal_places=2,
        max_digits=20,
        db_comment="Liters of diesel-class fuel retained"
    )
    diesel_class_deferred = models.DecimalField(
        blank=True,
        null=True,
        decimal_places=2,
        max_digits=20,
        db_comment="Liters of diesel-class fuel deferred"
    )
    credits_offset = models.IntegerField(
        blank=True,
        null=True,
        db_comment="Credits used to off set debits (if applicable)"
    )

    class Meta:
        db_table = 'compliance_report_summary'
    db_table_comment = "Stores a set of inputs from the summary page of a " \
                       "compliance report (eg fuel volume retained or " \
                       "deferred)"
