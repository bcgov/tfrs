from enum import Enum

from django.db.models import Model
from django.db import models

from api.models.ProvisionOfTheAct import ProvisionOfTheAct
from api.models.ApprovedFuel import ApprovedFuel
from api.models.ExpectedUse import ExpectedUse
from api.models.FuelClass import FuelClass
from api.models.FuelCode import FuelCode
from api.models.NotionalTransferType import NotionalTransferType
from decimal import Decimal


class ScheduleC(Model):
    class Meta:
        db_table = 'compliance_report_schedule_c'


class ScheduleCRecord(Model):
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
        max_digits=20
    )

    expected_use = models.ForeignKey(
        ExpectedUse,
        on_delete=models.PROTECT,
        null=False
    )

    rationale = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'compliance_report_schedule_c_record'


class ScheduleA(Model):
    class Meta:
        db_table = 'compliance_report_schedule_a'


class ScheduleARecord(Model):
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
        max_digits=20
    )

    trading_partner = models.CharField(
        max_length=200,
        blank=False,
        null=False
    )

    postal_address = models.CharField(
        max_length=200,
        blank=False,
        null=False
    )

    class Meta:
        db_table = 'compliance_report_schedule_a_record'


class ScheduleB(Model):
    class Meta:
        db_table = 'compliance_report_schedule_b'


class ScheduleBRecord(Model):
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
        max_digits=20
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

    class Meta:
        db_table = 'compliance_report_schedule_b_record'


class ScheduleD(Model):
    class Meta:
        db_table = 'compliance_report_schedule_d'


class ScheduleDSheet(Model):
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


class ScheduleDSheetInput(Model):
    sheet = models.ForeignKey(
        ScheduleDSheet,
        related_name='inputs',
        on_delete=models.PROTECT,
        null=False
    )

    worksheet_name = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    cell = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    value = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    units = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    description = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'compliance_report_schedule_d_sheet_input'


class ScheduleDSheetOutput(Model):

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
        decimal_places=2,
        default=Decimal('0.00'),
        max_digits=5,
        null=True,
        db_comment="Carbon Intensity (gCO2e/MJ)"
    )

    description = models.CharField(
        choices=[(c, c.name) for c in OutputCells],
        max_length=100,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'compliance_report_schedule_d_sheet_output'
        unique_together = [['description', 'sheet']]
