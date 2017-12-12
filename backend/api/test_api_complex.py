"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel Requirements Regulation.

    OpenAPI spec version: v1
        

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""

import json
from django.test import TestCase
from django.test import Client
import django



# Complex API test cases. 
# If an API operation contains generated code and requires a complex model object
# (containing child items) then it is tested in this file.
#
# This file will have to be edited by hand.
class Test_Api_Complex(TestCase):

    def setUp(self):
        # Every test needs a client.
        self.client = Client()
        # needed to setup django
        django.setup()


if __name__ == '__main__':
    unittest.main()




