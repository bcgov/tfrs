import pika
from pika.exceptions import AMQPError

from api.services.SecurityScan import SecurityScan
from tfrs.settings import AMQP_CONNECTION_PARAMETERS


def run():

    try:
        parameters = AMQP_CONNECTION_PARAMETERS
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        channel.queue_declare(queue='security-scan-responses')
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(handle_message, queue='security-scan-responses')
        channel.start_consuming()

    except AMQPError as error:
        print('AMQP Error {}'.format(error))


def handle_message(ch, method, props, body):
    print('response received!, body was {}'.format(body))
    SecurityScan.handle_scan_response(body)
    ch.basic_ack(delivery_tag=method.delivery_tag)
