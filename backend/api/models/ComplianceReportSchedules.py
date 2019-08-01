import decimal
from enum import Enum
from decimal import Decimal

from django.db import models

from api.models.ProvisionOfTheAct import ProvisionOfTheAct
from api.models.ApprovedFuel import ApprovedFuel
from api.models.ExpectedUse import ExpectedUse
from api.models.FuelClass import FuelClass
from api.models.FuelCode import FuelCode
from api.models.NotionalTransferType import NotionalTransferType
from api.services.CreditCalculationService import CreditCalculationService
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

    @property
    def net_diesel_class_transferred(self):
        records = self.records.all()
        total = 0
        for record in records:
            if record.fuel_class.fuel_class == 'Diesel':
             total += record.net_transferred
        return total

    @property
    def net_gasoline_class_transferred(self):
        records = self.records.all()
        total = 0
        for record in records:
            if record.fuel_class.fuel_class == 'Gasoline':
                total += record.net_transferred
        return total

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

    @property
    def net_transferred(self):
        k = 0

        if self.transfer_type.the_type == 'Transferred':
            k = -1
        if self.transfer_type.the_type == 'Received':
            k = 1

        return decimal.Decimal(k) * self.quantity

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

    @property
    def total_credits(self):
        out = self.records.all()
        total = 0
        for record in out:
            cred = record.credits
            if cred is not None:
                total += cred

        return round(total)

    @property
    def total_debits(self):
        out = self.records.all()
        total = 0
        for record in out:
            deb = record.debits
            if deb is not None:
                total += deb

        return round(total)

    @property
    def total_petroleum_diesel(self):
        out = self.records.all()
        total = 0
        for record in out:
            val = record.petroleum_diesel_volume
            if val is not None:
                total += val

        return total

    @property
    def total_petroleum_gasoline(self):
        out = self.records.all()
        total = 0
        for record in out:
            val = record.petroleum_gasoline_volume
            if val is not None:
                total += val

        return total

    @property
    def total_renewable_diesel(self):
        out = self.records.all()
        total = 0
        for record in out:
            val = record.renewable_diesel_volume
            if val is not None:
                total += val

        return total

    @property
    def total_renewable_gasoline(self):
        out = self.records.all()
        total = 0
        for record in out:
            val = record.renewable_gasoline_volume
            if val is not None:
                total += val

        return total


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

    @property
    def effective_carbon_intensity(self):
        if self.provision_of_the_act is None:
            return None

        t = self.provision_of_the_act.determination_type.the_type

        if t == 'Alternative':
            return self.intensity
        if t == 'GHGenius':
            i = self.schedule_d_sheet_index
            sheets = self.schedule.compliance_report.schedule_d.sheets.all()
            return sheets[i].carbon_intensity
        if t == 'Fuel Code':
            if self.fuel_code is None:
                return None
            return self.fuel_code.carbon_intensity
        if t == 'Carbon Intensity' or t == 'Default Carbon Intensity':
            period = self.schedule.compliance_report.compliance_period
            if self.fuel_type.credit_calculation_only:
                obj = CreditCalculationService.get(
                    category__name=self.fuel_type.name,
                    effective_date=period.effective_date,
                    model_name="PetroleumCarbonIntensity"
                )
                return obj.density
            else:
                obj = CreditCalculationService.get(
                    category__name=self.fuel_type.default_carbon_intensity_category.name,
                    effective_date=period.effective_date,
                    model_name="DefaultCarbonIntensity"
                )
                return obj.density

        return None

    @property
    def ci_limit(self):
        period = self.schedule.compliance_report.compliance_period
        obj = CreditCalculationService.get(
            compliance_period=period,
            effective_date=period.effective_date,
            fuel_class__fuel_class=self.fuel_class.fuel_class,
            model_name="CarbonIntensityLimit"
        )
        return obj.density

    @property
    def energy_density(self):
        period = self.schedule.compliance_report.compliance_period
        obj = CreditCalculationService.get(
            category_id=self.fuel_type.energy_density_category_id,
            effective_date=period.effective_date,
            model_name="EnergyDensity"
        )

        return obj.density

    @property
    def eer(self):
        period = self.schedule.compliance_report.compliance_period
        obj = CreditCalculationService.get(
            category_id=self.fuel_type.energy_effectiveness_ratio_category_id,
            effective_date=period.effective_date,
            fuel_class__fuel_class=self.fuel_class.fuel_class,
            model_name="EnergyEffectivenessRatio"
        )
        return obj.ratio

    @property
    def energy_content(self):
        try:
            return self.energy_density * self.quantity
        except TypeError:
            return None

    @property
    def raw_credits(self):
        credit = self.ci_limit * self.eer
        credit = credit - self.effective_carbon_intensity
        credit = credit * self.energy_content
        credit = credit / 1000000

        # unrounded values
        return credit

    @property
    def credits(self):
        try:
            rc = self.raw_credits
            if rc >= 0:
                return rc
        except TypeError:
            return None

    @property
    def debits(self):
        try:
            rc = self.raw_credits
            if rc < 0:
                return -1 * rc
        except TypeError:
            return None

    @property
    def renewable_gasoline_volume(self):
        fraction = 1

        if self.fuel_code is not None and self.fuel_code.renewable_percentage is not None:
            fraction = self.fuel_code.renewable_percentage / decimal.Decimal(100.0)

        renewable_fuels = ["Ethanol", "Renewable gasoline"]
        if self.fuel_type.name in renewable_fuels:
            if self.fuel_class.fuel_class == 'Gasoline':
                return self.quantity * fraction

        return 0

    @property
    def renewable_diesel_volume(self):
        fraction = 1

        if self.fuel_code is not None and self.fuel_code.renewable_percentage is not None:
            fraction = self.fuel_code.renewable_percentage / decimal.Decimal(100.0)

        renewable_fuels = ["Biodiesel", "HDRD", "Renewable diesel"]
        if self.fuel_type.name in renewable_fuels:
            if self.fuel_class.fuel_class == 'Diesel':
                return self.quantity * fraction

        return 0

    @property
    def petroleum_gasoline_volume(self):
        if self.fuel_type.name == 'Petroleum-based gasoline':
            return self.quantity

        return 0

    @property
    def petroleum_diesel_volume(self):
        if self.fuel_type.name == 'Petroleum-based diesel':
            return self.quantity

        return 0

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

    @property
    def total_petroleum_diesel(self):
        out = self.records.all()
        total = 0
        for record in out:
            val = record.petroleum_diesel_volume
            if val is not None:
                total += val

        return total

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

    @property
    def petroleum_diesel_volume(self):
        if self.fuel_type.name == 'Petroleum-based diesel' and \
                self.expected_use.description == 'Heating Oil':
            return self.quantity

        return 0

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

    @property
    def carbon_intensity(self):
        out = self.outputs.all()
        total = 0
        for record in out:
            total += record.intensity

        return round(total / 1000, 2)

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
