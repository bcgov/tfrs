import json

from api.models.OrganizationType import OrganizationType
from .base_test_case import BaseTestCase


class TestOrganizations(BaseTestCase):

    def test_get_fuel_suppliers_only(self):
        response = self.clients['gov_analyst'].get("/api/organizations/fuel_suppliers")
        response_data = json.loads(response.content.decode("utf-8"))
        for fs in response_data:
            self.assertEqual(
                fs['type'],
                OrganizationType.objects.get_by_natural_key("Part3FuelSupplier").id
            )
