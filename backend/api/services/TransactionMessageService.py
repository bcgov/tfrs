import json
import pika
from pika.exceptions import AMQPError
from tfrs.settings import AMQP_CONNECTION_PARAMETERS


class TransactionDeliveryFailure(Exception):
    """Custom exception for transaction delivery failures."""

    pass


class TransactionMessageService:
    @staticmethod
    def send_transaction_message(
        tfrs_id: int, organization_id: int, compliance_units_amount: int
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
                "tfrs_id": tfrs_id,
                "organization_id": organization_id,
                "compliance_units_amount": compliance_units_amount,
            }

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
