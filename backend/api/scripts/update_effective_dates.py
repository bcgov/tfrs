from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.CreditTradeStatus import CreditTradeStatus


def run():
    """
    Goes through the Credit Trades and makes sure that the
    effective date is correct, by going through the history
    and seeing what the last status e=was
    """
    status_approved = CreditTradeStatus.objects \
                                        .get(status="Approved")

    status_completed = CreditTradeStatus.objects \
                                        .get(status="Completed")

    # Get all completed credit transfers
    credit_trades = CreditTrade.objects.filter(
        status_id=status_completed.id).order_by('-id')

    for credit_trade in credit_trades:
        # as we loop through the completed credit trades,
        # look at the history, and check what the last effective was
        # before it was completed
        credit_trade_history = CreditTradeHistory.objects.filter(
            credit_trade_id=credit_trade.id,
            status_id=status_approved.id
        ).order_by('-update_timestamp', '-id').first()

        if credit_trade_history:
            credit_trade_history_complete = CreditTradeHistory.objects.filter(
                credit_trade_id=credit_trade.id,
                status_id=status_completed.id
            ).order_by('-update_timestamp', '-id').first()

            if credit_trade_history_complete.trade_effective_date != \
               credit_trade_history.trade_effective_date and \
               credit_trade_history.trade_effective_date is not None:
                # Update the history that has a status completed
                # so it uses the that effective date
                credit_trade_history_complete.trade_effective_date = \
                    credit_trade_history.trade_effective_date
                credit_trade_history_complete.save()

                # Update the credit trade
                credit_trade.trade_effective_date = \
                    credit_trade_history.trade_effective_date
                credit_trade.save()
