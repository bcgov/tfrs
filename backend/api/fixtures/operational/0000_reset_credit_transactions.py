from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeComment import CreditTradeComment
from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.Document import Document
from api.models.DocumentComment import DocumentComment
from api.models.DocumentCreditTrade import DocumentCreditTrade
from api.models.DocumentFileAttachment import DocumentFileAttachment
from api.models.DocumentHistory import DocumentHistory
from api.models.DocumentMilestone import DocumentMilestone
from api.models.NotificationMessage import NotificationMessage
from api.models.Organization import Organization
from api.models.OrganizationBalance import OrganizationBalance
from api.models.SigningAuthorityConfirmation import \
    SigningAuthorityConfirmation


class ResetCreditTransactions(OperationalDataScript):
    """
    Deletes the credit transactions and associated records.
    (Includes secure file submission)
    """
    is_revertable = False
    comment = "Deletes the credit transactions and associated records"

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        OrganizationBalance.objects.all().delete()
        SigningAuthorityConfirmation.objects.all().delete()
        NotificationMessage.objects.all().delete()

        DocumentComment.objects.all().delete()
        DocumentMilestone.objects.all().delete()
        DocumentCreditTrade.objects.all().delete()
        DocumentHistory.objects.all().delete()
        DocumentFileAttachment.objects.all().delete()
        Document.objects.all().delete()

        CreditTradeComment.objects.all().delete()
        CreditTradeHistory.objects.all().delete()
        CreditTrade.objects.all().delete()

        government = Organization.objects.get(
            name="Government of British Columbia"
        )

        OrganizationBalance.objects.create(
            credit_trade_id=None,
            organization_id=government.id,
            validated_credits=1000000000000000,
            effective_date="2017-01-01"
        )

        organizations = Organization.objects.exclude(
            id=government.id
        )

        for organization in organizations:
            OrganizationBalance.objects.create(
                credit_trade_id=None,
                organization=organization,
                validated_credits=0,
                effective_date="2017-01-01"
            )

script_class = ResetCreditTransactions
