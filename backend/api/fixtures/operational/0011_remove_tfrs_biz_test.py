from django.db import transaction
from django.db.models import Q

from api.management.data_script import OperationalDataScript
from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeComment import CreditTradeComment
from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.Organization import Organization
from api.models.OrganizationBalance import OrganizationBalance
from api.models.SigningAuthorityConfirmation \
    import SigningAuthorityConfirmation
from api.models.User import User


class RemoveTFRSBizTest(OperationalDataScript):
    """
    Remove TFRS Biz Test and users associated
    """
    is_revertable = False
    comment = 'Remove TFRS Biz Test and users associated'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        CreditTradeHistory.objects.filter(
            update_user__in=User.objects.filter(
                organization__name="TFRS Biz Test"
            )
        ).update(
            update_user=None
        )

        CreditTrade.objects.filter(
            update_user__in=User.objects.filter(
                organization__name="TFRS Biz Test"
            )
        ).update(
            update_user=None
        )

        CreditTradeComment.objects.filter(
            credit_trade__in=CreditTrade.objects.filter(
                Q(respondent__name="TFRS Biz Test") |
                Q(initiator__name="TFRS Biz Test")
            )
        ).delete()

        OrganizationBalance.objects.filter(
            organization__name="TFRS Biz Test"
        ).delete()

        OrganizationBalance.objects.filter(
            credit_trade__in=CreditTrade.objects.filter(
                Q(respondent__name="TFRS Biz Test") |
                Q(initiator__name="TFRS Biz Test")
            )
        ).delete()

        CreditTradeHistory.objects.filter(
            credit_trade__in=CreditTrade.objects.filter(
                Q(respondent__name="TFRS Biz Test") |
                Q(initiator__name="TFRS Biz Test")
            )
        ).delete()

        SigningAuthorityConfirmation.objects.filter(
            credit_trade__in=CreditTrade.objects.filter(
                Q(respondent__name="TFRS Biz Test") |
                Q(initiator__name="TFRS Biz Test")
            )
        ).delete()

        CreditTrade.objects.filter(
            Q(respondent__name="TFRS Biz Test") |
            Q(initiator__name="TFRS Biz Test")
        ).delete()

        User.objects.filter(
            organization__name="TFRS Biz Test"
        ).delete()

        Organization.objects.filter(
            name="TFRS Biz Test"
        ).delete()

script_class = RemoveTFRSBizTest
