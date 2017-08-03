from rest_framework.exceptions import APIException
from django.utils.encoding import force_text
from rest_framework import status


class CustomValidation(APIException):

    def __init__(self, detail, field, status_code):
        self.detail = detail
        if detail is not None:
            self.detail = {field: force_text(detail)}
        self.message = detail
        self.field = field
        self.status_code = status_code

    def __call__(self, value):
        detail = self.detail
        message = self.message
        field = self.field
        status_code = self.status_code
        if value <= 0:
            raise CustomValidation(message, field, status_code)