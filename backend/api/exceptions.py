from rest_framework.exceptions import APIException

class PositiveIntegerException(APIException):
    status_code = 422
    default_detail = 'Value must be a positive integer'