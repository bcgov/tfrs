# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
"""
    REST API Documentation for the NRsS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

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

from rest_framework import status

from .base_test_case import BaseTestCase


class TestCreditCalculation(BaseTestCase):
    """Tests for the credit calculation endpoint"""
    extra_fixtures = [
        'test/test_unit_of_measures.json',
        'test/test_carbon_intensity_limits.json',
        'test/test_default_carbon_intensities.json',
        'test/test_energy_densities.json',
        'test/test_energy_effectiveness_ratio.json'
    ]

    def test_get_carbon_intensity_limits_list(self):
        """
        Test that the carbon intensity limit shows up properly
        """
        response = self.clients['gov_analyst'].get(
            "/api/credit_calculation/carbon_intensity_limits"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        for row in response_data:
            if row["description"] == "2018":
                self.assertEqual(
                    row["limits"]["diesel"]["fuel"], "Diesel Class")
                self.assertEqual(
                    row["limits"]["diesel"]["density"], 88.6)
                self.assertEqual(
                    row["limits"]["gasoline"]["fuel"], "Gasoline Class")
                self.assertEqual(
                    row["limits"]["gasoline"]["density"], 82.41)

    def test_get_default_carbon_intensity_list(self):
        """
        Test that the carbon intensity shows up properly
        """
        response = self.clients['gov_analyst'].get(
            "/api/credit_calculation/default_carbon_intensities"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        for row in response_data:
            if row["name"] == "CNG":
                self.assertEqual(row["density"], 63.64)

            elif row["name"] == "LNG":
                self.assertEqual(row["density"], 112.65)

    def test_get_energy_density_list(self):
        """
        Test that the energy effectiveness ratio shows up properly
        """
        response = self.clients['gov_analyst'].get(
            "/api/credit_calculation/energy_densities"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        for row in response_data:
            if row["name"] == "Biodiesel":
                self.assertEqual(row["density"], 35.40)
                self.assertEqual(row["unitOfMeasure"], "L")

            elif row["name"] == "Hydrogen":
                self.assertEqual(row["density"], 141.24)
                self.assertEqual(row["unitOfMeasure"], "kg")

    def test_get_energy_effectiveness_ratio_list(self):
        """
        Test that the energy effectiveness ratio shows up properly
        """
        response = self.clients['gov_analyst'].get(
            "/api/credit_calculation/energy_effectiveness_ratios"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        for row in response_data:
            if row["name"] == "CNG":
                self.assertEqual(row["dieselRatio"], 0.9)

            elif row["name"] == "LNG":
                self.assertEqual(row["dieselRatio"], 1.0)
                self.assertEqual(row["gasolineRatio"], None)

            elif row["name"] == "Propane":
                self.assertEqual(row["dieselRatio"], None)
                self.assertEqual(row["gasolineRatio"], None)
