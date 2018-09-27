from django.core.exceptions import ValidationError

from .exceptions import PositiveIntegerException


def CreditTradeNumberOfCreditsValidator(value):
    """
    Validates and makes sure that the user doesn't
    enter 0 or a negative value for the number of
    credits
    """
    if value <= 0:
        raise PositiveIntegerException(
            "Please enter at least 1 credit."
        )


def CreditTradeFairMarketValueValidator(value):
    """
    Validates and makes sure that the user doesn't
    a negative value for fair market value
    (they can enter 0, though)
    """
    if value < 0:
        raise PositiveIntegerException(
            "Value per credit can't be negative."
        )
