from unittest import TestCase
from decimal import Decimal
from datetime import datetime
from api.serializers.ComplianceReport import ComplianceReportDetailSerializer, CompliancePeriodSerializer
from unittest.mock import MagicMock, Mock
from api.models.Organization import Organization


class TestComplianceReportDetailSerializer(TestCase):
    def setUp(self):
        self.serializer = ComplianceReportDetailSerializer()
        self.serializer.compliance_period = CompliancePeriodSerializer()
        self.serializer.summary = None
        self.serializer.supplements = None
        self.serializer.organization = Organization.objects.first()

        self.serializer.schedule_a = MagicMock(
            net_gasoline_class_transferred=Decimal('10'),
            net_diesel_class_transferred=Decimal('20')
        )
        self.serializer.schedule_b = MagicMock(
            total_petroleum_diesel=Decimal('30'),
            total_petroleum_gasoline=Decimal('40'),
            total_renewable_diesel=Decimal('50'),
            total_renewable_gasoline=Decimal('60'),
            total_credits=Decimal('70'),
            total_debits=Decimal('80')
        )
        self.serializer.schedule_c = MagicMock(
            total_petroleum_diesel=Decimal('90'),
            total_petroleum_gasoline=Decimal('100'),
            total_renewable_diesel=Decimal('110'),
            total_renewable_gasoline=Decimal('120')
        )

    def test_get_summary_for_year_lt_2023(self):
        self.serializer.compliance_period.description = '2022'
        result = self.serializer.get_summary(self.serializer)['total_payable']
        self.assertEqual(result, Decimal('2000.00'))

    def test_get_summary_for_year_gt_2022(self):
        self.serializer.compliance_period.description = '2023'
        result = self.serializer.get_summary(self.serializer)['total_payable']
        self.assertEqual(result, Decimal('6000.00'))