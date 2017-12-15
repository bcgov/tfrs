from django.test import TestCase
from . import utils


class TestUtils(TestCase):
    valid_names = [
        {'display_name': 'Dane Toe',
         'user_type': 'Business',
         'result': {
             'first_name': "Dane",
             'last_name': "Toe"}
         },
        {'display_name': 'Dane Toe',
         'user_type': 'Personal',
         'result': {
             'first_name': "Dane",
             'last_name': "Toe"}
         },
        {'display_name': 'Toe, Dane (Test) FFFF:EX',
         'user_type': 'Internal',
         'result': {
             'first_name': "Dane",
             'last_name': "Toe"}
         },
        {'display_name': 'Toe, Dane FFFF:EX',
         'user_type': 'Internal',
         'result': {
             'first_name': "Dane",
             'last_name': "Toe"}
         },
        {'display_name': 'Toe, Dane FFFF:EX',
         'user_type': 'Internal',
         'result': {
             'first_name': "Dane",
             'last_name': "Toe"}
         },
    ]

    def setUp(self):
        pass

    def test_names(self):
        for name in self.valid_names:
            fname, lname = utils.get_firstname_lastname(
                name.get("display_name"), name.get("user_type"))

            assert fname == name.get("result").get("first_name")
            assert lname == name.get("result").get("last_name")
