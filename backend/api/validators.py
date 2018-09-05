from django.core.exceptions import ValidationError

from .exceptions import PositiveIntegerException


def CreditTradeNumberOfCreditsValidator(value):
    if value <= 0:
        raise PositiveIntegerException(
            "Number of Credits can't be negative."
        )


def CreditTradeFairMarketValueValidator(value):
    if value < 0:
        raise PositiveIntegerException(
            "Value per credit can't be negative."
        )
