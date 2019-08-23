from django.db import models

from auditable.models import Commentable


class ExclusionAgreement(Commentable):
    """
    Container for a single instance of "Exclusion Agreement"
    """
    class Meta:
        db_table = 'compliance_report_exclusion_agreement'

    db_table_comment = 'Container for a single instance of ' \
                       '"Exclusion Agreement"'


class ExclusionAgreementRecord(Commentable):
    """
    Line items for "Exclusion Agreement".
    """
    exclusion_agreement = models.ForeignKey(
        ExclusionAgreement,
        related_name='records',
        on_delete=models.PROTECT,
        null=False
    )

    transaction_type = models.ForeignKey(
        'TransactionType',
        on_delete=models.PROTECT,
        null=False
    )

    fuel_type = models.ForeignKey(
        'ApprovedFuel',
        on_delete=models.PROTECT,
        null=False
    )

    transaction_partner = models.CharField(
        max_length=200,
        blank=False,
        null=False,
        db_comment="Legal organization name of the transaction partner. This "
                   "is a free form text field with auto-suggested values from "
                   "existing Organization names."
    )

    postal_address = models.CharField(
        max_length=200,
        blank=False,
        null=False,
        db_comment="Contains the transaction partner address. This is a free "
                   "form text field with auto-suggested values from existing "
                   "Organization addresses."
    )

    quantity = models.DecimalField(
        blank=False,
        null=False,
        decimal_places=0,
        max_digits=15,
        db_comment="Quantity of fuel purchased or sold."
    )

    quantity_not_sold = models.DecimalField(
        blank=False,
        null=False,
        decimal_places=0,
        max_digits=15,
        db_comment="Quantity of fuel not sold or supplied within the "
                   "Compliance Period."
    )

    class Meta:
        db_table = 'compliance_report_exclusion_agreement_record'
        ordering = ['id']

    db_table_comment = 'Line items for "Exclusion Agreement".'
