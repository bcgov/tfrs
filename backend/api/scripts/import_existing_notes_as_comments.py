import logging

from django.db import transaction

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeComment import CreditTradeComment
from api.models.User import User


def run(fallback_user_id=None):
    """For all credit trades having notes, create a new comment with the note text and the same
     creating user as the credit transfer.

     fallback_user_id will be used for credit_trades with no creating user.

     If it is not supplied, and such a trade is found, the script will rollback
     """
    transaction.set_autocommit(False)

    fallback_user = User.objects.filter(id=fallback_user_id).first()

    all_credit_trades_with_notes = CreditTrade.objects.filter(
        note__isnull=False
    ).all()

    count = 0

    for ct in all_credit_trades_with_notes:

        comment = CreditTradeComment()
        comment.credit_trade = ct
        comment.privileged_access = True

        comment.create_user = ct.create_user
        comment.create_timestamp = ct.create_timestamp
        comment.update_user = ct.update_user
        comment.update_timestamp = ct.update_timestamp

        if ct.create_user is None:
            if fallback_user is not None:
                comment.create_user = fallback_user
            else:
                transaction.rollback()
                raise Exception("Encountered a note with no create_user"
                                " and no fallback supplied")

        comment.comment = ct.note

        comment.save()

        ct.note = None
        ct.save()
        count += 1

    transaction.commit()

    print('imported {} notes'.format(count))
