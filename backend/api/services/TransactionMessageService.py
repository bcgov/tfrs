import json
from decimal import Decimal
from typing import Optional

import pika
from pika.exceptions import AMQPError

from api.models.ComplianceReport import ComplianceReport
from api.models.User import User
from tfrs.settings import AMQP_CONNECTION_PARAMETERS


class TransactionDeliveryFailure(Exception):
    """Custom exception for transaction delivery failures."""

    pass


class TransactionMessageService:
    @staticmethod
    def sync_compliance_report_to_lcfs(
        compliance_report: ComplianceReport,
        action: str,
        user: User,
        credits: Optional[Decimal],
    ):
        try:
            # Use existing AMQP connection parameters from settings
            parameters = AMQP_CONNECTION_PARAMETERS
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()

            # Declare the queue if not already declared
            channel.queue_declare(queue="transaction_queue", durable=True)

            # Create the message body
            message = {
                "tfrs_id": compliance_report.original_report_id,
                "organization_id": compliance_report.organization_id,
                "compliance_period": compliance_report.compliance_period.description,
                "nickname": compliance_report.nickname,
                "action": action,
                "user_id": user.id,
            }

            if credits is not None:
                message["credits"] = int(credits.to_integral_value())

            # Publish the message to the queue
            channel.basic_publish(
                exchange="",
                routing_key="transaction_queue",
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Make message persistent
                ),
            )

            print(f" [x] Sent transaction message: {message}")

            # Close the connection
            connection.close()

        except AMQPError as error:
            raise TransactionDeliveryFailure(
                f"Failed to send transaction message: {error}"
            )
