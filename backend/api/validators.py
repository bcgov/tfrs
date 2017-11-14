from django.core.exceptions import ValidationError

from .exceptions import PositiveIntegerException

def CreditTradeNumberOfCreditsValidator(value):
    if value <= 0:
        raise PositiveIntegerException()