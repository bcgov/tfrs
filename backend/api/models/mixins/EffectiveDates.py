from django.db import models


class EffectiveDates(models.Model):

    effective_date = models.DateField(
        blank=True, null=True, db_comment='The calendar date the value became valid.')

    expiration_date = models.DateField(
        blank=True, null=True, db_comment='The calendar date the value is no longer valid.')

    class Meta:
        abstract = True
