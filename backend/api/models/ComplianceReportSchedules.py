from django.db.models import Model
from django.db import models

from api.models.ApprovedFuel import ApprovedFuel
from api.models.ExpectedUse import ExpectedUse
from api.models.FuelClass import FuelClass


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
