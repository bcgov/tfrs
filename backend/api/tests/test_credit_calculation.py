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

from datetime import date
from decimal import Decimal
from rest_framework import status

from api.models.ApprovedFuel import ApprovedFuel
from api.models.CompliancePeriod import CompliancePeriod
from api.models.FuelClass import FuelClass

from .base_test_case import BaseTestCase


class TestCreditCalculation(BaseTestCase):
    """Tests for the credit calculation endpoint"""
    extra_fixtures = [
        'test/test_unit_of_measures.json',
        'test/test_carbon_intensity_limits.json',
        'test/test_default_carbon_intensities.json',
        'test/test_energy_densities.json',
        'test/test_energy_effectiveness_ratio.json',
        'test/test_petroleum_carbon_intensities.json'
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

    def test_get_petroleum_carbon_intensity_list(self):
        """
        Test that the petroleum-based carbon intensity shows up properly
        """
        response = self.clients['gov_analyst'].get(
            "/api/credit_calculation/petroleum_carbon_intensities"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        for row in response_data:
            if row["name"] == "Petroleum-based diesel":
                self.assertEqual(row["density"], 94.76)

            elif row["name"] == "Petroleum-based gasoline":
                self.assertEqual(row["density"], 88.14)

    def test_update_energy_effectiveness_ratio(self):
        """
        Test that the updating energy effectiveness ratio actually updates the
        effective and expiry dates properly.
        It should never overwrite the current record
        """
        from api.models.EnergyEffectivenessRatio import \
            EnergyEffectivenessRatio

        approved_fuel = ApprovedFuel.objects.get(name="CNG")
        diesel_fuel_class = FuelClass.objects.get(fuel_class="Diesel")
        gasoline_fuel_class = FuelClass.objects.get(fuel_class="Gasoline")

        payload = {
            "dieselEffectiveDate": "2022-01-01",
            "dieselRatio": 1.9,  # up from 0.9,
            "gasolineEffectiveDate": "2020-01-01",
            "gasolineRatio": 2.0  # up from 1.0
        }

        response = self.clients['gov_analyst'].put(
            "/api/credit_calculation/energy_effectiveness_ratios/{}".format(
                approved_fuel.energy_effectiveness_ratio_category_id
            ),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        diesel_ratio = EnergyEffectivenessRatio.objects.get(
            category_id=approved_fuel.energy_effectiveness_ratio_category_id,
            fuel_class=diesel_fuel_class,
            effective_date="2017-01-01"
        )

        # ratio should remain unchanged for the old record
        self.assertEqual(diesel_ratio.ratio, Decimal('0.90'))

        # but it should now have an expiry date
        self.assertEqual(
            diesel_ratio.expiration_date, date(2021, 12, 31))

        diesel_ratio = EnergyEffectivenessRatio.objects.get(
            category_id=approved_fuel.energy_effectiveness_ratio_category_id,
            fuel_class=diesel_fuel_class,
            effective_date="2022-01-01"
        )

        self.assertEqual(diesel_ratio.ratio, Decimal('1.9'))

        # expiry date for the new record should be null
        self.assertIsNone(diesel_ratio.expiration_date)

        gasoline_ratio = EnergyEffectivenessRatio.objects.get(
            category_id=approved_fuel.energy_effectiveness_ratio_category_id,
            fuel_class=gasoline_fuel_class,
            effective_date="2017-01-01"
        )

        # ratio should remain unchanged for the old record
        self.assertEqual(gasoline_ratio.ratio, Decimal('1.0'))

        # but it should now have an expiry date
        self.assertEqual(
            gasoline_ratio.expiration_date, date(2019, 12, 31))

        gasoline_ratio = EnergyEffectivenessRatio.objects.get(
            category_id=approved_fuel.energy_effectiveness_ratio_category_id,
            fuel_class=gasoline_fuel_class,
            effective_date="2020-01-01"
        )

        self.assertEqual(gasoline_ratio.ratio, Decimal('2.0'))

        # expiry date for the new record should be null
        self.assertIsNone(gasoline_ratio.expiration_date)

    def test_update_energy_density(self):
        """
        Test that the updating energy density actually updates the effective
        and expiry dates properly.
        It should never overwrite the current record
        """
        from api.models.EnergyDensity import \
            EnergyDensity

        approved_fuel = ApprovedFuel.objects.get(name="LNG")

        payload = {
            "density": 55.46,
            "effectiveDate": "2019-01-01"
        }

        response = self.clients['gov_analyst'].put(
            "/api/credit_calculation/energy_densities/{}".format(
                approved_fuel.energy_density_category_id
            ),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        current_density = EnergyDensity.objects.get(
            category_id=approved_fuel.energy_density_category_id,
            effective_date="2017-01-01"
        )

        # density should remain unchanged for the old record
        self.assertEqual(current_density.density, Decimal('52.46'))

        # but it should now have an expiry date
        self.assertEqual(
            current_density.expiration_date, date(2018, 12, 31))

        new_density = EnergyDensity.objects.get(
            category_id=approved_fuel.energy_density_category_id,
            effective_date="2019-01-01"
        )

        self.assertEqual(new_density.density, Decimal('55.46'))

        # expiry date for the new record should be null
        self.assertIsNone(new_density.expiration_date)

    def test_update_default_carbon_intensity(self):
        """
        Test that the updating default carbon intensity actually updates the
        effective and expiry dates properly.
        It should never overwrite the current record
        """
        from api.models.DefaultCarbonIntensity import \
            DefaultCarbonIntensity

        approved_fuel = ApprovedFuel.objects.get(name="CNG")

        payload = {
            "density": 65.64,
            "effectiveDate": "2022-01-01"
        }

        response = self.clients['gov_analyst'].put(
            "/api/credit_calculation/default_carbon_intensities/{}".format(
                approved_fuel.default_carbon_intensity_category_id
            ),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        current_density = DefaultCarbonIntensity.objects.get(
            category_id=approved_fuel.default_carbon_intensity_category_id,
            effective_date="2017-01-01"
        )

        # density should remain unchanged for the old record
        self.assertEqual(current_density.density, Decimal('63.64'))

        # but it should now have an expiry date
        self.assertEqual(
            current_density.expiration_date, date(2021, 12, 31))

        new_density = DefaultCarbonIntensity.objects.get(
            category_id=approved_fuel.default_carbon_intensity_category_id,
            effective_date="2022-01-01"
        )

        self.assertEqual(new_density.density, Decimal('65.64'))

        # expiry date for the new record should be null
        self.assertIsNone(new_density.expiration_date)

    def test_update_carbon_intensity_limit(self):
        """
        Test that the updating carbon intensity limit actually updates the
        effective and expiry dates properly.
        It should never overwrite the current record
        """
        from api.models.CarbonIntensityLimit import \
            CarbonIntensityLimit

        compliance_period = CompliancePeriod.objects.get(description="2020")
        diesel_fuel_class = FuelClass.objects.get(fuel_class="Diesel")
        gasoline_fuel_class = FuelClass.objects.get(fuel_class="Gasoline")

        payload = {
            "dieselCarbonIntensity": 86.58,
            "dieselEffectiveDate": "2020-01-01",
            "gasolineCarbonIntensity": 80.33,
            "gasolineEffectiveDate": "2020-01-01"
        }

        response = self.clients['gov_analyst'].put(
            "/api/credit_calculation/carbon_intensity_limits/{}".format(
                compliance_period.id
            ),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        diesel_density = CarbonIntensityLimit.objects.get(
            compliance_period=compliance_period,
            fuel_class=diesel_fuel_class,
            effective_date="2017-01-01"
        )

        # density should remain unchanged for the old record
        self.assertEqual(diesel_density.density, Decimal('85.28'))

        # but it should now have an expiry date
        self.assertEqual(
            diesel_density.expiration_date, date(2019, 12, 31))

        diesel_density = CarbonIntensityLimit.objects.get(
            compliance_period=compliance_period,
            fuel_class=diesel_fuel_class,
            effective_date="2020-01-01"
        )

        self.assertEqual(diesel_density.density, Decimal('86.58'))

        # expiry date for the new record should be null
        self.assertIsNone(diesel_density.expiration_date)

        gasoline_density = CarbonIntensityLimit.objects.get(
            compliance_period=compliance_period,
            fuel_class=gasoline_fuel_class,
            effective_date="2017-01-01"
        )

        # density should remain unchanged for the old record
        self.assertEqual(gasoline_density.density, Decimal('79.33'))

        # but it should now have an expiry date
        self.assertEqual(
            gasoline_density.expiration_date, date(2019, 12, 31))

        gasoline_density = CarbonIntensityLimit.objects.get(
            compliance_period=compliance_period,
            fuel_class=gasoline_fuel_class,
            effective_date="2020-01-01"
        )

        self.assertEqual(gasoline_density.density, Decimal('80.33'))

        # expiry date for the new record should be null
        self.assertIsNone(gasoline_density.expiration_date)

    def test_update_petroleum_carbon_intensity(self):
        """
        Test that the updating petroleum carbon intensity actually updates
        the effective and expiry dates properly.
        It should never overwrite the current record
        """
        from api.models.PetroleumCarbonIntensity import \
            PetroleumCarbonIntensity

        from api.models.PetroleumCarbonIntensityCategory import \
            PetroleumCarbonIntensityCategory

        category = PetroleumCarbonIntensityCategory.objects.\
            get(name="Petroleum-based diesel")

        payload = {
            "density": 95.76,
            "effectiveDate": "2022-01-01"
        }

        response = self.clients['gov_analyst'].put(
            "/api/credit_calculation/petroleum_carbon_intensities/{}".format(
                category.id
            ),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        current_density = PetroleumCarbonIntensity.objects.get(
            category_id=category.id,
            effective_date="2017-01-01"
        )

        # density should remain unchanged for the old record
        self.assertEqual(current_density.density, Decimal('94.76'))

        # but it should now have an expiry date
        self.assertEqual(
            current_density.expiration_date, date(2021, 12, 31))

        new_density = PetroleumCarbonIntensity.objects.get(
            category_id=category.id,
            effective_date="2022-01-01"
        )

        self.assertEqual(new_density.density, Decimal('95.76'))

        # expiry date for the new record should be null
        self.assertIsNone(new_density.expiration_date)
